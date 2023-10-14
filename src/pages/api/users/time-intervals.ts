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
    intervals: z.array(
      z.object({
        weekDay: z.number(),
        startTimeInMinutes: z.number(),
        endTimeInMinutes: z.number(),
      })
    ),
  });

  if (req.method !== "POST") {
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

  const { intervals } = schema.parse(req.body);

  await prisma.userTimeInterval.createMany({
    data: intervals.map((interval) => ({
      week_day: interval.weekDay,
      timeStartInMinutes: interval.startTimeInMinutes,
      timeEndInMinutes: interval.endTimeInMinutes,
      userId: session.user.id,
    })),
    skipDuplicates: true,
  });

  return res.status(201).end();
}
