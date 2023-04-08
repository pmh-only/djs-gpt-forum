import { AIAskerService } from '../../AI/AIAskerService'
import { DatabaseService } from '../../Database/DatabaseService'
import { MessageAuthorType, type Messages } from '../../Database/models/Messages'
import { DiscordConsts } from '../DiscordConsts'
import { type DiscordEvent } from './DiscordEvent'
import { type Message, ChannelType } from 'discord.js'

export class DiscordEventMessageCreateImpl implements DiscordEvent<'messageCreate'> {
  public readonly name = 'messageCreate'
  private readonly dbService = new DatabaseService()
  private readonly aiService = new AIAskerService()

  public async listener (_, message: Message): Promise<void> {
    if (!this.isVaildMessage(message))
      return

    if (!await this.dbService.isThreadSaved(message))
      await this.dbService.saveNewAsker(message, true)

    else if (!await this.dbService.isAskerSaved(message))
      return

    await this.dbService.saveNewMessage(message)
    await this.dbService.saveNewMessage(
      await this.askAIAndSend(message,
        await this.dbService.loadThreadMessages(message)),
      MessageAuthorType.ASSISTANT
    )
  }

  private isVaildMessage (message: Message): boolean {
    return !message.author.bot &&
      message.guild !== null &&
      !message.content.startsWith('#') &&
      message.channel.type === ChannelType.PublicThread &&
      message.channel.parent?.type === ChannelType.GuildForum &&
      message.channel.parent.id === DiscordConsts.DISCORD_FORUM_ID
  }

  private async askAIAndSend (message: Message, promptMessages: Messages[]): Promise<Message> {
    const newMessage = await message.channel.send('Processing...')
    const aiResult = await this.aiService.askAI(promptMessages)

    return await newMessage.edit(aiResult ?? 'ERROR')
  }
}
