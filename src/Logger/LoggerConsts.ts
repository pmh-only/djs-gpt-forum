import 'dotenv/config'
import { LogLevel } from '../Logger/LogLevel'

import { join as pathJoin } from 'node:path'
import chalk, { type Chalk } from 'chalk'

export class LoggerConsts {
  public static readonly LOG_MINIMUM_LEVEL: LogLevel =
    LogLevel[process.env.LOG_MINIMUM_LEVEL ?? 'INFO'] ?? LogLevel.INFO

  public static readonly LOG_LEVEL_COLOR_MAP: Record<LogLevel, Chalk> = {
    ERROR: chalk.bgRed,
    INFO: chalk.bgCyan
  }

  public static readonly LOG_DIRECTORY_PATH: string =
    pathJoin(process.cwd(), process.env.LOG_DIRECTORY_PATH ?? 'logs')
}
