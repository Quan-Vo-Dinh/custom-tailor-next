"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
  Ruler,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  ChevronLeft,
  AlertCircle,
} from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  getMeasurements,
  createMeasurement,
  updateMeasurement,
  deleteMeasurement,
} from "@/services/users";
import type { Measurement } from "@/types";

export default function MeasurementsPage() {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    chest: "",
    waist: "",
    hips: "",
    shoulders: "",
    sleeveLength: "",
    inseam: "",
    neck: "",
    notes: "",
  });

  useEffect(() => {
    const loadMeasurements = async () => {
      try {
        setLoading(true);
        const data = await getMeasurements();
        setMeasurements(data);
      } catch (error: any) {
        console.error("Failed to load measurements:", error);
        toast.error("Không thể tải danh sách số đo");
        setMeasurements([]);
      } finally {
        setLoading(false);
      }
    };

    loadMeasurements();
  }, []);

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({
      name: "",
      chest: "",
      waist: "",
      hips: "",
      shoulders: "",
      sleeveLength: "",
      inseam: "",
      neck: "",
      notes: "",
    });
  };

  const handleEdit = (measurement: Measurement) => {
    setIsAdding(false);
    setEditingId(measurement.id || "");
    setFormData({
      name: measurement.name,
      chest: measurement.chest?.toString() || "",
      waist: measurement.waist?.toString() || "",
      hips: measurement.hips?.toString() || "",
      shoulders: measurement.shoulders?.toString() || "",
      sleeveLength: measurement.sleeveLength?.toString() || "",
      inseam: measurement.inseam?.toString() || "",
      neck: measurement.neck?.toString() || "",
      notes: measurement.notes || "",
    });
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.chest || !formData.waist || !formData.shoulders) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc");
      return;
    }

    setSubmitting(true);
    try {
      const details: Record<string, any> = {
        chest: Number(formData.chest),
        waist: Number(formData.waist),
        shoulders: Number(formData.shoulders),
      };
      
      if (formData.hips) details.hips = Number(formData.hips);
      if (formData.sleeveLength) details.sleeveLength = Number(formData.sleeveLength);
      if (formData.inseam) details.inseam = Number(formData.inseam);
      if (formData.neck) details.neck = Number(formData.neck);
      if (formData.notes) details.notes = formData.notes;

      if (isAdding) {
        const newMeasurement = await createMeasurement({
          name: formData.name,
          details,
        });
      setMeasurements([...measurements, newMeasurement]);
        toast.success("Thêm số đo thành công!");
    } else if (editingId) {
        const updatedMeasurement = await updateMeasurement(editingId, {
          name: formData.name,
          details,
        });
      setMeasurements(
          measurements.map((m) => (m.id === editingId ? updatedMeasurement : m))
        );
        toast.success("Cập nhật số đo thành công!");
    }
    handleCancel();
    } catch (error: any) {
      toast.error(error.message || "Thao tác thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa số đo này?")) {
      return;
    }

    try {
      await deleteMeasurement(id);
    setMeasurements(measurements.filter((m) => m.id !== id));
      toast.success("Xóa số đo thành công!");
    } catch (error: any) {
      toast.error(error.message || "Xóa số đo thất bại");
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      name: "",
      chest: "",
      waist: "",
      hips: "",
      shoulders: "",
      sleeveLength: "",
      inseam: "",
      neck: "",
      notes: "",
    });
  };

  const measurementFields = [
    { key: "chest", label: "Vòng ngực (cm)", required: true },
    { key: "waist", label: "Vòng eo (cm)", required: true },
    { key: "hips", label: "Vòng mông (cm)", required: false },
    { key: "shoulders", label: "Vai (cm)", required: true },
    { key: "sleeveLength", label: "Dài tay (cm)", required: false },
    { key: "inseam", label: "Dài quần (cm)", required: false },
    { key: "neck", label: "Vòng cổ (cm)", required: false },
  ];

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
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Quay lại Tài khoản</span>
          </Link>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-light mb-2">
                Quản Lý <span className="text-luxury italic">Số Đo</span>
              </h1>
              <p className="text-gray-400">
                Lưu trữ và quản lý các bộ số đo của bạn
              </p>
            </div>
            {!isAdding && !editingId && (
              <Button variant="luxury" size="lg" onClick={handleAdd}>
                <Plus className="w-5 h-5" />
                <span>Thêm số đo mới</span>
              </Button>
            )}
          </div>
        </AnimatedSection>

        {/* Add/Edit Form */}
        <AnimatePresence>
          {(isAdding || editingId) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatedSection delay={0.1} className="mb-8">
                <GlassCard className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-light text-white">
                      {isAdding ? "Thêm số đo mới" : "Chỉnh sửa số đo"}
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Tên bộ số đo <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors"
                        placeholder="Ví dụ: Số đo Vest, Số đo Sơ mi..."
                      />
                    </div>

                    {/* Measurements Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {measurementFields.map((field) => (
                        <div key={field.key}>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            {field.label}{" "}
                            {field.required && (
                              <span className="text-red-500">*</span>
                            )}
                          </label>
                          <input
                            type="number"
                            value={
                              formData[field.key as keyof typeof formData] || ""
                            }
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                [field.key]: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors"
                            placeholder="96"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Ghi chú
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData({ ...formData, notes: e.target.value })
                        }
                        rows={3}
                        className="w-full px-4 py-3 bg-white/10 text-white placeholder-gray-500 border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors resize-none"
                        placeholder="Thêm ghi chú về bộ số đo này..."
                      />
                    </div>

                    {/* Info */}
                    <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                      <div className="text-sm text-blue-300">
                        <strong>Lưu ý:</strong> Các số đo được tính bằng
                        centimet (cm). Hãy đo cẩn thận để đảm bảo độ chính xác.
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="luxury"
                        onClick={handleSave}
                        className="flex-1"
                        disabled={
                          submitting ||
                          !formData.name ||
                          !formData.chest ||
                          !formData.waist ||
                          !formData.shoulders
                        }
                      >
                        {submitting ? (
                          <>
                            <LoadingSpinner />
                            <span>Đang lưu...</span>
                          </>
                        ) : (
                          <>
                        <Save className="w-5 h-5" />
                        <span>{isAdding ? "Thêm số đo" : "Lưu thay đổi"}</span>
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                      >
                        <X className="w-5 h-5" />
                        <span>Hủy</span>
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              </AnimatedSection>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Measurements List */}
        {measurements.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {measurements.map((measurement, index) => (
              <AnimatedSection key={measurement.id} delay={0.1 * (index + 1)}>
                <GlassCard className="p-6 hover:border-(--color-gold)/50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-(--color-gold)/10 flex items-center justify-center">
                        <Ruler className="w-6 h-6 text-(--color-gold)" />
                      </div>
                      <div>
                        <h3 className="text-xl font-medium text-white">
                          {measurement.name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          Tạo ngày{" "}
                          {new Date(measurement.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(measurement)}
                        className="p-2 hover:bg-(--color-gold)/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-5 h-5 text-(--color-gold)" />
                      </button>
                      <button
                        onClick={() => handleDelete(measurement.id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-5 h-5 text-red-400" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-white/10">
                      <span className="text-gray-400">Vòng ngực:</span>
                      <span className="text-white font-medium">
                        {measurement.chest} cm
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/10">
                      <span className="text-gray-400">Vòng eo:</span>
                      <span className="text-white font-medium">
                        {measurement.waist} cm
                      </span>
                    </div>
                    {measurement.hips && (
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-gray-400">Vòng mông:</span>
                        <span className="text-white font-medium">
                          {measurement.hips} cm
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 border-b border-white/10">
                      <span className="text-gray-400">Vai:</span>
                      <span className="text-white font-medium">
                        {measurement.shoulders} cm
                      </span>
                    </div>
                    {measurement.sleeveLength && (
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-gray-400">Dài tay:</span>
                        <span className="text-white font-medium">
                          {measurement.sleeveLength} cm
                        </span>
                      </div>
                    )}
                    {measurement.inseam && (
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-gray-400">Dài quần:</span>
                        <span className="text-white font-medium">
                          {measurement.inseam} cm
                        </span>
                      </div>
                    )}
                    {measurement.neck && (
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-gray-400">Vòng cổ:</span>
                        <span className="text-white font-medium">
                          {measurement.neck} cm
                        </span>
                      </div>
                    )}
                  </div>

                  {measurement.notes && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-sm text-gray-400">
                        <span className="font-medium">Ghi chú:</span>{" "}
                        {measurement.notes}
                      </p>
                    </div>
                  )}
                </GlassCard>
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <AnimatedSection delay={0.2}>
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-(--color-gold)/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Ruler className="w-10 h-10 text-(--color-gold)" />
              </div>
              <h3 className="text-2xl font-light text-white mb-2">
                Chưa có số đo nào
              </h3>
              <p className="text-gray-400 mb-6">
                Thêm số đo đầu tiên để bắt đầu đặt hàng
              </p>
              <Button variant="luxury" size="lg" onClick={handleAdd}>
                <Plus className="w-5 h-5" />
                <span>Thêm số đo mới</span>
              </Button>
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}
