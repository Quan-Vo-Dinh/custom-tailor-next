"use client";

import { useState } from "react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/Calendar";
import { TimeSlotPicker } from "@/components/TimeSlotPicker";
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  FileText,
  CheckCircle,
} from "lucide-react";
import { AppointmentType, TimeSlot } from "@/types";

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [appointmentType, setAppointmentType] = useState<AppointmentType>(
    AppointmentType.CONSULTATION
  );
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!selectedDate || !selectedSlot) {
      alert("Vui lòng chọn ngày và khung giờ");
      return;
    }

    try {
      setSubmitting(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock success
      console.log("Booking created:", {
        type: appointmentType,
        date: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        notes: notes || undefined,
      });

      setSuccess(true);
      setTimeout(() => {
        setSelectedDate(null);
        setSelectedSlot(null);
        setNotes("");
        setSuccess(false);
      }, 3000);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Có lỗi xảy ra khi đặt lịch"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (success) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <AnimatedSection className="text-center">
          <div className="glass-luxury p-12 rounded-2xl max-w-md mx-auto">
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
            <h2 className="text-3xl font-light mb-4">Đặt Lịch Thành Công!</h2>
            <p className="text-gray-600 mb-6">
              Chúng tôi đã gửi email xác nhận đến địa chỉ của bạn. Vui lòng kiểm
              tra hộp thư.
            </p>
            <Button variant="luxury" onClick={() => setSuccess(false)}>
              Đặt Lịch Khác
            </Button>
          </div>
        </AnimatedSection>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 lg:px-12">
        <AnimatedSection className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light mb-6">
            Đặt Lịch Tư Vấn
            <br />
            <span className="text-luxury italic">& Đo Đạc</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-light">
            Chọn ngày và khung giờ phù hợp. Chúng tôi sẽ tư vấn và đo đạc để tạo
            ra trang phục hoàn hảo cho bạn.
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <AnimatedSection delay={0.1}>
              <Calendar
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
            </AnimatedSection>

            {selectedDate && (
              <AnimatedSection delay={0.2}>
                <TimeSlotPicker
                  date={selectedDate}
                  selectedSlot={selectedSlot}
                  onSelect={setSelectedSlot}
                />
              </AnimatedSection>
            )}
          </div>

          <div className="space-y-6">
            <AnimatedSection delay={0.3}>
              <GlassCard variant="luxury" className="sticky top-32">
                <h3 className="text-xl font-light mb-6">Thông Tin Buổi Hẹn</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <CalendarDays className="w-5 h-5 text-yellow-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Ngày</p>
                      <p className="font-medium">
                        {selectedDate ? formatDate(selectedDate) : "Chưa chọn"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-yellow-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Khung giờ</p>
                      <p className="font-medium">
                        {selectedSlot
                          ? `${selectedSlot.startTime} - ${selectedSlot.endTime}`
                          : "Chưa chọn"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-yellow-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Địa điểm</p>
                      <p className="font-medium">Custom Tailor Showroom</p>
                      <p className="text-sm text-gray-500">
                        123 Nguyễn Huệ, Q1, TP.HCM
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6 space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                      <User className="w-4 h-4" />
                      Loại lịch hẹn
                    </label>
                    <select
                      value={appointmentType}
                      onChange={(e) =>
                        setAppointmentType(e.target.value as AppointmentType)
                      }
                      className="w-full px-4 py-3 bg-white/10 text-white border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors"
                    >
                      <option value={AppointmentType.CONSULTATION}>
                        Tư vấn
                      </option>
                      <option value={AppointmentType.FITTING}>Thử đồ</option>
                      <option value={AppointmentType.PICKUP}>Nhận hàng</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                      <FileText className="w-4 h-4" />
                      Ghi chú (tùy chọn)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                      placeholder="Thêm ghi chú về yêu cầu đặc biệt của bạn..."
                      className="w-full px-4 py-3 bg-white/10 text-white placeholder-gray-500 border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors resize-none"
                    />
                  </div>

                  <Button
                    variant="luxury"
                    size="lg"
                    className="w-full"
                    onClick={handleSubmit}
                    disabled={!selectedDate || !selectedSlot || submitting}
                  >
                    {submitting ? "Đang xử lý..." : "Xác Nhận Đặt Lịch"}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    Bằng cách đặt lịch, bạn đồng ý với điều khoản dịch vụ của
                    chúng tôi.
                  </p>
                </div>
              </GlassCard>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
}
