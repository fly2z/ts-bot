import "dotenv/config";
import { registerEvents } from "./utils/events";
import Events from "./events";
import Commands from "./commands";
import SlashCommands from "./slashCommands";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import { registerCommands, registerSlashCommands } from "./utils/commands";
import { SlashCommand } from "./utils/commands";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.cooldowns = new Collection<string, number>();
client.slashCommands = new Collection<string, SlashCommand>();

registerEvents(client, Events);
registerCommands(client, Commands);
registerSlashCommands(client, SlashCommands);

client.login(process.env.TOKEN!).catch((err) => {
  console.error("[Login Error]", err);
  process.exit(1);
});
