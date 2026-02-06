import {
  BaseLogger,
  DestinationStream,
  LevelWithSilentOrString,
  LogFn,
  LoggerOptions,
  pino,
  type Logger,
} from "pino";
import config from "./config";


type FunctionLoggerOptions = LoggerOptions | DestinationStream;

const pinoDefaultSettings: FunctionLoggerOptions = {
  level: config.logger.level,
  formatters: {
    level(label) {
      return { level: label };
    },
  },
};

class FunctionLogger implements BaseLogger {
  private readonly logger: Logger;

  info: LogFn;
  warn: LogFn;
  error: LogFn;
  debug: LogFn;
  fatal: LogFn;
  trace: LogFn;
  silent: LogFn;

  level: LevelWithSilentOrString;

  get msgPrefix(): string | undefined {
    return this.logger.msgPrefix;
  }

  constructor(options?: FunctionLoggerOptions) {
    this.logger = pino(options ?? pinoDefaultSettings);

    this.info = this.logger.info.bind(this.logger);
    this.warn = this.logger.warn.bind(this.logger);
    this.error = this.logger.error.bind(this.logger);
    this.debug = this.logger.debug.bind(this.logger);
    this.fatal = this.logger.fatal.bind(this.logger);
    this.trace = this.logger.trace.bind(this.logger);
    this.silent = this.logger.silent.bind(this.logger);

    this.level = this.logger.level;
  }
}


export {
    FunctionLogger as Logger,
    FunctionLoggerOptions as LoggerOptions
}

export default new FunctionLogger();
