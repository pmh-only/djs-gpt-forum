import 'dotenv/config'
import { ConstUtils } from '../Utils/ConstUtils'

export class AIConsts {
  public static readonly OPENAI_API_KEY =
    ConstUtils.checkRequiredField(
      'OPENAI_API_KEY', process.env.OPENAI_API_KEY)

  public static readonly OPENAI_API_MODEL =
    process.env.OPENAI_API_MODEL ?? 'gpt-3.5-turbo'
}
