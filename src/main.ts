import { DiscordClient } from './Discord/DiscordClient/DiscordClient'
import { DiscordEventReadyImpl } from './Discord/DiscordEvent/DiscordEventReadyImpl'

void DiscordClient
  .getInstance()
  .registEvent(DiscordEventReadyImpl)
  .run()
