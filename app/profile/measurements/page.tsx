"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
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

// Mock measurements data
type MeasurementData = {
  id: string;
  name: string;
  chest: number;
  waist: number;
  hips?: number;
  shoulders: number;
  sleeveLength?: number;
  inseam?: number;
  neck?: number;
  notes: string;
  createdAt: string;
};

const mockMeasurements: MeasurementData[] = [
  {
    id: "1",
    name: "Số đo Vest",
    chest: 96,
    waist: 82,
    hips: 98,
    shoulders: 44,
    sleeveLength: 62,
    inseam: 78,
    neck: 38,
    notes: "Số đo chuẩn cho vest công sở",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Số đo Sơ mi",
    chest: 94,
    waist: 80,
    shoulders: 43,
    sleeveLength: 61,
    neck: 38,
    notes: "",
    createdAt: "2024-02-01",
  },
];

type Measurement = {
  id?: string;
  name: string;
  chest: number | string;
  waist: number | string;
  hips?: number | string;
  shoulders: number | string;
  sleeveLength?: number | string;
  inseam?: number | string;
  neck?: number | string;
  notes?: string;
};

export default function MeasurementsPage() {
  const [measurements, setMeasurements] = useState(mockMeasurements);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Measurement>({
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

  const handleEdit = (measurement: (typeof mockMeasurements)[0]) => {
    setIsAdding(false);
    setEditingId(measurement.id);
    setFormData({
      name: measurement.name,
      chest: measurement.chest,
      waist: measurement.waist,
      hips: measurement.hips,
      shoulders: measurement.shoulders,
      sleeveLength: measurement.sleeveLength,
      inseam: measurement.inseam,
      neck: measurement.neck,
      notes: measurement.notes || "",
    });
  };

  const handleSave = () => {
    // TODO: Integrate with backend
    if (isAdding) {
      const timestamp = new Date().toISOString();
      const randomId = `temp-${timestamp}`;
      const newMeasurement: MeasurementData = {
        id: randomId,
        name: formData.name,
        chest: Number(formData.chest),
        waist: Number(formData.waist),
        hips: formData.hips ? Number(formData.hips) : undefined,
        shoulders: Number(formData.shoulders),
        sleeveLength: formData.sleeveLength
          ? Number(formData.sleeveLength)
          : undefined,
        inseam: formData.inseam ? Number(formData.inseam) : undefined,
        neck: formData.neck ? Number(formData.neck) : undefined,
        notes: formData.notes || "",
        createdAt: timestamp,
      };
      setMeasurements([...measurements, newMeasurement]);
    } else if (editingId) {
      setMeasurements(
        measurements.map((m) =>
          m.id === editingId
            ? {
                ...m,
                name: formData.name,
                chest: Number(formData.chest),
                waist: Number(formData.waist),
                hips: formData.hips ? Number(formData.hips) : undefined,
                shoulders: Number(formData.shoulders),
                sleeveLength: formData.sleeveLength
                  ? Number(formData.sleeveLength)
                  : undefined,
                inseam: formData.inseam ? Number(formData.inseam) : undefined,
                neck: formData.neck ? Number(formData.neck) : undefined,
                notes: formData.notes || "",
              }
            : m
        )
      );
    }
    handleCancel();
  };

  const handleDelete = (id: string) => {
    // TODO: Add confirmation dialog
    // TODO: Integrate with backend
    setMeasurements(measurements.filter((m) => m.id !== id));
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
                              formData[field.key as keyof Measurement] || ""
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
                          !formData.name ||
                          !formData.chest ||
                          !formData.waist ||
                          !formData.shoulders
                        }
                      >
                        <Save className="w-5 h-5" />
                        <span>{isAdding ? "Thêm số đo" : "Lưu thay đổi"}</span>
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
