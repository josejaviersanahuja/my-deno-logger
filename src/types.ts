// Definición de niveles válidos
export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

// Definición de formatos válidos
export type LogFormat = "pretty" | "jsonl" | "key-value" | "none";

// Transporte básico de logs
export type LoggerTransport =
  | { type: "consola" }
  | { type: "webhook"; url: string }
  | { type: "memory" }
  | FileTransportOptions;

type FileTransportOptions =
  | {
      type: "file";
      path: string; // path único
      pathStdout?: never; // prohibido definir si path existe
      pathStderr?: never;
      rotation?: "daily" | "size";
      maxSizeMB?: number;
    }
  | {
      type: "file";
      path?: never; // prohibido definir si pathStdout/pathStderr
      pathStdout?: string;
      pathStderr?: string;
      rotation?: "daily" | "size";
      maxSizeMB?: number;
    };

// Configuración general del logger
export interface LoggerConfig {
  timestamp: boolean;
  format: LogFormat;
  color: string | false;
  level: LogLevel;
  transports: LoggerTransport[];
  inspect?: boolean; // Modo verbose de objetos
  mute?: boolean; // Silenciar salida (modo test) solo sirve para desarrollar el paquete
  storeInMemory?: boolean; // Acumular logs en array solo sirve para desarrollar el paquete
  trackTime?: boolean; // Medir tiempos de ejecución
  inspectMode?: "simple" | "expanded" | "developer";
  inspectOptions?: Partial<Deno.InspectOptions>; // fine-tuning
  errorStack?: "full" | "message-only" | "none";
  silent?: boolean; // Silenciar salida (modo test) solo sirve para desarrollar el paquete
}

// Preset parcial (usado en logger.config.json) VOY A DEPRECARLO
export interface LoggerPreset extends Partial<LoggerConfig> {
  combinePresets?: string[];
}
