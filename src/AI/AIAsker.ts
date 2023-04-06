import { type ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai'
import { AIConsts } from './AIConsts'

export class AIAsker {
  private static _instance: AIAsker
  private constructor () {}

  public static getInstance (): AIAsker {
    if (this._instance === undefined)
      this._instance = new AIAsker()

    return this._instance
  }

  private readonly openaiConfig = new Configuration({
    apiKey: AIConsts.OPENAI_API_KEY
  })

  private readonly openai = new OpenAIApi(this.openaiConfig)

  public async ask (messages: ChatCompletionRequestMessage[]): Promise<string | undefined> {
    return await this.openai.createChatCompletion({
      model: AIConsts.OPENAI_API_MODEL,
      messages
    }).then((v) => v.data.choices[0].message?.content)
  }
}
