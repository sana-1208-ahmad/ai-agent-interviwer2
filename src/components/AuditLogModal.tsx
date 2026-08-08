import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Terminal,
  Activity,
  Cpu,
  Database,
  Code,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Clock,
  Layers,
  FileText
} from 'lucide-react';
import { auditLogger, AuditLogEntry, SystemPromptLog } from '../lib/auditLogger';

interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'prompts' | 'metrics'>('timeline');
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [prompts, setPrompts] = useState<SystemPromptLog[]>([]);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLogs(auditLogger.getLogs());
      setPrompts(auditLogger.getSystemPrompts());
    }

    const unsubscribe = auditLogger.subscribe(() => {
      setLogs(auditLogger.getLogs());
      setPrompts(auditLogger.getSystemPrompts());
    });

    return unsubscribe;
  }, [isOpen]);

  if (!isOpen) return null;

  const metrics = auditLogger.getMetrics();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl dark:bg-[#0b0f19] bg-white dark:border-white/15 border-slate-200 border shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b dark:border-white/10 border-slate-200 p-5 dark:bg-[#080b13] bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-600 text-white shadow-lg shadow-teal-500/20">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                  Hackathon Build Authenticity Verification
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Verified Telemetry
                </span>
              </div>
              <h2 className="text-xl font-black dark:text-white text-slate-900">
                Audit &amp; AI Usage Log Explorer
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl dark:bg-white/10 bg-slate-200 dark:text-slate-400 text-slate-500 hover:dark:bg-white/20 hover:bg-slate-300 hover:dark:text-white hover:text-slate-900 transition-colors cursor-pointer"
            title="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Controls & Export Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-b dark:border-white/10 border-slate-200 dark:bg-white/[0.02] bg-slate-100/60">
          {/* Navigation Tabs */}
          <div className="flex items-center p-1 rounded-xl dark:bg-white/10 bg-slate-200/80 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'timeline'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'dark:text-slate-300 text-slate-600 hover:dark:text-white hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>API Call Timeline ({logs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('prompts')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'prompts'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'dark:text-slate-300 text-slate-600 hover:dark:text-white hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>System Prompt Evolution ({prompts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('metrics')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'metrics'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'dark:text-slate-300 text-slate-600 hover:dark:text-white hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Token Telemetry</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => auditLogger.exportLogsJSON()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              title="Download full audit log as JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit Log (JSON)</span>
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* TAB 1: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl dark:bg-white/5 bg-slate-100 border dark:border-white/10 border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Total API Transactions</span>
                  <div className="text-lg font-black dark:text-white text-slate-900 mt-0.5">{metrics.totalCalls}</div>
                </div>

                <div className="p-3 rounded-2xl dark:bg-white/5 bg-slate-100 border dark:border-white/10 border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Total Tokens Processed</span>
                  <div className="text-lg font-black text-teal-400 mt-0.5">{metrics.totalTokens.toLocaleString()}</div>
                </div>

                <div className="p-3 rounded-2xl dark:bg-white/5 bg-slate-100 border dark:border-white/10 border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Avg Latency</span>
                  <div className="text-lg font-black text-blue-400 mt-0.5">{metrics.avgLatency} ms</div>
                </div>

                <div className="p-3 rounded-2xl dark:bg-white/5 bg-slate-100 border dark:border-white/10 border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Retry Events</span>
                  <div className="text-lg font-black text-amber-400 mt-0.5">{metrics.retriesCount}</div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Live Audit Log Feed</span>
                  <span className="text-[10px] font-mono text-slate-500">Auto-updating realtime</span>
                </h3>

                {logs.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl dark:bg-white/5 bg-slate-100 dark:text-slate-400 text-slate-500 text-xs">
                    No log entries captured yet. Interact with the candidate interview chat or settings to generate telemetry.
                  </div>
                ) : (
                  logs.map((log) => {
                    const isExpanded = expandedLogId === log.id;
                    return (
                      <div
                        key={log.id}
                        className="rounded-2xl dark:bg-white/5 bg-slate-50 dark:border-white/10 border-slate-200 border overflow-hidden transition-all"
                      >
                        <div
                          onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                          className="p-3 sm:p-4 flex items-center justify-between gap-3 cursor-pointer hover:dark:bg-white/[0.08] hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold uppercase ${
                              log.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                              log.status === 'RETRY' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                              'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            }`}>
                              {log.status}
                            </span>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold dark:text-white text-slate-900 font-mono">
                                  {log.endpoint}
                                </span>
                                <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                                  {log.model}
                                </span>
                              </div>
                              <p className="text-xs dark:text-slate-400 text-slate-600 line-clamp-1 mt-0.5">
                                {log.promptSnippet}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-right">
                            <div className="hidden sm:block">
                              <div className="text-xs font-bold dark:text-slate-300 text-slate-700 font-mono">
                                {log.latencyMs}ms
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                In: {log.inputTokens} | Out: {log.outputTokens}
                              </div>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">{log.timestamp}</span>
                          </div>
                        </div>

                        {/* Expandable Details */}
                        {isExpanded && (
                          <div className="p-4 border-t dark:border-white/10 border-slate-200 dark:bg-black/30 bg-slate-100/80 space-y-3 font-mono text-xs">
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase">Full Request Snippet:</span>
                              <pre className="mt-1 p-2.5 rounded-xl dark:bg-black/60 bg-white dark:text-slate-300 text-slate-800 overflow-x-auto whitespace-pre-wrap border dark:border-white/10 border-slate-200">
                                {log.promptSnippet}
                              </pre>
                            </div>

                            <div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase">Response Output Snippet:</span>
                              <pre className="mt-1 p-2.5 rounded-xl dark:bg-black/60 bg-white dark:text-emerald-400 text-slate-800 overflow-x-auto whitespace-pre-wrap border dark:border-white/10 border-slate-200">
                                {log.responseSnippet}
                              </pre>
                            </div>

                            {log.details && (
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase">Additional Telemetry Metadata:</span>
                                <pre className="mt-1 p-2 rounded-xl dark:bg-black/40 bg-white text-slate-400 overflow-x-auto text-[11px]">
                                  {JSON.stringify(log.details, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 2: SYSTEM PROMPT EVOLUTION */}
          {activeTab === 'prompts' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-blue-400" />
                  <span>System Prompt Architecture Logs</span>
                </p>
                <p className="dark:text-slate-300 text-slate-600">
                  Judges can review the exact versioned system prompts governing the Evaluation Engine, Solution Spoiler Guardrails, and Adaptive Question Generation.
                </p>
              </div>

              {prompts.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl dark:bg-white/5 bg-slate-50 dark:border-white/10 border-slate-200 border p-4 space-y-3"
                >
                  <div className="flex items-center justify-between border-b dark:border-white/10 border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 font-mono font-bold text-xs border border-blue-500/30">
                        v{p.version}
                      </span>
                      <h4 className="font-black text-sm dark:text-white text-slate-900">{p.module}</h4>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{p.purpose}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">System Prompt Instructions:</span>
                    <pre className="p-3 rounded-xl dark:bg-black/60 bg-white dark:text-slate-300 text-slate-800 font-mono text-xs overflow-x-auto whitespace-pre-wrap border dark:border-white/10 border-slate-200">
                      {p.promptText}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: TOKEN METRICS */}
          {activeTab === 'metrics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl dark:bg-white/5 bg-slate-50 dark:border-white/10 border-slate-200 border space-y-2">
                  <div className="flex items-center gap-2 text-blue-400">
                    <Zap className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Input Tokens</span>
                  </div>
                  <div className="text-2xl font-black dark:text-white text-slate-900">
                    {metrics.totalInputTokens.toLocaleString()}
                  </div>
                  <p className="text-xs text-slate-400">Context windows &amp; candidate transcript tokens</p>
                </div>

                <div className="p-5 rounded-2xl dark:bg-white/5 bg-slate-50 dark:border-white/10 border-slate-200 border space-y-2">
                  <div className="flex items-center gap-2 text-teal-400">
                    <Cpu className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Output Tokens</span>
                  </div>
                  <div className="text-2xl font-black dark:text-white text-slate-900">
                    {metrics.totalOutputTokens.toLocaleString()}
                  </div>
                  <p className="text-xs text-slate-400">Evaluation feedback &amp; question generations</p>
                </div>

                <div className="p-5 rounded-2xl dark:bg-white/5 bg-slate-50 dark:border-white/10 border-slate-200 border space-y-2">
                  <div className="flex items-center gap-2 text-purple-400">
                    <Clock className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Average Latency</span>
                  </div>
                  <div className="text-2xl font-black dark:text-white text-slate-900">
                    {metrics.avgLatency} <span className="text-sm font-normal text-slate-400">ms</span>
                  </div>
                  <p className="text-xs text-slate-400">Gemini 3.6 Flash response time</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl dark:bg-white/5 bg-slate-50 dark:border-white/10 border-slate-200 border space-y-3">
                <h4 className="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Hackathon Build Authenticity Verification Summary</span>
                </h4>
                <div className="text-xs dark:text-slate-300 text-slate-600 space-y-2 leading-relaxed">
                  <p>
                    This application uses live calls to <strong className="text-teal-400">Gemini 3.6 Flash</strong> via the official Google GenAI SDK, coupled with persistent context syncing via <strong className="text-indigo-400">Breeth Memory MCP Protocol</strong>.
                  </p>
                  <p>
                    All multi-turn evaluations, candidate adaptive question generation, and report synthesis pass through structured JSON schemas with automatic exponential backoff retry handling.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 z-10 p-4 dark:bg-[#080b13] bg-slate-100 border-t dark:border-white/10 border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Telemetry active • {logs.length} events captured</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl dark:bg-white/10 bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-300 dark:hover:bg-white/20 transition-all cursor-pointer"
            >
              Cancel / ← Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
