import * as path from 'node:path'
import { User, UserLog } from 'src/modules'
import { DataSource, type DataSourceOptions } from 'typeorm'
import { DATABASE_CONFIG } from './config'

//Aqui o runner busca por qualquer alteração em qualquer entity
//se tiver, ele gera uma nova migration com as alterações
export class Database {
  static buildSettings(): DataSourceOptions {
    const migrationsPath = path.join(__dirname, 'migrations')

    return {
      database: DATABASE_CONFIG.database,
      name: DATABASE_CONFIG.name,
      type: 'mysql',
      url: DATABASE_CONFIG.url,
      entities: [User, UserLog],
      migrations: [`${migrationsPath}/*.js`],
      migrationsTableName: 'migrations',
      timezone: 'Z'
    } as DataSourceOptions
  }
}

export const dataSource: DataSource = new DataSource(Database.buildSettings())
