import type { Awaitable, ClientEvents, Client as DiscordJSClient } from 'discord.js'

export type EventName = keyof ClientEvents

export interface DiscordEvent<N extends EventName> {
  name: N
  listener: (client: DiscordJSClient, ...args: ClientEvents[N]) => Awaitable<void>
}

export type DiscordEventConstructor<N extends EventName> =
  new() => DiscordEvent<N>
