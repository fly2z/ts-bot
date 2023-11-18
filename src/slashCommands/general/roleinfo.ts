import {
  Colors,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../../utils/commands";

const RoleInfo: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("roleinfo")
    .setDescription("Get role info")
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role you want to get")
        .setRequired(true)
    ),
  execute: async (interaction) => {
    if (!interaction.guild) return;

    const role = interaction.options.getRole("role");
    if (!role) return;

    const members = await interaction.guild.members.fetch();

    let memberCount = 0;
    await members.forEach(async (member) => {
      if (member.roles.cache.has(role.id)) memberCount++;
    });

    const embed = new EmbedBuilder()
      .setColor(Colors.DarkOrange)
      .setThumbnail(role.icon || null)
      .addFields({ name: "Name", value: `${role.name}` })
      .addFields({ name: "Role Id", value: `${role.id}` })
      .addFields({ name: "Color", value: `${role.color}` })
      .addFields({ name: "Mentionable", value: `${role.mentionable}` })
      .addFields({ name: "Hoisted", value: `${role.hoist}` })
      .addFields({ name: "Role Position", value: `${role.position}` })
      .addFields({ name: "Role Member Count", value: `${memberCount}` })
      .setFooter({ text: "Role Info" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
  cooldown: 5,
};

export default RoleInfo;
