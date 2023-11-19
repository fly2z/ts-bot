import { SlashCommand } from "../utils/commands";
import clear from "./general/clear";
import poll from "./general/poll";
import roleInfo from "./general/roleinfo";
import serverInfo from "./general/serverinfo";
import createInvite from "./moderation/create-invite";
import timeout from "./moderation/timeout";
import activateKey from "./premium/activate";
import premiumOnly from "./premium/test-command";

export default [
  clear,
  roleInfo,
  serverInfo,
  createInvite,
  poll,
  activateKey,
  premiumOnly,
  timeout,
] as SlashCommand[];
