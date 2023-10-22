import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).end();
  }

  const { username } = req.query;
  const { year, month } = req.query;

  if (!year && !month) {
    return res.status(400).json({ message: "Missing year and month" });
  }

  const userAlreadyExists = await prisma.user.findUnique({
    where: { username: username as string },
  });

  if (!userAlreadyExists) {
    return res.status(404).json({ message: "User not found" });
  }

  const availableWeekDays = await prisma.userTimeInterval.findMany({
    select: {
      week_day: true,
    },

    where: {
      userId: userAlreadyExists.id,
    },
  });

  const blockWeekDays = [0, 1, 2, 3, 4, 5, 6].filter((weekDay) => {
    return !availableWeekDays.some(
      (availableWeekDay) => availableWeekDay.week_day === weekDay
    );
  });

  //   const blockedDatesRow = await prisma.$queryRaw`
  //     SELECT *
  //     FROM schedulings S

  //     WHERE S."userId" = ${userAlreadyExists.id}
  //       AND DATE_TRUNC(S.date, "%Y-%m") = ${year}-${month};
  //  `;

  return res.status(200).json({ blockWeekDays });
}
