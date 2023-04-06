import { RequiredFieldNotProvidedError } from './RequiredFieldNotProvidedError'

export class ConstUtils {
  public static checkRequiredField<T> (fieldName: string, value: T | undefined): T {
    if (typeof value === 'undefined')
      throw new RequiredFieldNotProvidedError(fieldName)

    if (Array.isArray(value) && value.length < 1)
      throw new RequiredFieldNotProvidedError(fieldName)

    return value
  }
}
