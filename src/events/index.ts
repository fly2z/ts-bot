import { Event } from "../utils/events";
import guildCreate from "./guildCreate";
import join from "./join";
import ready from "./ready";

export default [ready, join, guildCreate] as Event[];
