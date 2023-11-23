import { Colors, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../utils/commands";

const ServerInfo: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Get server info"),
  execute: async (interaction) => {
    if (!interaction.guild) return;

    const { guild } = interaction;

    const serverInfoEmbed = new EmbedBuilder()
      .setColor(Colors.DarkOrange)
      .addFields({
        name: "Owner",
        value: (await guild.fetchOwner()).user.tag,
        inline: true,
      })
      .addFields({
        name: "Text Channels",
        value: guild.channels.cache
          .filter((c) => c.type === 0)
          .toJSON()
          .length.toString(),
        inline: true,
      })
      .addFields({
        name: "Voice Channels",
        value: guild.channels.cache
          .filter((c) => c.type === 2)
          .toJSON()
          .length.toString(),
        inline: true,
      })
      .addFields({
        name: "Category Channels",
        value: guild.channels.cache
          .filter((c) => c.type === 2)
          .toJSON()
          .length.toString(),
        inline: true,
      })
      .addFields({
        name: "Members",
        value: guild.memberCount.toString(),
        inline: true,
      })
      .addFields({
        name: "Roles",
        value: guild.roles.cache.size.toString(),
        inline: true,
      })
      .addFields({
        name: "Role List",
        value: guild.roles.cache.toJSON().join(", "),
      })
      .setAuthor({
        name: guild.name,
        iconURL: guild.iconURL({ size: 256 }) || undefined,
      })
      .setFooter({
        text: `ID: ${
          guild.id
        } | Server Created: ${guild.createdAt.toDateString()}`,
      });

    await interaction.reply({ embeds: [serverInfoEmbed] });
  },
  cooldown: 5,
};

export default ServerInfo;
