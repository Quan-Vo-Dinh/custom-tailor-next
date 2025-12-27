"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  Package,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Ruler,
  CheckCircle,
  Clock,
  Truck,
  AlertCircle,
} from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  getAdminOrderById,
  updateOrderStatusAdmin,
  assignStaffToOrder,
} from "@/services/orders";
import { Order, OrderStatus } from "@/types";

const statusConfig: Record<OrderStatus, { label: string; color: string; bg: string }> =
  {
    [OrderStatus.PENDING]: {
    label: "Chờ xác nhận",
    color: "text-yellow-400",
      bg: "bg-yellow-500/10",
  },
    [OrderStatus.CONFIRMED]: {
    label: "Đã xác nhận",
    color: "text-blue-400",
      bg: "bg-blue-500/10",
  },
    [OrderStatus.IN_PRODUCTION]: {
    label: "Đang sản xuất",
    color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    [OrderStatus.SHIPPING]: {
      label: "Đang giao",
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    },
    [OrderStatus.READY_FOR_PICKUP]: {
      label: "Sẵn sàng giao/nhận",
    color: "text-cyan-400",
      bg: "bg-cyan-500/10",
  },
    [OrderStatus.COMPLETED]: {
    label: "Hoàn thành",
    color: "text-green-400",
      bg: "bg-green-500/10",
  },
    [OrderStatus.CANCELLED]: {
    label: "Đã hủy",
    color: "text-red-400",
      bg: "bg-red-500/10",
    },
};

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getAdminOrderById(orderId);
        setOrder(data);
        setSelectedStatus(data.status);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Không thể tải đơn hàng");
      } finally {
        setLoading(false);
      }
    };
    if (orderId) load();
  }, [orderId]);

  const handleUpdateStatus = async () => {
    if (!order || !selectedStatus) return;
    try {
      setUpdating(true);
      const updated = await updateOrderStatusAdmin(order.id, selectedStatus);
      setOrder(updated);
      toast.success("Đã cập nhật trạng thái");
    } catch (err: any) {
      toast.error(err.message || "Không thể cập nhật trạng thái");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GlassCard className="p-10 text-center max-w-lg">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Không tìm thấy đơn</h2>
          <p className="text-gray-400 mb-6">{error || "Order not found"}</p>
          <Button onClick={() => router.push("/admin/orders")}>Quay lại danh sách</Button>
        </GlassCard>
      </div>
    );
  }

  const statusInfo = statusConfig[order.status];
  const firstItem = order.items?.[0];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6 lg:px-10">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
                <span>Quay lại</span>
            </Link>
          </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <AnimatedSection>
              <GlassCard className="p-6 border border-white/10">
                <div className="flex items-start justify-between gap-4 mb-4">
            <div>
                    <p className="text-sm text-gray-400">Mã đơn</p>
                    <h1 className="text-3xl font-light text-white">{order.orderNumber || order.id}</h1>
                    <p className="text-sm text-gray-500 mt-2">
                      Ngày tạo:{" "}
                      {new Date(order.createdAt).toLocaleString("vi-VN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bg} ${statusInfo.color} border border-white/10`}
                >
                  {statusInfo.label}
                </span>
              </div>
            </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">Cập nhật trạng thái</label>
                    <select
                      value={selectedStatus || order.status}
                      onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-(--color-gold)"
                    >
                      {Object.values(OrderStatus).map((st) => (
                        <option key={st} value={st}>
                          {statusConfig[st].label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
              <Button
                variant="luxury"
                      onClick={handleUpdateStatus}
                      disabled={updating}
                      className="w-full"
                    >
                      {updating ? "Đang lưu..." : "Lưu trạng thái"}
              </Button>
            </div>
          </div>
              </GlassCard>
        </AnimatedSection>

            <AnimatedSection delay={0.05}>
              <GlassCard className="p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <User className="w-5 h-5 text-(--color-gold)" />
                  <h3 className="text-xl font-medium text-white">Khách hàng</h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{(order.customer as any)?.email || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{(order.customer as any)?.phone || "N/A"}</span>
                  </div>
                </div>
              </GlassCard>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <GlassCard className="p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Package className="w-5 h-5 text-(--color-gold)" />
                  <h3 className="text-xl font-medium text-white">Sản phẩm</h3>
                </div>
                <div className="space-y-3">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                      {item.product?.images?.[0] && (
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-black/30">
                        <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                          fill
                          className="object-cover"
                            unoptimized
                        />
                      </div>
                      )}
                      <div className="flex-1">
                        <h4 className="text-white font-medium mb-1">{item.product?.name || "Sản phẩm"}</h4>
                        <p className="text-sm text-gray-400">Số lượng: {item.quantity}</p>
                        {item.fabric?.name && (
                          <p className="text-sm text-gray-400">Vải: {item.fabric.name}</p>
                        )}
                          </div>
                      <div className="text-right">
                        <p className="text-lg font-medium text-(--color-gold)">
                          {(item.subtotal || item.unitPrice * item.quantity).toLocaleString()} đ
                        </p>
                      </div>
                    </div>
                  ))}
                  {!order.items?.length && (
                    <p className="text-gray-400 text-sm">Không có mục hàng</p>
                  )}
                </div>
              </GlassCard>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <GlassCard className="p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Ruler className="w-5 h-5 text-(--color-gold)" />
                  <h3 className="text-xl font-medium text-white">Địa chỉ giao hàng</h3>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-300">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span>{order.shippingAddress || "Chưa có"}</span>
                </div>
              </GlassCard>
            </AnimatedSection>
          </div>

          <div className="space-y-6">
            <AnimatedSection>
              <GlassCard className="p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="w-5 h-5 text-(--color-gold)" />
                  <h3 className="text-xl font-medium text-white">Thanh toán</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex justify-between">
                    <span>Phương thức</span>
                    <span>{(order as any).paymentMethod || (order as any).payment?.method || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Trạng thái</span>
                    <span>{(order as any).paymentStatus || (order as any).payment?.status || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tổng tiền</span>
                    <span className="text-lg font-semibold text-(--color-gold)">
                      {order.totalAmount.toLocaleString()} đ
                    </span>
                  </div>
                </div>
              </GlassCard>
            </AnimatedSection>

            <AnimatedSection delay={0.05}>
              <GlassCard className="p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Truck className="w-5 h-5 text-(--color-gold)" />
                  <h3 className="text-xl font-medium text-white">Nhân viên phụ trách</h3>
                </div>
                <p className="text-sm text-gray-300 mb-3">
                  {(order.assignedStaff as any)?.name || (order.assignedStaff as any)?.email || "Chưa gán"}
                </p>
                      <Button
                        variant="outline"
                  className="w-full border-white/20 text-gray-100"
                  onClick={() =>
                    toast("Chức năng gán nhân viên sẽ được bổ sung khi có danh sách staff", {
                      icon: "ℹ️",
                    })
                        }
                      >
                  Gán nhân viên
                      </Button>
              </GlassCard>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
}

