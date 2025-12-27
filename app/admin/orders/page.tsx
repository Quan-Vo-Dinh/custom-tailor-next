"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Package,
  Search,
  Filter,
  Download,
  Eye,
  Edit2,
  CheckCircle,
  XCircle,
  Truck,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { getAllOrders, updateOrderStatusAdmin } from "@/services/orders";
import { Order, OrderStatus } from "@/types";
import toast from "react-hot-toast";

const statusConfig = {
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
  IN_PRODUCTION: {
    label: "Đang sản xuất",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
  },
  READY_FOR_PICKUP: {
    label: "Sẵn sàng lấy",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
  },
  SHIPPING: {
    label: "Đang giao hàng",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
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
};

const paymentStatusConfig = {
  UNPAID: { label: "Chờ thanh toán", color: "text-yellow-400" },
  PAID: { label: "Đã thanh toán", color: "text-green-400" },
  FAILED: { label: "Thất bại", color: "text-red-400" },
  REFUNDED: { label: "Đã hoàn tiền", color: "text-blue-400" },
};

type OrderStatusKey = keyof typeof statusConfig;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllOrders({
          page: currentPage,
          limit: itemsPerPage,
          status: statusFilter !== "All" ? statusFilter : undefined,
        });
        setOrders(response.orders);
        setTotalPages(response.pagination.totalPages);
        setTotalItems(response.pagination.totalItems);
      } catch (err: any) {
        setError(err.message || "Không thể tải danh sách đơn hàng");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage, statusFilter]);

  // Client-side search filter
  const filteredOrders = orders.filter((order) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const orderNumber = (order as any).orderNumber || order.id;
    const customerName = (order as any).customer?.fullName || (order as any).customerName || "";
    const customerEmail = (order as any).customer?.email || (order as any).customerEmail || "";
    
    return (
      orderNumber.toLowerCase().includes(query) ||
      customerName.toLowerCase().includes(query) ||
      customerEmail.toLowerCase().includes(query)
    );
  });

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map((o) => o.id));
    }
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleBulkStatusUpdate = async (newStatus: OrderStatus) => {
    try {
      const promises = selectedOrders.map((orderId) =>
        updateOrderStatusAdmin(orderId, newStatus)
      );
      await Promise.all(promises);
      toast.success(`Đã cập nhật ${selectedOrders.length} đơn hàng`);
    setSelectedOrders([]);
      // Refresh orders
      const response = await getAllOrders({
        page: currentPage,
        limit: itemsPerPage,
        status: statusFilter !== "All" ? statusFilter : undefined,
      });
      setOrders(response.orders);
    } catch (err: any) {
      toast.error(err.message || "Không thể cập nhật trạng thái");
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatusAdmin(orderId, newStatus);
      toast.success("Đã cập nhật trạng thái đơn hàng");
      // Refresh orders
      const response = await getAllOrders({
        page: currentPage,
        limit: itemsPerPage,
        status: statusFilter !== "All" ? statusFilter : undefined,
      });
      setOrders(response.orders);
    } catch (err: any) {
      toast.error(err.message || "Không thể cập nhật trạng thái");
    }
  };

  const handleExport = () => {
    // TODO: Implement CSV export
    toast("Tính năng xuất báo cáo đang được phát triển", { icon: "ℹ️" });
  };

  // Calculate stats from all orders (would need separate API call for accurate stats)
  const stats = {
    total: totalItems,
    pending: orders.filter((o) => o.status === OrderStatus.PENDING).length,
    processing: orders.filter(
      (o) => o.status === OrderStatus.CONFIRMED || o.status === OrderStatus.IN_PRODUCTION
    ).length,
    shipping: orders.filter((o) => o.status === OrderStatus.SHIPPING).length,
    completed: orders.filter((o) => o.status === OrderStatus.COMPLETED).length,
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <AnimatedSection className="mb-12">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-light mb-2">
                Quản Lý <span className="text-luxury italic">Đơn Hàng</span>
              </h1>
              <p className="text-gray-400">
                Theo dõi và xử lý tất cả các đơn hàng
              </p>
            </div>
            <Button variant="luxury" size="lg" onClick={handleExport}>
              <Download className="w-5 h-5" />
              <span>Xuất báo cáo</span>
            </Button>
          </div>
        </AnimatedSection>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <AnimatedSection delay={0.1}>
            <GlassCard className="p-6">
              <div className="text-sm text-gray-400 mb-1">Tổng đơn</div>
              <div className="text-3xl font-medium text-white">
                {stats.total}
              </div>
            </GlassCard>
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <GlassCard className="p-6">
              <div className="text-sm text-gray-400 mb-1">Chờ xử lý</div>
              <div className="text-3xl font-medium text-yellow-400">
                {stats.pending}
              </div>
            </GlassCard>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <GlassCard className="p-6">
              <div className="text-sm text-gray-400 mb-1">Đang xử lý</div>
              <div className="text-3xl font-medium text-blue-400">
                {stats.processing}
              </div>
            </GlassCard>
          </AnimatedSection>
          <AnimatedSection delay={0.25}>
            <GlassCard className="p-6">
              <div className="text-sm text-gray-400 mb-1">Đang giao</div>
              <div className="text-3xl font-medium text-orange-400">
                {stats.shipping}
              </div>
            </GlassCard>
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <GlassCard className="p-6">
              <div className="text-sm text-gray-400 mb-1">Hoàn thành</div>
              <div className="text-3xl font-medium text-green-400">
                {stats.completed}
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>

        {/* Filters & Search */}
        <AnimatedSection delay={0.35} className="mb-6">
          <GlassCard className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo mã đơn, tên, email khách hàng..."
                  className="w-full pl-10 pr-4 py-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 flex-wrap">
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
                {(Object.keys(statusConfig) as OrderStatusKey[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status as OrderStatus)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      statusFilter === status
                        ? `${statusConfig[status].bgColor} ${statusConfig[status].color} border ${statusConfig[status].borderColor}`
                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    {statusConfig[status].label}
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>
        </AnimatedSection>

        {/* Bulk Actions Bar */}
        {selectedOrders.length > 0 && (
          <AnimatedSection delay={0.4} className="mb-6">
            <GlassCard className="p-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <span className="text-white">
                  Đã chọn <strong>{selectedOrders.length}</strong> đơn hàng
                </span>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkStatusUpdate(OrderStatus.CONFIRMED)}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Xác nhận</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkStatusUpdate(OrderStatus.IN_PRODUCTION)}
                  >
                    <Package className="w-4 h-4" />
                    <span>Đang sản xuất</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkStatusUpdate(OrderStatus.SHIPPING)}
                  >
                    <Truck className="w-4 h-4" />
                    <span>Giao hàng</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedOrders([])}
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Hủy chọn</span>
                  </Button>
                </div>
              </div>
            </GlassCard>
          </AnimatedSection>
        )}

        {/* Loading State */}
        {loading && (
          <AnimatedSection delay={0.45}>
            <div className="flex justify-center py-20">
              <LoadingSpinner />
            </div>
          </AnimatedSection>
        )}

        {/* Error State */}
        {error && !loading && (
          <AnimatedSection delay={0.45}>
            <ErrorMessage message={error} />
          </AnimatedSection>
        )}

        {/* Orders Table */}
        {!loading && !error && (
        <AnimatedSection delay={0.45}>
          <GlassCard className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-white/10">
                  <tr>
                    <th className="text-left p-4">
                      <input
                        type="checkbox"
                        checked={
                            selectedOrders.length === filteredOrders.length &&
                            filteredOrders.length > 0
                        }
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-white/20 bg-white/10 cursor-pointer"
                      />
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-300">
                      Mã đơn
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-300">
                      Khách hàng
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-300">
                      Sản phẩm
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-300">
                      Giá trị
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-300">
                      Trạng thái
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-300">
                      Thanh toán
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-300">
                      Ngày tạo
                    </th>
                    <th className="text-right p-4 text-sm font-medium text-gray-300">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                    {filteredOrders.map((order, index) => {
                      const status = statusConfig[order.status as OrderStatusKey] || statusConfig.PENDING;
                    const paymentStatus =
                      paymentStatusConfig[
                        order.paymentStatus as keyof typeof paymentStatusConfig
                        ] || paymentStatusConfig.UNPAID;
                      const orderNumber = (order as any).orderNumber || order.id;
                      const customerName = (order as any).customer?.fullName || (order as any).customerName || "N/A";
                      const customerEmail = (order as any).customer?.email || (order as any).customerEmail || "";
                      const firstItem = order.items?.[0];
                      const productName = firstItem?.product?.name || "N/A";
                      const quantity = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
                      const totalAmount = order.totalAmount || 0;
                      
                    return (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(order.id)}
                            onChange={() => handleSelectOrder(order.id)}
                            className="w-4 h-4 rounded border-white/20 bg-white/10 cursor-pointer"
                          />
                        </td>
                        <td className="p-4">
                          <Link
                              href={`/admin/orders/${order.id}`}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                          >
                              {orderNumber}
                          </Link>
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="text-white font-medium">
                                {customerName}
                            </div>
                              {customerEmail && (
                            <div className="text-sm text-gray-400">
                                  {customerEmail}
                            </div>
                              )}
                          </div>
                        </td>
                        <td className="p-4">
                            <div className="text-white">{productName}</div>
                          <div className="text-sm text-gray-400">
                              {quantity > 0 ? `x${quantity}` : `${order.items?.length || 0} sản phẩm`}
                          </div>
                        </td>
                        <td className="p-4">
                            <div className="text-[var(--color-gold)] font-medium">
                              {totalAmount.toLocaleString()} đ
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${status.bgColor} ${status.color} border ${status.borderColor}`}
                          >
                            {status.label}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`text-sm ${paymentStatus.color}`}>
                            {paymentStatus.label}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-gray-300">
                            {new Date(order.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                              <Link href={`/admin/orders/${order.id}`}>
                              <button
                                  className="p-2 hover:bg-[var(--color-gold)]/10 rounded-lg transition-colors cursor-pointer"
                                title="Xem chi tiết"
                              >
                                  <Eye className="w-4 h-4 text-[var(--color-gold)]" />
                              </button>
                            </Link>
                            <button
                              className="p-2 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                              title="Chỉnh sửa"
                                onClick={() => {
                                  // TODO: Open edit modal
                                  toast("Tính năng chỉnh sửa đang được phát triển", {
                                    icon: "ℹ️",
                                  });
                                }}
                            >
                              <Edit2 className="w-4 h-4 text-blue-400" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-white/10 flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Hiển thị {(currentPage - 1) * itemsPerPage + 1} -{" "}
                    {Math.min(currentPage * itemsPerPage, totalItems)}{" "}
                    trong tổng số {totalItems} đơn hàng
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
                              ? "bg-[var(--color-gold)] text-charcoal"
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
          </GlassCard>
        </AnimatedSection>
        )}

        {/* Empty State */}
        {!loading && !error && filteredOrders.length === 0 && (
          <AnimatedSection delay={0.5}>
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-[var(--color-gold)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-[var(--color-gold)]" />
              </div>
              <h3 className="text-2xl font-light text-white mb-2">
                Không tìm thấy đơn hàng
              </h3>
              <p className="text-gray-400">
                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
              </p>
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}
