// src/config.ts
import { LoggerConfig } from "./types.ts";

export const DEFAULT_CONFIG: Required<LoggerConfig> = {
  color: "cyan",
  transporter: "stdout",
  format: Deno.env.get("DENO_ENV") === "production" ? "jsonl" : "pretty",
  activeLevels: ["debug", "info", "warn", "error", "fatal"],
};

export function loadUserConfig(): Partial<LoggerConfig> {
  try {
    const text = Deno.readTextFileSync(
      new URL("../logger.config.json", import.meta.url)
    );
    return JSON.parse(text) as LoggerConfig;
  } catch {
    return {};
  }
}

export function resolveConfig(overrides: Partial<LoggerConfig>): LoggerConfig {
  return {
    ...DEFAULT_CONFIG,
    ...loadUserConfig(),
    ...overrides,
  } as LoggerConfig;
}
