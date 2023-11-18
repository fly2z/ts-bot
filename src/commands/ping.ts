import { CommandOptions, command } from "../utils/commands";

const options: CommandOptions = {
  aliases: ["test"],
  cooldown: 3,
};

export default command(
  "ping",
  ({ message }) => {
    return message.reply("pong");
  },
  options
);
