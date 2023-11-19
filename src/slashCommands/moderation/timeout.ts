import {
  GuildMemberRoleManager,
  PermissionFlagsBits,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import ms, { StringValue } from "ms";
import prettyMs from "pretty-ms";
import { SlashCommand } from "../../utils/commands";

const Timeout: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout a user")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user you want to timeout.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("duration")
        .setDescription("Timeout duration (30m, 1h, 1 day).")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for the timeout.")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
  execute: async (interaction) => {
    if (!interaction.guild || !interaction.member) return;

    if (
      !interaction.guild.members.me?.permissions.has(
        PermissionsBitField.Flags.MuteMembers
      )
    ) {
      return await interaction.reply(
        "I don't have the required permissions to mute members."
      );
    }

    const mentionable = interaction.options.getUser("target");
    const duration = interaction.options.getString("duration");
    const reason =
      interaction.options.getString("reason") || "No reason provided";
    if (!mentionable || !duration) return;

    await interaction.deferReply({ ephemeral: true });

    const targetUser = await interaction.guild.members.fetch(mentionable);
    if (!targetUser) {
      await interaction.editReply("That user doesn't exist in this server.");
      return;
    }

    if (targetUser.user.bot) {
      await interaction.editReply("I can't timeout a bot.");
      return;
    }

    let msDuration: number;
    try {
      msDuration = ms(duration as StringValue);
    } catch (error) {
      await interaction.editReply("Please provide a valid timeout duration.");
      return;
    }

    // min 5 seconds, max 28 days
    if (msDuration < 5000 || msDuration > 2.41e9) {
      await interaction.editReply(
        "Timeout duration cannot be less than 5 seconds or more than 28 days."
      );
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position;
    const requestUserRolePosition = (
      interaction.member.roles as GuildMemberRoleManager
    ).highest.position;
    const botRolePosition =
      interaction.guild.members.me?.roles.highest.position;
    if (!botRolePosition) return;

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply(
        "You can't kick that user because they have the same/higher role than you."
      );
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply(
        "I can't kick that user because they have the same/higher role than me."
      );
      return;
    }

    // Timeout the user
    try {
      if (targetUser.isCommunicationDisabled()) {
        await targetUser.timeout(msDuration, reason);
        await interaction.editReply(
          `${targetUser}'s timeout has been updated to ${prettyMs(msDuration, {
            verbose: true,
          })}.\nReason: ${reason}`
        );
        return;
      }

      await targetUser.timeout(msDuration, reason);
      await interaction.editReply(
        `${targetUser} was timed out for ${prettyMs(msDuration, {
          verbose: true,
        })}.\nReason: ${reason}`
      );
    } catch (error) {
      console.log(`There was an error when timing out: ${error}`);
      return;
    }
  },
};

export default Timeout;
