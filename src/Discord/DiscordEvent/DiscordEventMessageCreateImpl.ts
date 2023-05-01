import { AIAskerService } from '../../AI/AIAskerService'
import { DatabaseService } from '../../Database/DatabaseService'
import { MessageAuthorType, type Messages } from '../../Database/models/Messages'
import { DiscordConsts } from '../DiscordConsts'
import { type DiscordEvent } from './DiscordEvent'
import { type Message, ChannelType, type ThreadChannel } from 'discord.js'

export class DiscordEventMessageCreateImpl implements DiscordEvent<'messageCreate'> {
  public readonly name = 'messageCreate'
  private readonly dbService = new DatabaseService()
  private readonly aiService = new AIAskerService()

  public async listener (_, message: Message): Promise<void> {
    if (!this.isVaildMessage(message))
      return

    if (!await this.dbService.isThreadSaved(message))
      await this.dbService.saveAskStarter(message)

    if (!await this.dbService.isAskerSaved(message)) {
      await this.processUnPermittedMessage(message)
      return
    }

    if (message.content.startsWith('#')) {
      await this.processHashCommandMessage(message)
      return
    }

    await this.dbService.saveNewMessage(message)

    const botMessage = await message.channel.send('Processing...')
    const threadMessages = await this.dbService.loadThreadMessages(message)
    const askAIResult = await this.askAI(threadMessages)
    const sentMessages = await this.sendBulkMessage(botMessage, askAIResult)

    await this.dbService.saveNewMessages(sentMessages, MessageAuthorType.ASSISTANT)
    await this.calculateTitle(message, threadMessages)
  }

  private isVaildMessage (message: Message): boolean {
    return !message.author.bot &&
      message.guild !== null &&
      // !message.content.startsWith('#') &&
      message.channel.type === ChannelType.PublicThread &&
      message.channel.parent?.type === ChannelType.GuildForum &&
      message.channel.parent.id === DiscordConsts.DISCORD_FORUM_ID
  }

  private async calculateTitle (message: Message, promptMessages: Messages[]): Promise<void> {
    const channel = message.channel as ThreadChannel
    const title = await this.aiService.calculateTitle(promptMessages)

    if (title === undefined)
      return

    await channel.setName(title.replaceAll('"', ''))
  }

  private async askAI (promptMessages: Messages[]): Promise<string> {
    return await this.aiService.askAI(promptMessages) ?? 'ERROR'
  }

  private async sendBulkMessage (message: Message, bulkContent: string): Promise<Message[]> {
    const slicedContents = bulkContent.match(/(.|[\r\n]){1,2000}/g) ?? []
    const sentMessages: Message[] = []

    for (const [index, content] of slicedContents.entries()) {
      const sentMessage = index < 1
        ? await message.edit(content)
        : await message.channel.send(content)

      sentMessages.push(sentMessage)
    }

    return sentMessages
  }

  private async processUnPermittedMessage (message: Message): Promise<void> {
    if (!message.content.startsWith('#') || message.content.startsWith('#asker'))
      await message.delete()
  }

  private async processHashCommandMessage (message: Message): Promise<void> {
    if (message.content.startsWith('#asker add'))
      await this.addAsker(message)

    if (message.content.startsWith('#asker list'))
      await this.listAsker(message)
  }

  private async addAsker (message: Message): Promise<void> {
    await this.dbService.saveAsker(message)
    await message.reply('> Done')
  }

  private async listAsker (message: Message): Promise<void> {
    const askers = await this.dbService.loadAsker(message)
    const askerMembers = await Promise.all(askers.map(async (asker) =>
      await message.guild?.members.fetch(asker.userId.toString())))

    const askerNames = askerMembers
      .map((v) => v?.user.tag ?? 'Unknown')
      .reduce((name, prev) => `${prev}\n> ${name}`, '')

    await message.reply(askerNames.length < 1 ? '> Empty' : askerNames)
  }
}
