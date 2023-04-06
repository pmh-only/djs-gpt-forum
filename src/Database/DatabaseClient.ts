import knex, { type Knex } from 'knex'
import { DatabaseConsts } from './DatabaseConsts'
import { Logger } from '../Logger/Logger'
import { LogLevel } from '../Logger/LogLevel'

export class DatabaseClient {
  private static _instance: DatabaseClient

  public query: Knex
  private readonly logger = Logger.getInstance(DatabaseClient.name)

  private constructor () {
    this.initializeClient()
    this.logInitialize()
  }

  public static getInstance (): DatabaseClient {
    if (this._instance === undefined)
      this._instance = new this()

    return this._instance
  }

  private initializeClient (): void {
    this.query = knex({
      client: 'mysql2',
      connection: {
        host: DatabaseConsts.DATABASE_HOST,
        port: DatabaseConsts.DATABASE_PORT,
        user: DatabaseConsts.DATABASE_USER,
        password: DatabaseConsts.DATABASE_PASSWORD,
        database: DatabaseConsts.DATABASE_SCHEMA
      }
    })
  }

  private logInitialize (): void {
    this.logger.log({
      level: LogLevel.INFO,
      message: 'Database connection has been established',
      tag: ['db', 'connected'],
      extra: {
        queryBuilderVersion: this.query.VERSION
      }
    })
  }
}
