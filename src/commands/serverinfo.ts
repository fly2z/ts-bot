import { EmbedBuilder } from "discord.js";
import { CommandOptions, command } from "../utils/commands";

const options: CommandOptions = {
  aliases: ["server"],
};

export default command(
  "serverinfo",
  async ({ message }) => {
    if (!message.inGuild()) {
      return message.reply("You can only run this command inside a server.");
    }

    const { guild } = message;

    const serverInfoEmbed = new EmbedBuilder({
      author: {
        name: guild.name,
        icon_url: guild.iconURL({ size: 256 }) || undefined,
      },
      fields: [
        {
          name: "Owner",
          value: (await guild.fetchOwner()).user.tag,
          inline: true,
        },
        {
          name: "Text Channels",
          value: guild.channels.cache
            .filter((c) => c.type === 0)
            .toJSON()
            .length.toString(),
          inline: true,
        },
        {
          name: "Voice Channels",
          value: guild.channels.cache
            .filter((c) => c.type === 2)
            .toJSON()
            .length.toString(),
          inline: true,
        },
        {
          name: "Category Channels",
          value: guild.channels.cache
            .filter((c) => c.type === 2)
            .toJSON()
            .length.toString(),
          inline: true,
        },
        {
          name: "Members",
          value: guild.memberCount.toString(),
          inline: true,
        },
        {
          name: "Roles",
          value: guild.roles.cache.size.toString(),
          inline: true,
        },
        {
          name: "Role List",
          value: guild.roles.cache.toJSON().join(", "),
        },
      ],
      footer: {
        text: `ID: ${
          guild.id
        } | Server Created: ${guild.createdAt.toDateString()}`,
      },
    });

    return message.reply({ embeds: [serverInfoEmbed] });
  },
  options
);
