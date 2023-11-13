import { TextChannel } from "discord.js";
import { event, Events } from "../utils/events";

export default event(Events.GuildMemberAdd, async ({ log, client }, member) => {
  // not implemented
  const channel = (await client.channels.fetch(
    ""
  )) as TextChannel;
  return channel.send(`Welcome ${member.user.username}!`);
});
