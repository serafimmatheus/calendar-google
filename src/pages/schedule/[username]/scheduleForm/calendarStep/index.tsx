import { Calendar } from "@/components/calendar";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useState } from "react";

interface IPropsPossibleTimes {
  availableTimes: number[];
  possibleTimes: number[];
}

interface CalendarStepProps {
  onSelectDateTime: (date: Date) => void;
}

export default function CalendarStep({ onSelectDateTime }: CalendarStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const router = useRouter();
  const { username } = router.query;

  const isDateSelected = !!selectedDate;

  const weekDay = selectedDate ? dayjs(selectedDate).format("dddd") : null;
  const describeDate = selectedDate
    ? dayjs(selectedDate).format("DD[ de ]MMMM")
    : null;

  const selectedDateWithoutTime = selectedDate
    ? dayjs(selectedDate).format("YYYY-MM-DD")
    : null;

  const { data: availability, isLoading } = useQuery<IPropsPossibleTimes>({
    queryKey: ["availability", selectedDateWithoutTime],
    queryFn: async () => {
      const { data } = await api.get(
        `/users/${username}/availability?date=${selectedDateWithoutTime}`
      );

      return data;
    },
    enabled: !!selectedDate,
  });

  function handleSelectDateTime(time: number) {
    const dateWithTIme = dayjs(selectedDate).set("hour", time).startOf("hour");

    onSelectDateTime(dateWithTIme.toDate());
  }

  return (
    <div className="mx-auto mt-6 p-0 flex relative w-full">
      <Calendar selecedDate={selectedDate} onDateSelected={setSelectedDate} />

      {isDateSelected && (
        <div className="w-80 absolute top-0 bottom-0 left-full p-5 bg-gray-900 overflow-y-scroll">
          <h4 className="text-gray-400 mb-5 capitalize">
            {weekDay} <span>{describeDate}</span>
          </h4>

          {isLoading ? (
            <div className="flex flex-col gap-5">
              {Array.from({ length: 7 }).map((_, i) => {
                return (
                  <div
                    key={i}
                    className="bg-gray-800 p-4 h-14 animate-pulse rounded-md text-gray-300 disabled:bg-gray-600 disabled:text-gray-400"
                  ></div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {availability?.possibleTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => handleSelectDateTime(time)}
                  disabled={!availability.availableTimes.includes(time)}
                  className="bg-gray-800 p-4 rounded-md text-gray-300 disabled:bg-gray-600 disabled:text-gray-400"
                >
                  {String(time).padStart(2, "0")}:00h
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
