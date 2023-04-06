import { DatabaseService } from '../../Database/DatabaseService'
import { DiscordConsts } from '../DiscordConsts'
import { type DiscordEvent } from './DiscordEvent'
import { type Message, ChannelType } from 'discord.js'

export class DiscordEventMessageCreateImpl implements DiscordEvent<'messageCreate'> {
  public readonly name = 'messageCreate'
  private readonly dbService = new DatabaseService()

  public async listener (_, message: Message): Promise<void> {
    if (!this.isVaildMessage(message))
      return

    if (!await this.dbService.isThreadSaved(message))
      await this.dbService.saveNewAsker(message, true)

    else if (!await this.dbService.isAskerSaved(message))
      return

    await this.dbService.saveNewMessage(message)
  }

  private isVaildMessage (message: Message): boolean {
    return !message.author.bot &&
      message.guild !== null &&
      message.channel.type === ChannelType.PublicThread &&
      message.channel.parent?.type === ChannelType.GuildForum &&
      message.channel.parent.id === DiscordConsts.DISCORD_FORUM_ID
  }
}
