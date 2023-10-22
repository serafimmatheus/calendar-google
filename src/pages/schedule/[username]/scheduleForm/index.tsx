// import { Calendar } from "@/components/calendar";
import { useState } from "react";
import CalendarStep from "./calendarStep";
import ConfirmStep from "./confirmStep";

export default function ScheduleForm() {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>();

  function handleClearSelectedDateTime() {
    setSelectedDateTime(null);
  }

  if (selectedDateTime) {
    return (
      <ConfirmStep
        schedulingDate={selectedDateTime}
        handleClearSelectedDateTime={handleClearSelectedDateTime}
      />
    );
  }

  return <CalendarStep onSelectDateTime={setSelectedDateTime} />;
}
