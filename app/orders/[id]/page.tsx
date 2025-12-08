"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  Package,
  MapPin,
  Ruler,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

// Mock order data
const mockOrder = {
  id: "ORD-2024-001",
  status: "Completed",
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-02-01T14:20:00Z",
  totalAmount: 4500000,
  product: {
    id: "1",
    name: "Vest Truyền Thống",
    image: "/images/products/vest-1.jpg",
    category: "Vest",
  },
  fabric: {
    name: "Vải Wool Ý Premium",
    material: "100% Wool",
    color: "Navy Blue",
    price: 1200000,
  },
  style: {
    lapelType: "Notch Lapel",
    buttonStyle: "2 Buttons",
    pocketStyle: "Flap Pockets",
    vents: "Double Vents",
  },
  measurement: {
    name: "Số đo Vest",
    chest: 96,
    waist: 82,
    hips: 98,
    shoulders: 44,
    sleeveLength: 62,
  },
  shipping: {
    fullName: "Nguyễn Văn A",
    phone: "0901234567",
    email: "nguyenvana@example.com",
    address: "123 Đường ABC",
    ward: "Phường 1",
    district: "Quận 1",
    city: "TP. Hồ Chí Minh",
  },
  timeline: [
    {
      status: "Pending",
      label: "Đang chờ xác nhận",
      timestamp: "2024-01-15T10:30:00Z",
      completed: true,
    },
    {
      status: "Confirmed",
      label: "Đã xác nhận",
      timestamp: "2024-01-15T14:00:00Z",
      completed: true,
    },
    {
      status: "In_Production",
      label: "Đang sản xuất",
      timestamp: "2024-01-18T09:00:00Z",
      completed: true,
    },
    {
      status: "Shipping",
      label: "Đang giao hàng",
      timestamp: "2024-01-28T10:00:00Z",
      completed: true,
    },
    {
      status: "Completed",
      label: "Hoàn thành",
      timestamp: "2024-02-01T14:20:00Z",
      completed: true,
    },
  ],
  review: null as { rating: number; comment: string; createdAt: string } | null,
  canCancel: false,
};

type ReviewForm = {
  rating: number;
  comment: string;
};

export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [order] = useState(mockOrder);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [reviewForm, setReviewForm] = useState<ReviewForm>({
    rating: 5,
    comment: "",
  });

  const handleSubmitReview = () => {
    // TODO: Integrate with backend
    console.log("Submit review:", reviewForm);
    setShowReviewForm(false);
  };

  const handleCancelOrder = () => {
    // TODO: Integrate with backend
    console.log("Cancel order:", params.id);
    setShowCancelDialog(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "text-yellow-400";
      case "Confirmed":
        return "text-blue-400";
      case "In_Production":
        return "text-purple-400";
      case "Shipping":
        return "text-orange-400";
      case "Completed":
        return "text-green-400";
      case "Cancelled":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      Pending: "Đang chờ xác nhận",
      Confirmed: "Đã xác nhận",
      In_Production: "Đang sản xuất",
      Shipping: "Đang giao hàng",
      Completed: "Hoàn thành",
      Cancelled: "Đã hủy",
    };
    return labels[status] || status;
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <AnimatedSection className="mb-12">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Quay lại Đơn hàng</span>
          </Link>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-light mb-2">
                Chi Tiết <span className="text-luxury italic">Đơn Hàng</span>
              </h1>
              <div className="flex items-center gap-4 text-gray-400">
                <span>Mã đơn: {order.id}</span>
                <span>•</span>
                <span className={getStatusColor(order.status)}>
                  {getStatusLabel(order.status)}
                </span>
              </div>
            </div>
            {order.canCancel && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowCancelDialog(true)}
                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                <XCircle className="w-5 h-5" />
                <span>Hủy đơn hàng</span>
              </Button>
            )}
          </div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Timeline */}
            <AnimatedSection delay={0.1}>
              <GlassCard className="p-8">
                <h2 className="text-2xl font-light text-white mb-6 flex items-center gap-3">
                  <Clock className="w-6 h-6 text-(--color-gold)" />
                  Trạng thái đơn hàng
                </h2>
                <div className="relative">
                  {order.timeline.map((item, index) => (
                    <div
                      key={item.status}
                      className="flex gap-4 pb-8 last:pb-0"
                    >
                      <div className="relative flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                            item.completed ? "bg-(--color-gold)" : "bg-white/10"
                          }`}
                        >
                          {item.completed ? (
                            <CheckCircle className="w-5 h-5 text-charcoal" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-white/50" />
                          )}
                        </div>
                        {index < order.timeline.length - 1 && (
                          <div
                            className={`w-0.5 h-full absolute top-10 ${
                              item.completed
                                ? "bg-(--color-gold)"
                                : "bg-white/10"
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 pt-1">
                        <h3
                          className={`font-medium mb-1 ${
                            item.completed ? "text-white" : "text-gray-400"
                          }`}
                        >
                          {item.label}
                        </h3>
                        {item.timestamp && (
                          <p className="text-sm text-gray-500">
                            {new Date(item.timestamp).toLocaleString("vi-VN", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </AnimatedSection>

            {/* Product Info */}
            <AnimatedSection delay={0.2}>
              <GlassCard className="p-8">
                <h2 className="text-2xl font-light text-white mb-6 flex items-center gap-3">
                  <Package className="w-6 h-6 text-(--color-gold)" />
                  Thông tin sản phẩm
                </h2>
                <div className="flex gap-6">
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-white/5 shrink-0">
                    <Image
                      src={order.product.image}
                      alt={order.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-medium text-white mb-2">
                      {order.product.name}
                    </h3>
                    <p className="text-gray-400 mb-4">
                      {order.product.category}
                    </p>

                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-2">
                          Chất liệu:
                        </h4>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-white">
                            {order.fabric.name}
                          </span>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-400">
                            {order.fabric.material}
                          </span>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-400">
                            {order.fabric.color}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-2">
                          Phong cách:
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Loại ve:</span>
                            <span className="text-white">
                              {order.style.lapelType}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Nút áo:</span>
                            <span className="text-white">
                              {order.style.buttonStyle}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Túi:</span>
                            <span className="text-white">
                              {order.style.pocketStyle}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Xẻ tà:</span>
                            <span className="text-white">
                              {order.style.vents}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </AnimatedSection>

            {/* Measurement */}
            <AnimatedSection delay={0.3}>
              <GlassCard className="p-8">
                <h2 className="text-2xl font-light text-white mb-6 flex items-center gap-3">
                  <Ruler className="w-6 h-6 text-(--color-gold)" />
                  Số đo sử dụng
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Vòng ngực</p>
                    <p className="text-lg font-medium text-white">
                      {order.measurement.chest} cm
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Vòng eo</p>
                    <p className="text-lg font-medium text-white">
                      {order.measurement.waist} cm
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Vòng mông</p>
                    <p className="text-lg font-medium text-white">
                      {order.measurement.hips} cm
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Vai</p>
                    <p className="text-lg font-medium text-white">
                      {order.measurement.shoulders} cm
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Dài tay</p>
                    <p className="text-lg font-medium text-white">
                      {order.measurement.sleeveLength} cm
                    </p>
                  </div>
                </div>
              </GlassCard>
            </AnimatedSection>

            {/* Review Section */}
            {order.status === "Completed" && !order.review && (
              <AnimatedSection delay={0.4}>
                <GlassCard className="p-8">
                  <h2 className="text-2xl font-light text-white mb-6 flex items-center gap-3">
                    <Star className="w-6 h-6 text-(--color-gold)" />
                    Đánh giá đơn hàng
                  </h2>

                  {!showReviewForm ? (
                    <div className="text-center py-6">
                      <p className="text-gray-400 mb-6">
                        Bạn chưa đánh giá đơn hàng này
                      </p>
                      <Button
                        variant="luxury"
                        onClick={() => setShowReviewForm(true)}
                      >
                        <MessageSquare className="w-5 h-5" />
                        <span>Viết đánh giá</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Star Rating */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                          Đánh giá của bạn
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() =>
                                setReviewForm({ ...reviewForm, rating: star })
                              }
                              className="cursor-pointer transition-transform hover:scale-110"
                            >
                              <Star
                                className={`w-8 h-8 ${
                                  star <= reviewForm.rating
                                    ? "fill-(--color-gold) text-(--color-gold)"
                                    : "text-gray-600"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Comment */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Nhận xét của bạn
                        </label>
                        <textarea
                          value={reviewForm.comment}
                          onChange={(e) =>
                            setReviewForm({
                              ...reviewForm,
                              comment: e.target.value,
                            })
                          }
                          rows={5}
                          className="w-full px-4 py-3 bg-white/10 text-white placeholder-gray-500 border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors resize-none"
                          placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm và dịch vụ..."
                        />
                      </div>

                      {/* Actions */}
                      <div className="flex gap-4">
                        <Button
                          variant="luxury"
                          onClick={handleSubmitReview}
                          className="flex-1"
                          disabled={!reviewForm.comment.trim()}
                        >
                          Gửi đánh giá
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowReviewForm(false)}
                        >
                          Hủy
                        </Button>
                      </div>
                    </div>
                  )}
                </GlassCard>
              </AnimatedSection>
            )}

            {order.review && (
              <AnimatedSection delay={0.4}>
                <GlassCard className="p-8">
                  <h2 className="text-2xl font-light text-white mb-6 flex items-center gap-3">
                    <Star className="w-6 h-6 text-(--color-gold)" />
                    Đánh giá của bạn
                  </h2>
                  <div className="space-y-4">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= (order.review?.rating || 0)
                              ? "fill-(--color-gold) text-(--color-gold)"
                              : "text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-300">{order.review?.comment}</p>
                    <p className="text-sm text-gray-500">
                      Đã đánh giá ngày{" "}
                      {new Date(
                        order.review?.createdAt || ""
                      ).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </GlassCard>
              </AnimatedSection>
            )}
          </div>

          {/* Right Column - Summary & Shipping */}
          <div className="lg:col-span-1 space-y-8">
            {/* Order Summary */}
            <AnimatedSection delay={0.1}>
              <GlassCard className="p-6">
                <h3 className="text-xl font-light text-white mb-6">
                  Tóm tắt đơn hàng
                </h3>
                <div className="space-y-3 pb-4 border-b border-white/10">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Sản phẩm:</span>
                    <span className="text-white">
                      {(
                        order.totalAmount - order.fabric.price
                      ).toLocaleString()}{" "}
                      đ
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Vải:</span>
                    <span className="text-white">
                      {order.fabric.price.toLocaleString()} đ
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Phí vận chuyển:</span>
                    <span className="text-green-400">Miễn phí</span>
                  </div>
                </div>
                <div className="flex justify-between pt-4">
                  <span className="text-lg font-medium text-white">
                    Tổng cộng:
                  </span>
                  <span className="text-2xl font-medium text-(--color-gold)">
                    {order.totalAmount.toLocaleString()} đ
                  </span>
                </div>
              </GlassCard>
            </AnimatedSection>

            {/* Shipping Info */}
            <AnimatedSection delay={0.2}>
              <GlassCard className="p-6">
                <h3 className="text-xl font-light text-white mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-(--color-gold)" />
                  Địa chỉ giao hàng
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-white font-medium">
                      {order.shipping.fullName}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Số điện thoại:</p>
                    <p className="text-white">{order.shipping.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Email:</p>
                    <p className="text-white">{order.shipping.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Địa chỉ:</p>
                    <p className="text-white">
                      {order.shipping.address}, {order.shipping.ward},{" "}
                      {order.shipping.district}, {order.shipping.city}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </AnimatedSection>
          </div>
        </div>
      </div>

      {/* Cancel Dialog */}
      <AnimatePresence>
        {showCancelDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowCancelDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <GlassCard className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  </div>
                  <h3 className="text-2xl font-light text-white">
                    Xác nhận hủy đơn
                  </h3>
                </div>
                <p className="text-gray-400 mb-6">
                  Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không
                  thể hoàn tác.
                </p>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={handleCancelOrder}
                    className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    Xác nhận hủy
                  </Button>
                  <Button
                    variant="luxury"
                    onClick={() => setShowCancelDialog(false)}
                    className="flex-1"
                  >
                    Giữ đơn hàng
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
