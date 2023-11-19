import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  Colors,
  EmbedBuilder,
  PermissionsBitField,
  TextBasedChannel,
} from "discord.js";
import { db } from "../lib/db";
import { event, Events } from "../utils/events";

export default event(Events.GuildCreate, async ({ log }, guild) => {
  try {
    const gld = await db.guild.findUnique({ where: { id: guild.id } });
    if (!gld) {
      await db.guild.create({ data: { id: guild.id } });
      log(`Guild Created [${guild.id}-${guild.name}]`);
    }
  } catch (err) {
    log(`Error [${guild.id}-${guild.name}]`);
    throw err;
  }

  async function sendMessage(channelId: string) {
    const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("deleteNew")
        .setLabel("🗑️")
        .setStyle(ButtonStyle.Danger)
    );

    const embed = new EmbedBuilder()
      .setColor(Colors.DarkOrange)
      .setTitle("Thanks for inviting me!")
      .setDescription(
        `Thank you for inviting me to your server - ${guild.name}. I am here to help! \n\n **Please note this bot is in beta, and may produce unwanted responses. If you encounter these or any other bugs, please do /report**`
      )
      .setFooter({
        text: "Feel free to delete this message using the button if it is in a bad channel!",
      });

    const sendChannel = (await guild.channels.cache.get(
      channelId
    )) as TextBasedChannel;
    const msg = await sendChannel.send({
      embeds: [embed],
      components: [button],
    });

    const collector = await msg.createMessageComponentCollector();
    collector.on("collect", async (i) => {
      if (i.customId === "deleteNew") {
        await msg.delete();
      }
    });
  }

  if (guild.publicUpdatesChannel) {
    sendMessage(guild.publicUpdatesChannel.id);
  } else if (guild.systemChannel) {
    sendMessage(guild.systemChannel.id);
  } else {
    let goodChannels: string[] = [];
    let badChannels: string[] = [];

    const channelFetch = await guild.channels.fetch();
    if (!channelFetch) return;

    channelFetch.forEach((channel) => {
      if (
        channel
          ?.permissionsFor(guild.roles.everyone)
          .has(PermissionsBitField.Flags.SendMessages) &&
        channel.type === ChannelType.GuildText
      ) {
        goodChannels.push(channel.id);
      } else if (channel?.type === ChannelType.GuildText) {
        badChannels.push(channel.id);
      } else {
        return;
      }
    });

    // get a random channel
    if (goodChannels.length > 0) {
      sendMessage(
        goodChannels[Math.floor(Math.random() * goodChannels.length)]
      );
    } else if (badChannels.length > 0) {
      sendMessage(badChannels[Math.floor(Math.random() * badChannels.length)]);
    } else {
      return;
    }
  }
});
