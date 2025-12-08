"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarProps {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  minDate?: Date;
}

export const Calendar = ({
  selectedDate,
  onSelectDate,
  minDate = new Date(),
}: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } =
    getDaysInMonth(currentMonth);

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const isDateDisabled = (day: number) => {
    const date = new Date(year, month, day);
    // Chuẩn hóa minDate về 0h00p00s để so sánh chính xác với ngày đầu tháng
    const today = new Date(
      minDate.getFullYear(),
      minDate.getMonth(),
      minDate.getDate()
    );
    return date < today;
  };

  const isDateSelected = (day: number) => {
    if (!selectedDate) return false;
    const date = new Date(year, month, day);
    const dateString = date.toISOString().split("T")[0];
    return dateString === selectedDate;
  };

  const handleDateClick = (day: number) => {
    if (isDateDisabled(day)) return;
    const date = new Date(year, month, day);
    const dateString = date.toISOString().split("T")[0];
    onSelectDate(dateString);
  };

  const monthNames = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const disabled = isDateDisabled(day);
    const selected = isDateSelected(day);

    days.push(
      <button
        key={day}
        onClick={() => handleDateClick(day)}
        disabled={disabled}
        // Thay đổi text-sm -> text-lg
        className={`aspect-square flex items-center justify-center rounded-lg text-lg font-medium transition-all ${
          disabled
            ? "text-gray-300 cursor-not-allowed"
            : selected
            ? "bg-yellow-600 text-white shadow-lg scale-105"
            : "hover:bg-yellow-50 text-gray-700"
        }`}
      >
        {day}
      </button>
    );
  }

  return (
    <div className="glass-luxury p-6 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {/* Tăng kích thước icon lên w-6 h-6 cho cân đối */}
          <ChevronLeft className="w-6 h-6" />
        </button>

        <h3 className="text-xl font-medium">
          {monthNames[month]} {year}
        </h3>

        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {/* Tăng kích thước icon lên w-6 h-6 cho cân đối */}
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map((name) => (
          <div
            key={name}
            // Thay đổi text-xs -> text-base
            className="text-center text-base font-medium text-gray-500 py-2"
          >
            {name}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2">{days}</div>
    </div>
  );
};
