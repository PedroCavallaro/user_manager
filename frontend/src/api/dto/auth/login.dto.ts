import { z } from 'zod'
import { zExt } from '../../../utils'

export const LoginSchema = z.object({
  email: zExt.string().email('Formato inválido'),
  password: zExt.string({
    min: 8
  })
})

export type LoginDTO = z.infer<typeof LoginSchema>
