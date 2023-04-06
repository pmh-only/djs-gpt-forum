import 'dotenv/config'

export class DatabaseConsts {
  public static readonly DATABASE_HOST =
    process.env.DATABASE_HOST ?? 'localhost'

  public static readonly DATABASE_PORT =
    parseInt(process.env.DATABASE_PORT ?? '3306')

  public static readonly DATABASE_USER =
    process.env.DATABASE_USER ?? 'djsgpt'

  public static readonly DATABASE_PASSWORD =
    process.env.DATABASE_PASSWORD

  public static readonly DATABASE_SCHEMA =
    process.env.DATABASE_SCHEMA ?? 'djsgpt'
}
