import { type Messages } from '../Database/models/Messages'
import { LogLevel } from '../Logger/LogLevel'
import { Logger } from '../Logger/Logger'
import { AIAsker } from './AIAsker'

export class AIAskerService {
  private readonly aiAsker = AIAsker.getInstance()
  private readonly logger = Logger.getInstance(AIAskerService.name)

  public async askAI (promptMessages: Messages[]): Promise<string | undefined> {
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

  public async calculateTitle (promptMessages: Messages[]): Promise<string | undefined> {
    this.logger.log({
      level: LogLevel.INFO,
      message: 'calculate title via ai',
      tag: ['calcTitle'],
      extra: { promptMessages }
    })

    return await this.aiAsker.ask([
      ...promptMessages.map((v) => ({
        content: v.message,
        role: v.authorType
      })),
      {
        content: '위 대화내용에 알맞은 제목을 한국어로 붙혀줘',
        role: 'user'
      }
    ])
  }
}
