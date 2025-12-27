"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ruler,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  User,
  Mail,
  Phone,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Save,
} from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import toast from "react-hot-toast";
import api from "@/lib/api";

interface MeasurementUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
}

interface Measurement {
  id: string;
  name: string;
  details: Record<string, number>;
  createdAt: string;
  updatedAt: string;
  user: MeasurementUser;
}

interface MeasurementStats {
  total: number;
  usersWithMeasurements: number;
  recentlyAdded: number;
}

// Measurement field labels in Vietnamese
const measurementLabels: Record<string, string> = {
  chest: "Vòng ngực",
  waist: "Vòng eo",
  hips: "Vòng mông",
  shoulders: "Vai",
  sleeveLength: "Dài tay",
  inseam: "Dài đũng",
  neck: "Vòng cổ",
  armLength: "Dài tay",
  thigh: "Vòng đùi",
  height: "Chiều cao",
  weight: "Cân nặng",
};

export default function AdminMeasurementsPage() {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [stats, setStats] = useState<MeasurementStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Modal states
  const [selectedMeasurement, setSelectedMeasurement] =
    useState<Measurement | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<{
    name: string;
    details: Record<string, number>;
  }>({ name: "", details: {} });

  // Fetch measurements
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [measurementsRes, statsRes] = await Promise.all([
          api.get("/users/admin/measurements", {
            params: {
              page: currentPage,
              limit: itemsPerPage,
              search: searchQuery || undefined,
            },
          }),
          api.get("/users/admin/measurements/stats"),
        ]);

        setMeasurements(measurementsRes.data.measurements || []);
        setTotalPages(measurementsRes.data.pagination?.totalPages || 1);
        setTotalItems(measurementsRes.data.pagination?.totalItems || 0);
        setStats(statsRes.data);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Không thể tải dữ liệu";
        setError(errorMessage);
        console.error("Error fetching measurements:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, searchQuery]);

  const handleView = (measurement: Measurement) => {
    setSelectedMeasurement(measurement);
    setIsViewModalOpen(true);
  };

  const handleEdit = (measurement: Measurement) => {
    setSelectedMeasurement(measurement);
    setEditFormData({
      name: measurement.name,
      details: { ...measurement.details },
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedMeasurement) return;

    try {
      await api.put(
        `/users/admin/measurements/${selectedMeasurement.id}`,
        editFormData
      );
      toast.success("Đã cập nhật số đo");
      setIsEditModalOpen(false);

      // Refresh data
      const response = await api.get("/users/admin/measurements", {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchQuery || undefined,
        },
      });
      setMeasurements(response.data.measurements || []);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Không thể cập nhật số đo";
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bộ số đo này?")) return;

    try {
      await api.delete(`/users/admin/measurements/${id}`);
      toast.success("Đã xóa số đo");

      // Refresh data
      const [measurementsRes, statsRes] = await Promise.all([
        api.get("/users/admin/measurements", {
          params: {
            page: currentPage,
            limit: itemsPerPage,
            search: searchQuery || undefined,
          },
        }),
        api.get("/users/admin/measurements/stats"),
      ]);

      setMeasurements(measurementsRes.data.measurements || []);
      setTotalPages(measurementsRes.data.pagination?.totalPages || 1);
      setTotalItems(measurementsRes.data.pagination?.totalItems || 0);
      setStats(statsRes.data);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Không thể xóa số đo";
      toast.error(errorMessage);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <AnimatedSection className="mb-12">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-light mb-2">
                Quản Lý <span className="text-luxury italic">Số Đo</span>
              </h1>
              <p className="text-gray-400">
                Quản lý số đo của tất cả khách hàng
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <AnimatedSection delay={0.1}>
            <GlassCard className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[var(--color-gold)]/10 rounded-lg flex items-center justify-center">
                  <Ruler className="w-6 h-6 text-[var(--color-gold)]" />
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Tổng số đo</div>
                  <div className="text-3xl font-medium text-white">
                    {stats?.total || 0}
                  </div>
                </div>
              </div>
            </GlassCard>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <GlassCard className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">
                    Khách có số đo
                  </div>
                  <div className="text-3xl font-medium text-blue-400">
                    {stats?.usersWithMeasurements || 0}
                  </div>
                </div>
              </div>
            </GlassCard>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <GlassCard className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Plus className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">
                    Thêm mới (30 ngày)
                  </div>
                  <div className="text-3xl font-medium text-green-400">
                    {stats?.recentlyAdded || 0}
                  </div>
                </div>
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>

        {/* Search */}
        <AnimatedSection delay={0.25}>
          <GlassCard className="p-6 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Tìm theo tên số đo, email, tên khách hàng..."
                className="w-full pl-10 pr-4 py-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:border-[var(--color-gold)] transition-colors"
              />
            </div>
          </GlassCard>
        </AnimatedSection>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <LoadingSpinner />
          </div>
        )}

        {/* Error */}
        {error && !loading && <ErrorMessage message={error} />}

        {/* Measurements List */}
        {!loading && !error && (
          <AnimatedSection delay={0.3}>
            <GlassCard className="p-6">
              <h3 className="text-xl font-light text-white mb-6">
                Danh sách số đo ({totalItems})
              </h3>

              {measurements.length === 0 ? (
                <div className="text-center py-12">
                  <Ruler className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">
                    Không tìm thấy số đo
                  </h3>
                  <p className="text-gray-400">Thử thay đổi từ khóa tìm kiếm</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {measurements.map((measurement, index) => (
                    <motion.div
                      key={measurement.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-[var(--color-gold)]/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-lg font-medium text-[var(--color-gold)]">
                              {measurement.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              ID: {measurement.id.substring(0, 8)}...
                            </span>
                          </div>

                          {/* User Info */}
                          <div className="grid md:grid-cols-3 gap-2 text-sm mb-3">
                            <div className="flex items-center gap-2 text-white">
                              <User className="w-4 h-4 text-gray-400" />
                              {measurement.user.name}
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                              <Mail className="w-4 h-4 text-gray-400" />
                              {measurement.user.email}
                            </div>
                            {measurement.user.phone && (
                              <div className="flex items-center gap-2 text-gray-300">
                                <Phone className="w-4 h-4 text-gray-400" />
                                {measurement.user.phone}
                              </div>
                            )}
                          </div>

                          {/* Measurements Preview */}
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(measurement.details)
                              .slice(0, 5)
                              .map(([key, value]) => (
                                <span
                                  key={key}
                                  className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300"
                                >
                                  {measurementLabels[key] || key}: {value}cm
                                </span>
                              ))}
                            {Object.keys(measurement.details).length > 5 && (
                              <span className="px-2 py-1 text-xs text-gray-400">
                                +{Object.keys(measurement.details).length - 5}{" "}
                                khác
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            Tạo: {formatDate(measurement.createdAt)}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(measurement)}
                            className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(measurement)}
                            className="border-[var(--color-gold)]/50 text-[var(--color-gold)] hover:bg-[var(--color-gold)]/10"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(measurement.id)}
                            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    Hiển thị {(currentPage - 1) * itemsPerPage + 1} -{" "}
                    {Math.min(currentPage * itemsPerPage, totalItems)} trong
                    tổng số {totalItems}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-400" />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let page: number;
                      if (totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }
                      return (
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
                      );
                    })}
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
            </GlassCard>
          </AnimatedSection>
        )}
      </div>

      {/* View Modal */}
      <AnimatePresence>
        {isViewModalOpen && selectedMeasurement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsViewModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-charcoal border border-white/20 rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-light text-white">
                  Chi tiết số đo:{" "}
                  <span className="text-[var(--color-gold)]">
                    {selectedMeasurement.name}
                  </span>
                </h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Customer Info */}
              <div className="p-4 bg-white/5 rounded-lg mb-6">
                <h3 className="text-sm font-medium text-gray-400 mb-3">
                  Thông tin khách hàng
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-white">
                    <User className="w-4 h-4 text-gray-400" />
                    {selectedMeasurement.user.name}
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {selectedMeasurement.user.email}
                  </div>
                  {selectedMeasurement.user.phone && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {selectedMeasurement.user.phone}
                    </div>
                  )}
                </div>
              </div>

              {/* Measurements */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(selectedMeasurement.details).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="p-4 bg-white/5 rounded-lg text-center"
                    >
                      <p className="text-sm text-gray-400 mb-1">
                        {measurementLabels[key] || key}
                      </p>
                      <p className="text-xl font-medium text-white">
                        {value} cm
                      </p>
                    </div>
                  )
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 text-sm text-gray-400">
                <p>Tạo ngày: {formatDate(selectedMeasurement.createdAt)}</p>
                <p>Cập nhật: {formatDate(selectedMeasurement.updatedAt)}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && selectedMeasurement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsEditModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-charcoal border border-white/20 rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-light text-white">
                  Chỉnh sửa số đo
                </h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Name */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tên bộ số đo
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/10 text-white border border-white/20 rounded-lg focus:outline-none focus:border-[var(--color-gold)]"
                />
              </div>

              {/* Measurements */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {Object.entries(editFormData.details).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      {measurementLabels[key] || key} (cm)
                    </label>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          details: {
                            ...editFormData.details,
                            [key]: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg focus:outline-none focus:border-[var(--color-gold)]"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Hủy
                </Button>
                <Button variant="luxury" onClick={handleSaveEdit}>
                  <Save className="w-4 h-4" />
                  Lưu thay đổi
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
