import { db } from "../lib/db";
import { event, Events } from "../utils/events";

export default event(Events.GuildCreate, async ({ log }, guild) => {
  try {
    await db.guild.create({ data: { id: guild.id } });
    log(`Guild Created [${guild.id}-${guild.name}]`);
  } catch (err) {
    log(`Error [${guild.id}-${guild.name}]`);
    throw err;
  }
});
