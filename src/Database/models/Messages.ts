export interface Messages {
  threadId: string
  messageId: string
  authorType: MessageAuthorType
  message: string
}

export enum MessageAuthorType {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant'
}
