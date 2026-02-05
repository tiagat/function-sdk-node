import { pino, type Logger } from "pino";
import config from "./config";

const logger: Logger = pino({
  level: config.logger.level,
  formatters: {
    level(label) {
      return { level: label };
    },
  },
});

export default logger;
