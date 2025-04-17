import { Logger } from "./src/logger.ts";

const logger = new Logger().development().test().production();

logger.setLevel("debug");

logger.setColor("yellow");

logger.setTransport({
  type: "file",
  path: "./logs/app.log",
  rotation: "daily",
  maxSizeMB: 10,
});

logger.info("Hello world!");
logger.debug("Debugging info");
logger.warn("Warning message");
logger.error("Error occurred");
logger.fatal("Fatal error");
logger.info("This is an info message", { user: "John Doe" });

const str = Deno.inspect(logger, {
  breakLength: 1000,
  colors: true,
  trailingComma: true,
  compact: true,
  sorted: true,
  getters: true,
  showHidden: true,
  showProxy: true,
  depth: 3,
  escapeSequences: true,
  iterableLimit: 100,
  strAbbreviateSize: 100,
});

logger.info(str);
