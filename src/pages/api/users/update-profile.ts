import { NextApiRequest, NextApiResponse } from "next";
import { buildNextAuthOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const schema = z.object({
    bio: z.string().optional(),
  });

  const { bio } = schema.parse(req.body);

  if (req.method !== "PUT") {
    return res.status(405).end();
  }

  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res)
  );

  if (!session) {
    return res.status(401).end();
  }

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      bio,
    },
  });

  return res.status(204).end();
}
