import { getWeekDays } from "@/utils/get-week-days";
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";

export function Calendar() {
  const weekDays = getWeekDays({ short: true });

  async function handleDays(number: number) {
    alert(`dia clicado ${number}`);
  }
  return (
    <div className="container bg-gray-900 rounded-md p-3">
      <header className="header flex justify-between my-5">
        <h1 className="calendar-tile">
          Novembro <span>2023</span>
        </h1>
        <div className="calendar-actions flex gap-4">
          <SlArrowLeft />
          <SlArrowRight />
        </div>
      </header>

      <table className="calendar-body flex flex-col justify-between">
        <thead className="flex w-full">
          <tr className="flex w-full justify-between gap-5">
            {weekDays.map((weekDay) => (
              <th
                className="w-full flex justify-center items-center"
                key={weekDay}
              >
                {weekDay}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="flex flex-col">
          <tr className="flex  gap-8">
            {Array.from({ length: 7 }).map((_, index) => (
              <td className="w-full" key={index}>
                <button
                  className="flex disabled:bg-gray-800 disabled:text-gray-600 w-full aspect-square cursor-pointer bg-gray-600 rounded-md justify-center items-center"
                  onClick={() => handleDays(index + 1)}
                >
                  {index + 1}
                </button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
