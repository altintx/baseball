import { LogLevel, LogLevels } from "./level";

export class Logger {
  level: LogLevel;
  
  constructor(level: LogLevel = "quiet") {
    this.level = level;
  }

  shouldLog(level: LogLevel): boolean {
    return LogLevels.indexOf(level) <= LogLevels.indexOf(this.level);
  }

  log:typeof console.log = (level: LogLevel, ...params: unknown[]) => {
    if(this.shouldLog(level)) {
      console.log(...params);
    }
  }
  debug:typeof console.debug = (level: LogLevel, ...params: unknown[]) => {
    if(this.shouldLog(level)) {
      console.debug(...params);
    }
  }
  info:typeof console.info = (level: LogLevel, ...params: unknown[]) => {
    if(this.shouldLog(level)) {
      console.info(...params);
    }
  }
  warn:typeof console.warn = (level: LogLevel, ...params: unknown[]) => {
    if(this.shouldLog(level)) {
      console.warn(...params);
    }
  }
  error:typeof console.error = (level: LogLevel, ...params: unknown[]) => {
    if(this.shouldLog(level)) {
      console.error(...params);
    }
  }
}