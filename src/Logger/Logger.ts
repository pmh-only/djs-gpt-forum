import chalk from 'chalk'
import { type LogData } from './LogData'
import { LogFileWriter } from './LogFileWriter'
import { LoggerConsts } from './LoggerConsts'
import moment from 'moment'
import { LogLevel } from './LogLevel'

export class Logger {
  private static readonly _instances = new Map<string, Logger>()

  private constructor (area: string) {
    this.area = area
  }

  private readonly area: string
  private readonly logFileWriter = LogFileWriter.getInstance()

  public static getInstance (area: string): Logger {
    if (!this._instances.has(area))
      this._instances.set(area, new this(area))

    return this._instances.get(area) ?? new this(area)
  }

  public log (logData: LogData): void {
    console.log(this.logDataToConsoleStr(logData))
    void this.logFileWriter.write(this.logDataToJson(logData))
  }

  public logDebug (message: string): void {
    this.log({
      level: LogLevel.DEBUG,
      message,
      tag: []
    })
  }

  private logDataToJson (logData: LogData): string {
    return JSON.stringify({ area: this.area, ...logData, timestamp: moment().format() }) + '\n'
  }

  private logDataToConsoleStr (logData: LogData): string {
    return moment().format() + ' ' +
      LoggerConsts.LOG_LEVEL_COLOR_MAP[logData.level](` ${logData.level} `) + ' ' +
      chalk.gray(`:: ${this.area} ::`) + ' ' +
      logData.message + ' ' +
      chalk.italic.gray(`#${logData.tag.join(' #')}`)
  }
}
