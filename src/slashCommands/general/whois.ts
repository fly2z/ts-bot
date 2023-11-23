import { Colors, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../utils/commands";

const WhoIs: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("whois")
    .setDescription("Get user information")
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription("User to get information for")
        .setRequired(false)
    ),
  execute: async (interaction) => {
    if (!interaction.guild) return;

    const user = interaction.options.getUser("member") || interaction.user;

    const member = await interaction.guild.members.fetch(user.id);
    if (!member) return;

    const icon = user.displayAvatarURL();
    const tag = user.tag;
    const roles = member.roles.cache.map((r) => r);

    const perms: any = {
      Administrator: "Administrator",
      ManageGuild: "Manage Server",
      ManageRoles: "Manage Roles",
      ManageChannels: "Manage Channels",
      ManageMessages: "Manage Messages",
      ManageWebhooks: "Manage Webhooks",
      ManageNicknames: "Manage Nicknames",
      KickMembers: "Kick Members",
      BanMembers: "Ban Members",
      MentionEveryone: "Mention Everyone",
      ModerateMembers: "Timeout Members",
      ManageEmojisAndStickers: "Manage Emojis and Stickers",
    };

    const memberPermissions = member.permissions.toArray();
    const infoPerms = [];
    for (const permission of memberPermissions) {
      if (permission in perms) {
        infoPerms.push(perms[permission]);
      }
    }

    const owner = await interaction.guild.fetchOwner();
    const isOwner = owner.id === user.id;

    const embed = new EmbedBuilder()
      .setColor(Colors.DarkBlue)
      .setAuthor({
        name: tag,
        iconURL: icon,
      })
      .setThumbnail(member.user.avatarURL({ size: 256 }))
      .setDescription(`${user}`)
      .addFields({
        name: "Joined",
        value: member.joinedAt ? `${member.joinedAt?.toDateString()}` : "",
        inline: true,
      })
      .addFields({
        name: "Registered",
        value: user.createdAt ? `${user.createdAt.toDateString()}` : "",
        inline: true,
      })
      .addFields({
        name: `Roles [${roles.length}]`,
        value: `${roles.join(" ")}`,
        inline: false,
      })
      .addFields({
        name: `Permissions`,
        value: `${infoPerms.join(", ")}`,
        inline: false,
      })
      .setFooter({
        text: `ID: ${user.id}`,
      })
      .setTimestamp();

    if (isOwner) embed.addFields({ name: "Extra", value: "Server Owner" });

    await interaction.reply({ embeds: [embed] });
  },
  cooldown: 3,
};

export default WhoIs;
