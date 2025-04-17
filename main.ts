import { Logger } from "./mod.ts";

export const logger = new Logger()
  .development()
  .test()
  .production()
  .setColor("blue")
  .setTransporter("stdout");

logger.debug("Mensaje de depuración 🍭");
logger.info("Hola mundo");
logger.error("¡Algo salió mal!");
