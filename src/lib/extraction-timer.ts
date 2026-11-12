/**
 * Extraction Timer Utility for Benchmark & Paper Testing
 * 
 * Accurately measures the latency of document extractions for:
 * - Form 9 (Form 138 / SF9)
 * - TOR (Transcript of Records)
 * - Prospectus
 * - COR (Certificate of Registration)
 * - Assessment (Statement of Account / Tuition Assessment)
 * - Receipt (Official Receipt)
 * - CCG (Certified Copy of Grades)
 * 
 * Results are logged to the browser console and stored in
 * window.__EXTRACTION_BENCHMARKS__ for paper data collection.
 */

export type ExtractionDocType =
  | "Form 9"
  | "TOR"
  | "Prospectus"
  | "COR"
  | "Assessment"
  | "Receipt"
  | "CCG"
  | "Historical CCG"
  | "COR & Assessment (Consolidated)";

export interface ExtractionMetadata {
  fileName?: string;
  fileSize?: number | string;
  files?: File[] | FileList | null;
  documentId?: number;
  [key: string]: unknown;
}

export interface ExtractionBenchmarkRecord {
  id: string;
  documentType: ExtractionDocType;
  fileName: string;
  fileSize: string;
  startTime: number;
  endTime: number;
  durationMs: number;
  durationSec: number;
  durationFormatted: string;
  status: "SUCCESS" | "FAILED" | "REJECTED";
  timestamp: string;
  details?: Record<string, unknown>;
}

interface ActiveTimer {
  id: string;
  documentType: ExtractionDocType;
  startTime: number;
  metadata?: ExtractionMetadata;
}

// In-memory registry of active timers keyed by timer ID or documentType
const activeTimers = new Map<string, ActiveTimer>();
const benchmarkHistory: ExtractionBenchmarkRecord[] = [];

let counter = 0;

function formatBytes(bytes?: number | string): string {
  if (bytes == null) return "N/A";
  const num = typeof bytes === "string" ? parseFloat(bytes) : bytes;
  if (isNaN(num) || num <= 0) return typeof bytes === "string" ? bytes : "N/A";
  if (num < 1024) return `${num} B`;
  if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
  return `${(num / (1024 * 1024)).toFixed(2)} MB`;
}

function resolveFilesInfo(meta?: ExtractionMetadata): { fileName: string; fileSize: string } {
  if (!meta) return { fileName: "N/A", fileSize: "N/A" };

  if (meta.files) {
    const list = Array.from(meta.files);
    if (list.length > 0) {
      const names = list.map((f) => f.name).join(", ");
      const totalBytes = list.reduce((sum, f) => sum + (f.size || 0), 0);
      return { fileName: names, fileSize: formatBytes(totalBytes) };
    }
  }

  const name = meta.fileName || (meta.documentId ? `Document #${meta.documentId}` : "N/A");
  const size = formatBytes(meta.fileSize);
  return { fileName: name, fileSize: size };
}

// Ensure browser global helpers exist
if (typeof window !== "undefined") {
  window.__EXTRACTION_BENCHMARKS__ = benchmarkHistory;

  window.showExtractionBenchmarks = () => {
    if (benchmarkHistory.length === 0) {
      console.log("No extraction benchmark records yet.");
      return;
    }
    console.table(
      benchmarkHistory.map((r, i) => ({
        "#": i + 1,
        "Document Type": r.documentType,
        "Duration (s)": `${r.durationSec}s`,
        "Duration (ms)": `${r.durationMs} ms`,
        Status: r.status,
        File: r.fileName,
        Size: r.fileSize,
        Timestamp: r.timestamp,
      }))
    );
  };

  window.clearExtractionBenchmarks = () => {
    benchmarkHistory.length = 0;
    console.log("Extraction benchmark records cleared.");
  };

  window.exportExtractionBenchmarks = () => {
    if (benchmarkHistory.length === 0) {
      console.log("No records to export.");
      return "";
    }
    const tsv = [
      ["Document Type", "Duration (s)", "Duration (ms)", "Status", "File Name", "File Size", "Timestamp"].join("\t"),
      ...benchmarkHistory.map((r) =>
        [r.documentType, r.durationSec, r.durationMs, r.status, r.fileName, r.fileSize, r.timestamp].join("\t")
      ),
    ].join("\n");
    console.log("📋 TSV Data (paste into Excel / Google Sheets):\n\n" + tsv);
    return tsv;
  };
}

export function resolveApplicantDocType(type?: string | null): "Form 9" | "TOR" {
  if (type && type.toUpperCase().includes("TOR")) return "TOR";
  return "Form 9";
}

/**
 * Start an extraction timer.
 * Can be called with docType and optional metadata.
 * Returns a unique timer ID.
 */
export function startExtractionTimer(
  documentType: ExtractionDocType,
  metadata?: ExtractionMetadata
): string {
  const id = `timer_${documentType.replace(/[^a-zA-Z0-9]/g, "_")}_${++counter}_${Date.now()}`;
  const startTime = performance.now();

  const timer: ActiveTimer = {
    id,
    documentType,
    startTime,
    metadata,
  };

  // Register by ID and also by docType (for easy lookup when ID is not threaded through)
  activeTimers.set(id, timer);
  activeTimers.set(documentType, timer);
  if (metadata?.documentId) {
    activeTimers.set(String(metadata.documentId), timer);
  }

  const { fileName, fileSize } = resolveFilesInfo(metadata);

  console.log(
    `%c⏳ [EXTRACTION START] ${documentType} extraction initiated...`,
    "color: #2563eb; font-weight: bold; background: #eff6ff; padding: 2px 6px; border-radius: 4px; border: 1px solid #93c5fd;",
    `\nFile: ${fileName} (${fileSize}) | Started: ${new Date().toLocaleTimeString()}`
  );

  return id;
}

/**
 * End an extraction timer and log benchmark results.
 * Accepts timer ID, docType, or documentId.
 */
export function endExtractionTimer(
  identifier: string | ExtractionDocType | number,
  options?: {
    status?: "SUCCESS" | "FAILED" | "REJECTED";
    details?: Record<string, unknown>;
    fileName?: string;
    fileSize?: number | string;
  }
): ExtractionBenchmarkRecord | null {
  const key = String(identifier);
  const timer = activeTimers.get(key);

  if (!timer) {
    // Timer was either already completed or not started; ignore duplicate calls
    return null;
  }

  // Remove all keys mapped to this timer to prevent duplicate ends
  activeTimers.delete(timer.id);
  activeTimers.delete(timer.documentType);
  if (timer.metadata?.documentId) {
    activeTimers.delete(String(timer.metadata.documentId));
  }

  const endTime = performance.now();
  const rawDurationMs = endTime - timer.startTime;
  const durationMs = Math.round(rawDurationMs);
  const durationSec = Number((rawDurationMs / 1000).toFixed(2));

  const status = options?.status ?? "SUCCESS";
  const mergedMeta = { ...timer.metadata, ...options };
  const { fileName, fileSize } = resolveFilesInfo(mergedMeta);

  const record: ExtractionBenchmarkRecord = {
    id: timer.id,
    documentType: timer.documentType,
    fileName,
    fileSize,
    startTime: timer.startTime,
    endTime,
    durationMs,
    durationSec,
    durationFormatted: `${durationSec}s (${durationMs} ms)`,
    status,
    timestamp: new Date().toLocaleTimeString(),
    details: options?.details,
  };

  benchmarkHistory.push(record);

  // Styled console output for test results
  const badgeColor =
    status === "SUCCESS"
      ? "background: #059669; color: white;"
      : status === "REJECTED"
        ? "background: #d97706; color: white;"
        : "background: #dc2626; color: white;";

  console.groupCollapsed(
    `%c⏱️ [EXTRACTION BENCHMARK] ${record.documentType} extracted in ${record.durationSec}s (${record.durationMs} ms) [${status}]`,
    `${badgeColor} font-weight: bold; padding: 3px 8px; border-radius: 4px; font-size: 12px;`
  );
  console.log(`%cDocument Type: %c${record.documentType}`, "font-weight: bold;", "color: #2563eb; font-weight: bold;");
  console.log(`%cTime Taken:    %c${record.durationSec} seconds (${record.durationMs} ms)`, "font-weight: bold;", "color: #059669; font-weight: bold; font-size: 13px;");
  console.log(`%cStatus:        %c${record.status}`, "font-weight: bold;", record.status === "SUCCESS" ? "color: #059669;" : "color: #dc2626;");
  console.log(`%cFile Name:     %c${record.fileName}`, "font-weight: bold;", "color: #4b5563;");
  console.log(`%cFile Size:     %c${record.fileSize}`, "font-weight: bold;", "color: #4b5563;");
  console.log(`%cCompleted At:  %c${record.timestamp}`, "font-weight: bold;", "color: #4b5563;");
  if (record.details) {
    console.log(`%cDetails:`, "font-weight: bold;", record.details);
  }
  console.log("%c💡 Tip for paper testing: type window.showExtractionBenchmarks() or window.exportExtractionBenchmarks() to export table.", "color: #6b7280; font-style: italic;");
  console.groupEnd();

  // Also print a single-line summary so it's directly visible without opening the group
  console.log(
    `%c[EXTRACTION TIME] ${record.documentType}: ${record.durationSec}s (${record.durationMs} ms) — Status: ${status}`,
    "color: #059669; font-weight: 600; font-family: monospace;"
  );

  return record;
}

/**
 * Cancel an active extraction timer without recording a benchmark.
 */
export function cancelExtractionTimer(identifier: string | ExtractionDocType | number): void {
  const key = String(identifier);
  const timer = activeTimers.get(key);
  if (!timer) return;
  activeTimers.delete(timer.id);
  activeTimers.delete(timer.documentType);
  if (timer.metadata?.documentId) {
    activeTimers.delete(String(timer.metadata.documentId));
  }
}

/**
 * Helper to wrap any async extraction promise with automatic timing and logging.
 */
export async function timeExtraction<T>(
  documentType: ExtractionDocType,
  fn: () => Promise<T>,
  metadata?: ExtractionMetadata
): Promise<T> {
  const timerId = startExtractionTimer(documentType, metadata);
  try {
    const result = await fn();
    endExtractionTimer(timerId, {
      status: "SUCCESS",
      details: typeof result === "object" && result !== null ? (result as Record<string, unknown>) : undefined,
    });
    return result;
  } catch (error) {
    endExtractionTimer(timerId, {
      status: "FAILED",
      details: {
        error: error instanceof Error ? error.message : String(error),
      },
    });
    throw error;
  }
}

// Global declaration for TypeScript
declare global {
  interface Window {
    __EXTRACTION_BENCHMARKS__?: ExtractionBenchmarkRecord[];
    showExtractionBenchmarks?: () => void;
    clearExtractionBenchmarks?: () => void;
    exportExtractionBenchmarks?: () => string;
  }
}
