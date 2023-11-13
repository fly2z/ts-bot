import { CommandOptions, command } from "../utils/commands";

const options: CommandOptions = {
  aliases: ["test"],
};

export default command(
  "ping",
  async ({ message }, args) => {
    console.log(args);
    return message.reply("pong");
  },
  options
);
