import { join } from "jsr:@std/path";
import { LogLevel, LoggerConfig, LoggerTransport } from "./types.ts";

// Cargamos el config.json desde raíz del proyecto
const CONFIG_PATH = join(Deno.cwd(), "logger.config.json");
const rawConfig = await Deno.readTextFile(CONFIG_PATH);
const parsedConfig = JSON.parse(rawConfig);

export class Logger {
  private config: LoggerConfig;

  constructor(initial?: Partial<LoggerConfig>) {
    const defaults = parsedConfig.defaults ?? {};
    this.config = {
      ...defaults,
      ...initial,
      transports: initial?.transports ?? [],
    };
  }

  development(): this {
    return this.applyPreset("development");
  }

  test(): this {
    return this.applyPreset("test");
  }

  production(): this {
    return this.applyPreset("production");
  }

  private applyPreset(presetName: string): this {
    const preset = parsedConfig.presets?.[presetName];
    if (!preset) throw new Error(`Preset "${presetName}" not found in logger.config.json`);
    this.config = { ...this.config, ...preset };
    return this;
  }

  setLevel(level: LogLevel): this {
    this.config.level = level;
    return this;
  }

  setColor(color: string | false): this {
    this.config.color = color;
    return this;
  }

  setTransport(transport: LoggerTransport): this {
    this.config.transports.push(transport);
    return this;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = ["debug", "info", "warn", "error", "fatal"];
    const current = levels.indexOf(this.config.level);
    const incoming = levels.indexOf(level);
    return incoming >= current;
  }

  info(msg: unknown, meta?: unknown): void {
    if (!this.shouldLog("info")) return;
    // TODO: format y enviar a transports
    console.log("[INFO]", msg, meta);
  }

  debug(msg: unknown, meta?: unknown): void {
    if (!this.shouldLog("debug")) return;
    console.log("[DEBUG]", msg, meta);
  }

  warn(msg: unknown, meta?: unknown): void {
    if (!this.shouldLog("warn")) return;
    console.warn("[WARN]", msg, meta);
  }

  error(msg: unknown, meta?: unknown): void {
    if (!this.shouldLog("error")) return;
    console.error("[ERROR]", msg, meta);
  }

  fatal(msg: unknown, meta?: unknown): void {
    if (!this.shouldLog("fatal")) return;
    console.error("[FATAL]", msg, meta);
  }
}