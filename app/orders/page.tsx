"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GlassCard } from "@/components/ui/GlassCard";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  Calendar,
  MapPin,
  CreditCard,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  getMockOrders,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
} from "@/lib/mockData";

const statusConfig = {
  [OrderStatus.PENDING]: {
    label: "Chờ xác nhận",
    icon: Clock,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-300",
  },
  [OrderStatus.CONFIRMED]: {
    label: "Đã xác nhận",
    icon: CheckCircle,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-300",
  },
  [OrderStatus.IN_PRODUCTION]: {
    label: "Đang may",
    icon: Package,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-300",
  },
  [OrderStatus.READY_FOR_PICKUP]: {
    label: "Sẵn sàng lấy hàng",
    icon: CheckCircle,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
    borderColor: "border-indigo-300",
  },
  [OrderStatus.SHIPPING]: {
    label: "Đang giao hàng",
    icon: Truck,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
    borderColor: "border-indigo-300",
  },
  [OrderStatus.COMPLETED]: {
    label: "Hoàn thành",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100",
    borderColor: "border-green-300",
  },
  [OrderStatus.CANCELLED]: {
    label: "Đã hủy",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-100",
    borderColor: "border-red-300",
  },
};

const paymentMethodLabels = {
  [PaymentMethod.COD]: "Thanh toán khi nhận hàng",
  [PaymentMethod.STRIPE]: "Stripe",
  [PaymentMethod.SEPAY]: "Sepay",
};

const paymentStatusLabels = {
  [PaymentStatus.PENDING]: "Chờ thanh toán",
  [PaymentStatus.PAID]: "Đã thanh toán",
  [PaymentStatus.FAILED]: "Thanh toán thất bại",
  [PaymentStatus.REFUNDED]: "Đã hoàn tiền",
};

export default function OrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const allOrders = getMockOrders({
    status:
      selectedStatus !== "all" ? (selectedStatus as OrderStatus) : undefined,
    sortBy,
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const statusCounts = {
    all: getMockOrders().length,
    [OrderStatus.PENDING]: getMockOrders({ status: OrderStatus.PENDING })
      .length,
    [OrderStatus.CONFIRMED]: getMockOrders({ status: OrderStatus.CONFIRMED })
      .length,
    [OrderStatus.IN_PRODUCTION]: getMockOrders({
      status: OrderStatus.IN_PRODUCTION,
    }).length,
    [OrderStatus.SHIPPING]: getMockOrders({ status: OrderStatus.SHIPPING })
      .length,
    [OrderStatus.COMPLETED]: getMockOrders({ status: OrderStatus.COMPLETED })
      .length,
    [OrderStatus.CANCELLED]: getMockOrders({ status: OrderStatus.CANCELLED })
      .length,
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      {/* Hero */}
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-linear-to-br from-gray-900 to-black" />
        </div>

        <div className="container mx-auto px-6 lg:px-12">
          <AnimatedSection className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light mb-6 text-white">
              Đơn Hàng
              <br />
              <span className="text-yellow-600 italic">Của Bạn</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 font-light">
              Theo dõi trạng thái và quản lý đơn hàng của bạn
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8">
        <div className="container mx-auto px-6 lg:px-12">
          <GlassCard className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-100">
                  Trạng thái
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => setSelectedStatus("all")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedStatus === "all"
                        ? "bg-yellow-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    Tất cả ({statusCounts.all})
                  </button>
                  <button
                    onClick={() => setSelectedStatus(OrderStatus.PENDING)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedStatus === OrderStatus.PENDING
                        ? "bg-yellow-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    Chờ ({statusCounts[OrderStatus.PENDING]})
                  </button>
                  <button
                    onClick={() => setSelectedStatus(OrderStatus.IN_PRODUCTION)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedStatus === OrderStatus.IN_PRODUCTION
                        ? "bg-yellow-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    Đang may ({statusCounts[OrderStatus.IN_PRODUCTION]})
                  </button>
                  <button
                    onClick={() => setSelectedStatus(OrderStatus.SHIPPING)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedStatus === OrderStatus.SHIPPING
                        ? "bg-yellow-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    Đang giao ({statusCounts[OrderStatus.SHIPPING]})
                  </button>
                  <button
                    onClick={() => setSelectedStatus(OrderStatus.COMPLETED)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedStatus === OrderStatus.COMPLETED
                        ? "bg-yellow-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    Hoàn thành ({statusCounts[OrderStatus.COMPLETED]})
                  </button>
                  <button
                    onClick={() => setSelectedStatus(OrderStatus.CANCELLED)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedStatus === OrderStatus.CANCELLED
                        ? "bg-yellow-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    Đã hủy ({statusCounts[OrderStatus.CANCELLED]})
                  </button>
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-100">
                  Sắp xếp
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 transition-colors"
                >
                  <option value="date-desc">Mới nhất</option>
                  <option value="date-asc">Cũ nhất</option>
                  <option value="amount-desc">Giá cao nhất</option>
                  <option value="amount-asc">Giá thấp nhất</option>
                </select>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Orders List */}
      <section className="py-8">
        <div className="container mx-auto px-6 lg:px-12">
          {allOrders.length === 0 ? (
            <AnimatedSection>
              <GlassCard className="p-12 text-center">
                <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-medium text-gray-100 mb-2">
                  Không tìm thấy đơn hàng
                </h3>
                <p className="text-gray-400">
                  {selectedStatus === "all"
                    ? "Bạn chưa có đơn hàng nào"
                    : "Không có đơn hàng nào với trạng thái này"}
                </p>
              </GlassCard>
            </AnimatedSection>
          ) : (
            <div className="space-y-6">
              {allOrders.map((order, index) => {
                const status = statusConfig[order.status];
                const StatusIcon = status.icon;
                const isExpanded = expandedOrderId === order.id;

                return (
                  <AnimatedSection key={order.id} delay={index * 0.1}>
                    <GlassCard className="overflow-hidden">
                      {/* Order Header */}
                      <div
                        className="p-6 cursor-pointer hover:bg-gray-800/30 transition-colors"
                        onClick={() => toggleOrderDetails(order.id)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-xl font-medium text-gray-100">
                                {order.orderNumber}
                              </h3>
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${status.bgColor} ${status.color} border ${status.borderColor}`}
                              >
                                <StatusIcon className="w-4 h-4" />
                                {status.label}
                              </span>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-2 text-sm text-gray-400">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Ngày đặt: {formatDate(order.createdAt)}
                              </div>
                              {order.estimatedDelivery && (
                                <div className="flex items-center gap-2">
                                  <Truck className="w-4 h-4" />
                                  Dự kiến: {formatDate(order.estimatedDelivery)}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-2xl font-medium text-yellow-600 mb-2">
                              {formatPrice(order.totalAmount)}
                            </div>
                            <button className="text-gray-400 hover:text-gray-200 transition-colors">
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5" />
                              ) : (
                                <ChevronDown className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Order Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-gray-700 p-6 space-y-6">
                              {/* Items */}
                              <div>
                                <h4 className="text-lg font-medium text-gray-100 mb-4">
                                  Sản phẩm
                                </h4>
                                <div className="space-y-4">
                                  {order.items.map((item) => (
                                    <div
                                      key={item.id}
                                      className="flex gap-4 p-4 bg-gray-800/30 rounded-lg"
                                    >
                                      <div className="relative w-20 h-20 shrink-0">
                                        <Image
                                          src={item.productImage}
                                          alt={item.productName}
                                          fill
                                          className="object-cover rounded"
                                        />
                                      </div>
                                      <div className="flex-1">
                                        <h5 className="font-medium text-gray-100 mb-1">
                                          {item.productName}
                                        </h5>
                                        <div className="text-sm text-gray-400 space-y-0.5">
                                          <p>Vải: {item.fabricName}</p>
                                          <p>
                                            Phong cách:{" "}
                                            {item.styleNames.join(", ")}
                                          </p>
                                          <p>Số đo: {item.measurementName}</p>
                                          <p>Số lượng: {item.quantity}</p>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-lg font-medium text-yellow-600">
                                          {formatPrice(item.subtotal)}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Payment & Shipping Info */}
                              <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                  <h4 className="text-lg font-medium text-gray-100 mb-3">
                                    Thanh toán
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-gray-300">
                                      <CreditCard className="w-4 h-4" />
                                      {paymentMethodLabels[order.paymentMethod]}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span
                                        className={`px-2 py-1 rounded text-xs font-medium ${
                                          order.paymentStatus ===
                                          PaymentStatus.PAID
                                            ? "bg-green-100 text-green-800"
                                            : order.paymentStatus ===
                                              PaymentStatus.PENDING
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                      >
                                        {
                                          paymentStatusLabels[
                                            order.paymentStatus
                                          ]
                                        }
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {order.shippingAddress && (
                                  <div>
                                    <h4 className="text-lg font-medium text-gray-100 mb-3">
                                      Địa chỉ giao hàng
                                    </h4>
                                    <div className="flex items-start gap-2 text-sm text-gray-300">
                                      <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                                      <span>{order.shippingAddress}</span>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Notes */}
                              {order.notes && (
                                <div>
                                  <h4 className="text-lg font-medium text-gray-100 mb-3">
                                    Ghi chú
                                  </h4>
                                  <p className="text-sm text-gray-400 bg-gray-800/30 p-4 rounded-lg">
                                    {order.notes}
                                  </p>
                                </div>
                              )}

                              {/* Actions */}
                              <div className="flex gap-3 pt-4 border-t border-gray-700">
                                <Link href={`/orders/${order.id}`}>
                                  <button className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                                    Xem chi tiết
                                  </button>
                                </Link>
                                {order.status === OrderStatus.PENDING && (
                                  <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                    Hủy đơn hàng
                                  </button>
                                )}
                                {order.status === OrderStatus.COMPLETED && (
                                  <button className="px-6 py-2 bg-gray-700 text-gray-100 rounded-lg hover:bg-gray-600 transition-colors">
                                    Mua lại
                                  </button>
                                )}
                                <button className="px-6 py-2 bg-gray-700 text-gray-100 rounded-lg hover:bg-gray-600 transition-colors">
                                  Liên hệ hỗ trợ
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </GlassCard>
                  </AnimatedSection>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
