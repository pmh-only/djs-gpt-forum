import { LogLevel } from '../../Logger/LogLevel'
import { Logger } from '../../Logger/Logger'
import { DiscordConsts } from '../DiscordConsts'
import type { DiscordEvent } from './DiscordEvent'
import { type Client as DiscordJSClient } from 'discord.js'

export class DiscordEventReadyImpl implements DiscordEvent<'ready'> {
  public readonly name = 'ready'
  private client: DiscordJSClient<true>
  private readonly logger = Logger.getInstance('DiscordEventReadyImpl')

  public listener (client: DiscordJSClient<true>): void {
    this.client = client
    this.logEvent()
    this.setActivity()
  }

  private setActivity (): void {
    this.client.user.setActivity(DiscordConsts.DISCORD_ACTIVITY)
  }

  private logEvent (): void {
    this.logger.log({
      level: LogLevel.INFO,
      tag: ['event', 'ready'],
      message: `${this.client.user.tag} is now online`
    })
  }
}
