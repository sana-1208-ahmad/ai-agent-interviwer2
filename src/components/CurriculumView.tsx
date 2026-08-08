import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  CheckCircle,
  Clock,
  Layers,
  Wrench,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Check,
  RotateCcw,
  Target
} from 'lucide-react';
import { CURRICULUM_DATA, COHORT_INFO } from '../data/curriculumData';
import { CandidateProfile } from '../types';

interface CurriculumViewProps {
  selectedCandidate: CandidateProfile;
  onStartInterviewForDay?: (dayNumber: number) => void;
  onToggleDayStatus?: (dayNumber: number, newStatus: 'completed' | 'skipped' | 'reset') => void;
}

const getTypeBadgeStyle = (type?: string) => {
  switch (type) {
    case 'SETUP':
      return 'bg-blue-500/15 text-blue-600 dark:text-blue-300 border-blue-500/30';
    case 'BUILD':
      return 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 border-indigo-500/30';
    case 'AI_CORE':
      return 'bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-500/30';
    case 'SHIP_IT':
      return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30';
    case 'LEARN':
      return 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30';
    case 'CAPSTONE':
      return 'bg-rose-500/15 text-rose-600 dark:text-rose-300 border-rose-500/30';
    case 'OPTIMIZE':
      return 'bg-teal-500/15 text-teal-600 dark:text-teal-300 border-teal-500/30';
    default:
      return 'bg-slate-500/15 text-slate-600 dark:text-slate-300 border-slate-500/30';
  }
};

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  selectedCandidate,
  onStartInterviewForDay,
  onToggleDayStatus
}) => {
  const [filter, setFilter] = useState<'all' | 'completed' | 'skipped' | 'in_progress'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDay, setExpandedDay] = useState<number | null>(1); // Default expand Day 1

  const completedCount = selectedCandidate.completedDays.length;
  const skippedCount = selectedCandidate.skippedDays.length;
  const inProgressCount = CURRICULUM_DATA.length - completedCount - skippedCount;
  const progressPercent = Math.round((completedCount / CURRICULUM_DATA.length) * 100);

  const filteredDays = CURRICULUM_DATA.filter(item => {
    const isCompleted = selectedCandidate.completedDays.includes(item.day);
    const isSkipped = selectedCandidate.skippedDays.includes(item.day);
    const isInProgress = !isCompleted && !isSkipped;

    if (filter === 'completed' && !isCompleted) return false;
    if (filter === 'skipped' && !isSkipped) return false;
    if (filter === 'in_progress' && !isInProgress) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const objectMatch = (item.objectives || item.learningObjectives).some(o => o.toLowerCase().includes(q));
      return (
        item.topic.toLowerCase().includes(q) ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        item.module.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tools.some(t => t.toLowerCase().includes(q)) ||
        objectMatch
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Overall Progress Banner */}
      <div className="p-5 rounded-2xl dark:bg-white/5 bg-white dark:border-white/10 border-slate-200 backdrop-blur-xl shadow-lg border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-300 font-extrabold text-[11px] uppercase tracking-wider">
              {COHORT_INFO.cohort}
            </span>
          </div>
          <h2 className="text-base font-bold dark:text-white text-slate-900 mt-2">
            {selectedCandidate.name}'s Curriculum Progress
          </h2>
          <p className="text-xs dark:text-slate-400 text-slate-600 mt-0.5">
            {completedCount} of 31 Missions Mastered ({progressPercent}%) • {inProgressCount} Remaining
          </p>
        </div>
        <div className="w-full sm:w-64 space-y-1.5">
          <div className="flex justify-between text-xs font-bold dark:text-slate-300 text-slate-700">
            <span>Overall Completion</span>
            <span className="text-blue-500 font-extrabold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full dark:bg-white/10 bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* View Header & Filter Pills */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white text-slate-900">31-Day AI Engineering Roadmap</h1>
          <p className="text-xs dark:text-slate-400 text-slate-600 mt-1">
            Enterprise AI Engineering Cohort objectives. Click any day to inspect tools, objectives, and practice questions.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 dark:bg-white/5 bg-white backdrop-blur-xl rounded-xl dark:border-white/10 border-slate-200 border">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-500/25'
                : 'dark:text-slate-400 text-slate-600 hover:dark:text-white hover:text-slate-900'
            }`}
          >
            All ({CURRICULUM_DATA.length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === 'completed'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25'
                : 'dark:text-slate-400 text-slate-600 hover:dark:text-white hover:text-slate-900'
            }`}
          >
            Completed ({completedCount})
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === 'in_progress'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-500/25'
                : 'dark:text-slate-400 text-slate-600 hover:dark:text-white hover:text-slate-900'
            }`}
          >
            In Progress ({inProgressCount})
          </button>
          <button
            onClick={() => setFilter('skipped')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === 'skipped'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/25'
                : 'dark:text-slate-400 text-slate-600 hover:dark:text-white hover:text-slate-900'
            }`}
          >
            Skipped ({skippedCount})
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 dark:text-slate-400 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search modules, topics, objectives, or tools (e.g. Ollama, FastAPI, RAG, MCP, LangChain)..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl dark:bg-white/5 bg-white border dark:border-white/10 border-slate-200 backdrop-blur-xl text-xs font-medium dark:text-white text-slate-900 dark:placeholder-slate-400 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        />
      </div>

      {/* Curriculum Days List */}
      <div className="space-y-3">
        {filteredDays.map((item) => {
          const isCompleted = selectedCandidate.completedDays.includes(item.day);
          const isSkipped = selectedCandidate.skippedDays.includes(item.day);
          const isExpanded = expandedDay === item.day;
          const objectivesList = item.objectives || item.learningObjectives;

          return (
            <div
              key={item.day}
              className="rounded-2xl dark:bg-white/5 bg-white border dark:border-white/10 border-slate-200 backdrop-blur-xl shadow-lg overflow-hidden transition-all duration-200"
            >
              {/* Card Header Row */}
              <div
                onClick={() => setExpandedDay(isExpanded ? null : item.day)}
                className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:dark:bg-white/5 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex-shrink-0 w-12 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center font-black text-xs text-blue-500 dark:text-blue-300">
                    Day {item.day}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[11px] font-semibold dark:text-slate-400 text-slate-500 uppercase tracking-wider truncate">
                        {item.module}
                      </p>
                      {item.type && (
                        <span className={`px-2 py-0.5 rounded border text-[10px] font-extrabold uppercase tracking-wider ${getTypeBadgeStyle(item.type)}`}>
                          {item.type}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-bold dark:text-white text-slate-900 truncate mt-0.5">
                      {item.topic}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  {isCompleted && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 dark:text-emerald-300 text-emerald-700 text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                      Completed
                    </span>
                  )}
                  {isSkipped && (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 dark:text-amber-300 text-amber-700 text-[10px] font-bold">
                      Skipped
                    </span>
                  )}
                  {!isCompleted && !isSkipped && (
                    <span className="px-2.5 py-1 rounded-full dark:bg-white/10 bg-slate-100 dark:text-slate-400 text-slate-600 text-[10px] font-bold">
                      In Progress
                    </span>
                  )}

                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 dark:text-slate-400 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 dark:text-slate-400 text-slate-500" />
                  )}
                </div>
              </div>

              {/* Expanded Card Body */}
              {isExpanded && (
                <div className="p-4 pt-3 border-t dark:border-white/10 border-slate-200 dark:bg-white/5 bg-slate-50/50 backdrop-blur-md space-y-4 text-xs">
                  <p className="dark:text-slate-300 text-slate-700 leading-relaxed font-normal">
                    {item.description}
                  </p>

                  <div>
                    <p className="font-bold dark:text-white text-slate-900 mb-2 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-indigo-500" /> Objectives:
                    </p>
                    <div className="space-y-1.5 pl-1">
                      {objectivesList.map((obj, i) => (
                        <div key={i} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                          <CheckCircle className="w-3.5 h-3.5 text-blue-500/70 flex-shrink-0 mt-0.5" />
                          <span>{obj}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="font-bold dark:text-white text-slate-900 mr-1 flex items-center gap-1">
                      <Wrench className="w-3.5 h-3.5 text-blue-500" /> Tools:
                    </span>
                    {item.tools.map((tool, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md dark:bg-white/10 bg-slate-200/80 border dark:border-white/10 border-slate-300 dark:text-slate-200 text-slate-800 font-medium text-[11px]"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>

                  {/* Interactive Status Controls & Practice Button */}
                  <div className="pt-3 border-t dark:border-white/10 border-slate-200 flex flex-wrap items-center justify-between gap-3">
                    {/* Progress Status Toggles */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold dark:text-slate-400 text-slate-500">Status:</span>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleDayStatus?.(item.day, isCompleted ? 'reset' : 'completed');
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isCompleted
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                            : 'dark:bg-emerald-500/15 bg-emerald-100 border border-emerald-500/30 dark:text-emerald-300 text-emerald-700 hover:bg-emerald-500/25'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isCompleted ? 'Completed ✓' : 'Mark Completed'}</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleDayStatus?.(item.day, isSkipped ? 'reset' : 'skipped');
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isSkipped
                            ? 'bg-amber-600 text-white shadow-md shadow-amber-500/30'
                            : 'dark:bg-amber-500/15 bg-amber-100 border border-amber-500/30 dark:text-amber-300 text-amber-700 hover:bg-amber-500/25'
                        }`}
                      >
                        <span>{isSkipped ? 'Skipped' : 'Mark Skipped'}</span>
                      </button>

                      {(isCompleted || isSkipped) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleDayStatus?.(item.day, 'reset');
                          }}
                          className="px-2.5 py-1.5 rounded-xl text-xs font-semibold dark:text-slate-400 text-slate-600 hover:dark:text-white hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
                          title="Reset status to In Progress"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset</span>
                        </button>
                      )}
                    </div>

                    {/* Start Practice Interview Button */}
                    {onStartInterviewForDay && (
                      <button
                        onClick={() => onStartInterviewForDay(item.day)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 border border-white/20 text-white font-semibold text-xs transition-all shadow-md hover:scale-[1.02] cursor-pointer flex items-center gap-1.5 ml-auto"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Practice Day {item.day} Questions</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};


