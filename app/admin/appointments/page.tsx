"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  Search,
  Filter,
  Eye,
  Edit2,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Phone,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/Calendar";

// Mock data
const mockAppointments = [
  {
    id: "APT-001",
    customerName: "Nguyễn Văn A",
    customerPhone: "0901234567",
    customerEmail: "nguyenvana@example.com",
    date: "2024-03-15",
    time: "10:00",
    type: "Đo lường",
    status: "Confirmed",
    notes: "Mang theo các mẫu vest đã chọn",
    createdAt: "2024-03-01T10:00:00Z",
  },
  {
    id: "APT-002",
    customerName: "Trần Thị B",
    customerPhone: "0912345678",
    customerEmail: "tranthib@example.com",
    date: "2024-03-16",
    time: "14:30",
    type: "Tư vấn",
    status: "Pending",
    notes: "Khách hàng muốn tư vấn về áo dài",
    createdAt: "2024-03-02T09:00:00Z",
  },
  {
    id: "APT-003",
    customerName: "Lê Văn C",
    customerPhone: "0923456789",
    customerEmail: "levanc@example.com",
    date: "2024-03-17",
    time: "11:00",
    type: "Thử đồ",
    status: "Confirmed",
    notes: "Thử vest đã hoàn thành",
    createdAt: "2024-03-05T14:00:00Z",
  },
  {
    id: "APT-004",
    customerName: "Phạm Thị D",
    customerPhone: "0934567890",
    customerEmail: "phamthid@example.com",
    date: "2024-02-20",
    time: "15:00",
    type: "Tư vấn",
    status: "Completed",
    notes: "",
    createdAt: "2024-02-15T10:00:00Z",
  },
  {
    id: "APT-005",
    customerName: "Hoàng Văn E",
    customerPhone: "0945678901",
    customerEmail: "hoangvane@example.com",
    date: "2024-02-10",
    time: "09:30",
    type: "Đo lường",
    status: "Cancelled",
    notes: "Khách hàng hủy vì bận đột xuất",
    createdAt: "2024-02-05T11:00:00Z",
  },
  {
    id: "APT-006",
    customerName: "Võ Thị F",
    customerPhone: "0956789012",
    customerEmail: "vothif@example.com",
    date: "2024-03-18",
    time: "16:00",
    type: "Tư vấn",
    status: "Pending",
    notes: "",
    createdAt: "2024-03-08T15:00:00Z",
  },
];

const statusConfig = {
  Pending: {
    label: "Chờ xác nhận",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
  },
  Confirmed: {
    label: "Đã xác nhận",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  Completed: {
    label: "Hoàn thành",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
  },
  Cancelled: {
    label: "Đã hủy",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
  },
  No_Show: {
    label: "Không đến",
    color: "text-gray-400",
    bgColor: "bg-gray-500/10",
    borderColor: "border-gray-500/20",
  },
};

const appointmentTypes = ["Tư vấn", "Đo lường", "Thử đồ", "Nhận hàng"];

type AppointmentStatus = keyof typeof statusConfig;

export default function AdminAppointmentsPage() {
  const [appointments] = useState(mockAppointments);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "All">(
    "All"
  );
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.customerPhone.includes(searchQuery) ||
      apt.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All" ? true : apt.status === statusFilter;
    const matchesType = typeFilter === "All" ? true : apt.type === typeFilter;
    const matchesDate = selectedDate
      ? apt.date === selectedDate.toISOString().split("T")[0]
      : true;
    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleStatusUpdate = (aptId: string, newStatus: AppointmentStatus) => {
    // TODO: Integrate with backend
    console.log("Update appointment", aptId, "to", newStatus);
  };

  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === "Pending").length,
    confirmed: appointments.filter((a) => a.status === "Confirmed").length,
    today: appointments.filter(
      (a) =>
        a.date === new Date().toISOString().split("T")[0] &&
        (a.status === "Confirmed" || a.status === "Pending")
    ).length,
  };

  const upcomingAppointments = appointments
    .filter((a) => {
      const aptDate = new Date(a.date);
      const today = new Date();
      return (
        aptDate >= today && (a.status === "Pending" || a.status === "Confirmed")
      );
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <AnimatedSection className="mb-12">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-light mb-2">
                Quản Lý <span className="text-luxury italic">Lịch Hẹn</span>
              </h1>
              <p className="text-gray-400">
                Theo dõi và xử lý tất cả các lịch hẹn
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <AnimatedSection delay={0.1}>
            <GlassCard className="p-6">
              <div className="text-sm text-gray-400 mb-1">Tổng lịch hẹn</div>
              <div className="text-3xl font-medium text-white">
                {stats.total}
              </div>
            </GlassCard>
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <GlassCard className="p-6">
              <div className="text-sm text-gray-400 mb-1">Chờ xác nhận</div>
              <div className="text-3xl font-medium text-yellow-400">
                {stats.pending}
              </div>
            </GlassCard>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <GlassCard className="p-6">
              <div className="text-sm text-gray-400 mb-1">Đã xác nhận</div>
              <div className="text-3xl font-medium text-blue-400">
                {stats.confirmed}
              </div>
            </GlassCard>
          </AnimatedSection>
          <AnimatedSection delay={0.25}>
            <GlassCard className="p-6">
              <div className="text-sm text-gray-400 mb-1">Hôm nay</div>
              <div className="text-3xl font-medium text-(--color-gold)">
                {stats.today}
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Filters & List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters & Search */}
            <AnimatedSection delay={0.3}>
              <GlassCard className="p-6">
                <div className="space-y-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm theo mã, tên, SĐT, email khách hàng..."
                      className="w-full pl-10 pr-4 py-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors"
                    />
                  </div>

                  {/* Status Filter */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Filter className="w-5 h-5 text-gray-400 shrink-0" />
                    <span className="text-sm text-gray-400">Trạng thái:</span>
                    <button
                      onClick={() => setStatusFilter("All")}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        statusFilter === "All"
                          ? "bg-(--color-gold) text-charcoal"
                          : "bg-white/5 text-gray-400 hover:bg-white/10"
                      }`}
                    >
                      Tất cả
                    </button>
                    {(Object.keys(statusConfig) as AppointmentStatus[]).map(
                      (status) => (
                        <button
                          key={status}
                          onClick={() => setStatusFilter(status)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            statusFilter === status
                              ? `${statusConfig[status].bgColor} ${statusConfig[status].color} border ${statusConfig[status].borderColor}`
                              : "bg-white/5 text-gray-400 hover:bg-white/10"
                          }`}
                        >
                          {statusConfig[status].label}
                        </button>
                      )
                    )}
                  </div>

                  {/* Type Filter */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Filter className="w-5 h-5 text-gray-400 shrink-0" />
                    <span className="text-sm text-gray-400">Loại:</span>
                    <button
                      onClick={() => setTypeFilter("All")}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        typeFilter === "All"
                          ? "bg-(--color-gold) text-charcoal"
                          : "bg-white/5 text-gray-400 hover:bg-white/10"
                      }`}
                    >
                      Tất cả
                    </button>
                    {appointmentTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setTypeFilter(type)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          typeFilter === type
                            ? "bg-(--color-gold) text-charcoal"
                            : "bg-white/5 text-gray-400 hover:bg-white/10"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </AnimatedSection>

            {/* Appointments List */}
            <AnimatedSection delay={0.35}>
              <GlassCard className="p-6">
                <h3 className="text-xl font-light text-white mb-6">
                  Danh sách lịch hẹn
                </h3>
                <div className="space-y-4">
                  {paginatedAppointments.map((apt, index) => {
                    const status =
                      statusConfig[apt.status as AppointmentStatus];
                    return (
                      <motion.div
                        key={apt.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-(--color-gold)/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-blue-400 font-medium">
                                {apt.id}
                              </span>
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${status.bgColor} ${status.color} border ${status.borderColor}`}
                              >
                                {status.label}
                              </span>
                              <span className="px-2 py-1 rounded text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                {apt.type}
                              </span>
                            </div>
                            <div className="grid md:grid-cols-2 gap-2 text-sm">
                              <div className="flex items-center gap-2 text-white">
                                <User className="w-4 h-4 text-gray-400" />
                                {apt.customerName}
                              </div>
                              <div className="flex items-center gap-2 text-gray-300">
                                <Phone className="w-4 h-4 text-gray-400" />
                                {apt.customerPhone}
                              </div>
                              <div className="flex items-center gap-2 text-gray-300">
                                <CalendarIcon className="w-4 h-4 text-gray-400" />
                                {new Date(apt.date).toLocaleDateString("vi-VN")}{" "}
                                - {apt.time}
                              </div>
                              <div className="flex items-center gap-2 text-gray-300">
                                <Clock className="w-4 h-4 text-gray-400" />
                                {apt.time}
                              </div>
                            </div>
                            {apt.notes && (
                              <div className="mt-2 flex items-start gap-2 p-2 bg-blue-500/5 rounded border border-blue-500/10">
                                <MessageSquare className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                                <span className="text-sm text-gray-300">
                                  {apt.notes}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            {apt.status === "Pending" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleStatusUpdate(apt.id, "Confirmed")
                                }
                                className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                            {(apt.status === "Pending" ||
                              apt.status === "Confirmed") && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleStatusUpdate(apt.id, "Cancelled")
                                }
                                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            )}
                            <Link href={`/appointments/${apt.id}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button variant="outline" size="sm">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      Hiển thị {(currentPage - 1) * itemsPerPage + 1} -{" "}
                      {Math.min(
                        currentPage * itemsPerPage,
                        filteredAppointments.length
                      )}{" "}
                      trong tổng số {filteredAppointments.length} lịch hẹn
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-400" />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                              currentPage === page
                                ? "bg-(--color-gold) text-charcoal"
                                : "bg-white/5 text-gray-400 hover:bg-white/10"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {filteredAppointments.length === 0 && (
                  <div className="text-center py-12">
                    <CalendarIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      Không tìm thấy lịch hẹn
                    </h3>
                    <p className="text-gray-400">
                      Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                    </p>
                  </div>
                )}
              </GlassCard>
            </AnimatedSection>
          </div>

          {/* Right Column - Calendar & Upcoming */}
          <div className="space-y-6">
            {/* Calendar */}
            <AnimatedSection delay={0.4}>
              <GlassCard className="p-6">
                <h3 className="text-xl font-light text-white mb-4">Lịch</h3>
                <Calendar
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                />
              </GlassCard>
            </AnimatedSection>

            {/* Upcoming Appointments */}
            <AnimatedSection delay={0.45}>
              <GlassCard className="p-6">
                <h3 className="text-xl font-light text-white mb-4">Sắp tới</h3>
                <div className="space-y-3">
                  {upcomingAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="p-3 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-(--color-gold)">
                          {new Date(apt.date).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                          })}
                        </span>
                        <span className="text-sm text-gray-400">
                          {apt.time}
                        </span>
                        <span
                          className={`ml-auto px-2 py-0.5 rounded text-xs ${
                            statusConfig[apt.status as AppointmentStatus]
                              .bgColor
                          } ${
                            statusConfig[apt.status as AppointmentStatus].color
                          }`}
                        >
                          {apt.type}
                        </span>
                      </div>
                      <p className="text-sm text-white">{apt.customerName}</p>
                    </div>
                  ))}
                  {upcomingAppointments.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-4">
                      Không có lịch hẹn sắp tới
                    </p>
                  )}
                </div>
              </GlassCard>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
}
