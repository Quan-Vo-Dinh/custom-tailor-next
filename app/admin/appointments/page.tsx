"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Phone,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  X,
} from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Calendar } from "@/components/Calendar";
import {
  getAllAppointments,
  updateAppointmentStatus,
  assignStaffToAppointment,
} from "@/services/appointments";
import { getStaffList, StaffInfo } from "@/services/admin";
import { Appointment, AppointmentStatus, AppointmentType } from "@/types";
import toast from "react-hot-toast";
import { formatAppointmentCode } from "@/lib/utils";

const statusConfig: Record<
  AppointmentStatus,
  {
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
  }
> = {
  PENDING: {
    label: "Chờ xác nhận",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  IN_PROGRESS: {
    label: "Đang diễn ra",
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20",
  },
  COMPLETED: {
    label: "Hoàn thành",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
  },
  CANCELLED: {
    label: "Đã hủy",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
  },
  NO_SHOW: {
    label: "Không đến",
    color: "text-gray-400",
    bgColor: "bg-gray-500/10",
    borderColor: "border-gray-500/20",
  },
};

const typeLabels: Record<AppointmentType, string> = {
  CONSULTATION: "Tư vấn",
  FITTING: "Thử đồ",
  PICKUP: "Nhận hàng",
};

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "All">(
    "All"
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [typeFilter, setTypeFilter] = useState<AppointmentType | "All">("All");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Staff assignment states
  const [staffList, setStaffList] = useState<StaffInfo[]>([]);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [assignLoading, setAssignLoading] = useState(false);

  // Fetch staff list
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const staff = await getStaffList();
        setStaffList(staff);
      } catch (err) {
        console.error("Error fetching staff:", err);
      }
    };
    fetchStaff();
  }, []);

  // Fetch appointments from API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllAppointments({
          page: currentPage,
          limit: itemsPerPage,
          status: statusFilter !== "All" ? statusFilter : undefined,
          fromDate: selectedDate ? `${selectedDate}T00:00:00.000Z` : undefined,
          toDate: selectedDate ? `${selectedDate}T23:59:59.999Z` : undefined,
          search: searchQuery || undefined,
        });
        setAppointments(response.appointments || []);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalItems(response.pagination?.totalItems || 0);
      } catch (err: any) {
        setError(err.message || "Không thể tải danh sách lịch hẹn");
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [currentPage, searchQuery, statusFilter, selectedDate]);

  const handleStatusUpdate = async (
    aptId: string,
    newStatus: AppointmentStatus
  ) => {
    try {
      await updateAppointmentStatus(aptId, newStatus);
      toast.success("Đã cập nhật trạng thái lịch hẹn");
      // Refresh appointments
      const response = await getAllAppointments({
        page: currentPage,
        limit: itemsPerPage,
        status: statusFilter !== "All" ? statusFilter : undefined,
        fromDate: selectedDate ? `${selectedDate}T00:00:00.000Z` : undefined,
        toDate: selectedDate ? `${selectedDate}T23:59:59.999Z` : undefined,
        search: searchQuery || undefined,
      });
      setAppointments(response.appointments || []);
      setTotalPages(response.pagination?.totalPages || 1);
      setTotalItems(response.pagination?.totalItems || 0);
    } catch (err: any) {
      toast.error(err.message || "Không thể cập nhật trạng thái");
    }
  };

  // Handle assign staff
  const handleOpenAssignModal = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setSelectedStaffId(apt.assignedStaffId || "");
    setAssignModalOpen(true);
  };

  const handleCloseAssignModal = () => {
    setAssignModalOpen(false);
    setSelectedAppointment(null);
    setSelectedStaffId("");
  };

  const handleAssignStaff = async () => {
    if (!selectedAppointment || !selectedStaffId) {
      toast.error("Vui lòng chọn nhân viên");
      return;
    }

    try {
      setAssignLoading(true);
      await assignStaffToAppointment(selectedAppointment.id, selectedStaffId);
      toast.success("Đã gán nhân viên thành công");

      // Refresh appointments
      const response = await getAllAppointments({
        page: currentPage,
        limit: itemsPerPage,
        status: statusFilter !== "All" ? statusFilter : undefined,
        fromDate: selectedDate ? `${selectedDate}T00:00:00.000Z` : undefined,
        toDate: selectedDate ? `${selectedDate}T23:59:59.999Z` : undefined,
        search: searchQuery || undefined,
      });
      setAppointments(response.appointments || []);
      handleCloseAssignModal();
    } catch (err: any) {
      toast.error(err.message || "Không thể gán nhân viên");
    } finally {
      setAssignLoading(false);
    }
  };

  const stats = {
    total: totalItems,
    pending: appointments.filter((a) => a.status === AppointmentStatus.PENDING)
      .length,
    confirmed: appointments.filter(
      (a) => a.status === AppointmentStatus.CONFIRMED
    ).length,
    today: appointments.filter((a) => {
      const aptDate = new Date(a.startTime);
      const today = new Date();
      return (
        aptDate.toDateString() === today.toDateString() &&
        (a.status === AppointmentStatus.CONFIRMED ||
          a.status === AppointmentStatus.PENDING)
      );
    }).length,
  };

  const upcomingAppointments = appointments
    .filter((a) => {
      const aptDate = new Date(a.startTime);
      const today = new Date();
      return (
        aptDate >= today &&
        (a.status === AppointmentStatus.PENDING ||
          a.status === AppointmentStatus.CONFIRMED)
      );
    })
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    )
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
              <div className="text-3xl font-medium text-[var(--color-gold)]">
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
                      className="w-full pl-10 pr-4 py-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:border-[var(--color-gold)] transition-colors"
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
                          ? "bg-[var(--color-gold)] text-charcoal"
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
                </div>
              </GlassCard>
            </AnimatedSection>

            {/* Loading State */}
            {loading && (
              <AnimatedSection delay={0.35}>
                <div className="flex justify-center py-20">
                  <LoadingSpinner />
                </div>
              </AnimatedSection>
            )}

            {/* Error State */}
            {error && !loading && (
              <AnimatedSection delay={0.35}>
                <ErrorMessage message={error} />
              </AnimatedSection>
            )}

            {/* Appointments List */}
            {!loading && !error && (
              <AnimatedSection delay={0.35}>
                <GlassCard className="p-6">
                  <h3 className="text-xl font-light text-white mb-6">
                    Danh sách lịch hẹn
                  </h3>
                  <div className="space-y-4">
                    {appointments.map((apt, index) => {
                      const status = statusConfig[apt.status];
                      const startDate = new Date(apt.startTime);
                      const endDate = new Date(apt.endTime);
                      return (
                        <motion.div
                          key={apt.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-[var(--color-gold)]/50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <span className="text-blue-400 font-medium">
                                  {formatAppointmentCode(apt.id)}
                                </span>
                                <span
                                  className={`px-2 py-1 rounded text-xs font-medium ${status.bgColor} ${status.color} border ${status.borderColor}`}
                                >
                                  {status.label}
                                </span>
                                {apt.type && (
                                  <span className="px-2 py-1 rounded text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                    {typeLabels[apt.type] || apt.type}
                                  </span>
                                )}
                                {apt.assignedStaff ? (
                                  <span className="px-2 py-1 rounded text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1">
                                    <UserPlus className="w-3 h-3" />
                                    {apt.assignedStaff.name ||
                                      apt.assignedStaff.email}
                                  </span>
                                ) : (
                                  <span className="px-2 py-1 rounded text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">
                                    Chưa gán NV
                                  </span>
                                )}
                              </div>
                              <div className="grid md:grid-cols-2 gap-2 text-sm">
                                {apt.customer && (
                                  <>
                                    <div className="flex items-center gap-2 text-white">
                                      <User className="w-4 h-4 text-gray-400" />
                                      {apt.customer.name || apt.customer.email}
                                    </div>
                                    {apt.customer.phone && (
                                      <div className="flex items-center gap-2 text-gray-300">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        {apt.customer.phone}
                                      </div>
                                    )}
                                  </>
                                )}
                                <div className="flex items-center gap-2 text-gray-300">
                                  <CalendarIcon className="w-4 h-4 text-gray-400" />
                                  {startDate.toLocaleDateString("vi-VN")}
                                </div>
                                <div className="flex items-center gap-2 text-gray-300">
                                  <Clock className="w-4 h-4 text-gray-400" />
                                  {startDate.toLocaleTimeString("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                  {" - "}
                                  {endDate.toLocaleTimeString("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
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
                              {apt.status === AppointmentStatus.PENDING && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleStatusUpdate(
                                      apt.id,
                                      AppointmentStatus.CONFIRMED
                                    )
                                  }
                                  className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                                  title="Xác nhận"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                              )}
                              {(apt.status === AppointmentStatus.PENDING ||
                                apt.status === AppointmentStatus.CONFIRMED) && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleOpenAssignModal(apt)}
                                    className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                                    title="Gán nhân viên"
                                  >
                                    <UserPlus className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleStatusUpdate(
                                        apt.id,
                                        AppointmentStatus.CANCELLED
                                      )
                                    }
                                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                                    title="Hủy"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                              {apt.status === AppointmentStatus.CONFIRMED && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleStatusUpdate(
                                      apt.id,
                                      AppointmentStatus.COMPLETED
                                    )
                                  }
                                  className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                                  title="Hoàn thành"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                              )}
                              <Link href={`/appointments/${apt.id}`}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  title="Xem chi tiết"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </Link>
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
                        {Math.min(currentPage * itemsPerPage, totalItems)} trong
                        tổng số {totalItems} lịch hẹn
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
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                              currentPage === page
                                ? "bg-[var(--color-gold)] text-charcoal"
                                : "bg-white/5 text-gray-400 hover:bg-white/10"
                            }`}
                          >
                            {page}
                          </button>
                        ))}
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
                  {appointments.length === 0 && (
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
            )}
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
                  {upcomingAppointments.map((apt) => {
                    const startDate = new Date(apt.startTime);
                    return (
                      <div
                        key={apt.id}
                        className="p-3 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-[var(--color-gold)]">
                            {startDate.toLocaleDateString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                            })}
                          </span>
                          <span className="text-sm text-gray-400">
                            {startDate.toLocaleTimeString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {apt.type && (
                            <span
                              className={`ml-auto px-2 py-0.5 rounded text-xs ${
                                statusConfig[apt.status].bgColor
                              } ${statusConfig[apt.status].color}`}
                            >
                              {typeLabels[apt.type] || apt.type}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-white">
                          {apt.customer?.name || apt.customer?.email || "N/A"}
                        </p>
                      </div>
                    );
                  })}
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

      {/* Assign Staff Modal */}
      {assignModalOpen && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCloseAssignModal}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-charcoal border border-white/10 rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={handleCloseAssignModal}
              className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>

            <h3 className="text-xl font-medium text-white mb-2">
              Gán nhân viên phụ trách
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Lịch hẹn:{" "}
              <span className="text-blue-400">
                {formatAppointmentCode(selectedAppointment.id)}
              </span>
            </p>

            {/* Customer Info */}
            <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="text-sm text-gray-400 mb-1">Khách hàng</div>
              <div className="text-white">
                {selectedAppointment.customer?.name ||
                  selectedAppointment.customer?.email ||
                  "N/A"}
              </div>
              {selectedAppointment.customer?.phone && (
                <div className="text-sm text-gray-400 mt-1">
                  {selectedAppointment.customer.phone}
                </div>
              )}
            </div>

            {/* Staff Selection */}
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">
                Chọn nhân viên
              </label>
              <select
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 text-white border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors"
              >
                <option value="">-- Chọn nhân viên --</option>
                {staffList.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.fullName} ({staff.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleCloseAssignModal}
                className="flex-1"
              >
                Hủy
              </Button>
              <Button
                variant="luxury"
                onClick={handleAssignStaff}
                disabled={assignLoading || !selectedStaffId}
                className="flex-1"
              >
                {assignLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Gán nhân viên
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
