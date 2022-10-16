import colors from "colors";
import { appConfig } from "./config";

export enum LogLevel {
  TRACE = 5,
  DEBUG = 4,
  INFO = 3,
  WARN = 2,
  ERROR = 1,
}

export type LogLevelStrings = keyof typeof LogLevel;
export type Colors = "cyan" | "green" | "white" | "yellow" | "red";

const LOG_COLORS: { [key: string]: Colors } = {
  TRACE: "cyan",
  DEBUG: "green",
  INFO: "white",
  WARN: "yellow",
  ERROR: "red",
};

export function logger(level: LogLevel, msg: any) {
  if (level <= appConfig.log) {
    if (LOG_COLORS[LogLevel[level]]) {
      console.log(colors[LOG_COLORS[LogLevel[level]]](msg));
    } else {
      console.log(msg);
    }
  }
}
