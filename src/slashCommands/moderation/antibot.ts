import {
  Colors,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../../utils/commands";
import { getGuildOption, setGuildOption } from "../../functions";

const Antibot: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("antibot")
    .setDescription("Antibot")
    .addSubcommand((command) =>
      command
        .setName("enable")
        .setDescription("Prohibit bots from joining the server")
    )
    .addSubcommand((command) =>
      command
        .setName("disable")
        .setDescription("Disable the anti bot system for this server")
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
        content: "You don't have permission to use the anti bot system.",
        ephemeral: true,
      });
    }

    const sub = options.getSubcommand();
    const enabled = await getGuildOption(interaction.guild, "antiBotEnabled");

    const embed = new EmbedBuilder().setColor(Colors.DarkOrange);

    switch (sub) {
      case "enable":
        if (enabled) {
          return await interaction.reply({
            content: `You already have this system setup!`,
            ephemeral: true,
          });
        }

        try {
          await setGuildOption(interaction.guild, "antiBotEnabled", true);
          embed.setDescription(
            `🌍 Bots are now prohibited from joining this server. **All current bots will be kicked within the next 10 seconds -- to reverse this, use the /antibot disable command.**`
          );
          await interaction.reply({ embeds: [embed], ephemeral: true });

          setTimeout(async () => {
            if (!interaction.guild) return;
            const enabled = await getGuildOption(
              interaction.guild,
              "antiBotEnabled"
            );

            if (!enabled) return;

            const members = await interaction.guild.members.fetch();

            members.forEach(async (member) => {
              if (member.user.bot && member.id !== interaction.client.user.id) {
                return await member.kick("Anti bot system");
              }
            });
          }, 10000);
        } catch (error) {
          return;
        }

        break;

      case "disable":
        if (!enabled) {
          return await interaction.reply({
            content: `🧠 Looks like this system has not been setup here`,
            ephemeral: true,
          });
        }

        try {
          await setGuildOption(interaction.guild, "antiBotEnabled", false);
          embed.setDescription(
            `🌍 Bots can now join and remain in this server`
          );
          await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
          return;
        }

        break;
    }
  },
  cooldown: 5,
};

export default Antibot;
