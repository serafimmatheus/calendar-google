import { api } from "@/lib/axios";
import { getWeekDays } from "@/utils/get-week-days";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";
import { useQuery } from "@tanstack/react-query";

interface CalendarProps {
  week: number;
  days: Array<{
    date: dayjs.Dayjs;
    disable: boolean | undefined;
  }>;
}

type CalendarWeeks = CalendarProps[];

interface CalendarIProps {
  selecedDate: Date | null;
  onDateSelected?: (date: Date) => void;
}

interface BlockedDates {
  blockWeekDays: number[];
}

export function Calendar({ selecedDate, onDateSelected }: CalendarIProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().set("date", 1);
  });

  const router = useRouter();
  const { username } = router.query;

  const weekDays = getWeekDays({ short: true });

  const currentMonth = currentDate.format("MMMM");
  const currentYear = currentDate.format("YYYY");

  function handleNextMonth() {
    setCurrentDate((state) => state.add(1, "month"));
  }

  function handlePreviousMonth() {
    setCurrentDate((state) => state.subtract(1, "month"));
  }

  const { data: blokedDates } = useQuery<BlockedDates>({
    queryKey: [
      "blockedDates",
      currentDate.get("month"),
      currentDate.get("year"),
    ],
    queryFn: async () => {
      const res = await api.get(
        `/users/${username}/blocked-dates?month=${currentDate.get(
          "month"
        )}&year=${currentDate.get("year")}")}`
      );

      return res.data;
    },
  });

  const calendarWeeks = useMemo(() => {
    if (!blokedDates) return [];

    const daysInMonthArray = Array.from({
      length: currentDate.daysInMonth(),
    }).map((_, i) => {
      return currentDate.set("date", i + 1);
    });

    const firstWeekDay = currentDate.get("day");

    const previusMonthFillArray = Array.from({
      length: firstWeekDay,
    })
      .map((_, i) => {
        return currentDate.subtract(i + 1, "day");
      })
      .reverse();

    const lastDayInCurrentMonth = currentDate.set(
      "date",
      currentDate.daysInMonth()
    );
    const lastWeekDay = lastDayInCurrentMonth.get("day");

    const nextMonthFillArray = Array.from({
      length: 7 - (lastWeekDay + 1),
    }).map((_, i) => {
      return lastDayInCurrentMonth.add(i + 1, "day");
    });

    const calendarDays = [
      ...previusMonthFillArray.map((date) => {
        return { date, disable: true };
      }),
      ...daysInMonthArray.map((date) => {
        return {
          date,
          disable:
            date.endOf("day").isBefore(dayjs()) ||
            blokedDates.blockWeekDays.includes(date.get("day")),
        };
      }),
      ...nextMonthFillArray.map((date) => {
        return { date, disable: true };
      }),
    ];

    const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
      (weeks, _, i, original) => {
        const isNewWeek = i % 7 === 0;

        if (isNewWeek) {
          weeks.push({
            week: i / 7 + 1,
            days: original.slice(i, i + 7),
          });
        }

        return weeks;
      },
      []
    );

    return calendarWeeks;
  }, [currentDate, blokedDates]);

  return (
    <div className="container bg-gray-900 h-[601px] relative rounded-md p-3">
      <header className="header flex justify-between my-5">
        <h1 className="calendar-tile capitalize">
          {currentMonth} <span className="ml-3">{currentYear}</span>
        </h1>
        <div className="calendar-actions flex gap-4">
          <button onClick={handlePreviousMonth} title="calendario anterior">
            <SlArrowLeft />
          </button>

          <button onClick={handleNextMonth} title="proximo calendario">
            <SlArrowRight />
          </button>
        </div>
      </header>

      <table className="calendar-body flex flex-col justify-between">
        <thead className="">
          <tr className="flex">
            {weekDays.map((weekDay) => (
              <th className="w-1/6" key={weekDay}>
                {weekDay}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="">
          {calendarWeeks.map(({ week, days }) => {
            return (
              <tr key={week} className="flex gap-4">
                {days.map(({ date, disable }) => {
                  return (
                    <td
                      className="flex w-full aspect-square items-center justify-center"
                      key={date.toString()}
                    >
                      <button
                        disabled={disable}
                        className="py-5 w-full disabled:bg-gray-800 disabled:text-gray-600 cursor-pointer bg-gray-600 rounded-md"
                        onClick={() => onDateSelected?.(date.toDate())}
                      >
                        {date.get("date")}
                      </button>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
