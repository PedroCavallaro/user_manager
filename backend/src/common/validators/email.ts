import { Transform } from 'class-transformer'
import { ValidationArguments, ValidationOptions, isEmail, registerDecorator } from 'class-validator'

// Mais uma proteção contra SQL injection
// e também ajuda a definir dominio válidos: como .gmail, .hotmail, .conectar etc..
export function IsValidEmail(allowedDomains: string[], validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    Transform(({ value }) => {
      if (typeof value === 'string') {
        return value
          .replace(/[;()\\'"<>]/g, '')
          .trim()
          .toLowerCase()
      }
      return value
    })(object, propertyName)

    registerDecorator({
      name: 'IsValidEmail',
      target: object.constructor,
      propertyName,
      constraints: [allowedDomains],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string' || !isEmail(value)) return false

          const [, domain] = value.split('@')
          const allowed = args.constraints[0] as string[]
          return allowed.includes(domain)
        },
        defaultMessage(args: ValidationArguments) {
          const domains = args.constraints[0].join(', ')
          return `${args.property} must be a valid email with one of the allowed domains: ${domains}`
        }
      }
    })
  }
}
