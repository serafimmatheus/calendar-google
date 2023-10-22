import { getGoogleOAuthToken } from "@/lib/google";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { google } from "googleapis";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const schemaQuery = z.object({
      username: z.string(),
    });

    const { username } = schemaQuery.parse(req.query);

    const userAlreadyExists = await prisma.user.findUnique({
      where: { username },
    });

    if (!userAlreadyExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const schemaBody = z.object({
      name: z.string().min(3, { message: "Mínimo 3 caracteres" }),
      email: z.string().email({ message: "E-mail inválido" }),
      observation: z.string().optional(),
      date: z.string().datetime(),
    });

    const { name, email, observation, date } = schemaBody.parse(req.body);

    const schedulingDate = dayjs(date).startOf("hour");

    if (schedulingDate.isBefore(dayjs().startOf("hour"))) {
      return res.status(400).json({ message: "Data inválida" });
    }

    const conflictingScheluding = await prisma.scheduling.findFirst({
      where: {
        userId: userAlreadyExists.id,
        date: schedulingDate.toDate(),
      },
    });

    if (conflictingScheluding) {
      return res.status(400).json({ message: "Data já reservada" });
    }

    const scheduling = await prisma.scheduling.create({
      data: {
        date: schedulingDate.toDate(),
        name,
        email,
        observation,
        userId: userAlreadyExists.id,
      },
    });

    const calendar = google.calendar({
      version: "v3",
      auth: await getGoogleOAuthToken(userAlreadyExists.id),
    });

    await calendar.events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1,
      requestBody: {
        summary: `Ignite Call: ${name}`,
        description: observation,
        start: {
          dateTime: schedulingDate.format(),
          timeZone: "America/Sao_Paulo",
        },
        end: {
          dateTime: schedulingDate.add(1, "hour").format(),
          timeZone: "America/Sao_Paulo",
        },

        attendees: [
          {
            email,
            displayName: name,
          },
        ],

        conferenceData: {
          createRequest: {
            requestId: scheduling.id,
            conferenceSolutionKey: {
              type: "hangoutsMeet",
            },
          },
        },
      },
    });

    return res.status(201).end();
  }

  return res.status(405).json({ message: "Method not allowed" });
}
