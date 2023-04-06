import { type LogLevel } from './LogLevel'

export interface LogData {
  level: LogLevel
  tag: string[]
  message: string
  extra?: any
}
