import { DiscordClient } from './Discord/DiscordClient/DiscordClient'
import { DiscordEventReadyImpl } from './Discord/DiscordEvent/DiscordEventReadyImpl'
import { DiscordEventMessageCreateImpl } from './Discord/DiscordEvent/DiscordEventMessageCreateImpl'

void DiscordClient
  .getInstance()
  .registEvent(DiscordEventReadyImpl)
  .registEvent(DiscordEventMessageCreateImpl)
  .run()
