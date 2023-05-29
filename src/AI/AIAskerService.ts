import { type Messages } from '../Database/models/Messages'
import { LogLevel } from '../Logger/LogLevel'
import { Logger } from '../Logger/Logger'
import { AIAsker } from './AIAsker'

export class AIAskerService {
  private readonly aiAsker = AIAsker.getInstance()
  private readonly logger = Logger.getInstance(AIAskerService.name)

  public async askAndParseMessages (promptMessages: Messages[]): Promise<string | undefined> {
    return await this.askMessages(promptMessages)
  }

  private async askMessages (promptMessages: Messages[]): Promise<string | undefined> {
    this.logger.log({
      level: LogLevel.INFO,
      message: `asking ${promptMessages.length} prompts to ai`,
      tag: ['ask'],
      extra: { promptMessages }
    })

    return await this.aiAsker.ask(
      promptMessages.map((v) => ({
        content: v.message,
        role: v.authorType
      })))
  }
}
