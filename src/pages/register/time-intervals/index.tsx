import { MultStap } from "@/components/multStep";
import { api } from "@/lib/axios";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { LuArrowRight } from "react-icons/lu";
import { BsCheckSquare } from "react-icons/bs";
import { parseCookies } from "nookies";
import { useFieldArray, useForm } from "react-hook-form";
import { getWeekDays } from "@/utils/get-week-days";
import { z } from "zod";
import { type } from "os";
import { zodResolver } from "@hookform/resolvers/zod";
import { convertTimeStringToMinutes } from "@/utils/convert-time-string-to-minutes";

const schemaTimeIntervarls = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number(),
        enabled: z.boolean(),
        start: z.string(),
        end: z.string(),
      })
    )
    .length(7)
    .transform((intervals) => intervals.filter((interval) => interval.enabled))
    .refine((intervals) => intervals.length > 0, {
      message: "Selecione pelo menos um dia da semana",
    })
    .transform((intervals) => {
      return intervals.map((interval) => {
        return {
          weekDay: interval.weekDay,
          startTimeInMinutes: convertTimeStringToMinutes(interval.start),
          endTimeInMinutes: convertTimeStringToMinutes(interval.end),
        };
      });
    })
    .refine(
      (intervals) => {
        return intervals.every(
          (interval) =>
            interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes
        );
      },
      {
        message: "O intervalo de horário deve ser de no mínimo 1 hora",
      }
    ),
});

type TimeIntervalsDataInput = z.input<typeof schemaTimeIntervarls>;
type TimeIntervalsDataOutput = z.output<typeof schemaTimeIntervarls>;

export default function TimeIntervals() {
  const cookies = parseCookies();
  const router = useRouter();
  const session = useSession();
  const hasAuthError = !!router.query.error;

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TimeIntervalsDataInput>({
    resolver: zodResolver(schemaTimeIntervarls),
    defaultValues: {
      intervals: [
        { weekDay: 0, enabled: false, start: "09:00", end: "18:00" },
        { weekDay: 1, enabled: true, start: "09:00", end: "18:00" },
        { weekDay: 2, enabled: true, start: "09:00", end: "18:00" },
        { weekDay: 3, enabled: true, start: "09:00", end: "18:00" },
        { weekDay: 4, enabled: true, start: "09:00", end: "18:00" },
        { weekDay: 5, enabled: true, start: "09:00", end: "18:00" },
        { weekDay: 6, enabled: false, start: "09:00", end: "18:00" },
      ],
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "intervals",
  });

  const weekDays = getWeekDays();

  const intervals = watch("intervals");

  async function handleSetTImeIntervals(data: any) {
    const formData = data as TimeIntervalsDataOutput;
    await api.post("/users/time-intervals", formData).then(() => {
      router.push("/register/update-profile");
    });
  }

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/");
    }
  }, [session.status]);

  return (
    <div className="max-w-xl mx-auto px-2 flex flex-col justify-center h-screen">
      <header className="px-2">
        <h2 className="text-4xl text-gray-300 font-roboto font-bold mb-4">
          Quase lá
        </h2>

        <p className="font-roboto text-sm text-gray-400 mb-6">
          Defina o intervalo de horários que você está disponível em cada dia da
          semana.
        </p>
      </header>

      <MultStap size={4} currentStep={3} />

      <form
        onSubmit={handleSubmit(handleSetTImeIntervals)}
        className="bg-gray-900 p-4 rounded-lg flex flex-col gap-5"
      >
        {fields.map((field, index) => {
          return (
            <div key={field.id} className="segunda">
              <div className="flex items-center justify-between py-4 rounded-md px-6 border border-gray-600">
                <label className="flex gap-2">
                  <input
                    className="w-6 h-6 text-green-400 border rounded focus:ring-2 focus:ring-green-400"
                    type="checkbox"
                    {...register(`intervals.${index}.enabled`)}
                  />
                  <p>{weekDays[field.weekDay]}</p>
                </label>

                <div className="flex gap-4">
                  <input
                    {...register(`intervals.${index}.start`)}
                    type="time"
                    className={`bg-gray-950 w-32 h-10 px-4 ${
                      intervals[index].enabled === false
                        ? "placeholder:text-gray-600"
                        : ""
                    }}`}
                    disabled={intervals[index].enabled === false}
                  />
                  <input
                    {...register(`intervals.${index}.end`)}
                    type="time"
                    className="bg-gray-950 w-32 h-10 px-4"
                    disabled={intervals[index].enabled === false}
                  />
                </div>
              </div>
            </div>
          );
        })}

        {errors.intervals?.message && (
          <p className="flex text-red-400 text-sm">
            {errors.intervals.message}
          </p>
        )}

        <button
          className={`flex items-center justify-center h-10 rounded-lg gap-4 text-base transition-colors ${
            session.status === "authenticated"
              ? "border border-green-600 hover:bg-green-400 text-white bg-green-600"
              : "bg-gray-600 hover:bg-gray-500"
          }`}
          type="submit"
          disabled={isSubmitting}
        >
          "Próximo passo
          <LuArrowRight />
        </button>
      </form>
    </div>
  );
}
