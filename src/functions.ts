import {
  Guild,
  GuildMember,
  PermissionFlagsBits,
  PermissionResolvable,
} from "discord.js";
import { db } from "./lib/db";

import type { Guild as GuildModel } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const checkPermissions = (
  member: GuildMember,
  permissions: Array<PermissionResolvable>
) => {
  let neededPermissions: PermissionResolvable[] = [];
  permissions.forEach((permission) => {
    if (!member.permissions.has(permission)) neededPermissions.push(permission);
  });
  if (neededPermissions.length === 0) return null;
  return neededPermissions.map((p) => {
    if (typeof p === "string") return p.split(/(?=[A-Z])/).join(" ");
    else
      return Object.keys(PermissionFlagsBits)
        .find((k) => Object(PermissionFlagsBits)[k] === p)
        ?.split(/(?=[A-Z])/)
        .join(" ");
  });
};

/**
 * Retrieves a specific option of a guild from the database.
 * @param guild The guild for which the option is being retrieved.
 * @param option The specific option key to retrieve from the GuildModel.
 * @returns A Promise resolving to the value of the specified guild option or null if the guild is not found.
 */
export const getGuildOption = async <T extends keyof GuildModel>(
  guild: Guild,
  option: T
): Promise<GuildModel[T] | null> => {
  const foundGuild = await db.guild.findUnique({
    where: {
      id: guild.id,
    },
  });

  if (!foundGuild) {
    return null;
  }

  return foundGuild[option];
};


type GuildOptionValue<T extends keyof GuildModel> = GuildModel[T];

/**
 * Sets a specific option of a guild in the database.
 * @param guild The guild for which the option is being set.
 * @param option The specific option key to set in the GuildModel.
 * @param value The value to set for the specified guild option.
 * @throws Throws an error if the database update fails.
 */
export const setGuildOption = async <T extends keyof GuildModel>(
  guild: Guild,
  option: T,
  value: GuildOptionValue<T>
): Promise<void> => {
  try {
    await db.guild.update({
      where: {
        id: guild.id,
      },
      data: {
        [option]: value,
      },
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      throw new Error(`Failed to set guild option '${option}': ${error.message}`);
    } else {
      throw new Error(`Failed to set guild option '${option}': Unknown error`);
    }
  }
};
