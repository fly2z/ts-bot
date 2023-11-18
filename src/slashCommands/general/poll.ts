import {
  ChannelType,
  Colors,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { SlashCommand } from "../../utils/commands";

const PollCommand: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Create a poll and send it to a certain channel")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("Describe the poll")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Where do you want to send the poll to?")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),
  execute: async (interaction) => {
    if (!interaction.guild) return;
    
    const { options } = interaction;

    const channel = options.getChannel("channel") as TextChannel;
    const description = options.getString("description");

    const embed = new EmbedBuilder()
      .setColor(Colors.Orange)
      .setDescription(description)
      .setTimestamp();

    try {
      const message = await channel.send({ embeds: [embed] });
      await message.react("✅");
      await message.react("❌");
      await interaction.reply({
        content: "Poll was successfully sent to the channel.",
        ephemeral: true,
      });
    } catch (error) {
      console.log(error);
    }
  },
  cooldown: 5,
};

export default PollCommand;
