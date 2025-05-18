import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

@Injectable()
export class HashStrategy {
  async hash(password: string) {
    const salts = await bcrypt.genSalt()

    return await bcrypt.hash(password, salts)
  }

  async verify(val: string, hash: string) {
    return await bcrypt.compare(val, hash)
  }
}
