# Siguientes TODO's

## 📄 1. logger.config.json

Un ejemplo actualizado para seguir tu nuevo esquema (aplanado, simple, elegante):

```json
{
  "timestamp": true,
  "format": "pretty",
  "color": "cyan",
  "level": "debug",
  "transports": [{ "type": "consola" }],
  "inspect": true,
  "mute": false,
  "storeInMemory": false,
  "trackTime": true,
  "inspectMode": "developer",
  "inspectOptions": {
    "depth": 5,
    "compact": false,
    "breakLength": 80
  },
  "errorStack": "full",
  "silent": false
}
```

## 📄 2. src/config.ts

Este archivo se encarga de:

- Cargar el `logger.config.json`
- Aplicar ajustes según `DENO_ENV`
- Devolver un objeto `LoggerConfig` listo para usar

```ts
import { join } from "jsr:@std/path";
import { LoggerConfig } from "./types.ts";

const CONFIG_PATH = join(Deno.cwd(), "logger.config.json");

export async function loadLoggerConfig(): Promise<LoggerConfig> {
  const raw = await Deno.readTextFile(CONFIG_PATH);
  const userConfig: Partial<LoggerConfig> = JSON.parse(raw);

  const env = Deno.env.get("DENO_ENV") ?? "development";

  const baseConfig: LoggerConfig = {
    timestamp: true,
    format: "pretty",
    color: "cyan",
    level: "info",
    transports: [{ type: "consola" }],
    inspect: false,
    mute: false,
    storeInMemory: false,
    trackTime: false,
    inspectMode: "simple",
    errorStack: "message-only",
    silent: false,
    ...userConfig,
  };

  return adjustConfigForEnv(baseConfig, env);
}

function adjustConfigForEnv(config: LoggerConfig, env: string): LoggerConfig {
  const adjusted = { ...config };

  if (env === "production") {
    adjusted.format = "jsonl";
    adjusted.color = false;
    adjusted.level = "warn";
    adjusted.errorStack = "none";
    adjusted.inspect = false;
    adjusted.mute = false;
    adjusted.silent = config.silent ?? false; // por si user fuerza silent en producción
  } else if (env === "test") {
    adjusted.format = "none";
    adjusted.level = "warn";
    adjusted.mute = config.mute ?? true;
    adjusted.storeInMemory = config.storeInMemory ?? true;
    adjusted.inspect = false;
  } else if (env === "development") {
    // Mantiene todo el poder brutal de inspección
    adjusted.inspect = true;
    adjusted.trackTime = true;
    adjusted.errorStack = "full";
  }

  return adjusted;
}
```
