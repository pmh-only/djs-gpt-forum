import { type ClientEvents, Client as DiscordJSClient } from 'discord.js'
import { type EventName, type DiscordEventConstructor } from '../DiscordEvent/DiscordEvent'
import { DiscordConsts } from '../DiscordConsts'
import { Logger } from '../../Logger/Logger'
import { LogLevel } from '../../Logger/LogLevel'

export class DiscordClient {
  private static _instance: DiscordClient
  private readonly logger = Logger.getInstance(DiscordClient.name)
  private client: DiscordJSClient

  public static getInstance (): DiscordClient {
    if (this._instance === undefined)
      this._instance = new this()

    return this._instance
  }

  private constructor () {
    this.initializeClient()
    this.loadTokenFromConfig()
  }

  private initializeClient (): void {
    this.client = new DiscordJSClient({
      intents: DiscordConsts.DISCORD_INTENTS
    })
  }

  private loadTokenFromConfig (): void {
    this.client.token = DiscordConsts.DISCORD_TOKEN
  }

  public async run (): Promise<void> {
    await this.client.login()
  }

  public registEvent<N extends EventName> (EventClass: DiscordEventConstructor<N>): this {
    const eventInstance = new EventClass()

    this.client.on(eventInstance.name, (...events: ClientEvents[N]) => {
      void eventInstance.listener(this.client, ...events)
    })

    this.logger.log({
      level: LogLevel.INFO,
      tag: ['eventRegisted', eventInstance.name],
      message: `Discord client event "${eventInstance.name}" has been registed`,
      extra: {
        eventName: eventInstance.name
      }
    })

    return this
  }
}
