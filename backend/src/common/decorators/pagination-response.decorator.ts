import { Type, applyDecorators } from '@nestjs/common'
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger'

export const ApiPaginatedResponse = <TModel extends Type<unknown>>(
  model: TModel,
  dataType: 'object' | 'array' = 'array'
) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              data: {
                type: dataType,
                items: { $ref: getSchemaPath(model) }
              },
              page: { type: 'number' },
              totalPages: { type: 'number' },
              total: { type: 'number' }
            }
          }
        ]
      }
    })
  )
}
