import {
  Colors,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { SlashCommand } from "../../utils/commands";

const ClearCommand: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Deletes a specific amount of messages from a channel.")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of messages to delete")
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    ),
  execute: async (interaction) => {
    if (!interaction.guild) return;

    const amount = interaction.options.getInteger("amount");
    const channel = interaction.channel as TextChannel;

    if (
      !interaction.memberPermissions?.has(
        PermissionsBitField.Flags.ManageMessages
      )
    ) {
      await interaction.reply({
        content: "You don't have permissions to execute this command",
        ephemeral: true,
      });

      return;
    }

    if (!amount) {
      await interaction.reply({
        content: "Please specify the amount of messages you want to delete",
        ephemeral: true,
      });

      return;
    }

    if (amount > 100 || amount < 1) {
      await interaction.reply({
        content: "Please select a number *between* 1 and 100",
        ephemeral: true,
      });

      return;
    }

    try {
      await channel.bulkDelete(amount);
    } catch (error) {
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(Colors.Blue)
      .setDescription(`:white_check_mark:  Deleted **${amount}** messages.`);

    await interaction.reply({ embeds: [embed] });
    setTimeout(() => interaction.deleteReply(), 3000);

    return;
  },
  cooldown: 10,
};

export default ClearCommand;
