import fs from 'fs';
import path from 'path';
import { InterviewSession, FinalReport } from '../types';

const DATA_DIR = path.join(process.cwd(), 'data');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');
const REPORTS_FILE = path.join(DATA_DIR, 'reports.json');

// Ensure data directory exists
function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.warn('[SessionStore] Could not create data directory:', err);
  }
}

/**
 * Loads persisted active sessions from disk
 */
export function loadSessionsFromDisk(): Map<string, InterviewSession> {
  ensureDataDir();
  const sessionsMap = new Map<string, InterviewSession>();
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      const raw = fs.readFileSync(SESSIONS_FILE, 'utf-8');
      const data = JSON.parse(raw);
      if (Array.isArray(data)) {
        for (const session of data) {
          if (session && session.id) {
            sessionsMap.set(session.id, session);
          }
        }
      }
      console.log(`[SessionStore] Loaded ${sessionsMap.size} active sessions from disk.`);
    }
  } catch (err) {
    console.warn('[SessionStore] Error reading sessions file:', err);
  }
  return sessionsMap;
}

/**
 * Saves active sessions to disk
 */
export function saveSessionsToDisk(sessionsMap: Map<string, InterviewSession>): void {
  ensureDataDir();
  try {
    const list = Array.from(sessionsMap.values());
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[SessionStore] Error writing sessions file:', err);
  }
}

/**
 * Loads persisted completed reports from disk
 */
export function loadReportsFromDisk(): Map<string, FinalReport> {
  ensureDataDir();
  const reportsMap = new Map<string, FinalReport>();
  try {
    if (fs.existsSync(REPORTS_FILE)) {
      const raw = fs.readFileSync(REPORTS_FILE, 'utf-8');
      const data = JSON.parse(raw);
      if (Array.isArray(data)) {
        for (const report of data) {
          if (report && report.interviewId) {
            reportsMap.set(report.interviewId, report);
          }
        }
      }
      console.log(`[SessionStore] Loaded ${reportsMap.size} completed reports from disk.`);
    }
  } catch (err) {
    console.warn('[SessionStore] Error reading reports file:', err);
  }
  return reportsMap;
}

/**
 * Saves completed reports to disk
 */
export function saveReportsToDisk(reportsMap: Map<string, FinalReport>): void {
  ensureDataDir();
  try {
    const list = Array.from(reportsMap.values());
    fs.writeFileSync(REPORTS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[SessionStore] Error writing reports file:', err);
  }
}
