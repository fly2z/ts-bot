import { Command } from "../utils/commands";
import clear from "./clear";
import ping from "./ping";
import serverinfo from "./serverinfo";

export default [ping, clear, serverinfo] as Command[];
