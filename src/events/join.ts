import { TextChannel } from "discord.js";
import { db } from "../lib/db";
import { event, Events } from "../utils/events";

export default event(Events.GuildMemberAdd, async ({ client, log }, member) => {
  log(`${member.user.tag} joined to ${member.guild.name}`);

  const guild = await db.guild.findUnique({
    where: { id: member.guild.id },
    select: {
      welcomeChannel: true,
      welcomeMessage: true,
      welcomeReaction: true,
      antiBotEnabled: true,
    },
  });

  if (
    guild?.antiBotEnabled &&
    member.user.bot &&
    member.id !== client.user?.id
  ) {
    return await member.kick("Anti bot system");
  }

  if (!guild?.welcomeChannel || !guild.welcomeMessage) return;

  try {
    const channel = (await member.guild.channels.cache.get(
      guild.welcomeChannel
    )) as TextChannel;
    const formattedMessage = guild.welcomeMessage
      .replace("{member}", member.user.toString())
      .replace("{member.name}", member.user.username);
    const msg = await channel.send({ content: `${formattedMessage}` });

    if (guild.welcomeReaction) {
      await msg.react(guild.welcomeReaction);
    }
  } catch (error) {
    return;
  }
});
