import { type Message } from 'discord.js'
import { DatabaseClient } from './DatabaseClient'

import { type Askers } from './models/Askers'
import { MessageAuthorType, type Messages } from './models/Messages'

export class DatabaseService {
  private readonly db = DatabaseClient.getInstance()

  public async isThreadSaved (message: Message): Promise<boolean> {
    return await this.db
      .query<Messages>('messages')
      .where('threadId', parseInt(message.channel.id))
      .limit(1).then((v) => v.length > 0)
  }

  public async saveNewMessage (message: Message): Promise<void> {
    await this.db
      .query<Messages>('messages')
      .insert({
        threadId: parseInt(message.channel.id),
        messageId: parseInt(message.id),
        authorType: MessageAuthorType.USER,
        message: message.content
      })
  }

  public async isAskerSaved (message: Message): Promise<boolean> {
    return await this.db
      .query<Askers>('askers')
      .where('threadId', parseInt(message.channel.id))
      .where('userId', parseInt(message.author.id))
      .limit(1).then((v) => v.length > 0)
  }

  public async saveNewAsker (message: Message, isStarter: boolean): Promise<void> {
    await this.db
      .query<Askers>('askers')
      .insert({
        threadId: parseInt(message.channel.id),
        userId: parseInt(message.author.id),
        isStarter
      })
  }
}
