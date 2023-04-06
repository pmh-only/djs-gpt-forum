import { type Message } from 'discord.js'
import { DatabaseClient } from './DatabaseClient'

import { type Askers } from './models/Askers'
import { MessageAuthorType, type Messages } from './models/Messages'
import { Logger } from '../Logger/Logger'
import { LogLevel } from '../Logger/LogLevel'

export class DatabaseService {
  private readonly db = DatabaseClient.getInstance()
  private readonly logger = Logger.getInstance(DatabaseService.name)

  public async isThreadSaved (message: Message): Promise<boolean> {
    return await this.db
      .query<Messages>('messages')
      .where('threadId', parseInt(message.channel.id))
      .limit(1).then((v) => v.length > 0)
  }

  public async saveNewMessage (message: Message, authorType = MessageAuthorType.USER): Promise<void> {
    this.logger.log({
      level: LogLevel.INFO,
      message: 'Message saved',
      tag: ['db', 'save', 'message'],
      extra: {
        author: message.author.id,
        message: message.content,
        thread: message.channel.id,
        authorType
      }
    })

    await this.db
      .query<Messages>('messages')
      .insert({
        threadId: parseInt(message.channel.id),
        messageId: parseInt(message.id),
        authorType,
        message: message.content
      })
  }

  public async loadThreadMessages (message: Message): Promise<Messages[]> {
    this.logger.log({
      level: LogLevel.INFO,
      message: 'Message loaded',
      tag: ['db', 'load', 'message'],
      extra: {
        thread: message.channel.id
      }
    })

    return await this.db
      .query<Messages>('messages')
      .where('threadId', parseInt(message.channel.id))
      .orderBy('messageId', 'asc')
  }

  public async isAskerSaved (message: Message): Promise<boolean> {
    return await this.db
      .query<Askers>('askers')
      .where('threadId', parseInt(message.channel.id))
      .where('userId', parseInt(message.author.id))
      .limit(1).then((v) => v.length > 0)
  }

  public async saveNewAsker (message: Message, isStarter: boolean): Promise<void> {
    this.logger.log({
      level: LogLevel.INFO,
      message: 'Asker saved',
      tag: ['db', 'save', 'asker'],
      extra: {
        author: message.author.id,
        message: message.content,
        thread: message.channel.id,
        isStarter
      }
    })

    await this.db
      .query<Askers>('askers')
      .insert({
        threadId: parseInt(message.channel.id),
        userId: parseInt(message.author.id),
        isStarter
      })
  }
}
