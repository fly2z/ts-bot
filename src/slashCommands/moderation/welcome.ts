import {
  ChannelType,
  Colors,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../../utils/commands";
import { db } from "../../lib/db";

const Welcome: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("welcome")
    .setDescription("Manage your welcome message system")
    .addSubcommand((command) =>
      command
        .setName("setup")
        .setDescription("Set your welcome message system up")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel for your welcome messages")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription(
              "The message. Use {member} to ping the member, and {member.name} to put in their username"
            )
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reaction")
            .setDescription("The reaction for your welcome message")
            .setRequired(false)
        )
    )
    .addSubcommand((command) =>
      command
        .setName("disable")
        .setDescription("Disable your welcome message system")
    ),
  execute: async (interaction) => {
    if (!interaction.member || !interaction.guild) return;

    const { options } = interaction;
    if (
      !interaction.memberPermissions?.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      return await interaction.reply({
        content: "You don't have permission to use this system",
        ephemeral: true,
      });
    }

    const sub = options.getSubcommand();
    const data = await db.guild.findUnique({
      where: { id: interaction.guild.id },
      select: {
        welcomeChannel: true,
        welcomeMessage: true,
        welcomeReaction: true,
      },
    });

    if (!data) return;

    switch (sub) {
      case "setup":
        if (data?.welcomeChannel && data.welcomeMessage) {
          return await interaction.reply({
            content:
              "It looks like there is already a welcome message setup for this server",
            ephemeral: true,
          });
        }

        const channel = options.getChannel("channel");
        const message = options.getString("message");
        const reaction = options.getString("reaction");
        if (!channel || !message) return;

        await db.guild.update({
          where: { id: interaction.guild.id },
          data: {
            welcomeChannel: channel.id,
            welcomeMessage: message,
            welcomeReaction: reaction,
          },
        });

        const embed = new EmbedBuilder()
          .setColor(Colors.Green)
          .setDescription(
            `⚒️ Your welcome message is now setup. When a member joins the message \`${message}\` will be sent in ${channel}`
          );

        await interaction.reply({ embeds: [embed], ephemeral: true });
        break;

      case "disable":
        if (!data.welcomeChannel || !data.welcomeMessage) {
          return await interaction.reply({
            content:
              "It looks like there is NOT a welcome message setup for this server yet",
            ephemeral: true,
          });
        } else {
          await db.guild.update({
            where: { id: interaction.guild.id },
            data: {
              welcomeChannel: null,
              welcomeMessage: null,
              welcomeReaction: null,
            },
          });

          const embed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(
              `⚒️ Your welcome message is now disabled. And will no longer be sent.`
            );

          await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        break;
    }
  },
  cooldown: 5,
};

export default Welcome;
