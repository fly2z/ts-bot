import { Event } from "../utils/events";
import guildCreate from "./guildCreate";
import interactionCreate from "./interactionCreate";
import join from "./join";
import ready from "./ready";

export default [ready, interactionCreate, join, guildCreate] as Event[];
