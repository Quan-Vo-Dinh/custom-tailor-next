"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { getAppointmentById, cancelAppointment } from "@/services/appointments";
import { AppointmentStatus, Appointment } from "@/types";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { CalendarDays, Clock, User, MapPin, FileText, XCircle } from "lucide-react";

const statusLabel: Record<AppointmentStatus, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  IN_PROGRESS: "Đang diễn ra",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Đã hủy",
  NO_SHOW: "Vắng mặt",
};

export default function AppointmentDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const load = async () => {
    if (!params?.id) return;
    try {
      setLoading(true);
      const data = await getAppointmentById(params.id);
      setAppointment(data);
    } catch (error: any) {
      toast.error(error.message || "Không tải được lịch hẹn");
      router.push("/appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  const handleCancel = async () => {
    if (!appointment) return;
    try {
      setCancelling(true);
      const updated = await cancelAppointment(appointment.id);
      setAppointment(updated);
      toast.success("Đã hủy lịch hẹn");
    } catch (error: any) {
      toast.error(error.message || "Hủy lịch hẹn thất bại");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Đang tải chi tiết lịch hẹn..." />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <GlassCard className="p-10 text-center">
          <p className="text-lg text-white mb-4">Không tìm thấy lịch hẹn</p>
          <Button variant="luxury" onClick={() => router.push("/appointments")}>
            Quay lại danh sách
          </Button>
        </GlassCard>
      </div>
    );
  }

  const start = appointment.date;
  const dateStr = start.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 lg:px-12">
        <AnimatedSection>
          <h1 className="text-3xl md:text-4xl font-light text-white mb-6">
            Chi tiết lịch hẹn
          </h1>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <GlassCard className="p-8 space-y-6">
            <div className="flex flex-wrap justify-between gap-4 items-start">
              <div>
                <p className="text-gray-400 text-sm">Mã lịch hẹn</p>
                <p className="text-xl text-white font-medium">{appointment.id}</p>
              </div>
              <div className="px-3 py-1 rounded-full bg-gray-800 text-sm text-white border border-gray-700">
                {statusLabel[appointment.status]}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3 text-white">
                <div className="flex items-center gap-3">
                  <CalendarDays className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="text-gray-400 text-sm">Ngày</p>
                    <p className="font-medium">{dateStr}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="text-gray-400 text-sm">Thời gian</p>
                    <p className="font-medium">
                      {appointment.startTime} - {appointment.endTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="text-gray-400 text-sm">Nhân viên phụ trách</p>
                    <p className="font-medium">
                      {appointment.assignedStaff?.email || "Chưa phân công"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-white">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="text-gray-400 text-sm">Địa điểm</p>
                    <p className="font-medium">Custom Tailor Showroom</p>
                    <p className="text-gray-400 text-sm">
                      123 Nguyễn Huệ, Q1, TP.HCM
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-yellow-500 mt-1" />
                  <div>
                    <p className="text-gray-400 text-sm">Ghi chú</p>
                    <p className="font-medium whitespace-pre-line">
                      {appointment.notes || "Không có"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {appointment.status !== AppointmentStatus.CANCELLED &&
              appointment.status !== AppointmentStatus.COMPLETED && (
                <div className="flex gap-3">
                  <Button
                    variant="luxury"
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    {cancelling ? "Đang hủy..." : "Hủy lịch hẹn"}
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/appointments")}>
                    Quay lại
                  </Button>
                </div>
              )}
          </GlassCard>
        </AnimatedSection>
      </div>
    </div>
  );
}

