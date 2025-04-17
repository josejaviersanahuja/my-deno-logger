import { assertEquals } from "@std/assert";
import { logger } from "./main.ts";

Deno.test(function addTest() {
  logger.debug("Mensaje de depuración 🍭");
  assertEquals(2, 2);
  logger.info("Hola mundo");
});
