import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const { username } = req.query;
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: "Missing date" });
  }

  const userAlreadyExists = await prisma.user.findUnique({
    where: { username: username as string },
  });

  if (!userAlreadyExists) {
    return res.status(404).json({ message: "User not found" });
  }

  const referenceDate = dayjs(String(date));
  const isPastDate = referenceDate.endOf("day").isBefore(dayjs());

  if (isPastDate) {
    return res.status(200).json({ possibleTimes: [], availableTimes: [] });
  }

  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: {
      userId: userAlreadyExists.id,
      week_day: referenceDate.get("day"),
    },
  });

  if (!userAvailability) {
    return res.status(200).json({ possibleTimes: [], availableTimes: [] });
  }

  const { timeStartInMinutes, timeEndInMinutes } = userAvailability;

  const startHour = timeStartInMinutes / 60;
  const endHour = timeEndInMinutes / 60;

  const possibleTimes = Array.from({ length: endHour - startHour }).map(
    (_, index) => {
      return index + startHour;
    }
  );

  const blockedTimes = await prisma.scheduling.findMany({
    select: {
      date: true,
    },

    where: {
      userId: userAlreadyExists.id,
      date: {
        gte: referenceDate.set("hour", startHour).toDate(),
        lte: referenceDate.set("hour", endHour).toDate(),
      },
    },
  });

  const availableTimes = possibleTimes.filter((time) => {
    return !blockedTimes.some(
      (blockedTime) => blockedTime.date.getHours() === time
    );
  });

  return res.status(200).json({ possibleTimes, availableTimes });
}
