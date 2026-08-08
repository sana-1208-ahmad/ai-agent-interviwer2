import { GoogleGenAI, Type } from "@google/genai";
import { CandidateProfile, InterviewQuestion, QuestionAnswerRecord, FinalReport } from '../types';
import { SAMPLE_QUESTIONS } from '../data/sampleQuestions';
import { CURRICULUM_DATA } from '../data/curriculumData';
import { auditLogger } from './auditLogger';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    } catch (err) {
      console.warn("Gemini client initialization failed, fallback evaluation mode will be used:", err);
    }
  }
  return aiClient;
}

/**
 * Enhanced Gemini API caller with Exponential Backoff Retry and Toast Notice
 */
async function generateContentWithRetry(
  ai: GoogleGenAI,
  params: {
    model?: string;
    contents: any;
    config?: any;
  },
  maxRetries = 3,
  onRetryNotice?: (noticeMessage: string) => void
) {
  const primaryModel = params.model || "gemini-3.6-flash";
  const modelsToTry = Array.from(new Set([primaryModel, "gemini-flash-latest"]));
  let lastError: any = null;
  const startTime = Date.now();

  for (const modelName of modelsToTry) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0 && onRetryNotice) {
          onRetryNotice(`Reconnecting to Evaluation Engine (Attempt ${attempt}/${maxRetries})...`);
        }

        const response = await ai.models.generateContent({
          ...params,
          model: modelName,
        });

        const elapsed = Date.now() - startTime;
        const promptLength = typeof params.contents === 'string' ? params.contents.length : JSON.stringify(params.contents).length;
        const respLength = response.text ? response.text.length : 100;

        auditLogger.logEvent({
          type: 'GEMINI_CALL',
          endpoint: 'ai.models.generateContent',
          model: modelName,
          status: attempt === 0 ? 'SUCCESS' : 'RETRY',
          latencyMs: elapsed,
          inputTokens: Math.round(promptLength / 4),
          outputTokens: Math.round(respLength / 4),
          promptSnippet: (typeof params.contents === 'string' ? params.contents : JSON.stringify(params.contents)).substring(0, 150) + '...',
          responseSnippet: (response.text || 'OK').substring(0, 150) + '...',
          details: { attempt, modelUsed: modelName }
        });

        return response;
      } catch (err: any) {
        lastError = err;
        const errStr = String(err?.message || err);
        const isTransient =
          errStr.includes("503") ||
          errStr.includes("UNAVAILABLE") ||
          errStr.includes("high demand") ||
          errStr.includes("429") ||
          errStr.includes("RESOURCE_EXHAUSTED") ||
          errStr.includes("fetch failed") ||
          errStr.includes("network");

        if (isTransient && attempt < maxRetries) {
          // Exponential backoff delay with jitter: 600ms, 1200ms, 2400ms...
          const backoffDelay = Math.min(3000, Math.round(600 * Math.pow(2, attempt) + Math.random() * 200));
          console.warn(`[Gemini API] Transient error on ${modelName} (Attempt ${attempt + 1}/${maxRetries}). Backoff ${backoffDelay}ms...`);
          
          auditLogger.logEvent({
            type: 'GEMINI_CALL',
            endpoint: 'ai.models.generateContent',
            model: modelName,
            status: 'RETRY',
            latencyMs: Date.now() - startTime,
            inputTokens: 100,
            outputTokens: 0,
            promptSnippet: `Retry trigger: ${errStr.substring(0, 100)}`,
            responseSnippet: `Backoff delay ${backoffDelay}ms`,
            details: { attempt: attempt + 1, error: errStr }
          });

          await new Promise((res) => setTimeout(res, backoffDelay));
          continue;
        }

        if (isTransient && modelName !== modelsToTry[modelsToTry.length - 1]) {
          console.log(`[Gemini API] Primary model ${modelName} transient limit. Switching model...`);
          break;
        }

        throw err;
      }
    }
  }

  auditLogger.logEvent({
    type: 'GEMINI_CALL',
    endpoint: 'ai.models.generateContent',
    model: primaryModel,
    status: 'FALLBACK',
    latencyMs: Date.now() - startTime,
    inputTokens: 200,
    outputTokens: 100,
    promptSnippet: 'All Gemini API retries exhausted. Using local heuristic fallback engine.',
    responseSnippet: String(lastError?.message || lastError).substring(0, 120),
    details: { fallbackTriggered: true }
  });

  throw lastError;
}

export function classifyAnswerIntent(
  candidateAnswer: string,
  question: InterviewQuestion
): 'CORRECT' | 'PARTIALLY_CORRECT' | 'INCORRECT' | 'NON_RESPONSIVE' | 'UNCLEAR' {
  const trimmed = candidateAnswer.trim();
  if (!trimmed || trimmed.length < 4) {
    return 'NON_RESPONSIVE';
  }

  const lower = trimmed.toLowerCase();

  // Gibberish or explicitly non-responsive phrases
  const nonResponsivePhrases = [
    'no idea', 'idk', 'don\'t know', 'dont know', 'not sure', 'no clue',
    'asdf', 'qwerty', 'test', 'xyz', 'pass', 'skip', 'nothing', 'whatever',
    'sdjcnksjdvk', 'junk', 'blah', 'na', 'n/a', 'dunno'
  ];

  if (nonResponsivePhrases.some(p => lower === p || lower.startsWith(p))) {
    return 'NON_RESPONSIVE';
  }

  // Check random character patterns (no spaces and non-word random string, e.g. "sdjcnksjdvk")
  const containsNoSpaces = !trimmed.includes(' ') && trimmed.length > 7;
  const isRandomCharPattern = /^[^aeiou\s]{5,}$/i.test(trimmed) || (/^[a-z0-9]{8,}$/i.test(trimmed) && containsNoSpaces);

  // Check if answer contains any relevant technical words or common English words
  const technicalKeywords = [
    ...(question.expectedKeyPoints || []).flatMap(kp => kp.toLowerCase().split(/\W+/)),
    ...(question.topic || '').toLowerCase().split(/\W+/),
    'the', 'a', 'is', 'to', 'in', 'and', 'for', 'we', 'use', 'using', 'model', 'data', 'rag', 'vector', 'prompt', 'api', 'code', 'llm', 'chunk', 'chunks', 'retrieval'
  ].filter(w => w.length > 2);

  const words = lower.split(/\W+/).filter(Boolean);
  const matchesKeyword = words.some(w => technicalKeywords.includes(w));

  if ((isRandomCharPattern || containsNoSpaces) && !matchesKeyword) {
    return 'NON_RESPONSIVE';
  }

  return 'UNCLEAR';
}

export async function evaluateCandidateAnswer(
  question: InterviewQuestion,
  candidateAnswer: string,
  candidate: CandidateProfile,
  previousHistory: QuestionAnswerRecord[],
  steerConstraint?: string
): Promise<{
  score: number; // 0 - 100
  evaluationLabel: 'Excellent' | 'Good Answer' | 'Partial Answer' | 'Needs Improvement';
  feedback: string;
  idealKeyPointsCovered: string[];
  idealKeyPointsMissed: string[];
  errorsIdentified: string[];
  penaltyApplied: boolean;
  classification: 'CORRECT' | 'PARTIALLY_CORRECT' | 'INCORRECT' | 'NON_RESPONSIVE' | 'UNCLEAR';
  followUpProbe?: string;
  isRecovery?: boolean;
}> {
  const initialIntent = classifyAnswerIntent(candidateAnswer, question);

  // Check if candidate previously attempted this same topic and gave a weak answer
  const previousTurnsOnSameTopic = previousHistory.filter(h => h.day === question.day || h.topic === question.topic);
  const wasPreviousAttemptWeak = previousTurnsOnSameTopic.length > 0 &&
    previousTurnsOnSameTopic.some(t => t.score < 65 || t.evaluationLabel === 'Needs Improvement');

  const ai = getAiClient();

  if (ai) {
    try {
      const prompt = `You are a Senior AI Lead and Technical Interviewer conducting a multi-turn adaptive technical interview for candidate ${candidate.name}.
Your job is to evaluate the candidate's answer like a REAL, CONSTRUCTIVE, SENIOR HUMAN TECHNICAL INTERVIEWER.

Question Topic: Day ${question.day} - ${question.topic} (${question.module})
Question Text: "${question.questionText}"
Expected Key Points:
${question.expectedKeyPoints.map((kp, idx) => `${idx + 1}. ${kp}`).join('\n')}

Candidate's Submitted Answer:
"${candidateAnswer}"

Candidate Pre-Classification Hint: "${initialIntent}"
Was previous attempt on this topic weak? ${wasPreviousAttemptWeak ? 'YES (Candidate is retrying/responding to follow-up on this topic)' : 'NO'}

HUMAN SENIOR INTERVIEWER EVALUATION DIRECTIVES:
1. ANSWER CLASSIFICATION:
   Classify the candidate's answer as strictly ONE of:
   - "NON_RESPONSIVE": Gibberish (e.g. "sdjcnksjdvk", "asdf"), empty, "no idea", "idk", or random text that does not attempt to answer the question.
   - "INCORRECT": Candidate attempted a technical answer, but it is fundamentally wrong, off-target, or fails the core technical concept.
   - "PARTIALLY_CORRECT": Candidate got some key points right, but missed essential aspects or trade-offs.
   - "CORRECT": Candidate gave a accurate, technically sound answer covering key points.

2. HUMAN CONVERSATIONAL FEEDBACK STRUCTURE (DO NOT USE ROBOTIC JARGON):
   Construct your feedback text using the voice of a direct, constructive senior engineer:
   - For NON_RESPONSIVE:
     "That response doesn't address the question, so I can't give you credit for this answer. The question was testing [what the question tested]. A strong answer would discuss [1-2 key points]. This is an area I'd recommend revising. Before we move on, let's try it again from a simpler angle."
   - For INCORRECT:
     "That's not quite correct. The issue is that the answer doesn't address [specific missing technical aspect]. A key idea here is that [1-2 sentence core conceptual guidance without giving away the complete benchmark solution]. This is an area I'd recommend revising. Let's try again with a simpler question on this topic."
   - For PARTIALLY_CORRECT:
     "You're on the right track, but you're missing an important piece. Your answer correctly addresses [covered points], but you haven't explained [missing points]. Before moving on, let's clarify that missing piece."
   - For CORRECT (If candidate previously failed this topic, acknowledge recovery):
     ${wasPreviousAttemptWeak
       ? '"Much better! That\'s the key idea I was looking for. You correctly identified [key points]. Great recovery."'
       : '"That\'s correct. You clearly identified [key points]."'}

3. IMPORTANT: DO NOT GIVE AWAY THE COMPLETE SOLUTION BEFORE THE FOLLOW-UP.
   Provide enough conceptual guidance to teach what was missed, but do NOT print out the complete benchmark solution or code snippet.

4. SCORING & LABELS:
   - CORRECT: Score 80-100, label "Excellent" or "Good Answer"
   - PARTIALLY_CORRECT: Score 45-79, label "Partial Answer"
   - INCORRECT: Score 15-40, label "Needs Improvement"
   - NON_RESPONSIVE: Score 0-10, label "Needs Improvement"

${steerConstraint ? `5. JUDGE STEER CONSTRAINT INJECTED: "${steerConstraint}". Evaluate compliance.` : ''}

Return JSON adhering strictly to this structure:
{
  "classification": "CORRECT" or "PARTIALLY_CORRECT" or "INCORRECT" or "NON_RESPONSIVE",
  "score": number between 0 and 100,
  "evaluationLabel": "Excellent" or "Good Answer" or "Partial Answer" or "Needs Improvement",
  "errorsIdentified": ["list of exact technical errors or false claims"],
  "feedback": "Human senior interviewer response text following the directives above",
  "idealKeyPointsCovered": ["key points covered well"],
  "idealKeyPointsMissed": ["key points missed"],
  "isRecovery": boolean (true if candidate previously struggled on this topic and now gave a correct answer)
}`;

      const response = await generateContentWithRetry(ai, {
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              classification: { type: Type.STRING },
              score: { type: Type.INTEGER },
              evaluationLabel: { type: Type.STRING },
              errorsIdentified: { type: Type.ARRAY, items: { type: Type.STRING } },
              feedback: { type: Type.STRING },
              idealKeyPointsCovered: { type: Type.ARRAY, items: { type: Type.STRING } },
              idealKeyPointsMissed: { type: Type.ARRAY, items: { type: Type.STRING } },
              isRecovery: { type: Type.BOOLEAN }
            },
            required: ["classification", "score", "evaluationLabel", "feedback", "idealKeyPointsCovered", "idealKeyPointsMissed"]
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        const classification = (['CORRECT', 'PARTIALLY_CORRECT', 'INCORRECT', 'NON_RESPONSIVE'].includes(parsed.classification)
          ? parsed.classification
          : (initialIntent !== 'UNCLEAR' ? initialIntent : (parsed.score >= 80 ? 'CORRECT' : parsed.score >= 45 ? 'PARTIALLY_CORRECT' : 'INCORRECT'))) as any;

        const rawErrors: string[] = Array.isArray(parsed.errorsIdentified) ? parsed.errorsIdentified : [];
        const isNonResp = classification === 'NON_RESPONSIVE' || initialIntent === 'NON_RESPONSIVE';

        let finalScore = typeof parsed.score === 'number' ? parsed.score : (isNonResp ? 0 : 60);
        if (isNonResp) finalScore = 0;
        else if (classification === 'INCORRECT') finalScore = Math.min(35, finalScore);

        const validLabel = (finalScore < 40 || isNonResp)
          ? 'Needs Improvement'
          : (classification === 'PARTIALLY_CORRECT' ? 'Partial Answer' : (finalScore >= 85 ? 'Excellent' : 'Good Answer'));

        return {
          classification,
          score: finalScore,
          evaluationLabel: validLabel,
          feedback: parsed.feedback || (isNonResp
            ? `That response doesn't address the question, so I can't give you credit for this answer. The question was testing ${question.topic}. A strong answer would discuss ${question.expectedKeyPoints.slice(0, 2).join(' and ')}. This is an area I'd recommend revising. Before we move on, let's try it again from a simpler angle.`
            : `Direct technical feedback for ${question.topic}.`),
          idealKeyPointsCovered: isNonResp ? [] : (parsed.idealKeyPointsCovered || []),
          idealKeyPointsMissed: isNonResp ? question.expectedKeyPoints : (parsed.idealKeyPointsMissed || []),
          errorsIdentified: rawErrors,
          penaltyApplied: finalScore < 40,
          isRecovery: Boolean(parsed.isRecovery || (wasPreviousAttemptWeak && classification === 'CORRECT')),
          followUpProbe: parsed.followUpProbe || undefined
        };
      }
    } catch (err) {
      console.log("[Evaluation Engine] Using local heuristic scoring with human interviewer feedback pattern.");
    }
  }

  // Fallback intelligent human interviewer evaluator if Gemini API is offline
  const isNonResp = initialIntent === 'NON_RESPONSIVE';
  if (isNonResp) {
    return {
      classification: 'NON_RESPONSIVE',
      score: 0,
      evaluationLabel: 'Needs Improvement',
      feedback: `That response doesn't address the question, so I can't give you credit for this answer. The question was testing how you would handle core mechanics in ${question.topic}. A strong answer would discuss ${question.expectedKeyPoints.slice(0, 2).join(' and ')}. This is an area I'd recommend revising. Before we move on, let's try it again from a simpler angle.`,
      idealKeyPointsCovered: [],
      idealKeyPointsMissed: question.expectedKeyPoints,
      errorsIdentified: [`Response did not address ${question.topic}`],
      penaltyApplied: true,
      isRecovery: false
    };
  }

  const lowerAns = candidateAnswer.toLowerCase();
  let matchedCount = 0;
  const covered: string[] = [];
  const missed: string[] = [];

  for (const kp of question.expectedKeyPoints) {
    const keywords = kp.toLowerCase().split(' ').filter(w => w.length > 4);
    const hit = keywords.some(kw => lowerAns.includes(kw));
    if (hit) {
      matchedCount++;
      covered.push(kp);
    } else {
      missed.push(kp);
    }
  }

  const matchRatio = matchedCount / (question.expectedKeyPoints.length || 1);
  let classification: 'CORRECT' | 'PARTIALLY_CORRECT' | 'INCORRECT' = 'INCORRECT';
  let finalScore = 25;

  if (matchRatio >= 0.75) {
    classification = 'CORRECT';
    finalScore = 88;
  } else if (matchRatio >= 0.33) {
    classification = 'PARTIALLY_CORRECT';
    finalScore = 60;
  }

  let feedback = "";
  if (classification === 'CORRECT') {
    feedback = wasPreviousAttemptWeak
      ? `Much better! That's the key idea I was looking for. You correctly identified ${covered.slice(0, 2).join(' and ')}. Great recovery.`
      : `That's correct. You clearly identified the main concepts for ${question.topic}.`;
  } else if (classification === 'PARTIALLY_CORRECT') {
    feedback = `You're on the right track, but you're missing an important piece. Your answer addresses ${covered[0] || 'part of the problem'}, but you haven't explained ${missed[0] || 'the core trade-offs'}. Before moving on, let me ask a follow-up on that.`;
  } else {
    feedback = `That's not quite correct. The issue is that the answer doesn't address the core mechanics of ${question.topic}. A key idea here is that ${question.expectedKeyPoints[0] || question.topic} requires clear execution mechanics. This is an area I'd recommend revising. Let's try again from a simpler angle.`;
  }

  return {
    classification,
    score: finalScore,
    evaluationLabel: classification === 'CORRECT' ? 'Good Answer' : classification === 'PARTIALLY_CORRECT' ? 'Partial Answer' : 'Needs Improvement',
    feedback,
    idealKeyPointsCovered: covered,
    idealKeyPointsMissed: missed,
    errorsIdentified: classification === 'INCORRECT' ? [`Missed core mechanics of ${question.topic}`] : [],
    penaltyApplied: classification === 'INCORRECT',
    isRecovery: wasPreviousAttemptWeak && classification === 'CORRECT'
  };
}

export async function generateNextAdaptiveQuestion(
  candidate: CandidateProfile,
  askedQuestionsHistory: QuestionAnswerRecord[],
  questionIndex: number,
  targetTotalQuestions: number = 8,
  steerConstraint?: string
): Promise<InterviewQuestion> {
  const askedDays = new Set(askedQuestionsHistory.map(q => q.day));
  const askedQuestionTexts = new Set(askedQuestionsHistory.map(q => q.questionText.toLowerCase()));

  // Minimum requirement: Cover at least 4 different curriculum days across 8 questions
  const requiredUniqueDaysCount = 4;
  const daysLeftToAsk = targetTotalQuestions - questionIndex;
  const daysStillNeeded = requiredUniqueDaysCount - askedDays.size;
  const forceNewDay = daysStillNeeded > 0 && daysLeftToAsk <= daysStillNeeded;

  let targetDayNum: number;
  let branchingDirective = "";
  let lastScore = 75;

  if (askedQuestionsHistory.length > 0) {
    const lastRecord = askedQuestionsHistory[askedQuestionsHistory.length - 1];
    lastScore = lastRecord.score;

    // Count how many consecutive turns have been spent on the same day/topic
    let consecutiveSameDayCount = 0;
    for (let i = askedQuestionsHistory.length - 1; i >= 0; i--) {
      if (askedQuestionsHistory[i].day === lastRecord.day) {
        consecutiveSameDayCount++;
      } else {
        break;
      }
    }

    const isWeakOrNonResp = lastRecord.score < 65 ||
      lastRecord.evaluationLabel === 'Needs Improvement' ||
      lastRecord.evaluationLabel === 'Partial Answer' ||
      (lastRecord.errorsIdentified && lastRecord.errorsIdentified.length > 0);

    // CORE RULE: NEVER IMMEDIATELY MOVE TO A COMPLETELY NEW TOPIC AFTER AN INCORRECT OR PARTIAL ANSWER!
    // Stay on the same day/topic for a follow-up unless 3 attempts have been exhausted or forcing new day for 4-day minimum requirement.
    if (isWeakOrNonResp && consecutiveSameDayCount < 3 && !forceNewDay) {
      targetDayNum = lastRecord.day;
      const missedConcepts = lastRecord.idealKeyPointsMissed && lastRecord.idealKeyPointsMissed.length > 0
        ? lastRecord.idealKeyPointsMissed.join(', ')
        : 'the core problem';

      if (lastRecord.score === 0 || lastRecord.feedback.includes("doesn't address the question") || lastRecord.score < 35) {
        branchingDirective = `SAME TOPIC SIMPLER FOLLOW-UP DIRECTIVE: The candidate gave a non-responsive or incorrect answer to question on Day ${lastRecord.day} (${lastRecord.topic}) [Attempt ${consecutiveSameDayCount} of max 3].
CRITICAL RULE: DO NOT SWITCH TO A NEW TOPIC! STAY ON Day ${lastRecord.day} (${lastRecord.topic}).
Generate a SIMPLER, highly focused SAME-TOPIC follow-up question that breaks the concept down into a single fundamental question (e.g., "If you retrieve 20 chunks from a vector database, why might you NOT want to send all 20 directly to the LLM?").
Do NOT give away the complete answer to the previous question.`;
      } else {
        branchingDirective = `SAME TOPIC TARGETED PROBING DIRECTIVE: The candidate gave a partially correct answer on Day ${lastRecord.day} (${lastRecord.topic}) [Attempt ${consecutiveSameDayCount} of max 3].
CRITICAL RULE: DO NOT SWITCH TO A NEW TOPIC! STAY ON Day ${lastRecord.day} (${lastRecord.topic}).
Generate a targeted follow-up question specifically probing their missing concept (${missedConcepts}) to give them another chance to demonstrate understanding on this topic.`;
      }
    } else if (isWeakOrNonResp && consecutiveSameDayCount >= 3) {
      // Failed 3 attempts on the same topic -> Mark knowledge gap and transition to a new day
      let candidateTargetDays = candidate.completedDays.filter(d => !askedDays.has(d));
      if (candidateTargetDays.length === 0 || forceNewDay) {
        const unvisitedGlobal = CURRICULUM_DATA.map(d => d.day).filter(d => !askedDays.has(d));
        candidateTargetDays = unvisitedGlobal.length > 0 ? unvisitedGlobal : CURRICULUM_DATA.map(d => d.day);
      }
      targetDayNum = candidateTargetDays[Math.floor(Math.random() * candidateTargetDays.length)];

      branchingDirective = `KNOWLEDGE GAP TRANSITION DIRECTIVE: Candidate struggled with Day ${lastRecord.day} (${lastRecord.topic}) after ${consecutiveSameDayCount} attempts. We have identified a knowledge gap. Now smoothly transition to a new curriculum topic (Day ${targetDayNum}).`;
    } else {
      // Candidate gave a strong answer or recovered on this topic -> Advance to new curriculum day
      let candidateTargetDays = candidate.completedDays.filter(d => !askedDays.has(d));
      if (candidateTargetDays.length === 0 || forceNewDay) {
        const unvisitedGlobal = CURRICULUM_DATA.map(d => d.day).filter(d => !askedDays.has(d));
        candidateTargetDays = unvisitedGlobal.length > 0 ? unvisitedGlobal : CURRICULUM_DATA.map(d => d.day);
      }
      targetDayNum = candidateTargetDays[Math.floor(Math.random() * candidateTargetDays.length)];

      branchingDirective = `NEW TOPIC PROGRESSION DIRECTIVE: Candidate demonstrated competence on Day ${lastRecord.day}. Transition to Day ${targetDayNum} (${CURRICULUM_DATA.find(c => c.day === targetDayNum)?.topic || 'AI Concept'}). Ask a clear, well-structured technical evaluation question.`;
    }
  } else {
    // Turn 1: Select initial question
    const candidateTargetDays = candidate.completedDays.length > 0 ? candidate.completedDays : [1, 5, 8, 12, 18, 20];
    targetDayNum = candidateTargetDays[Math.floor(Math.random() * candidateTargetDays.length)];
    branchingDirective = `INITIAL QUESTION DIRECTIVE: Welcome candidate ${candidate.name} and ask an opening technical question for Day ${targetDayNum}.`;
  }

  const curriculumObj = CURRICULUM_DATA.find(c => c.day === targetDayNum) || CURRICULUM_DATA[0];

  // Construct full conversation history summary for multi-turn context
  const fullHistoryContext = askedQuestionsHistory.length > 0
    ? askedQuestionsHistory.map((rec, i) =>
        `Turn ${i + 1} (Day ${rec.day} - ${rec.topic}):\nQ: "${rec.questionText}"\nA: "${rec.candidateAnswer}"\nEvaluation: Score ${rec.score}% (${rec.evaluationLabel}) | Feedback: ${rec.feedback}`
      ).join('\n---\n')
    : "No previous turns. This is the initial question of the interview.";

  const ai = getAiClient();
  if (ai) {
    try {
      const prompt = `You are a Senior AI Lead and Technical Interviewer conducting a multi-turn adaptive technical interview for candidate ${candidate.name} (${candidate.role}).
Interview Progress: Question #${questionIndex + 1} of ${targetTotalQuestions}.
Visited Curriculum Days so far: ${Array.from(askedDays).join(', ') || 'None'} (Target: At least 4 unique days).
Current Target Curriculum Day: Day ${curriculumObj.day} - ${curriculumObj.topic} (${curriculumObj.module})
Learning Objectives: ${curriculumObj.learningObjectives.join(', ')}
Key Concepts: ${curriculumObj.keyConcepts.join(', ')}

Adaptive Branching Directive:
${branchingDirective}
${steerConstraint ? `\nACTIVE JUDGE STEER CONSTRAINT INJECTED: "${steerConstraint}". Frame this question to explicitly test the candidate's capability regarding this constraint.` : ''}

Full Previous Conversation History:
${fullHistoryContext}

Do NOT repeat any previously asked questions:
${Array.from(askedQuestionTexts).slice(-5).join(' | ')}

Generate the exact technical interview question for Day ${curriculumObj.day}.
Return JSON adhering strictly to this schema:
{
  "questionText": "The exact technical question for Day ${curriculumObj.day}",
  "difficulty": "Easy" or "Medium" or "Hard",
  "type": "Conceptual" or "Coding" or "System Design" or "Practical",
  "expectedKeyPoints": ["key point 1", "key point 2", "key point 3"],
  "sampleIdealAnswer": "2-3 sentence ideal technical answer"
}`;

      const response = await generateContentWithRetry(ai, {
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              questionText: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              type: { type: Type.STRING },
              expectedKeyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
              sampleIdealAnswer: { type: Type.STRING }
            },
            required: ["questionText", "difficulty", "type", "expectedKeyPoints", "sampleIdealAnswer"]
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        return {
          id: `q-gen-${Date.now()}-${questionIndex}`,
          day: curriculumObj.day,
          module: curriculumObj.module,
          topic: curriculumObj.topic,
          questionText: parsed.questionText,
          difficulty: (lastScore < 50 ? 'Easy' : (['Easy', 'Medium', 'Hard'].includes(parsed.difficulty) ? parsed.difficulty : (lastScore > 80 ? 'Hard' : 'Medium'))) as any,
          type: (['Conceptual', 'Coding', 'System Design', 'Practical'].includes(parsed.type) ? parsed.type : 'Conceptual') as any,
          expectedKeyPoints: parsed.expectedKeyPoints || curriculumObj.learningObjectives,
          sampleIdealAnswer: parsed.sampleIdealAnswer || `Ideal answer covering ${curriculumObj.topic}.`
        };
      }
    } catch (e) {
      console.log("[Question Engine] Using curated technical question bank (API rate limit or key fallback).");
    }
  }

  // Fallback adaptive question builder if API missing/offline
  // If staying on same topic due to weak/non-responsive answer, construct a simpler same-topic follow-up!
  const lastRec = askedQuestionsHistory.length > 0 ? askedQuestionsHistory[askedQuestionsHistory.length - 1] : null;
  if (lastRec && (lastRec.score < 65 || lastRec.evaluationLabel === 'Needs Improvement') && lastRec.day === curriculumObj.day) {
    if (curriculumObj.day === 9 || curriculumObj.day === 8 || curriculumObj.topic.toLowerCase().includes('rag') || curriculumObj.topic.toLowerCase().includes('vector')) {
      return {
        id: `q-fallback-followup-${Date.now()}`,
        day: curriculumObj.day,
        module: curriculumObj.module,
        topic: curriculumObj.topic,
        questionText: `If you retrieve 20 chunks from a vector database for a RAG pipeline, why might you NOT want to send all 20 directly to the LLM?`,
        difficulty: 'Easy',
        type: 'Conceptual',
        expectedKeyPoints: [
          'High token cost and increased latency',
          'Lost-in-the-middle context bias where LLM ignores middle chunks',
          'Context noise diluting answer precision'
        ],
        sampleIdealAnswer: 'Sending 20 chunks inflates token costs and latency while causing lost-in-the-middle context degradation where the model ignores facts buried in the middle.'
      };
    }

    return {
      id: `q-fallback-followup-${Date.now()}`,
      day: curriculumObj.day,
      module: curriculumObj.module,
      topic: curriculumObj.topic,
      questionText: `Let's break down ${curriculumObj.topic} into a simpler angle: What is the primary purpose of ${curriculumObj.keyConcepts[0] || 'this component'}, and why is it used in production AI systems?`,
      difficulty: 'Easy',
      type: 'Conceptual',
      expectedKeyPoints: curriculumObj.learningObjectives,
      sampleIdealAnswer: `The primary purpose of ${curriculumObj.keyConcepts[0]} is to ensure reliable execution.`
    };
  }

  const poolUnasked = SAMPLE_QUESTIONS.filter(q => !askedQuestionTexts.has(q.questionText.toLowerCase()) && !askedDays.has(q.day));
  if (poolUnasked.length > 0 && forceNewDay) {
    const picked = poolUnasked[Math.floor(Math.random() * poolUnasked.length)];
    return {
      ...picked,
      id: `q-sample-${Date.now()}`
    };
  }

  const difficultyLabel = lastScore > 80 ? 'Hard' : lastScore < 50 ? 'Easy' : 'Medium';
  const branchingPrefix = lastScore > 80
    ? `[Deep-Dive Architecture] Building on your strong response, let's explore lower-level mechanics.`
    : lastScore < 50
    ? `[Conceptual Fundamentals] Let's step back and clarify the core principles.`
    : `[Practical Scenario]`;

  return {
    id: `q-fallback-${Date.now()}`,
    day: curriculumObj.day,
    module: curriculumObj.module,
    topic: curriculumObj.topic,
    questionText: `${branchingPrefix} In Day ${curriculumObj.day} (${curriculumObj.topic}), how do you implement ${curriculumObj.keyConcepts[0] || 'core components'} in production using ${curriculumObj.tools[0] || 'modern tools'}? What key engineering trade-offs must you evaluate?`,
    difficulty: difficultyLabel as any,
    type: "Practical",
    expectedKeyPoints: curriculumObj.learningObjectives,
    sampleIdealAnswer: `A robust implementation utilizes ${curriculumObj.tools.join(', ')} to achieve ${curriculumObj.learningObjectives[0] || 'high availability'}. Key trade-offs include latency, memory overhead, and accuracy.`
  };
}

export async function generateFinalInterviewReport(
  candidate: CandidateProfile,
  transcript: QuestionAnswerRecord[],
  interviewId: string
): Promise<FinalReport> {
  const overallAvg = transcript.length > 0
    ? Math.round(transcript.reduce((sum, item) => sum + item.score, 0) / transcript.length)
    : 80;

  const daysEvaluated = Array.from(new Set(transcript.map(q => q.day)));

  const ai = getAiClient();
  if (ai) {
    try {
      const prompt = `You are the Lead AI Interview Examiner at ABTalks AI Cohort.
Synthesize the final technical interview report for candidate ${candidate.name} after an 8+ question adaptive interview covering Days: ${daysEvaluated.join(', ')}.

Transcript Summary:
${transcript.map((t, idx) => `Q${idx + 1} (Day ${t.day} - ${t.topic}) [${t.difficulty}]: Score ${t.score}% (${t.evaluationLabel})
Answer: "${t.candidateAnswer.substring(0, 150)}..."`).join('\n')}

Generate a comprehensive final report JSON adhering strictly to this schema:
{
  "gradeLabel": "Mastery" or "Excellent" or "Competent" or "Needs Revision",
  "technicalKnowledge": integer 0-100,
  "conceptualUnderstanding": integer 0-100,
  "problemSolving": integer 0-100,
  "systemDesign": integer 0-100,
  "communication": integer 0-100,
  "strengths": ["bullet point 1", "bullet point 2", "bullet point 3"],
  "areasToImprove": ["bullet point 1", "bullet point 2", "bullet point 3"],
  "recommendedActionPlan": ["step 1", "step 2", "step 3"],
  "summaryParagraph": "A 3-4 sentence professional executive summary of candidate readiness for Enterprise AI Engineer roles."
}`;

      const response = await generateContentWithRetry(ai, {
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              gradeLabel: { type: Type.STRING },
              technicalKnowledge: { type: Type.INTEGER },
              conceptualUnderstanding: { type: Type.INTEGER },
              problemSolving: { type: Type.INTEGER },
              systemDesign: { type: Type.INTEGER },
              communication: { type: Type.INTEGER },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              areasToImprove: { type: Type.ARRAY, items: { type: Type.STRING } },
              recommendedActionPlan: { type: Type.ARRAY, items: { type: Type.STRING } },
              summaryParagraph: { type: Type.STRING }
            },
            required: ["gradeLabel", "technicalKnowledge", "conceptualUnderstanding", "problemSolving", "systemDesign", "communication", "strengths", "areasToImprove", "summaryParagraph"]
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        return {
          interviewId,
          candidateName: candidate.name,
          completedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          overallScore: overallAvg,
          gradeLabel: (['Mastery', 'Excellent', 'Competent', 'Needs Revision'].includes(parsed.gradeLabel) ? parsed.gradeLabel : overallAvg >= 85 ? 'Excellent' : 'Competent') as any,
          scoreBreakdown: {
            technicalKnowledge: parsed.technicalKnowledge || Math.min(100, overallAvg + 3),
            conceptualUnderstanding: parsed.conceptualUnderstanding || overallAvg,
            problemSolving: parsed.problemSolving || Math.max(50, overallAvg - 2),
            systemDesign: parsed.systemDesign || Math.max(50, overallAvg - 5),
            communication: parsed.communication || Math.min(100, overallAvg + 5)
          },
          strengths: parsed.strengths || candidate.strengths,
          areasToImprove: parsed.areasToImprove || candidate.areasToImprove,
          recommendedActionPlan: parsed.recommendedActionPlan || [
            "Review Day 10 Hybrid Search & RRF score fusion mathematics",
            "Build a custom FastMCP server with bearer authorization middleware",
            "Implement production LangSmith tracing to measure TTFT and token cost"
          ],
          questionPerformance: transcript,
          daysEvaluated,
          visited_curriculum_days: daysEvaluated,
          summaryParagraph: parsed.summaryParagraph || `${candidate.name} demonstrated strong technical knowledge across ${daysEvaluated.length} curriculum days with an overall score of ${overallAvg}%.`
        };
      }
    } catch (e) {
      console.log("[Report Engine] Synthesizing report with structured evaluation framework (API rate limit or key fallback).");
    }
  }

  // Fallback heuristic report generator
  return {
    interviewId,
    candidateName: candidate.name,
    completedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    overallScore: overallAvg,
    gradeLabel: overallAvg >= 90 ? 'Mastery' : overallAvg >= 80 ? 'Excellent' : overallAvg >= 65 ? 'Competent' : 'Needs Revision',
    scoreBreakdown: {
      technicalKnowledge: Math.min(98, overallAvg + 3),
      conceptualUnderstanding: overallAvg,
      problemSolving: Math.max(55, overallAvg - 3),
      systemDesign: Math.max(50, overallAvg - 5),
      communication: Math.min(95, overallAvg + 5)
    },
    strengths: [
      `Strong foundational comprehension of Day ${daysEvaluated[0] || 1} topics`,
      "Clear, structured technical communication style",
      "Good awareness of practical implementation constraints"
    ],
    areasToImprove: [
      "Deeper mathematical mastery of vector similarity indices",
      "Production security and authorization policies in MCP servers"
    ],
    recommendedActionPlan: [
      "Practice multi-agent graph architecture with LangGraph",
      "Review RAG Triad faithfulness metrics and evaluation guardrails"
    ],
    questionPerformance: transcript,
    daysEvaluated,
    visited_curriculum_days: daysEvaluated,
    summaryParagraph: `${candidate.name} completed a multi-turn technical interview across ${daysEvaluated.length} curriculum days (Days ${daysEvaluated.join(', ')}). Overall performance was rated at ${overallAvg}%, showing solid technical proficiency in AI engineering concepts.`
  };
}

/**
 * Generates a light conceptual hint or nudge for a question without spoiling the direct solution.
 */
export async function generateQuestionHint(
  question: InterviewQuestion,
  onRetryNotice?: (msg: string) => void
): Promise<string> {
  const ai = getAiClient();
  if (ai) {
    try {
      const prompt = `You are an AI Technical Interviewer.
The candidate asked for a hint on Question: "${question.questionText}" (Topic: Day ${question.day} - ${question.topic}).
Expected key concepts: ${question.expectedKeyPoints.join(', ')}.

Provide a 1-2 sentence LIGHT CONCEPTUAL HINT/NUDGE that guides their thinking toward the key concepts.
CRITICAL RULE: DO NOT GIVE AWAY THE DIRECT CODE SOLUTION OR BENCHMARK ANSWER. Frame it as a thought-provoking interviewer guide.`;

      const response = await generateContentWithRetry(ai, {
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          temperature: 0.4
        }
      }, 2, onRetryNotice);

      if (response.text) {
        return response.text.trim();
      }
    } catch {
      console.log("[Hint Engine] Using curated fallback hint.");
    }
  }

  // Fallback hint
  if (question.expectedKeyPoints && question.expectedKeyPoints.length > 0) {
    return `💡 Think about how ${question.expectedKeyPoints[0]} impacts latency, memory, or model context. Consider how you would design the pipeline components to handle that trade-off.`;
  }
  return `💡 Consider the core architectural trade-offs involved in ${question.topic}. How do the components communicate under production loads?`;
}

