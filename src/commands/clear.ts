import {
  Colors,
  EmbedBuilder,
  Message,
  PermissionsBitField,
  TextChannel,
} from "discord.js";
import { CommandOptions, command } from "../utils/commands";

const options: CommandOptions = {
  cooldown: 10,
};

export default command(
  "clear",
  async ({ message }, ...args) => {
    if (
      !message.guild?.members.me?.permissions.has(
        PermissionsBitField.Flags.ManageMessages
      )
    ) {
      return message.reply(
        "I don't have the required permissions to clear messages."
      );
    }

    if (
      !message.member?.permissions.has(PermissionsBitField.Flags.ManageMessages)
    ) {
      return message.reply(
        "You don't have the required permissions to clear messages."
      );
    }

    if (!args[0]) {
      return message.reply(
        "Please specify the amount of messages you want to clear."
      );
    }

    const channel = message.channel as TextChannel;

    const amount = parseInt(args[0]);
    if (isNaN(amount)) {
      return message.reply("Amount must be a number");
    }

    if (amount > 100) {
      return message.reply(
        "Sorry, but Discord restricts clearing more than 100 messages at once. Please try a smaller number."
      );
    }

    const messages = await channel.messages.fetch({
      limit: amount === 100 ? amount : amount + 1,
    });

    const res = new EmbedBuilder().setColor(Colors.Orange);

    const targetMember = message.mentions.members?.first();
    if (targetMember) {
      let i = 0;
      const filtered: Message<boolean>[] = [];

      messages.filter((msg) => {
        if (msg.author.id === targetMember.id && amount > i) {
          filtered.push(msg);
          i++;
        }
      });

      await channel.bulkDelete(filtered).then((messages) => {
        res.setDescription(
          `Successfully deleted ${messages.size} messages from ${targetMember.displayName}`
        );
        return message.reply({ embeds: [res] });
      });
    } else {
      await channel.bulkDelete(amount, true).then((messages) => {
        res.setDescription(`Successfully deleted ${messages.size} messages`);
        return message.reply({ embeds: [res] });
      });
    }

    return;
  },
  options
);
