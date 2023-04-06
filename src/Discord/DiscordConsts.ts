import 'dotenv/config'
import { ConstUtils } from '../Utils/ConstUtils'
import { type ActivityOptions, GatewayIntentBits, ActivityType } from 'discord.js'

export class DiscordConsts {
  public static readonly DISCORD_TOKEN =
    ConstUtils.checkRequiredField(
      'DISCORD_TOKEN', process.env.DISCORD_TOKEN)

  public static readonly DISCORD_FORUM_ID =
    ConstUtils.checkRequiredField(
      'DISCORD_FORUM_ID', process.env.DISCORD_FORUM_ID)

  public static readonly DISCORD_INTENTS: GatewayIntentBits[] = [
    GatewayIntentBits.GuildMessages
  ]

  public static readonly DISCORD_ACTIVITY: ActivityOptions = {
    name: process.env.DISCORD_ACTIVITY_NAME ?? 'messages',
    type: ActivityType[process.env.DISCORD_ACTIVITY_TYPE ?? 'Watching'] ?? ActivityType.Watching
  }
}
