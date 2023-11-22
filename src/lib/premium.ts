import { User } from "@prisma/client";
import { db } from "./db";

// Function to create a new license key
export async function createLicenseKey(
  key: string,
  expiresAt: Date | null
): Promise<boolean> {
  try {
    await db.licenseKey.create({
      data: {
        key,
        expiresAt,
      },
    });
    return true; // Key creation successful
  } catch (error) {
    console.error("Error creating license key:", error);
    return false; // Error in key creation
  }
}

type ActivationResult =
  | "SUCCESS"
  | "INVALID_KEY"
  | "EXPIRED_OR_LIMIT_EXCEEDED"
  | "USER_NOT_FOUND";

// Function to activate premium status based on a given license key
export async function activatePremium(
  userId: string,
  licenseKey: string
): Promise<ActivationResult> {
  const user = await db.user.findUnique({
    where: { id: userId },
  });

  const key = await db.licenseKey.findUnique({
    where: { key: licenseKey },
  });

  if (!user) {
    return "USER_NOT_FOUND"; // User not found
  }

  if (!key) {
    return "INVALID_KEY"; // Invalid license key
  }

  if (key.remainingUses <= 0 || (key.expiresAt && new Date() > key.expiresAt)) {
    return "EXPIRED_OR_LIMIT_EXCEEDED"; // Expired key
  }

  await db.user.update({
    where: { id: userId },
    data: {
      premium: true,
      licenseKey: licenseKey,
    },
  });

  await db.licenseKey.update({
    where: { id: key.id },
    data: {
      remainingUses: {
        decrement: 1,
      },
    },
  });

  return "SUCCESS"; // Activation successful
}

export async function getUserOrCreate(userId: string): Promise<User> {
  let user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    user = await db.user.create({
      data: {
        id: userId,
      },
    });
  }

  return user;
}
