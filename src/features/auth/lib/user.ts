import type { Prisma } from "@prisma/client";
import { prisma } from "@/shared/lib/prisma";

export const publicUserSelect = {
  id: true,
  email: true,
  username: true,
  firstName: true,
  lastName: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

export type PublicUser = Prisma.UserGetPayload<{
  select: typeof publicUserSelect;
}>;

export async function findUserByEmailOrUsername(identifier: string) {
  return prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { username: identifier }],
    },
  });
}

export async function usernameExists(username: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });
  return user !== null;
}

export async function emailExists(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  return user !== null;
}
