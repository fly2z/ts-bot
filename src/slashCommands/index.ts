import { SlashCommand } from "../utils/commands";
import clear from "./general/clear";
import poll from "./general/poll";
import roleInfo from "./general/roleinfo";
import serverInfo from "./general/serverinfo";
import createInvite from "./moderation/createinvite";

export default [
  clear,
  roleInfo,
  serverInfo,
  createInvite,
  poll,
] as SlashCommand[];
