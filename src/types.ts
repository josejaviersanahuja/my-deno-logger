// Definición de niveles válidos
export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

// Definición de formatos válidos
export type LogFormat = "pretty" | "jsonl" | "key-value" | "none";

// Transporte básico de logs
export type LoggerTransport =
  | { type: "stdout" }
  | { type: "stderr" }
  | { type: "file"; path: string; rotation?: "daily" | "size"; maxSizeMB?: number }
  | { type: "webhook"; url: string }
  | { type: "memory" }; // especial para test

// Configuración general del logger
export interface LoggerConfig {
  timestamp: boolean;
  level: LogLevel;
  format: LogFormat;
  color: string | false;
  inspect?: boolean; // Modo verbose de objetos
  trackTime?: boolean; // Medir tiempos de ejecución
  mute?: boolean; // Silenciar salida (modo test)
  storeInMemory?: boolean; // Acumular logs en array
  transports: LoggerTransport[];
  colorsByFile?: Record<string, string>;
}

// Preset parcial (usado en logger.config.json)
export interface LoggerPreset extends Partial<LoggerConfig> {
  combinePresets?: string[];
}