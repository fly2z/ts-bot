import { Collection } from "discord.js";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TOKEN: string;
      PREFIX: string;
    }
  }
}

declare module "discord.js" {
  export interface Client {
    cooldowns: Collection<string, number>;
  }
}
