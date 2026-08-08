import React, { useState, useMemo } from 'react';
import {
  UserCheck,
  CheckCircle2,
  XCircle,
  Award,
  Play,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  Grid,
  ListFilter
} from 'lucide-react';
import { CandidateProfile } from '../types';

interface CandidateQuickSelectorProps {
  candidatesList: CandidateProfile[];
  selectedCandidate: CandidateProfile;
  onSelectCandidate: (candidate: CandidateProfile) => void;
  onStartInterview: (candidateId: string) => void;
}

export const CandidateQuickSelector: React.FC<CandidateQuickSelectorProps> = ({
  candidatesList,
  selectedCandidate,
  onSelectCandidate,
  onStartInterview
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(6); // 6 per page default or all

  // Extract unique roles for quick filter
  const uniqueRoles = useMemo(() => {
    const roles = Array.from(new Set(candidatesList.map(c => c.role)));
    return ['ALL', ...roles];
  }, [candidatesList]);

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    return candidatesList.filter(cand => {
      const matchesSearch =
        cand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cand.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cand.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cand.interviewFocus.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRole = selectedRoleFilter === 'ALL' || cand.role === selectedRoleFilter;

      return matchesSearch && matchesRole;
    });
  }, [candidatesList, searchQuery, selectedRoleFilter]);

  // Pagination calculation
  const totalPages = itemsPerPage === 0 ? 1 : Math.ceil(filteredCandidates.length / itemsPerPage);
  
  const paginatedCandidates = useMemo(() => {
    if (itemsPerPage === 0) return filteredCandidates;
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCandidates.slice(start, start + itemsPerPage);
  }, [filteredCandidates, currentPage, itemsPerPage]);

  const handleRoleChange = (role: string) => {
    setSelectedRoleFilter(role);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold dark:text-white text-slate-900 flex items-center gap-2">
            <UserCheck className="w-4.5 h-4.5 text-blue-500" />
            <span>Candidate Quick Selector</span>
          </h2>
          <p className="text-xs dark:text-slate-400 text-slate-500 mt-0.5">
            Select from all 20 enterprise candidate profiles to review mission histories or launch adaptive AI interviews.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full dark:bg-blue-500/15 bg-blue-50 dark:text-blue-300 text-blue-700 dark:border-blue-500/30 border-blue-200 border shadow-sm">
            {candidatesList.length} Active Profiles
          </span>
        </div>
      </div>

      {/* Toolbar: Search & Role Filters */}
      <div className="p-3.5 rounded-2xl dark:bg-white/5 bg-slate-100/80 border dark:border-white/10 border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 backdrop-blur-md">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search candidates by name, ID (e.g. CAND-015), or role..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl dark:bg-black/40 bg-white border dark:border-white/15 border-slate-300 dark:text-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Filters & View Toggle */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1" />
            <select
              value={selectedRoleFilter}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="text-xs font-semibold py-2 px-3 rounded-xl dark:bg-black/40 bg-white border dark:border-white/15 border-slate-300 dark:text-white text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Job Roles ({candidatesList.length})</option>
              {uniqueRoles.filter(r => r !== 'ALL').map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 border-l dark:border-white/10 border-slate-300 pl-2 shrink-0">
            <button
              type="button"
              onClick={() => { setItemsPerPage(6); setCurrentPage(1); }}
              className={`px-2.5 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                itemsPerPage === 6
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'dark:text-slate-400 text-slate-600 hover:dark:bg-white/10 hover:bg-slate-200'
              }`}
            >
              6 Per Page
            </button>
            <button
              type="button"
              onClick={() => { setItemsPerPage(0); setCurrentPage(1); }}
              className={`px-2.5 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                itemsPerPage === 0
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'dark:text-slate-400 text-slate-600 hover:dark:bg-white/10 hover:bg-slate-200'
              }`}
            >
              Show All (20)
            </button>
          </div>
        </div>
      </div>

      {/* Candidate Cards Grid */}
      {paginatedCandidates.length === 0 ? (
        <div className="p-12 text-center rounded-2xl dark:bg-white/5 bg-slate-50 border dark:border-white/10 border-slate-200 space-y-2">
          <p className="text-sm font-bold dark:text-slate-300 text-slate-700">No candidate profiles match your search criteria.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedRoleFilter('ALL'); }}
            className="text-xs text-blue-500 underline font-semibold cursor-pointer"
          >
            Clear filters and view all {candidatesList.length} profiles
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedCandidates.map((cand) => {
            const isSelected = selectedCandidate.id === cand.id;
            const completedCount = cand.completedDays.length;
            const skippedCount = cand.skippedDays.length;
            const progressPct = Math.round((completedCount / 31) * 100);

            return (
              <div
                key={cand.id}
                onClick={() => onSelectCandidate(cand)}
                className={`p-4 rounded-2xl border backdrop-blur-xl transition-all cursor-pointer relative group flex flex-col justify-between ${
                  isSelected
                    ? 'dark:bg-blue-900/20 bg-blue-50/80 dark:border-blue-500/50 border-blue-400 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/40'
                    : 'dark:bg-white/5 bg-white dark:border-white/15 border-slate-200 hover:dark:border-white/30 hover:border-slate-300 dark:hover:bg-white/10 hover:bg-slate-50 shadow-sm'
                }`}
              >
                <div>
                  {/* Header Row: Avatar, Name, ID, Role */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={cand.avatar}
                        alt={cand.name}
                        className="w-11 h-11 rounded-xl object-cover ring-2 dark:ring-white/20 ring-slate-300 group-hover:scale-105 transition-transform"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono font-bold dark:text-blue-400 text-blue-600 px-1.5 py-0.2 rounded bg-blue-500/10 border border-blue-500/20">
                            {cand.id}
                          </span>
                          <h3 className="text-xs font-bold dark:text-white text-slate-900 group-hover:text-blue-500 transition-colors flex items-center gap-1">
                            {cand.name}
                            {isSelected && (
                              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            )}
                          </h3>
                        </div>
                        <p className="text-[11px] font-medium dark:text-slate-300 text-slate-600 mt-0.5">
                          {cand.role}
                        </p>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border shrink-0 ${
                      cand.avgScore >= 85
                        ? 'dark:bg-emerald-500/20 bg-emerald-50 text-emerald-600 dark:text-emerald-300 dark:border-emerald-500/30 border-emerald-200'
                        : cand.avgScore >= 75
                        ? 'dark:bg-blue-500/20 bg-blue-50 text-blue-600 dark:text-blue-300 dark:border-blue-500/30 border-blue-200'
                        : 'dark:bg-amber-500/20 bg-amber-50 text-amber-600 dark:text-amber-300 dark:border-amber-500/30 border-amber-200'
                    }`}>
                      {cand.avgScore}% Avg
                    </span>
                  </div>

                  {/* Missions Metrics: Completed vs Skipped */}
                  <div className="grid grid-cols-2 gap-2 my-2.5">
                    <div className="p-2 rounded-xl dark:bg-emerald-500/10 bg-emerald-50/60 dark:border-emerald-500/20 border-emerald-100 border flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <div className="overflow-hidden">
                        <p className="text-[10px] dark:text-emerald-400 text-emerald-700 font-semibold truncate">Completed</p>
                        <p className="text-xs font-black dark:text-emerald-300 text-emerald-800">{completedCount} Missions</p>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl dark:bg-amber-500/10 bg-amber-50/60 dark:border-amber-500/20 border-amber-100 border flex items-center gap-2">
                      <XCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <div className="overflow-hidden">
                        <p className="text-[10px] dark:text-amber-400 text-amber-700 font-semibold truncate">Skipped</p>
                        <p className="text-xs font-black dark:text-amber-300 text-amber-800">{skippedCount} Missions</p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1 mb-2.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="dark:text-slate-400 text-slate-500">Curriculum Progress</span>
                      <span className="font-bold dark:text-slate-200 text-slate-700">{progressPct}% ({completedCount}/31 Days)</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full dark:bg-white/10 bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Interview Focus Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {cand.interviewFocus.slice(0, 2).map((focus, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium dark:bg-white/5 bg-slate-100 dark:text-slate-300 text-slate-600 dark:border-white/10 border-slate-200 border truncate max-w-[140px]"
                      >
                        {focus}
                      </span>
                    ))}
                    {cand.interviewFocus.length > 2 && (
                      <span className="px-1.5 py-0.5 rounded-md text-[10px] font-medium dark:bg-white/5 bg-slate-100 dark:text-slate-400 text-slate-500">
                        +{cand.interviewFocus.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-2 dark:border-white/10 border-slate-200 border-t flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold dark:text-slate-400 text-slate-500 flex items-center gap-1">
                    <Award className="w-3 h-3 text-blue-400" />
                    {cand.attemptsCount} Attempts
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartInterview(cand.id);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Interview</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Footer */}
      {itemsPerPage > 0 && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <p className="text-xs dark:text-slate-400 text-slate-500 font-medium">
            Showing <span className="font-bold dark:text-white text-slate-900">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
            <span className="font-bold dark:text-white text-slate-900">{Math.min(currentPage * itemsPerPage, filteredCandidates.length)}</span> of{' '}
            <span className="font-bold dark:text-white text-slate-900">{filteredCandidates.length}</span> profiles
          </p>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              className="p-1.5 rounded-xl dark:bg-white/5 bg-slate-100 border dark:border-white/10 border-slate-200 text-xs font-bold dark:text-slate-300 text-slate-700 hover:dark:bg-white/10 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </button>

            <span className="px-3 py-1 text-xs font-bold font-mono dark:text-slate-200 text-slate-800 dark:bg-white/5 bg-slate-100 rounded-xl border dark:border-white/10 border-slate-200">
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              className="p-1.5 rounded-xl dark:bg-white/5 bg-slate-100 border dark:border-white/10 border-slate-200 text-xs font-bold dark:text-slate-300 text-slate-700 hover:dark:bg-white/10 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
