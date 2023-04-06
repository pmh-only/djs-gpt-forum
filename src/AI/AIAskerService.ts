import { type Messages } from '../Database/models/Messages'
import { AIAsker } from './AIAsker'

export class AIAskerService {
  private readonly aiAsker = AIAsker.getInstance()

  public async askAI (promptMessages: Messages[]): Promise<string | undefined> {
    return await this.aiAsker.ask(
      promptMessages.map((v) => ({
        content: v.message,
        role: v.authorType
      })))
  }
}
