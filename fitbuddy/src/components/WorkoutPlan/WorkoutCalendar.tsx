'use client';

import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CustomCalendar.css';

interface Props {
  plans: any[];
}

export default function WorkoutCalendar({ plans }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const isPlannedDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return plans.some(
      (plan) =>
        dateStr >= plan.startDate.slice(0, 10) &&
        dateStr <= plan.endDate.slice(0, 10)
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="overflow-hidden pt-5">
      <Calendar
        onChange={(value) => setSelectedDate(value as Date)}
        value={selectedDate}
        tileClassName={({ date }) => {
          const classes = [];

          if (isPlannedDate(date)) {
            classes.push('planned-date');
          }

          if (isToday(date)) {
            classes.push('today-highlight');
          }

          if (
            selectedDate &&
            date.toDateString() === selectedDate.toDateString()
          ) {
            classes.push('selected-date');
          }

          return classes.join(' ');
        }}
        className="REACT-CALENDAR p-4"
        calendarType="gregory"
        locale="en-US"
      />
    </div>
  );
}
