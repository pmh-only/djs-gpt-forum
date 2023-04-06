import { LogLevel } from './LogLevel'
import { Logger } from './Logger'

export class LoggableError extends Error {
  public logError (): void {
    Logger
      .getInstance('LoggableError')
      .log({
        level: LogLevel.ERROR,
        message: this.message,
        tag: ['fatal'],
        extra: this
      })
  }
}
