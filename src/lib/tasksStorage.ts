import fs from 'fs';
import path from 'path';
import os from 'os';

export interface TaskLogEntry {
  id: string;
  timestamp: string;
  date: string;
  timeStr: string;
  task: string;
  channel: string;
  status: 'success' | 'error';
  title?: string;
  url?: string;
  error?: string;
  extraInfo?: string;
}

export interface DailyTasksSummary {
  date: string;
  lastUpdated: string;
  total: number;
  successCount: number;
  errorCount: number;
  hasErrors: boolean;
  statusSummary: string;
  tasks: TaskLogEntry[];
}

declare global {
  // eslint-disable-next-line no-var
  var __tcn_task_logs: TaskLogEntry[] | undefined;
}

let cachedTasksDir: string | null = null;

function getStorageDir(): string {
  if (cachedTasksDir) return cachedTasksDir;

  const defaultDir = path.join(process.cwd(), 'src', 'data');
  try {
    if (!fs.existsSync(defaultDir)) {
      fs.mkdirSync(defaultDir, { recursive: true });
    }
    const testFile = path.join(defaultDir, `.task-test-${Date.now()}`);
    fs.writeFileSync(testFile, 'ok');
    fs.unlinkSync(testFile);
    cachedTasksDir = defaultDir;
    return defaultDir;
  } catch {
    const tmpDir = path.join(os.tmpdir(), 'traicainghien_data');
    if (!fs.existsSync(tmpDir)) {
      try {
        fs.mkdirSync(tmpDir, { recursive: true });
      } catch {}
    }
    cachedTasksDir = tmpDir;
    return tmpDir;
  }
}

function getLogFilePath(): string {
  return path.join(getStorageDir(), 'n8n_tasks_log.json');
}

export function getAllTaskLogs(): TaskLogEntry[] {
  if (globalThis.__tcn_task_logs && globalThis.__tcn_task_logs.length > 0) {
    return globalThis.__tcn_task_logs;
  }

  const logFile = getLogFilePath();
  if (fs.existsSync(logFile)) {
    try {
      const raw = fs.readFileSync(logFile, 'utf-8');
      const parsed: TaskLogEntry[] = JSON.parse(raw);
      globalThis.__tcn_task_logs = parsed;
      return parsed;
    } catch (e) {
      console.warn('Error reading tasks log file:', e);
    }
  }

  // Khởi tạo danh sách mẫu nếu chưa có
  globalThis.__tcn_task_logs = [];
  return globalThis.__tcn_task_logs;
}

export function recordTaskExecution(entry: Omit<TaskLogEntry, 'id' | 'timestamp' | 'date'>): TaskLogEntry {
  const all = getAllTaskLogs();
  const now = new Date();
  
  // Múi giờ Việt Nam (UTC+7)
  const vnTime = new Date(now.getTime() + 7 * 3600 * 1000);
  const dateStr = vnTime.toISOString().split('T')[0];

  const newEntry: TaskLogEntry = {
    id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: now.toISOString(),
    date: dateStr,
    timeStr: entry.timeStr || now.toLocaleTimeString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
    task: entry.task,
    channel: entry.channel,
    status: entry.status,
    title: entry.title,
    url: entry.url,
    error: entry.error,
    extraInfo: entry.extraInfo,
  };

  all.unshift(newEntry);
  
  // Giữ tối đa 200 bản ghi gần nhất
  const trimmed = all.slice(0, 200);
  globalThis.__tcn_task_logs = trimmed;

  const logFile = getLogFilePath();
  try {
    fs.writeFileSync(logFile, JSON.stringify(trimmed, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Could not write tasks log to disk:', e);
  }

  return newEntry;
}

export function getTodayTasksSummary(): DailyTasksSummary {
  const all = getAllTaskLogs();
  const now = new Date();
  const vnTime = new Date(now.getTime() + 7 * 3600 * 1000);
  const todayStr = vnTime.toISOString().split('T')[0];

  const todayTasks = all.filter((t) => t.date === todayStr);
  const errorTasks = todayTasks.filter((t) => t.status === 'error');
  const successTasks = todayTasks.filter((t) => t.status === 'success');

  const hasErrors = errorTasks.length > 0;
  let statusSummary = 'Hôm nay chưa có task nào chạy.';
  if (todayTasks.length > 0) {
    if (hasErrors) {
      statusSummary = `⚠️ Cảnh báo: Có ${errorTasks.length}/${todayTasks.length} task gặp sự cố!`;
    } else {
      statusSummary = `✅ Xuất sắc: Toàn bộ ${todayTasks.length}/${todayTasks.length} task đều hoàn thành thành công 100%!`;
    }
  }

  return {
    date: todayStr,
    lastUpdated: now.toISOString(),
    total: todayTasks.length,
    successCount: successTasks.length,
    errorCount: errorTasks.length,
    hasErrors,
    statusSummary,
    tasks: todayTasks,
  };
}
