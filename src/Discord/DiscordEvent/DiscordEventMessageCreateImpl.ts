import { AIAskerService } from '../../AI/AIAskerService'
import { AIMetadataService } from '../../AI/AIMetadataService'
import type AIMetadata from '../../AI/datatypes/AIMetadata'
import { DatabaseService } from '../../Database/DatabaseService'
import { MessageAuthorType } from '../../Database/models/Messages'
import { DiscordConsts } from '../DiscordConsts'
import { type DiscordEvent } from './DiscordEvent'
import { type Message, ChannelType, type PublicThreadChannel, type GuildForumTag } from 'discord.js'

export class DiscordEventMessageCreateImpl implements DiscordEvent<'messageCreate'> {
  public readonly name = 'messageCreate'
  private readonly dbService = new DatabaseService()
  private readonly aiService = new AIAskerService()
  private readonly aiMetadataService = new AIMetadataService()

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
    const threadTags = await this.getTags(message)
    const threadMessages = await this.dbService.loadThreadMessages(message)
    const aiResult = await this.aiService.askAndParseMessages(threadMessages)
    const aiMetadataResult = await this.aiMetadataService.askAndParseMetadata(threadMessages, threadTags)

    if (aiResult === undefined) {
      await botMessage.edit('ERROR')
      return
    }

    if (aiMetadataResult !== undefined) {
      await this.setThreadTags(message, aiMetadataResult, threadTags)
      await this.setThreadTitle(message, aiMetadataResult)
    }

    const sentMessages = await this.sendBulkMessage(botMessage, aiResult)
    await this.dbService.saveNewMessages(sentMessages, MessageAuthorType.ASSISTANT)
  }

  private isVaildMessage (message: Message): boolean {
    return !message.author.bot &&
      message.guild !== null &&
      // !message.content.startsWith('#') &&
      message.channel.type === ChannelType.PublicThread &&
      message.channel.parent?.type === ChannelType.GuildForum &&
      message.channel.parent.id === DiscordConsts.DISCORD_FORUM_ID
  }

  private async sendBulkMessage (message: Message, aiResponse: string): Promise<Message[]> {
    const slicedContents = aiResponse.match(/(.|[\r\n]){1,2000}/g) ?? []
    const sentMessages: Message[] = []

    for (const [index, content] of slicedContents.entries()) {
      const sentMessage = index < 1
        ? await message.edit(content)
        : await message.channel.send(content)

      sentMessages.push(sentMessage)
    }

    return sentMessages
  }

  private async setThreadTags (message: Message, aiResponse: AIMetadata, tags: GuildForumTag[]): Promise<void> {
    const channel = message.channel as PublicThreadChannel<true>
    const filteredTags = tags.filter((tag) => aiResponse.tags.includes(tag.name))
    const tagIds = filteredTags.map((tag) => tag.id)

    await channel.setAppliedTags(tagIds)
  }

  private async setThreadTitle (message: Message, aiResponse: AIMetadata): Promise<void> {
    const channel = message.channel as PublicThreadChannel<true>
    await channel.setName(aiResponse.title)
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

  private async getTags (message: Message): Promise<GuildForumTag[]> {
    const channel = message.channel as PublicThreadChannel<true>
    return channel.parent?.availableTags ?? []
  }

  private async addAsker (message: Message): Promise<void> {
    await this.dbService.saveAsker(message)
    await message.reply('> Done')
  }

  private async listAsker (message: Message): Promise<void> {
    const askers = await this.dbService.loadAsker(message)
    const askerMembers = await Promise.all(askers.map(async (asker) =>
      await message.guild?.members.fetch(asker.userId)))

    const askerNames = '> ' + askerMembers
      .map((v) => v?.user.tag ?? 'Unknown')
      .join('\n> ')

    await message.reply(askerNames.length < 1 ? '> Empty' : askerNames)
  }
}
