import { Transform } from 'class-transformer'
import {
  ValidationArguments,
  ValidationOptions,
  isString,
  registerDecorator
} from 'class-validator'

// Isso aqui previne contra SQL injections
// a validação fica tanto no front quanto no back
export function IsSanitazedString(validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    Transform(({ value }) => {
      if (typeof value === 'string') {
        return value.replace(/[^a-zA-Z0-9 ]/g, '')
      }
      return value
    })(object, propertyName)

    registerDecorator({
      name: 'IsSanitazedString',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _: ValidationArguments) {
          return isString(value)
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a string`
        }
      }
    })
  }
}
