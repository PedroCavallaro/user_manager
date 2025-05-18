import { createKeyv } from '@keyv/redis'
import { CacheOptions, CacheOptionsFactory } from '@nestjs/cache-manager'
import { Injectable } from '@nestjs/common'
import { CACHE_CONFIG } from './config'

@Injectable()
export class CacheService implements CacheOptionsFactory {
  createCacheOptions():
    | CacheOptions<Record<string, any>>
    | Promise<CacheOptions<Record<string, any>>> {
    const store = createKeyv(CACHE_CONFIG.url)

    return {
      store
    }
  }
}
