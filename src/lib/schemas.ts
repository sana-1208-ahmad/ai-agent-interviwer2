import { z } from 'zod';

/**
 * Zod Schemas for Technical Specification API Validation
 */

// 1. Candidate Profile Schema
export const CandidateProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  cohort: z.string().optional().default("31-Day AI Engineer Cohort"),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  completedDays: z.array(z.number()).default([]),
  skippedDays: z.array(z.number()).default([]),
  targetRole: z.string().optional(),
});

// 2. Start Interview Request
export const StartInterviewRequestSchema = z.object({
  candidate_id: z.string().optional(),
  candidateId: z.string().optional(),
  candidate: z.union([z.string(), z.record(z.string(), z.any())]).optional(),
  num_questions: z.number().or(z.string()).optional(),
  total_questions: z.number().or(z.string()).optional(),
});

// 3. Answer / Respond Request
export const AnswerInterviewRequestSchema = z.object({
  session_id: z.string().optional(),
  interview_id: z.string().optional(),
  candidate_response: z.string().optional(),
  answer: z.string().optional(),
  message: z.string().optional(),
}).refine(data => Boolean(data.session_id || data.interview_id), {
  message: "Either session_id or interview_id is required",
  path: ["session_id"]
}).refine(data => data.candidate_response !== undefined || data.answer !== undefined || data.message !== undefined, {
  message: "Either candidate_response, answer, or message parameter is required",
  path: ["candidate_response"]
});

// 4. Steer Interview Request
export const SteerInterviewRequestSchema = z.object({
  session_id: z.string().optional(),
  interview_id: z.string().optional(),
  steer_constraint: z.string().optional(),
  constraint: z.string().optional(),
  steer_prompt: z.string().optional(),
}).refine(data => Boolean(data.session_id || data.interview_id), {
  message: "Either session_id or interview_id is required",
  path: ["session_id"]
}).refine(data => Boolean(data.steer_constraint || data.constraint || data.steer_prompt), {
  message: "Either steer_constraint, constraint, or steer_prompt is required",
  path: ["steer_constraint"]
});

// 5. Export Webhook Request
export const ExportWebhookRequestSchema = z.object({
  webhook_url: z.string().optional(),
  webhookUrl: z.string().optional(),
  candidate_name: z.string().optional(),
  session_id: z.string().optional(),
  report: z.record(z.string(), z.any()).optional()
});

// 6. Evaluation Payload Output Schema
export const EvaluationOutputSchema = z.object({
  score: z.number().min(0).max(100),
  understanding_percentage: z.number().min(0).max(100),
  label: z.enum(['NON_RESPONSIVE', 'INCORRECT', 'PARTIALLY_CORRECT', 'CORRECT', 'EXCELLENT', 'NEEDS_IMPROVEMENT', 'GOOD_ANSWER']),
  feedback: z.string(),
  key_points_covered: z.array(z.string()).default([]),
  key_points_missed: z.array(z.string()).default([]),
  errors_identified: z.array(z.string()).optional().default([]),
  penalty_applied: z.boolean().optional().default(false)
});

// 7. Error Response Schema
export const ErrorResponseSchema = z.object({
  error: z.string(),
  code: z.string().optional(),
  details: z.any().optional(),
  timestamp: z.string().default(() => new Date().toISOString())
});

export type CandidateProfileType = z.infer<typeof CandidateProfileSchema>;
export type StartInterviewRequestType = z.infer<typeof StartInterviewRequestSchema>;
export type AnswerInterviewRequestType = z.infer<typeof AnswerInterviewRequestSchema>;
export type SteerInterviewRequestType = z.infer<typeof SteerInterviewRequestSchema>;
export type ExportWebhookRequestType = z.infer<typeof ExportWebhookRequestSchema>;
