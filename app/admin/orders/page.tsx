"use client";

import { useState } from "react";
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

// Mock data
const mockOrders = [
  {
    id: "ORD-2024-001",
    customerName: "Nguyễn Văn A",
    customerEmail: "nguyenvana@example.com",
    productName: "Vest Truyền Thống",
    quantity: 1,
    totalAmount: 4500000,
    status: "Completed",
    paymentStatus: "Paid",
    createdAt: "2024-01-15T10:30:00Z",
    estimatedDelivery: "2024-02-01",
  },
  {
    id: "ORD-2024-002",
    customerName: "Trần Thị B",
    customerEmail: "tranthib@example.com",
    productName: "Sơ Mi Cao Cấp",
    quantity: 2,
    totalAmount: 3200000,
    status: "In_Production",
    paymentStatus: "Paid",
    createdAt: "2024-01-20T14:00:00Z",
    estimatedDelivery: "2024-02-10",
  },
  {
    id: "ORD-2024-003",
    customerName: "Lê Văn C",
    customerEmail: "levanc@example.com",
    productName: "Vest Hiện Đại",
    quantity: 1,
    totalAmount: 5500000,
    status: "Shipping",
    paymentStatus: "Paid",
    createdAt: "2024-01-25T09:15:00Z",
    estimatedDelivery: "2024-02-05",
  },
  {
    id: "ORD-2024-004",
    customerName: "Phạm Thị D",
    customerEmail: "phamthid@example.com",
    productName: "Áo Dài Truyền Thống",
    quantity: 1,
    totalAmount: 6200000,
    status: "Pending",
    paymentStatus: "Pending",
    createdAt: "2024-02-01T11:00:00Z",
    estimatedDelivery: "2024-02-20",
  },
  {
    id: "ORD-2024-005",
    customerName: "Hoàng Văn E",
    customerEmail: "hoangvane@example.com",
    productName: "Vest Dự Tiệc",
    quantity: 1,
    totalAmount: 7800000,
    status: "Confirmed",
    paymentStatus: "Paid",
    createdAt: "2024-02-03T15:30:00Z",
    estimatedDelivery: "2024-02-25",
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
  In_Production: {
    label: "Đang sản xuất",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
  },
  Shipping: {
    label: "Đang giao hàng",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
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
};

const paymentStatusConfig = {
  Pending: { label: "Chờ thanh toán", color: "text-yellow-400" },
  Paid: { label: "Đã thanh toán", color: "text-green-400" },
  Failed: { label: "Thất bại", color: "text-red-400" },
  Refunded: { label: "Đã hoàn tiền", color: "text-blue-400" },
};

type OrderStatus = keyof typeof statusConfig;

export default function AdminOrdersPage() {
  const [orders] = useState(mockOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All" ? true : order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = () => {
    if (selectedOrders.length === paginatedOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(paginatedOrders.map((o) => o.id));
    }
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleBulkStatusUpdate = (newStatus: OrderStatus) => {
    // TODO: Integrate with backend
    console.log("Bulk update:", selectedOrders, "to", newStatus);
    setSelectedOrders([]);
  };

  const handleExport = () => {
    // TODO: Implement CSV export
    console.log("Export orders:", filteredOrders);
  };

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "Pending").length,
    processing: orders.filter(
      (o) => o.status === "Confirmed" || o.status === "In_Production"
    ).length,
    shipping: orders.filter((o) => o.status === "Shipping").length,
    completed: orders.filter((o) => o.status === "Completed").length,
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
                {(Object.keys(statusConfig) as OrderStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
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
                    onClick={() => handleBulkStatusUpdate("Confirmed")}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Xác nhận</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkStatusUpdate("In_Production")}
                  >
                    <Package className="w-4 h-4" />
                    <span>Đang sản xuất</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkStatusUpdate("Shipping")}
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

        {/* Orders Table */}
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
                          selectedOrders.length === paginatedOrders.length &&
                          paginatedOrders.length > 0
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
                  {paginatedOrders.map((order, index) => {
                    const status = statusConfig[order.status as OrderStatus];
                    const paymentStatus =
                      paymentStatusConfig[
                        order.paymentStatus as keyof typeof paymentStatusConfig
                      ];
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
                            href={`/orders/${order.id}`}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            {order.id}
                          </Link>
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="text-white font-medium">
                              {order.customerName}
                            </div>
                            <div className="text-sm text-gray-400">
                              {order.customerEmail}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-white">{order.productName}</div>
                          <div className="text-sm text-gray-400">
                            x{order.quantity}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-(--color-gold) font-medium">
                            {order.totalAmount.toLocaleString()} đ
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
                            <Link href={`/orders/${order.id}`}>
                              <button
                                className="p-2 hover:bg-(--color-gold)/10 rounded-lg transition-colors cursor-pointer"
                                title="Xem chi tiết"
                              >
                                <Eye className="w-4 h-4 text-(--color-gold)" />
                              </button>
                            </Link>
                            <button
                              className="p-2 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                              title="Chỉnh sửa"
                            >
                              <Edit2 className="w-4 h-4 text-blue-400" />
                            </button>
                            <button
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                              title="Thêm"
                            >
                              <MoreVertical className="w-4 h-4 text-gray-400" />
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
                  {Math.min(currentPage * itemsPerPage, filteredOrders.length)}{" "}
                  trong tổng số {filteredOrders.length} đơn hàng
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
          </GlassCard>
        </AnimatedSection>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <AnimatedSection delay={0.5}>
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-(--color-gold)/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-(--color-gold)" />
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
