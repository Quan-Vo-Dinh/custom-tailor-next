"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  Calendar,
  Clock,
  MapPin,
  Filter,
  Eye,
  XCircle,
  CheckCircle,
  AlertCircle,
  Clock4,
  Ban,
} from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { getMyAppointments, cancelAppointment } from "@/services/appointments";
import { AppointmentType, AppointmentStatus, Appointment } from "@/types";
import { formatAppointmentCode } from "@/lib/utils";

// Mock appointments data (fallback)
const mockAppointments: Appointment[] = [
  {
    id: "APT-001",
    customerId: "user-1",
    customer: {} as any,
    date: new Date("2024-03-15"),
    startTime: "10:00",
    endTime: "11:00",
    type: AppointmentType.CONSULTATION,
    status: AppointmentStatus.CONFIRMED,
    notes: "Mang theo các mẫu vest đã chọn",
    createdAt: new Date("2024-03-01T10:00:00Z"),
    updatedAt: new Date("2024-03-01T10:00:00Z"),
  },
  {
    id: "APT-002",
    customerId: "user-1",
    customer: {} as any,
    date: new Date("2024-02-20"),
    startTime: "14:30",
    endTime: "15:30",
    type: AppointmentType.CONSULTATION,
    status: AppointmentStatus.COMPLETED,
    notes: "",
    createdAt: new Date("2024-02-15T09:00:00Z"),
    updatedAt: new Date("2024-02-15T09:00:00Z"),
  },
  {
    id: "APT-003",
    customerId: "user-1",
    customer: {} as any,
    date: new Date("2024-02-10"),
    startTime: "11:00",
    endTime: "12:00",
    type: AppointmentType.FITTING,
    status: AppointmentStatus.COMPLETED,
    notes: "Thử vest đã hoàn thành",
    createdAt: new Date("2024-02-05T14:00:00Z"),
    updatedAt: new Date("2024-02-05T14:00:00Z"),
  },
  {
    id: "APT-004",
    customerId: "user-1",
    customer: {} as any,
    date: new Date("2024-01-25"),
    startTime: "15:00",
    endTime: "16:00",
    type: AppointmentType.CONSULTATION,
    status: AppointmentStatus.CANCELLED,
    notes: "",
    createdAt: new Date("2024-01-20T10:00:00Z"),
    updatedAt: new Date("2024-01-20T10:00:00Z"),
  },
  {
    id: "APT-005",
    customerId: "user-1",
    customer: {} as any,
    date: new Date("2024-03-25"),
    startTime: "09:30",
    endTime: "10:30",
    type: AppointmentType.CONSULTATION,
    status: AppointmentStatus.PENDING,
    notes: "",
    createdAt: new Date("2024-03-10T11:00:00Z"),
    updatedAt: new Date("2024-03-10T11:00:00Z"),
  },
] as Appointment[];

const statusConfig = {
  Pending: {
    label: "Chờ xác nhận",
    icon: Clock4,
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
  },
  Confirmed: {
    label: "Đã xác nhận",
    icon: CheckCircle,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  In_Progress: {
    label: "Đang diễn ra",
    icon: Clock4,
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20",
  },
  Completed: {
    label: "Hoàn thành",
    icon: CheckCircle,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
  },
  Cancelled: {
    label: "Đã hủy",
    icon: XCircle,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
  },
  No_Show: {
    label: "Không đến",
    icon: Ban,
    color: "text-gray-400",
    bgColor: "bg-gray-500/10",
    borderColor: "border-gray-500/20",
  },
};

type LocalAppointmentStatus = keyof typeof statusConfig;

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<
    LocalAppointmentStatus | "All"
  >("All");

  // Load appointments for current user
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const data = await getMyAppointments(
          statusFilter !== "All"
            ? { status: statusMap[statusFilter] }
            : undefined
        );
        setAppointments(data);
      } catch (error: any) {
        console.error("Failed to load appointments:", error);
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Không thể tải danh sách lịch hẹn"
        );
        // Fallback to mock data so UI vẫn hiển thị
        setAppointments(mockAppointments);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [statusFilter]);

  // Map between LocalAppointmentStatus and AppointmentStatus enum
  const statusMap: Record<LocalAppointmentStatus, AppointmentStatus> = {
    Pending: AppointmentStatus.PENDING,
    Confirmed: AppointmentStatus.CONFIRMED,
    In_Progress: AppointmentStatus.IN_PROGRESS,
    Completed: AppointmentStatus.COMPLETED,
    Cancelled: AppointmentStatus.CANCELLED,
    No_Show: AppointmentStatus.NO_SHOW,
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (statusFilter === "All") return true;
    const apiStatus = statusMap[statusFilter];
    return apt.status === apiStatus;
  });

  const upcomingAppointments = filteredAppointments.filter((apt) => {
    const aptDate = new Date(apt.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (
      aptDate >= today &&
      (apt.status === AppointmentStatus.PENDING ||
        apt.status === AppointmentStatus.CONFIRMED)
    );
  });

  const pastAppointments = filteredAppointments.filter((apt) => {
    const aptDate = new Date(apt.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (
      aptDate < today ||
      apt.status === AppointmentStatus.COMPLETED ||
      apt.status === AppointmentStatus.CANCELLED ||
      apt.status === AppointmentStatus.NO_SHOW
    );
  });

  const handleCancelAppointment = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn hủy lịch hẹn này?")) {
      return;
    }

    try {
      await cancelAppointment(id);
      toast.success("Hủy lịch hẹn thành công!");
      // Reload appointments
      const data = await getMyAppointments(
        statusFilter !== "All" ? { status: statusMap[statusFilter] } : undefined
      );
      setAppointments(data);
    } catch (error: any) {
      toast.error(error.message || "Hủy lịch hẹn thất bại");
    }
  };

  const canCancel = (appointment: Appointment) => {
    const aptDate = new Date(appointment.date);
    const today = new Date();
    const hoursDiff = (aptDate.getTime() - today.getTime()) / (1000 * 60 * 60);
    return (
      (appointment.status === AppointmentStatus.PENDING ||
        appointment.status === AppointmentStatus.CONFIRMED) &&
      hoursDiff > 24
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <AnimatedSection className="mb-12">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-light mb-2">
                Lịch Hẹn <span className="text-luxury italic">Của Tôi</span>
              </h1>
              <p className="text-gray-400">
                Quản lý tất cả các cuộc hẹn của bạn
              </p>
            </div>
            <Link href="/booking">
              <Button variant="luxury" size="lg">
                <Calendar className="w-5 h-5" />
                <span>Đặt lịch mới</span>
              </Button>
            </Link>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-3 flex-wrap">
            <Filter className="w-5 h-5 text-gray-400" />
            <button
              onClick={() => setStatusFilter("All")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === "All"
                  ? "bg-(--color-gold) text-charcoal"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              Tất cả
            </button>
            {(Object.keys(statusConfig) as LocalAppointmentStatus[]).map(
              (status) => {
                const config = statusConfig[status];
                return (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      statusFilter === status
                        ? `${config.bgColor} ${config.color} border ${config.borderColor}`
                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    {config.label}
                  </button>
                );
              }
            )}
          </div>
        </AnimatedSection>

        {/* Upcoming Appointments */}
        {upcomingAppointments.length > 0 && (
          <div className="mb-12">
            <AnimatedSection delay={0.1}>
              <h2 className="text-2xl font-light text-white mb-6">
                Lịch hẹn sắp tới
              </h2>
            </AnimatedSection>
            <div className="grid md:grid-cols-2 gap-6">
              {upcomingAppointments.map((appointment, index) => (
                <AnimatedSection key={appointment.id} delay={0.1 * (index + 1)}>
                  <AppointmentCard
                    appointment={appointment}
                    onCancel={handleCancelAppointment}
                    canCancel={canCancel(appointment)}
                  />
                </AnimatedSection>
              ))}
            </div>
          </div>
        )}

        {/* Past Appointments */}
        {pastAppointments.length > 0 && (
          <div>
            <AnimatedSection delay={0.2}>
              <h2 className="text-2xl font-light text-white mb-6">
                Lịch hẹn đã qua
              </h2>
            </AnimatedSection>
            <div className="grid md:grid-cols-2 gap-6">
              {pastAppointments.map((appointment, index) => (
                <AnimatedSection key={appointment.id} delay={0.1 * (index + 1)}>
                  <AppointmentCard
                    appointment={appointment}
                    onCancel={handleCancelAppointment}
                    canCancel={false}
                    isPast
                  />
                </AnimatedSection>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredAppointments.length === 0 && (
          <AnimatedSection delay={0.2}>
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-(--color-gold)/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-(--color-gold)" />
              </div>
              <h3 className="text-2xl font-light text-white mb-2">
                Không có lịch hẹn
              </h3>
              <p className="text-gray-400 mb-6">
                {statusFilter === "All"
                  ? "Bạn chưa có lịch hẹn nào"
                  : `Không có lịch hẹn với trạng thái "${
                      statusConfig[statusFilter as LocalAppointmentStatus]
                        ?.label
                    }"`}
              </p>
              <Link href="/booking">
                <Button variant="luxury" size="lg">
                  <Calendar className="w-5 h-5" />
                  <span>Đặt lịch ngay</span>
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}

function AppointmentCard({
  appointment,
  onCancel,
  canCancel,
  isPast = false,
}: {
  appointment: Appointment;
  onCancel: (id: string) => void;
  canCancel: boolean;
  isPast?: boolean;
}) {
  // Map AppointmentStatus enum to LocalAppointmentStatus for UI
  const statusEnumToLocal: Record<AppointmentStatus, LocalAppointmentStatus> = {
    [AppointmentStatus.PENDING]: "Pending",
    [AppointmentStatus.CONFIRMED]: "Confirmed",
    [AppointmentStatus.IN_PROGRESS]: "In_Progress",
    [AppointmentStatus.COMPLETED]: "Completed",
    [AppointmentStatus.CANCELLED]: "Cancelled",
    [AppointmentStatus.NO_SHOW]: "No_Show",
  };
  const localStatus = statusEnumToLocal[appointment.status] || "Pending";
  const config = statusConfig[localStatus] || statusConfig.Pending;
  const StatusIcon = config.icon;

  return (
    <GlassCard
      className={`p-6 ${
        isPast ? "opacity-75" : ""
      } hover:border-(--color-gold)/50 transition-colors`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-lg ${config.bgColor} border ${config.borderColor} flex items-center justify-center`}
          >
            <StatusIcon className={`w-6 h-6 ${config.color}`} />
          </div>
          <div>
            <h3 className="text-xl font-medium text-white">
              {appointment.type === AppointmentType.CONSULTATION
                ? "Tư vấn"
                : appointment.type === AppointmentType.FITTING
                ? "Thử đồ"
                : appointment.type === AppointmentType.PICKUP
                ? "Nhận hàng"
                : appointment.type}
            </h3>
            <p className={`text-sm ${config.color}`}>{config.label}</p>
          </div>
        </div>
        <span className="text-sm text-gray-500">
          Mã: {formatAppointmentCode(appointment.id)}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-3 text-sm">
          <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
          <span className="text-white">
            {new Date(appointment.date).toLocaleDateString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Clock className="w-4 h-4 text-gray-400 shrink-0" />
          <span className="text-white">
            {appointment.startTime} - {appointment.endTime}
          </span>
        </div>
        {appointment.assignedStaff && (
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="text-white">
              Nhân viên:{" "}
              {(appointment.assignedStaff as any).fullName ||
                (appointment.assignedStaff as any).name ||
                "Chưa gán"}
            </span>
          </div>
        )}
      </div>

      {appointment.notes && (
        <div className="p-3 bg-white/5 rounded-lg border border-white/10 mb-4">
          <p className="text-sm text-gray-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-(--color-gold) mt-0.5 shrink-0" />
            <span>{appointment.notes}</span>
          </p>
        </div>
      )}

      <div className="flex gap-3 pt-4 border-t border-white/10">
        <Link href={`/appointments/${appointment.id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            <Eye className="w-4 h-4" />
            <span>Chi tiết</span>
          </Button>
        </Link>
        {canCancel && (
          <Button
            variant="outline"
            onClick={() => onCancel(appointment.id)}
            className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10"
          >
            <XCircle className="w-4 h-4" />
            <span>Hủy lịch</span>
          </Button>
        )}
      </div>
    </GlassCard>
  );
}
