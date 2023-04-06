import { LoggableError } from '../Logger/LoggableError'

export class RequiredFieldNotProvidedError extends LoggableError {
  constructor (fieldName: string) {
    super(`${fieldName} is not provided. panic. please check .env file or consts.ts`)
    this.name = 'RequiredFieldNotProvidedError'
    this.logError()
  }
}
