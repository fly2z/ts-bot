import {
  Guild,
  GuildMember,
  PermissionFlagsBits,
  PermissionResolvable,
} from "discord.js";
import { db } from "./lib/db";

import type { Guild as GuildModel } from "@prisma/client";

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
