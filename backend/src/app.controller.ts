import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Public } from './common'

@ApiTags('Health-check')
@Controller()
export class AppController {
  private _secToHMS = (time: number) => {
    const padStart = (number: number) => number.toString().padStart(2, '0')

    const hours = padStart(Math.floor(time / 3600))
    const minutes = padStart(Math.floor((time % 3600) / 60))
    const seconds = padStart(Math.floor((time % 3600) % 60))

    return `${hours}:${minutes}:${seconds}`
  }

  @Public()
  @Get('health-check')
  getHello() {
    const uptime = process.uptime()
    const dateNow = Date.now()
    const startedAt = new Date(dateNow - uptime * 1000)

    const healthCheck = {
      uptime: this._secToHMS(uptime),
      startedAt: startedAt.toISOString()
    }

    return healthCheck
  }
}
