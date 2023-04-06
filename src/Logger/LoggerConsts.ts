import 'dotenv/config'
import { type LogLevel } from '../Logger/LogLevel'

import { join as pathJoin } from 'node:path'
import chalk, { type Chalk } from 'chalk'

export class LoggerConsts {
  public static readonly LOG_LEVEL_COLOR_MAP: Record<LogLevel, Chalk> = {
    ERROR: chalk.bgRed,
    INFO: chalk.bgCyan,
    DEBUG: chalk.bgGray
  }

  public static readonly LOG_DIRECTORY_PATH: string =
    pathJoin(process.cwd(), process.env.LOG_DIRECTORY_PATH ?? 'logs')
}
