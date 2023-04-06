import { appendFile, stat, mkdir } from 'node:fs/promises'
import { join as pathJoin } from 'node:path'
import moment from 'moment'
import { LoggerConsts } from './LoggerConsts'

export class LogFileWriter {
  private static _instance: LogFileWriter
  private constructor () {}

  public static getInstance (): LogFileWriter {
    if (this._instance === undefined)
      this._instance = new this()

    return this._instance
  }

  public async write (logString: string): Promise<void> {
    await this.checkAndMakeDir()
    await appendFile(this.getLogFilePath(), logString, 'utf-8')
  }

  private async checkAndMakeDir (): Promise<void> {
    try {
      if (!(await stat(LoggerConsts.LOG_DIRECTORY_PATH)).isDirectory())
        throw new Error()
    } catch {
      await mkdir(LoggerConsts.LOG_DIRECTORY_PATH, { recursive: true })
    }
  }

  private getLogFilePath (): string {
    return pathJoin(LoggerConsts.LOG_DIRECTORY_PATH, `${moment().format('YYYY-MM-DD')}.log`)
  }
}
