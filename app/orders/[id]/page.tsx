"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-hot-toast";
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
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { getOrderById, cancelOrder, createReview } from "@/services/orders";
import { OrderStatus, Order } from "@/types";
import { formatOrderCode, formatDateTime } from "@/lib/utils";

type ReviewForm = {
  rating: number;
  comment: string;
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [reviewForm, setReviewForm] = useState<ReviewForm>({
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        const orderData = await getOrderById(orderId);
        setOrder(orderData);
      } catch (err: any) {
        console.error("Failed to load order:", err);
        setError(err.message || "Không thể tải thông tin đơn hàng");
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const handleSubmitReview = async () => {
    if (!order || reviewForm.comment.length < 10) {
      toast.error("Vui lòng nhập đánh giá ít nhất 10 ký tự");
      return;
    }

    try {
      await createReview({
        orderId: order.id,
        productId: order.items[0]?.productId || "",
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      toast.success("Đánh giá thành công!");
      setShowReviewForm(false);
      setReviewForm({ rating: 5, comment: "" });
      // Reload order to get updated review
      const updatedOrder = await getOrderById(orderId);
      setOrder(updatedOrder);
    } catch (err: any) {
      toast.error(err.message || "Đánh giá thất bại");
    } finally {
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;

    try {
      await cancelOrder(order.id);
      toast.success("Hủy đơn hàng thành công!");
      setShowCancelDialog(false);
      // Reload order to get updated status
      const updatedOrder = await getOrderById(orderId);
      setOrder(updatedOrder);
    } catch (err: any) {
      toast.error(err.message || "Hủy đơn hàng thất bại");
    } finally {
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <GlassCard className="p-12 text-center max-w-2xl mx-auto">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-light mb-4 text-white">Lỗi</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Button variant="luxury" onClick={() => router.push("/orders")}>
            Quay lại danh sách đơn hàng
          </Button>
        </GlassCard>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  // Check if order can be cancelled (only PENDING or CONFIRMED status)
  const canCancelOrder =
    order.status === OrderStatus.PENDING ||
    order.status === OrderStatus.CONFIRMED;

  // Generate timeline from order status
  const generateTimeline = (order: Order) => {
    const statuses = [
      { status: OrderStatus.PENDING, label: "Đang chờ xác nhận" },
      { status: OrderStatus.CONFIRMED, label: "Đã xác nhận" },
      { status: OrderStatus.IN_PRODUCTION, label: "Đang sản xuất" },
      { status: OrderStatus.SHIPPING, label: "Đang giao hàng" },
      { status: OrderStatus.COMPLETED, label: "Hoàn thành" },
    ];

    const currentStatusIndex = statuses.findIndex(
      (s) => s.status === order.status
    );

    return statuses.map((statusItem, index) => {
      const completed = index <= currentStatusIndex;
      let timestamp: string | null = null;

      if (completed) {
        if (index === 0) {
          timestamp = order.createdAt.toString();
        } else if (index === statuses.length - 1 && order.completedAt) {
          timestamp = order.completedAt.toString();
        } else {
          timestamp = order.updatedAt.toString();
        }
      }

      return {
        status: statusItem.status,
        label: statusItem.label,
        timestamp,
        completed,
      };
    });
  };

  const timeline = generateTimeline(order);

  // Get first item for display (guard when items missing)
  const firstItem = order.items?.[0];
  const displayProduct = firstItem?.product || (order as any).product;
  const displayFabric = firstItem?.fabric || (order as any).fabric;
  const displayStyle = firstItem?.style || (order as any).style;
  const displayMeasurement =
    firstItem?.measurement || (order as any).measurement;

  const getStatusColor = (status: string) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "text-yellow-400";
      case OrderStatus.CONFIRMED:
        return "text-blue-400";
      case OrderStatus.IN_PRODUCTION:
        return "text-purple-400";
      case OrderStatus.SHIPPING:
        return "text-orange-400";
      case OrderStatus.COMPLETED:
        return "text-green-400";
      case OrderStatus.CANCELLED:
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      [OrderStatus.PENDING]: "Đang chờ xác nhận",
      [OrderStatus.CONFIRMED]: "Đã xác nhận",
      [OrderStatus.IN_PRODUCTION]: "Đang sản xuất",
      [OrderStatus.SHIPPING]: "Đang giao hàng",
      [OrderStatus.COMPLETED]: "Hoàn thành",
      [OrderStatus.CANCELLED]: "Đã hủy",
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
                <span>Mã đơn: {formatOrderCode(order.id)}</span>
                <span>•</span>
                <span className={getStatusColor(order.status)}>
                  {getStatusLabel(order.status)}
                </span>
              </div>
            </div>
            {canCancelOrder && (
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
                  {timeline.map((item, index) => (
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
                        {index < timeline.length - 1 && (
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
                            {formatDateTime(item.timestamp)}
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
                  {displayProduct && (
                    <>
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-white/5 shrink-0">
                        <Image
                          src={
                            displayProduct.images?.[0] ||
                            (displayProduct as any).image ||
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%23f3f4f6' width='800' height='600'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='24' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EProduct%3C/text%3E%3C/svg%3E"
                          }
                          alt={displayProduct.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-medium text-white mb-2">
                          {displayProduct.name}
                        </h3>
                        <p className="text-gray-400 mb-4">
                          {displayProduct.category}
                        </p>

                        <div className="space-y-3">
                          {displayFabric && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-300 mb-2">
                                Chất liệu:
                              </h4>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-white">
                                  {displayFabric.name}
                                </span>
                                <span className="text-gray-500">•</span>
                                <span className="text-gray-400">
                                  {displayFabric.material}
                                </span>
                                <span className="text-gray-500">•</span>
                                <span className="text-gray-400">
                                  {displayFabric.color}
                                </span>
                              </div>
                            </div>
                          )}

                          {displayStyle && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-300 mb-2">
                                Phong cách:
                              </h4>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Tên:</span>
                                  <span className="text-white">
                                    {displayStyle.name ||
                                      (displayStyle as any).lapelType ||
                                      "N/A"}
                                  </span>
                                </div>
                                {(displayStyle as any).buttonStyle && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">
                                      Nút áo:
                                    </span>
                                    <span className="text-white">
                                      {(displayStyle as any).buttonStyle}
                                    </span>
                                  </div>
                                )}
                                {(displayStyle as any).pocketStyle && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Túi:</span>
                                    <span className="text-white">
                                      {(displayStyle as any).pocketStyle}
                                    </span>
                                  </div>
                                )}
                                {(displayStyle as any).vents && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">
                                      Xẻ tà:
                                    </span>
                                    <span className="text-white">
                                      {(displayStyle as any).vents}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
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
                {displayMeasurement ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {displayMeasurement.name && (
                      <div className="col-span-full text-center p-4 bg-white/5 rounded-lg border border-(--color-gold)/30 mb-4">
                        <p className="text-sm text-gray-400 mb-1">Bộ số đo</p>
                        <p className="text-lg font-medium text-(--color-gold)">
                          {displayMeasurement.name}
                        </p>
                      </div>
                    )}
                    {displayMeasurement.chest && (
                      <div className="text-center p-4 bg-white/5 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Vòng ngực</p>
                        <p className="text-lg font-medium text-white">
                          {displayMeasurement.chest} cm
                        </p>
                      </div>
                    )}
                    {displayMeasurement.waist && (
                      <div className="text-center p-4 bg-white/5 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Vòng eo</p>
                        <p className="text-lg font-medium text-white">
                          {displayMeasurement.waist} cm
                        </p>
                      </div>
                    )}
                    {displayMeasurement.hips && (
                      <div className="text-center p-4 bg-white/5 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Vòng mông</p>
                        <p className="text-lg font-medium text-white">
                          {displayMeasurement.hips} cm
                        </p>
                      </div>
                    )}
                    {displayMeasurement.shoulders && (
                      <div className="text-center p-4 bg-white/5 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Vai</p>
                        <p className="text-lg font-medium text-white">
                          {displayMeasurement.shoulders} cm
                        </p>
                      </div>
                    )}
                    {displayMeasurement.sleeveLength && (
                      <div className="text-center p-4 bg-white/5 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Dài tay</p>
                        <p className="text-lg font-medium text-white">
                          {displayMeasurement.sleeveLength} cm
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-400">
                    <p>Không có thông tin số đo cho đơn hàng này</p>
                  </div>
                )}
              </GlassCard>
            </AnimatedSection>

            {/* Review Section */}
            {order.status === OrderStatus.COMPLETED &&
              !(order as any).review && (
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

            {(order as any).review && (
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
                            star <= ((order as any).review?.rating || 0)
                              ? "fill-(--color-gold) text-(--color-gold)"
                              : "text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-300">
                      {(order as any).review?.comment}
                    </p>
                    <p className="text-sm text-gray-500">
                      Đã đánh giá ngày{" "}
                      {new Date(
                        (order as any).review?.createdAt || ""
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
                        order.totalAmount - (displayFabric?.price || 0)
                      ).toLocaleString()}{" "}
                      đ
                    </span>
                  </div>
                  {displayFabric && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Vải:</span>
                      <span className="text-white">
                        {(displayFabric.price || 0).toLocaleString()} đ
                      </span>
                    </div>
                  )}
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
                  {order.shippingAddress ? (
                    <div>
                      <p className="text-white">{order.shippingAddress}</p>
                    </div>
                  ) : (order as any).shipping ? (
                    <>
                      <div>
                        <p className="text-white font-medium">
                          {(order as any).shipping.fullName}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Số điện thoại:</p>
                        <p className="text-white">
                          {(order as any).shipping.phone}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Email:</p>
                        <p className="text-white">
                          {(order as any).shipping.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Địa chỉ:</p>
                        <p className="text-white">
                          {(order as any).shipping.address},{" "}
                          {(order as any).shipping.ward},{" "}
                          {(order as any).shipping.district},{" "}
                          {(order as any).shipping.city}
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-400">Chưa có thông tin địa chỉ</p>
                  )}
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
