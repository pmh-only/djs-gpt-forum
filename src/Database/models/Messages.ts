export interface Messages {
  threadId: number
  messageId: number
  authorType: MessageAuthorType
  message: string
}

export enum MessageAuthorType {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant'
}
