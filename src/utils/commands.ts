import {
  ChannelType,
  type Awaitable,
  type Client,
  type Message,
} from "discord.js";
import { getGuildOption } from "../functions";

export type LogMethod = (...args: unknown[]) => void;

export interface CommandProps {
  client: Client;
  log: LogMethod;
  message: Message<boolean>;
}

export type CommandCallback = (
  props: CommandProps,
  ...args: string[]
) => Awaitable<unknown>;

export interface CommandOptions {
  aliases?: string[];
  cooldown?: number;
}

export interface Command {
  name: string;
  callback: CommandCallback;
  options?: CommandOptions;
}

export function command(
  name: string,
  callback: CommandCallback,
  options?: CommandOptions
): Command {
  return { name, callback, options };
}

function findCommandByName(
  commands: Command[],
  commandName: string
): Command | undefined {
  return commands.find((command) => command.name === commandName);
}

function findCommandByAlias(
  commands: Command[],
  alias: string
): Command | undefined {
  return commands.find((command) => command.options?.aliases?.includes(alias));
}

export function registerCommands(client: Client, commands: Command[]): void {
  client.on("messageCreate", async (message) => {
    if (!message.member || message.author.bot) return; // Ignore messages from bots
    if (!message.guild) return;

    const guildPrefix = await getGuildOption(message.guild, "prefix");

    const prefix = guildPrefix || process.env.PREFIX;

    if (!message.content.startsWith(prefix)) return;
    if (message.channel.type !== ChannelType.GuildText) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();
    if (!commandName) return;

    let command = findCommandByName(commands, commandName);

    if (!command) {
      const commandFromAlias = findCommandByAlias(commands, commandName);
      if (commandFromAlias) {
        command = commandFromAlias;
      } else {
        return;
      }
    }

    let cooldown = message.client.cooldowns.get(
      `${command.name}-${message.member.user.username}`
    );

    if (command.options?.cooldown && cooldown) {
      if (Date.now() < cooldown) {
        message.reply(
          `You have to wait ${Math.floor(
            Math.abs(Date.now() - cooldown) / 1000
          )} second(s) to use this command again.`
        );
        return;
      }

      message.client.cooldowns.set(
        `${command.name}-${message.member.user.username}`,
        Date.now() + command.options.cooldown * 1000
      );

      setTimeout(() => {
        message.client.cooldowns.delete(
          `${command?.name}-${message.member!.user.username}`
        );
      }, command.options.cooldown * 1000);
    } else if (command.options?.cooldown && !cooldown) {
      message.client.cooldowns.set(
        `${command.name}-${message.member.user.username}`,
        Date.now() + command.options.cooldown * 1000
      );
    }

    const log = console.log.bind(console, `[Command: ${command.name}]`);

    try {
      await command.callback({ client, log, message }, ...args);
    } catch (err) {
      log(`[Uncaught Error]`, err);
    }
  });
}
