import { type GuildForumTag } from 'discord.js'
import { type Messages } from '../Database/models/Messages'
import { LogLevel } from '../Logger/LogLevel'
import { Logger } from '../Logger/Logger'
import { AIAsker } from './AIAsker'
import type AIResponse from './datatypes/AIMetadata'

export class AIMetadataService {
  private readonly aiAsker = AIAsker.getInstance()
  private readonly logger = Logger.getInstance(AIMetadataService.name)

  public async askAndParseMetadata (promptMessages: Messages[], tags: GuildForumTag[]): Promise<AIResponse | undefined> {
    promptMessages[promptMessages.length - 1].message =
      `user says "${promptMessages[promptMessages.length - 1].message}"` +
      ' create korean title of this conversation in JSON "title" field' +
      ` and choose hashtags from ${tags.reduce((prev, curr) => `${prev},"${curr.name}"`, '')} in JSON "tags" JSON array.` +
      ' give me only JSON output without code block'

    const rawResponse = await this.askMessages(promptMessages)
    return this.parseAIResponse(rawResponse)
  }

  private async askMessages (promptMessages: Messages[]): Promise<string | undefined> {
    this.logger.log({
      level: LogLevel.INFO,
      message: `asking ${promptMessages.length} prompts to ai`,
      tag: ['ask', 'metadata'],
      extra: { promptMessages }
    })

    return await this.aiAsker.ask(
      promptMessages.map((v) => ({
        content: v.message,
        role: v.authorType
      })))
  }

  private parseAIResponse (rawResponse: string | undefined): AIResponse | undefined {
    if (rawResponse === undefined)
      return undefined

    this.logger.log({
      level: LogLevel.INFO,
      message: 'parsing ai response.',
      tag: ['parse', 'aiResponse'],
      extra: { rawResponse }
    })

    try {
      const parsedResponse = JSON.parse(rawResponse) as AIResponse
      const isCorrectlyParsed =
        typeof parsedResponse.title === 'string' &&
        Array.isArray(parsedResponse.tags)

      if (isCorrectlyParsed)
        return parsedResponse

      return undefined
    } catch {
      return undefined
    }
  }
}
