function generateTimeSlots(
  schedule: any,
  currentDay: string,
  slotDuration: number,
  timeBetweenSlots: number,
  skipUnavailableDays: boolean,
): string[] {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Reset time to midnight
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const currentDayIndex = daysOfWeek.indexOf(currentDay);
  const availableDays = schedule.availabilityWeekDays.map((day) => day.day);
  const unavailabilityDates = schedule.unavailability.map(
    (unavail) => unavail.workingDate,
  );

  const timeSlots: string[] = [];

  for (let i = currentDayIndex; i < daysOfWeek.length + currentDayIndex; i++) {
    const dayIndex = i % daysOfWeek.length;
    const day = daysOfWeek[dayIndex];

    if (skipUnavailableDays && !availableDays.includes(day)) {
      // Skip unavailable days
      continue;
    }

    if (unavailabilityDates.includes(formatDate(currentDate))) {
      // Skip unavailability dates
      continue;
    }

    const availability = schedule.availabilityWeekDays.find(
      (item) => item.day === day,
    );
    if (!availability) {
      continue;
    }

    availability.availabilityDayTime.forEach((slot) => {
      const startTime = new Date(
        `${formatDate(currentDate)}T${slot.startTime}`,
      );
      const endTime = new Date(`${formatDate(currentDate)}T${slot.endTime}`);

      while (startTime < endTime) {
        const slotEnd = new Date(startTime.getTime() + slotDuration * 60000); // Convert minutes to milliseconds
        timeSlots.push(`${formatTime(startTime)} - ${formatTime(slotEnd)}`);
        startTime.setMinutes(
          startTime.getMinutes() + slotDuration + timeBetweenSlots,
        );
      }
    });
  }

  return timeSlots;
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
