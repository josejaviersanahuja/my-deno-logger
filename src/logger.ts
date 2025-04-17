// src/logger.ts
import {
  bold,
  cyan,
  green,
  yellow,
  red,
  magenta,
  gray,
} from "https://deno.land/std@0.224.0/fmt/colors.ts";
import { resolveConfig } from "./config.ts";
import { LogLevel, LoggerConfig, Transporter } from "./types.ts";

const env = Deno.env.get("DENO_ENV") ?? "development";

function defaultTransporter(kind: "stdout" | "stderr"): Transporter {
  return (formatted) => {
    if (kind === "stdout") console.log(formatted);
    else console.error(formatted);
  };
}

function colorFn(name: string) {
  switch (name) {
    case "red":
      return red;
    case "yellow":
      return yellow;
    case "green":
      return green;
    case "magenta":
      return magenta;
    case "gray":
      return gray;
    case "cyan":
    default:
      return cyan;
  }
}

export class Logger {
  private config: LoggerConfig;
  private colorize: (s: string) => string;
  private transporter: Transporter;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = resolveConfig(config);
    this.colorize = colorFn(this.config.color ?? "cyan");
    this.transporter =
      typeof this.config.transporter === "string"
        ? defaultTransporter(this.config.transporter)
        : defaultTransporter("stdout");
    this.syncWithEnv();
  }

  private syncWithEnv() {
    if (env === "production") {
      this.config.activeLevels = ["info", "warn", "error", "fatal"];
      if (!this.config.format) this.config.format = "jsonl";
    } else if (env === "test") {
      this.config.activeLevels = ["debug", "info", "warn", "error", "fatal"];
    }
  }

  /** Development layer */
  development() {
    if (env === "development") {
      this.setColor("magenta");
      this.config.format = "pretty";
    }
    return this;
  }
  /** Test layer */
  test() {
    if (env === "development" || env === "test") {
      this.setColor("green");
    }
    return this;
  }
  /** Production layer (always allowed) */
  production() {
    this.config.format = "jsonl";
    this.setTransporter("stdout");
    return this;
  }

  /** Fine‑grained settings */
  setColor(color: string) {
    this.colorize = colorFn(color);
    this.config.color = color;
    return this;
  }

  setTransporter(transport: "stdout" | "stderr" | Transporter) {
    if (typeof transport === "function") this.transporter = transport;
    else this.transporter = defaultTransporter(transport);
    return this;
  }

  /** Helper */
  inspect(obj: unknown) {
    console.dir(obj, { colors: true, depth: 10 });
  }

  /** ===== Logging methods ===== */
  private should(level: LogLevel) {
    return this.config.activeLevels?.includes(level);
  }
  private fmt(level: LogLevel, ...data: unknown[]) {
    if (this.config.format === "jsonl") {
      return JSON.stringify({ ts: Date.now(), level, msg: data });
    }
    if (this.config.format === "kv") {
      return `ts=${Date.now()} level=${level} msg="${data.join(" ")}"`;
    }
    const emoji = {
      debug: "🐛",
      info: "ℹ️",
      warn: "⚠️",
      error: "❌",
      fatal: "💀",
    }[level];
    return this.colorize(
      `${bold(emoji)} [${level.toUpperCase()}] ${data.join(" ")}`
    );
  }

  private log(level: LogLevel, ...data: unknown[]) {
    if (!this.should(level)) return;
    const formatted = this.fmt(level, ...data);
    this.transporter(formatted, { level, data });
  }

  debug(...data: unknown[]) {
    this.log("debug", ...data);
  }
  info(...data: unknown[]) {
    this.log("info", ...data);
  }
  warn(...data: unknown[]) {
    this.log("warn", ...data);
  }
  error(...data: unknown[]) {
    this.log("error", ...data);
  }
  fatal(...data: unknown[]) {
    this.log("fatal", ...data);
  }
}

export default Logger;
