import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../utils/commands";
import { db } from "../../lib/db";

const PremiumOnly: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("premium-only")
    .setDescription("Premium only test command."),
  execute: async (interaction) => {
    const user = await db.user.findUnique({
      where: { id: interaction.user.id },
    });

    if (user && user.premium) {
      return await interaction.reply({
        content: "🌟 You are a premium user! Enjoy the exclusive features!",
      });
    } else {
      return await interaction.reply({
        content:
          "🔒 You are not a premium user. Upgrade to unlock premium features!",
      });
    }
  },
  cooldown: 3,
};

export default PremiumOnly;
