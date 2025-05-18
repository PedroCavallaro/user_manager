import { SetMetadata } from '@nestjs/common'

export const UNPROTECTED_KEY = 'unprotected'
export const Public = () => SetMetadata(UNPROTECTED_KEY, true)
