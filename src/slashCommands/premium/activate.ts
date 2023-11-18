import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../utils/commands";
import { activatePremium, getUserOrCreate } from "../../lib/premium";

const ActivateKey: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("activate-premium")
    .setDescription("Activate premium with license key.")
    .addStringOption((option) =>
      option
        .setName("key")
        .setDescription("License Key")
        .setMinLength(16)
        .setMaxLength(25)
        .setRequired(true)
    ),
  execute: async (interaction) => {
    const key = interaction.options.getString("key");
    if (!key) {
      return await interaction.reply({
        content: "❌ License key cannot be empty!",
        ephemeral: true,
      });
    }

    const user = await getUserOrCreate(interaction.user.id);

    if (user.premium) {
      return await interaction.reply({
        content: "🌟 You're already enjoying premium benefits!",
        ephemeral: true,
      });
    }

    const result = await activatePremium(user.id, key);

    switch (result) {
      case "SUCCESS":
        return await interaction.reply({
          content:
            "✅ Congratulations! Your premium status has been activated successfully.",
          ephemeral: true,
        });

      case "INVALID_KEY":
        return await interaction.reply({
          content: "❌ Sorry, the provided license key is invalid.",
          ephemeral: true,
        });

      case "EXPIRED_OR_LIMIT_EXCEEDED":
        return await interaction.reply({
          content:
            "⏰ The license key has expired or reached its maximum uses.",
          ephemeral: true,
        });

      case "USER_NOT_FOUND":
        return await interaction.reply({
          content: "🔍 We couldn't find your account. Please try again later.",
          ephemeral: true,
        });

      default:
        return await interaction.reply({
          content:
            "⚠️ Something went wrong during activation. Please try again later.",
          ephemeral: true,
        });
    }
  },
  cooldown: 10,
};

export default ActivateKey;
