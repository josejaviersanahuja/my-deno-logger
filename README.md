# my-deno-logger

**Un sistema de logging ninja para Deno** — estilizado para desarrolladores y optimizado para producción.

> Colores, filtros, formatos y poder destructivo en un solo paquete.

---

## Características

### Modo Desarrollo (`DENO_ENV=development`)
- Logs visualmente atractivos con colores, íconos y formato amigable.
- Colores personalizables por archivo o módulo.
- Niveles: 🐛 `debug`, ℹ️ `info`, ⚠️ `warn`, ❌ `error`, 💀 `fatal`.
- Inspector automático de objetos complejos (`console.dir` mejorado).
- Filtros en caliente para mostrar/ocultar niveles de log.
- Búsqueda rápida por palabra clave en logs (`logger.filter("usuario")`).
- Contexto enriquecido (timestamp, archivo, línea, función).

### Modo Producción (`DENO_ENV=production`)
- Salida en formato estándar: `JSONL` o `key=value`.
- Logging silencioso si el nivel está desactivado (alta eficiencia).
- Configuración centralizada por entorno.
- Soporte para:
  - `stdout` / `stderr`
  - Archivo rotativo
  - Webhooks / HTTP
- Ideal para integración con herramientas tipo ELK, Datadog, Loki.

---

## Instalación

```bash
deno add https://deno.land/x/my_deno_logger/mod.ts