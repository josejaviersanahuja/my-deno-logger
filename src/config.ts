import { join } from "jsr:@std/path";
import { LoggerConfig, LoggerPreset } from "./types.ts";

const CONFIG_PATH = join(Deno.cwd(), "logger.config.json");

type RawConfig = {
  defaults: Partial<LoggerConfig>;
  presets: Record<string, LoggerPreset>;
  colorsByFile?: Record<string, string>;
};

export async function loadLoggerConfig(): Promise<LoggerConfig> {
  const raw = await Deno.readTextFile(CONFIG_PATH);
  const config: RawConfig = JSON.parse(raw);
  const env = Deno.env.get("DENO_ENV") ?? "development";

  // Presets que deben activarse
  const activePresetNames = getPresetChain(env, config.presets);

  // Fusionamos: defaults + presets (en orden)
  const merged: LoggerConfig = { ...config.defaults } as LoggerConfig; // @TODO Mejorar el tipado y no hardcodear el tipo
  for (const name of activePresetNames) {
    const preset = config.presets[name];
    Object.assign(merged, preset);
  }

  // Colores por archivo, si aplica
  if (config.colorsByFile) {
    merged.colorsByFile = config.colorsByFile;
  }

  return merged;
}

function getPresetChain(
  env: string,
  presets: Record<string, LoggerPreset>
): string[] {
  if (env === "production") return ["production"];
  if (env === "test") return ["test"];
  if (env === "development") {
    // Resuelve combinaciones recursivas
    const seen = new Set<string>();
    const stack = ["development"];
    const result: string[] = [];

    while (stack.length) {
      const current = stack.pop()!;
      if (seen.has(current)) continue;
      seen.add(current);
      result.push(current);
      const preset = presets[current];
      const combo = preset?.combinePresets ?? [];
      for (const extra of combo) {
        stack.push(extra);
      }
    }
    return result.reverse(); // mantener orden lógico: primero los generales
  }

  return [];
}
