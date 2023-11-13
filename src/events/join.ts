import { event, Events } from "../utils/events";

export default event(Events.GuildMemberAdd, async ({ log }, member) => {
  // not implemented
  // const channel = (await client.channels.fetch(
  //   "id"
  // )) as TextChannel;
  // return channel.send(`Welcome ${member.user.username}!`);
  log("[Join Event]", `${member.user.tag} joined to ${member.guild.name}`);
});
