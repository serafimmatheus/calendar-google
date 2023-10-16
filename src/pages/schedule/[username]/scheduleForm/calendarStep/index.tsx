import { Calendar } from "@/components/calendar";

export function CalendarStep() {
  const isDateSelected = true;
  return (
    <div className="mx-auto mt-6 p-0 flex relative max-w-full w-full">
      <Calendar />

      {isDateSelected && (
        <div className="max-w-xs absolute top-0 bottom-0 -right-60 p-5 bg-gray-900 overflow-y-scroll">
          <h4 className="text-gray-400 mb-5">
            Terça-feira <>20 de setembro</>
          </h4>

          <div className="flex flex-col gap-5">
            <button className="bg-gray-800 p-4 rounded-md text-gray-300">
              08:00h
            </button>
            <button className="bg-gray-800 p-4 rounded-md text-gray-300">
              09:00h
            </button>
            <button className="bg-gray-800 p-4 rounded-md text-gray-300">
              10:00h
            </button>
            <button className="bg-gray-800 p-4 rounded-md text-gray-300">
              11:00h
            </button>
            <button className="bg-gray-800 p-4 rounded-md text-gray-300">
              12:00h
            </button>
            <button className="bg-gray-800 p-4 rounded-md text-gray-300">
              13:00h
            </button>
            <button className="bg-gray-800 p-4 rounded-md text-gray-300">
              14:00h
            </button>
            <button className="bg-gray-800 p-4 rounded-md text-gray-300">
              15:00h
            </button>
            <button className="bg-gray-800 p-4 rounded-md text-gray-300">
              16:00h
            </button>
            <button className="bg-gray-800 p-4 rounded-md text-gray-300">
              17:00h
            </button>
            <button className="bg-gray-800 p-4 rounded-md text-gray-300">
              18:00h
            </button>
            <button className="bg-gray-800 p-4 rounded-md text-gray-300">
              19:00h
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
