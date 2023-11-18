import {
  ChannelType,
  Colors,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { SlashCommand } from "../../utils/commands";

const CreateInvite: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("create-invite")
    .setDescription("Create an invite for your guild")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to create the invite in")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
    )
    .addIntegerOption((option) =>
      option
        .setName("maxage")
        .setDescription("The max age for your invite in seconds")
        .setRequired(false)
    )
    .addIntegerOption((option) =>
      option
        .setName("maxuses")
        .setDescription("The max number of users who can use this invite")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for creating this invite")
        .setRequired(false)
    ),
  execute: async (interaction) => {
    if (!interaction.member || !interaction.guild) return;

    if (
      !interaction.memberPermissions?.has(
        PermissionsBitField.Flags.CreateInstantInvite
      )
    ) {
      return await interaction.reply({
        content: "This server does not allow members to create invites!",
        ephemeral: true,
      });
    }

    const channel = (interaction.options.getChannel("channel") ||
      interaction.channel) as TextChannel;
    const maxAge = interaction.options.getInteger("maxage") || 0;
    const maxUses = interaction.options.getInteger("maxuses") || 0;
    const reason =
      interaction.options.getString("reason") || "No reason provided";

    const invite = await channel.createInvite({
      maxAge: maxAge,
      maxUses: maxUses,
      reason: reason,
    });

    const embed = new EmbedBuilder()
      .setColor(Colors.DarkOrange)
      .setTitle("🗃️ I have created your invite link!")
      .addFields({
        name: "🔗 Invite Link",
        value: `https://discord.gg/${invite.code} OR \`${invite.code}\``,
      })
      .addFields({ name: "📜 Invite Channel", value: `*${channel}*` })
      .addFields({
        name: "👤 Max Uses",
        value: `\`${maxUses === 0 ? "infinite" : maxUses}\``,
      })
      .addFields({
        name: "📅 Max Age",
        value: `\`${maxAge === 0 ? "infinite" : maxUses}\``,
      })
      .setDescription(`You created this invite for: *${reason}*`)
      .setTimestamp()
      .setFooter({ text: "Invite Generator" });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
  cooldown: 5,
};

export default CreateInvite;
