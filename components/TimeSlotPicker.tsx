"use client";

import { useEffect, useState } from "react";
import { LoadingSpinner } from "./ui/LoadingSpinner";
import { GlassCard } from "./ui/GlassCard";
import { Clock } from "lucide-react";
import { generateMockTimeSlots } from "@/lib/mockData";
import type { TimeSlot } from "@/types";

interface TimeSlotPickerProps {
  date: string;
  selectedSlot: TimeSlot | null;
  onSelect: (slot: TimeSlot) => void;
}

export const TimeSlotPicker = ({
  date,
  selectedSlot,
  onSelect,
}: TimeSlotPickerProps) => {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!date) return;

      try {
        setLoading(true);
        setError(null);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        const data = generateMockTimeSlots(date);
        setSlots(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Không thể tải lịch trống"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [date]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <GlassCard variant="luxury" className="p-12">
        <LoadingSpinner text="Đang tải khung giờ..." />
      </GlassCard>
    );
  }

  if (error) {
    return (
      <GlassCard variant="luxury" className="p-6">
        <p className="text-red-600 text-center">{error}</p>
      </GlassCard>
    );
  }

  const availableSlots = slots.filter((slot) => slot.available);
  const unavailableSlots = slots.filter((slot) => !slot.available);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-yellow-600" />
        <h3 className="text-xl font-light">
          Chọn Khung Giờ - {formatDate(date)}
        </h3>
      </div>

      {availableSlots.length === 0 ? (
        <GlassCard variant="luxury" className="p-12 text-center">
          <p className="text-gray-600">
            Không có khung giờ nào khả dụng trong ngày này. Vui lòng chọn ngày
            khác.
          </p>
        </GlassCard>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {availableSlots.map((slot) => {
              const isSelected = selectedSlot?.id === slot.id;

              return (
                <button
                  key={slot.id}
                  onClick={() => onSelect(slot)}
                  className={`p-4 rounded-lg border-2 transition-all font-medium ${
                    isSelected
                      ? "bg-yellow-600 border-yellow-600 text-white shadow-lg scale-105"
                      : "bg-white/10 text-white border border-white/20 hover:border-yellow-600 hover:shadow-md"
                  }`}
                >
                  <div className="text-lg">{slot.startTime}</div>
                  <div className="text-xs mt-1 opacity-75">
                    {slot.endTime ? `- ${slot.endTime}` : ""}
                  </div>
                </button>
              );
            })}
          </div>

          {unavailableSlots.length > 0 && (
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-3">Khung giờ đã đầy:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {unavailableSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="p-4 rounded-lg bg-white/10 text-white border border-white/20 cursor-not-allowed"
                  >
                    <div className="text-lg line-through">{slot.startTime}</div>
                    <div className="text-xs mt-1">Đã kín</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
