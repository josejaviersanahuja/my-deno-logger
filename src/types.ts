// src/types.ts
export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

export interface LoggerConfig {
  color?: string;
  transporter?:
    | "stdout"
    | "stderr"
    | { type: "file"; path: string }
    | { type: "webhook"; url: string };
  format?: "pretty" | "jsonl" | "kv";
  activeLevels?: LogLevel[];
}

export interface Transporter {
  (formatted: string, raw: Record<string, unknown>): void | Promise<void>;
}
