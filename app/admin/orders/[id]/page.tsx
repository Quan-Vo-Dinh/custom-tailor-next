"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  UserCheck,
  AlertCircle,
  Printer,
  Send,
  Edit2,
  X,
  Search,
  Save,
  Ban,
} from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";

// Mock data for order detail
const mockStaffUsers = [
  {
    id: "staff-1",
    fullName: "Lê Văn Thợ",
    email: "levantho@tailor.vn",
    phone: "0923456789",
    role: "STAFF",
    currentOrders: 5,
    avatar: "",
  },
  {
    id: "staff-2",
    fullName: "Nguyễn Thị May",
    email: "nguyenthimay@tailor.vn",
    phone: "0934567890",
    role: "STAFF",
    currentOrders: 3,
    avatar: "",
  },
  {
    id: "staff-3",
    fullName: "Trần Văn Đo",
    email: "tranvando@tailor.vn",
    phone: "0945678901",
    role: "STAFF",
    currentOrders: 7,
    avatar: "",
  },
];

const mockOrderDetail = {
  id: "ORD-2024-001",
  status: "Confirmed",
  createdAt: "2024-03-10T10:30:00Z",
  updatedAt: "2024-03-10T14:20:00Z",
  customer: {
    id: "cust-1",
    fullName: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0901234567",
    avatar: "",
  },
  assignedTo: {
    id: "staff-2",
    fullName: "Nguyễn Thị May",
    email: "nguyenthimay@tailor.vn",
  },
  products: [
    {
      id: "prod-1",
      name: "Vest Công Sở Cao Cấp",
      image:
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80",
      quantity: 1,
      basePrice: 4500000,
      fabric: {
        name: "Vải Wool Ý",
        type: "Wool",
        priceAdjustment: 500000,
      },
      styleOptions: [
        { name: "Cổ vest 2 khuy", category: "COLLAR", priceAdjustment: 0 },
        { name: "Tay dài", category: "SLEEVE", priceAdjustment: 0 },
        {
          name: "Túi trong có nắp",
          category: "POCKET",
          priceAdjustment: 50000,
        },
      ],
      totalPrice: 5050000,
    },
  ],
  measurements: {
    name: "Số đo vest",
    chest: 98,
    waist: 84,
    hips: 100,
    shoulders: 45,
    sleeveLength: 62,
    jacketLength: 72,
    notes: "Vai hơi rộng, ưa cảm giác thoải mái",
  },
  payment: {
    method: "STRIPE",
    amount: 5050000,
    status: "PAID",
    paidAt: "2024-03-10T10:35:00Z",
  },
  deliveryAddress: {
    recipientName: "Nguyễn Văn A",
    phone: "0901234567",
    address: "123 Đường Lê Lợi",
    ward: "Phường Bến Nghé",
    district: "Quận 1",
    city: "TP. Hồ Chí Minh",
    postalCode: "700000",
  },
  statusHistory: [
    {
      status: "Pending",
      changedBy: "System",
      changedAt: "2024-03-10T10:30:00Z",
      note: "Đơn hàng được tạo",
    },
    {
      status: "Confirmed",
      changedBy: "Admin",
      changedAt: "2024-03-10T14:20:00Z",
      note: "Thanh toán thành công, đã xác nhận đơn",
    },
  ],
  assignmentHistory: [
    {
      assignedTo: "Nguyễn Thị May",
      assignedBy: "Admin",
      assignedAt: "2024-03-10T14:25:00Z",
      note: "Gán cho thợ có kinh nghiệm may vest",
    },
  ],
  shippingMethod: "Standard",
  estimatedDelivery: "2024-03-20",
  notes: "Khách hàng yêu cầu hoàn thành trước ngày 18/03",
};

const statusConfig = {
  Pending: {
    label: "Chờ xác nhận",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
    icon: Clock,
  },
  Confirmed: {
    label: "Đã xác nhận",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    icon: CheckCircle,
  },
  In_Production: {
    label: "Đang sản xuất",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    icon: Package,
  },
  Shipping: {
    label: "Đang giao hàng",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
    icon: Truck,
  },
  Completed: {
    label: "Hoàn thành",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    icon: CheckCircle,
  },
  Cancelled: {
    label: "Đã hủy",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    icon: AlertCircle,
  },
};

const paymentStatusConfig = {
  PENDING: { label: "Chờ thanh toán", color: "text-yellow-400" },
  PAID: { label: "Đã thanh toán", color: "text-green-400" },
  FAILED: { label: "Thanh toán thất bại", color: "text-red-400" },
  REFUNDED: { label: "Đã hoàn tiền", color: "text-gray-400" },
};

const paymentMethodConfig = {
  COD: { label: "COD", icon: "💵" },
  STRIPE: { label: "Stripe", icon: "💳" },
  SEPAY: { label: "SePay", icon: "🏦" },
};

export default function AdminOrderDetailPage() {
  const [order] = useState(mockOrderDetail);
  const [currentStatus, setCurrentStatus] = useState(order.status);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [searchStaff, setSearchStaff] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(
    order.assignedTo?.id || ""
  );
  const [assignmentNote, setAssignmentNote] = useState("");
  const [newStatus, setNewStatus] = useState(currentStatus);
  const [statusNote, setStatusNote] = useState("");
  const [cancelReason, setCancelReason] = useState("");

  const statusInfo = statusConfig[currentStatus as keyof typeof statusConfig];
  const StatusIcon = statusInfo?.icon || Clock;

  const filteredStaff = mockStaffUsers.filter(
    (staff) =>
      staff.fullName.toLowerCase().includes(searchStaff.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchStaff.toLowerCase())
  );

  const handleAssignStaff = () => {
    // TODO: Integrate with backend
    setIsAssignmentModalOpen(false);
    setAssignmentNote("");
    // Show success notification
    alert(
      `Đã gán đơn hàng cho ${
        mockStaffUsers.find((s) => s.id === selectedStaff)?.fullName
      }`
    );
  };

  const handleUpdateStatus = () => {
    // TODO: Integrate with backend
    setCurrentStatus(newStatus);
    setIsStatusModalOpen(false);
    setStatusNote("");
    // Send notification email to customer
    alert(
      `Đã cập nhật trạng thái đơn hàng thành ${
        statusConfig[newStatus as keyof typeof statusConfig].label
      }`
    );
  };

  const handleCancelOrder = () => {
    // TODO: Integrate with backend
    // Business rule: Cannot cancel if Shipping or Completed
    if (currentStatus === "Shipping" || currentStatus === "Completed") {
      alert("Không thể hủy đơn hàng đang giao hoặc đã hoàn thành!");
      return;
    }
    setCurrentStatus("Cancelled");
    setIsCancelModalOpen(false);
    setCancelReason("");
    alert("Đã hủy đơn hàng");
  };

  const handlePrintInvoice = () => {
    // TODO: Implement print functionality
    window.print();
  };

  const handleSendNotification = () => {
    // TODO: Integrate with notification service
    alert("Đã gửi thông báo tới khách hàng");
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header with Back Button */}
        <AnimatedSection className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/admin/orders">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại</span>
              </Button>
            </Link>
          </div>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-light">
                  Đơn hàng <span className="text-luxury">#{order.id}</span>
                </h1>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${statusInfo.bgColor} ${statusInfo.color} border ${statusInfo.borderColor}`}
                >
                  <StatusIcon className="w-4 h-4" />
                  {statusInfo.label}
                </span>
              </div>
              <p className="text-gray-400">
                Tạo lúc: {new Date(order.createdAt).toLocaleString("vi-VN")} •
                Cập nhật: {new Date(order.updatedAt).toLocaleString("vi-VN")}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handlePrintInvoice}>
                <Printer className="w-4 h-4" />
                <span>In hóa đơn</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSendNotification}
              >
                <Send className="w-4 h-4" />
                <span>Gửi thông báo</span>
              </Button>
              <Button
                variant="luxury"
                size="sm"
                onClick={() => setIsStatusModalOpen(true)}
                disabled={
                  currentStatus === "Cancelled" || currentStatus === "Completed"
                }
              >
                <Edit2 className="w-4 h-4" />
                <span>Cập nhật trạng thái</span>
              </Button>
            </div>
          </div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <AnimatedSection delay={0.1}>
              <GlassCard className="p-6">
                <h3 className="text-xl font-medium text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-(--color-gold)" />
                  Thông tin khách hàng
                </h3>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-(--color-gold)/10 flex items-center justify-center shrink-0">
                    <span className="text-(--color-gold) text-2xl font-medium">
                      {order.customer.fullName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="text-lg font-medium text-white">
                      {order.customer.fullName}
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {order.customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {order.customer.phone}
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </AnimatedSection>

            {/* Products */}
            <AnimatedSection delay={0.15}>
              <GlassCard className="p-6">
                <h3 className="text-xl font-medium text-white mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-(--color-gold)" />
                  Sản phẩm
                </h3>
                <div className="space-y-4">
                  {order.products.map((product) => (
                    <div
                      key={product.id}
                      className="flex gap-4 p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium mb-2">
                          {product.name}
                        </h4>
                        <div className="space-y-1 text-sm text-gray-400">
                          <div>
                            <span className="text-gray-500">Vải:</span>{" "}
                            {product.fabric.name} (+
                            {product.fabric.priceAdjustment.toLocaleString()} ₫)
                          </div>
                          <div>
                            <span className="text-gray-500">Tùy chỉnh:</span>{" "}
                            {product.styleOptions
                              .map((opt) => opt.name)
                              .join(", ")}
                          </div>
                          <div>
                            <span className="text-gray-500">Số lượng:</span>{" "}
                            {product.quantity}
                          </div>
                        </div>
                        <div className="mt-2 text-lg font-medium text-(--color-gold)">
                          {product.totalPrice.toLocaleString()} ₫
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </AnimatedSection>

            {/* Measurements */}
            <AnimatedSection delay={0.2}>
              <GlassCard className="p-6">
                <h3 className="text-xl font-medium text-white mb-4 flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-(--color-gold)" />
                  Số đo - {order.measurements.name}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(order.measurements)
                    .filter(([key]) => key !== "name" && key !== "notes")
                    .map(([key, value]) => (
                      <div key={key} className="p-3 bg-white/5 rounded-lg">
                        <div className="text-sm text-gray-400 mb-1">
                          {key === "chest"
                            ? "Vòng ngực"
                            : key === "waist"
                            ? "Vòng eo"
                            : key === "hips"
                            ? "Vòng mông"
                            : key === "shoulders"
                            ? "Vai"
                            : key === "sleeveLength"
                            ? "Dài tay"
                            : "Dài áo"}
                        </div>
                        <div className="text-lg font-medium text-white">
                          {value} cm
                        </div>
                      </div>
                    ))}
                </div>
                {order.measurements.notes && (
                  <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">Ghi chú:</div>
                    <div className="text-white">{order.measurements.notes}</div>
                  </div>
                )}
              </GlassCard>
            </AnimatedSection>

            {/* Delivery Address */}
            <AnimatedSection delay={0.25}>
              <GlassCard className="p-6">
                <h3 className="text-xl font-medium text-white mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-(--color-gold)" />
                  Địa chỉ giao hàng
                </h3>
                <div className="space-y-2 text-gray-300">
                  <div className="text-white font-medium">
                    {order.deliveryAddress.recipientName}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {order.deliveryAddress.phone}
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                    <div>
                      {order.deliveryAddress.address},{" "}
                      {order.deliveryAddress.ward},{" "}
                      {order.deliveryAddress.district},{" "}
                      {order.deliveryAddress.city}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-white/10">
                    <span className="text-gray-500">Phương thức:</span>{" "}
                    {order.shippingMethod} •{" "}
                    <span className="text-gray-500">Dự kiến giao:</span>{" "}
                    {new Date(order.estimatedDelivery).toLocaleDateString(
                      "vi-VN"
                    )}
                  </div>
                </div>
              </GlassCard>
            </AnimatedSection>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Assignment Card */}
            <AnimatedSection delay={0.3}>
              <GlassCard className="p-6">
                <h3 className="text-xl font-medium text-white mb-4 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-(--color-gold)" />
                  Phân công
                </h3>
                {order.assignedTo ? (
                  <div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 mb-3">
                      <div className="w-10 h-10 rounded-full bg-(--color-gold)/10 flex items-center justify-center">
                        <span className="text-(--color-gold) font-medium">
                          {order.assignedTo.fullName.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium">
                          {order.assignedTo.fullName}
                        </div>
                        <div className="text-sm text-gray-400">
                          {order.assignedTo.email}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setIsAssignmentModalOpen(true)}
                      className="w-full"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Gán lại nhân viên</span>
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-400 mb-3 text-sm">
                      Đơn hàng chưa được gán cho nhân viên
                    </p>
                    <Button
                      variant="luxury"
                      onClick={() => setIsAssignmentModalOpen(true)}
                      className="w-full"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Gán nhân viên</span>
                    </Button>
                  </div>
                )}

                {order.assignmentHistory.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="text-sm text-gray-400 mb-2">
                      Lịch sử phân công:
                    </div>
                    <div className="space-y-2">
                      {order.assignmentHistory.map((history, index) => (
                        <div
                          key={index}
                          className="text-xs text-gray-500 p-2 bg-white/5 rounded"
                        >
                          <div>
                            <span className="text-white">
                              {history.assignedTo}
                            </span>{" "}
                            bởi {history.assignedBy}
                          </div>
                          <div className="text-gray-600">
                            {new Date(history.assignedAt).toLocaleString(
                              "vi-VN"
                            )}
                          </div>
                          {history.note && (
                            <div className="mt-1 text-gray-400">
                              {history.note}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </GlassCard>
            </AnimatedSection>

            {/* Payment Info */}
            <AnimatedSection delay={0.35}>
              <GlassCard className="p-6">
                <h3 className="text-xl font-medium text-white mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-(--color-gold)" />
                  Thanh toán
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Phương thức:</span>
                    <span className="text-white font-medium">
                      {
                        paymentMethodConfig[
                          order.payment
                            .method as keyof typeof paymentMethodConfig
                        ].label
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Trạng thái:</span>
                    <span
                      className={`font-medium ${
                        paymentStatusConfig[
                          order.payment
                            .status as keyof typeof paymentStatusConfig
                        ].color
                      }`}
                    >
                      {
                        paymentStatusConfig[
                          order.payment
                            .status as keyof typeof paymentStatusConfig
                        ].label
                      }
                    </span>
                  </div>
                  {order.payment.paidAt && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Thanh toán lúc:</span>
                      <span className="text-gray-400">
                        {new Date(order.payment.paidAt).toLocaleString("vi-VN")}
                      </span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                    <span className="text-lg text-white font-medium">
                      Tổng cộng:
                    </span>
                    <span className="text-2xl text-(--color-gold) font-medium">
                      {order.payment.amount.toLocaleString()} ₫
                    </span>
                  </div>
                </div>
              </GlassCard>
            </AnimatedSection>

            {/* Status History */}
            <AnimatedSection delay={0.4}>
              <GlassCard className="p-6">
                <h3 className="text-xl font-medium text-white mb-4">
                  Lịch sử trạng thái
                </h3>
                <div className="space-y-3">
                  {order.statusHistory.map((history, index) => {
                    const statusInfo =
                      statusConfig[history.status as keyof typeof statusConfig];
                    const HistoryIcon = statusInfo?.icon || Clock;
                    return (
                      <div
                        key={index}
                        className="flex gap-3 p-3 bg-white/5 rounded-lg"
                      >
                        <div
                          className={`w-8 h-8 rounded-full ${statusInfo.bgColor} flex items-center justify-center shrink-0`}
                        >
                          <HistoryIcon
                            className={`w-4 h-4 ${statusInfo.color}`}
                          />
                        </div>
                        <div className="flex-1">
                          <div
                            className={`font-medium ${statusInfo.color} mb-1`}
                          >
                            {statusInfo.label}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(history.changedAt).toLocaleString(
                              "vi-VN"
                            )}{" "}
                            • {history.changedBy}
                          </div>
                          {history.note && (
                            <div className="text-sm text-gray-400 mt-1">
                              {history.note}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            </AnimatedSection>

            {/* Actions */}
            <AnimatedSection delay={0.45}>
              <GlassCard className="p-6">
                <h3 className="text-xl font-medium text-white mb-4">
                  Hành động
                </h3>
                <div className="space-y-3">
                  {currentStatus !== "Cancelled" &&
                    currentStatus !== "Completed" && (
                      <Button
                        variant="outline"
                        onClick={() => setIsCancelModalOpen(true)}
                        className="w-full text-red-400 border-red-500/20 hover:bg-red-500/10"
                        disabled={
                          currentStatus === "Shipping" ||
                          currentStatus === "Completed"
                        }
                      >
                        <Ban className="w-4 h-4" />
                        <span>Hủy đơn hàng</span>
                      </Button>
                    )}
                  {order.notes && (
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <div className="text-sm text-gray-400 mb-1">
                        Ghi chú đơn hàng:
                      </div>
                      <div className="text-white text-sm">{order.notes}</div>
                    </div>
                  )}
                </div>
              </GlassCard>
            </AnimatedSection>
          </div>
        </div>
      </div>

      {/* Assignment Modal */}
      <AnimatePresence>
        {isAssignmentModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setIsAssignmentModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl"
            >
              <GlassCard className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-light text-white">
                    Gán nhân viên cho đơn hàng
                  </h2>
                  <button
                    onClick={() => setIsAssignmentModalOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                {/* Search Staff */}
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchStaff}
                      onChange={(e) => setSearchStaff(e.target.value)}
                      placeholder="Tìm nhân viên theo tên, email..."
                      className="w-full pl-10 pr-4 py-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors"
                    />
                  </div>
                </div>

                {/* Staff List */}
                <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
                  {filteredStaff.map((staff) => (
                    <button
                      key={staff.id}
                      onClick={() => setSelectedStaff(staff.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-lg border transition-colors cursor-pointer ${
                        selectedStaff === staff.id
                          ? "bg-(--color-gold)/10 border-(--color-gold)/30"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-(--color-gold)/10 flex items-center justify-center shrink-0">
                        <span className="text-(--color-gold) font-medium text-lg">
                          {staff.fullName.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-white font-medium">
                          {staff.fullName}
                        </div>
                        <div className="text-sm text-gray-400">
                          {staff.email}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Đang xử lý: {staff.currentOrders} đơn hàng
                        </div>
                      </div>
                      {selectedStaff === staff.id && (
                        <CheckCircle className="w-6 h-6 text-(--color-gold)" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Assignment Note */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ghi chú phân công (tùy chọn)
                  </label>
                  <textarea
                    value={assignmentNote}
                    onChange={(e) => setAssignmentNote(e.target.value)}
                    placeholder="Ví dụ: Thợ có kinh nghiệm may vest..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <Button
                    variant="luxury"
                    onClick={handleAssignStaff}
                    className="flex-1"
                    disabled={!selectedStaff}
                  >
                    <Save className="w-5 h-5" />
                    <span>Xác nhận gán</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsAssignmentModalOpen(false)}
                  >
                    Hủy
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Update Modal */}
      <AnimatePresence>
        {isStatusModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setIsStatusModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg"
            >
              <GlassCard className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-light text-white">
                    Cập nhật trạng thái
                  </h2>
                  <button
                    onClick={() => setIsStatusModalOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Current Status */}
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="text-sm text-gray-400 mb-1">
                      Trạng thái hiện tại:
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
                      <span className="text-white font-medium">
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  {/* New Status Select */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Trạng thái mới <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 text-white border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors"
                    >
                      {Object.entries(statusConfig)
                        .filter(([key]) => key !== "Cancelled")
                        .map(([key, config]) => (
                          <option key={key} value={key}>
                            {config.label}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Status Note */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Ghi chú (tùy chọn)
                    </label>
                    <textarea
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      placeholder="Ghi chú về thay đổi trạng thái..."
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors resize-none"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      variant="luxury"
                      onClick={handleUpdateStatus}
                      className="flex-1"
                    >
                      <Save className="w-5 h-5" />
                      <span>Cập nhật</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsStatusModalOpen(false)}
                    >
                      Hủy
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel Order Modal */}
      <AnimatePresence>
        {isCancelModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setIsCancelModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg"
            >
              <GlassCard className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-light text-white">
                    Hủy đơn hàng
                  </h2>
                  <button
                    onClick={() => setIsCancelModalOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                      <div className="text-sm text-red-300">
                        Hành động này không thể hoàn tác. Khách hàng sẽ nhận
                        được thông báo về việc hủy đơn hàng.
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Lý do hủy <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder="Nhập lý do hủy đơn hàng..."
                      rows={4}
                      className="w-full px-4 py-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors resize-none"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      variant="outline"
                      onClick={handleCancelOrder}
                      className="flex-1 text-red-400 border-red-500/20 hover:bg-red-500/10"
                      disabled={!cancelReason.trim()}
                    >
                      <Ban className="w-5 h-5" />
                      <span>Xác nhận hủy</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsCancelModalOpen(false)}
                    >
                      Quay lại
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
