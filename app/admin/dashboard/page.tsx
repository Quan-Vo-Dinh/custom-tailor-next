"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Package,
  DollarSign,
  Calendar,
  Users,
  TrendingUp,
  ShoppingCart,
  Clock,
  CheckCircle,
  ArrowRight,
  AlertCircle,
  Truck,
  UserCheck,
} from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

// Mock data for dashboard
const mockStats = {
  totalOrders: 156,
  monthlyRevenue: 234500000,
  pendingOrders: 12,
  todayAppointments: 8,
  newCustomers: 24,
  completedOrders: 98,
  cancellationRate: 3.2,
  activeStaff: 6,
};

const mockRevenueData = [
  { date: "01/03", amount: 12500000 },
  { date: "02/03", amount: 15200000 },
  { date: "03/03", amount: 11800000 },
  { date: "04/03", amount: 18500000 },
  { date: "05/03", amount: 16300000 },
  { date: "06/03", amount: 21000000 },
  { date: "07/03", amount: 19800000 },
];

const mockOrdersByStatus = [
  { status: "Pending", count: 12, color: "#FBBF24" },
  { status: "Confirmed", count: 18, color: "#60A5FA" },
  { status: "In Production", count: 24, color: "#A78BFA" },
  { status: "Shipping", count: 15, color: "#34D399" },
  { status: "Completed", count: 98, color: "#10B981" },
  { status: "Cancelled", count: 5, color: "#EF4444" },
];

const mockRecentActivities = [
  {
    id: "1",
    type: "order_created",
    message: "Đơn hàng #ORD-2024-156 được tạo",
    user: "Nguyễn Văn A",
    timestamp: "5 phút trước",
    icon: ShoppingCart,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    id: "2",
    type: "order_completed",
    message: "Đơn hàng #ORD-2024-145 hoàn thành",
    user: "Trần Thị B",
    timestamp: "15 phút trước",
    icon: CheckCircle,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
  },
  {
    id: "3",
    type: "appointment_booked",
    message: "Lịch hẹn mới được đặt",
    user: "Lê Văn C",
    timestamp: "32 phút trước",
    icon: Calendar,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
  },
  {
    id: "4",
    type: "order_shipping",
    message: "Đơn hàng #ORD-2024-142 đang giao",
    user: "Phạm Thị D",
    timestamp: "1 giờ trước",
    icon: Truck,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
  },
  {
    id: "5",
    type: "order_assigned",
    message: "Đơn hàng #ORD-2024-155 được gán cho Lê Văn Thợ",
    user: "Admin",
    timestamp: "2 giờ trước",
    icon: UserCheck,
    color: "text-(--color-gold)",
    bgColor: "bg-(--color-gold)/10",
  },
  {
    id: "6",
    type: "order_pending",
    message: "Đơn hàng #ORD-2024-154 chờ xác nhận",
    user: "Hoàng Văn E",
    timestamp: "3 giờ trước",
    icon: Clock,
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
  },
];

const mockTopProducts = [
  { name: "Vest Công Sở", count: 45, revenue: 202500000 },
  { name: "Sơ Mi Cao Cấp", count: 38, revenue: 68400000 },
  { name: "Quần Âu", count: 32, revenue: 48000000 },
  { name: "Vest Cưới", count: 12, revenue: 96000000 },
  { name: "Áo Dài", count: 8, revenue: 64000000 },
];

export default function AdminDashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("7days");

  // Calculate chart dimensions
  const maxRevenue = Math.max(...mockRevenueData.map((d) => d.amount));
  const chartHeight = 200;
  const chartWidth = 600;

  // Calculate total for pie chart
  const totalOrders = mockOrdersByStatus.reduce(
    (sum, item) => sum + item.count,
    0
  );

  // Calculate pie chart segments
  const pieSegments = mockOrdersByStatus.reduce<
    Array<
      (typeof mockOrdersByStatus)[0] & {
        percentage: number;
        startAngle: number;
        endAngle: number;
      }
    >
  >((acc, item) => {
    const percentage = (item.count / totalOrders) * 100;
    const angle = (percentage / 100) * 360;
    const prevAngle = acc.length > 0 ? acc[acc.length - 1].endAngle : -90;
    acc.push({
      ...item,
      percentage,
      startAngle: prevAngle,
      endAngle: prevAngle + angle,
    });
    return acc;
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <AnimatedSection className="mb-12">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-light mb-2">
                Dashboard <span className="text-luxury italic">Admin</span>
              </h1>
              <p className="text-gray-400">
                Tổng quan hoạt động kinh doanh và vận hành
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedPeriod("7days")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  selectedPeriod === "7days"
                    ? "bg-(--color-gold) text-charcoal"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                7 ngày
              </button>
              <button
                onClick={() => setSelectedPeriod("30days")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  selectedPeriod === "30days"
                    ? "bg-(--color-gold) text-charcoal"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                30 ngày
              </button>
              <button
                onClick={() => setSelectedPeriod("90days")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  selectedPeriod === "90days"
                    ? "bg-(--color-gold) text-charcoal"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                90 ngày
              </button>
            </div>
          </div>
        </AnimatedSection>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <AnimatedSection delay={0.1}>
            <GlassCard className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-xs text-green-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12%
                </div>
              </div>
              <div className="text-sm text-gray-400 mb-1">Tổng đơn hàng</div>
              <div className="text-3xl font-medium text-white">
                {mockStats.totalOrders}
              </div>
            </GlassCard>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <GlassCard className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-(--color-gold)/10 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-(--color-gold)" />
                </div>
                <div className="text-xs text-green-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +8%
                </div>
              </div>
              <div className="text-sm text-gray-400 mb-1">Doanh thu tháng</div>
              <div className="text-2xl font-medium text-white">
                {(mockStats.monthlyRevenue / 1000000).toFixed(1)}M
              </div>
            </GlassCard>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <GlassCard className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-400" />
                </div>
                <Link href="/admin/orders?status=Pending">
                  <div className="text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
                    Xem →
                  </div>
                </Link>
              </div>
              <div className="text-sm text-gray-400 mb-1">Chờ xử lý</div>
              <div className="text-3xl font-medium text-white">
                {mockStats.pendingOrders}
              </div>
            </GlassCard>
          </AnimatedSection>

          <AnimatedSection delay={0.25}>
            <GlassCard className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-400" />
                </div>
                <Link href="/admin/appointments">
                  <div className="text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
                    Xem →
                  </div>
                </Link>
              </div>
              <div className="text-sm text-gray-400 mb-1">Lịch hẹn hôm nay</div>
              <div className="text-3xl font-medium text-white">
                {mockStats.todayAppointments}
              </div>
            </GlassCard>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <GlassCard className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="text-xs text-green-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +18%
                </div>
              </div>
              <div className="text-sm text-gray-400 mb-1">Khách hàng mới</div>
              <div className="text-3xl font-medium text-white">
                {mockStats.newCustomers}
              </div>
            </GlassCard>
          </AnimatedSection>

          <AnimatedSection delay={0.35}>
            <GlassCard className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-xs text-gray-400">Tháng này</div>
              </div>
              <div className="text-sm text-gray-400 mb-1">Hoàn thành</div>
              <div className="text-3xl font-medium text-white">
                {mockStats.completedOrders}
              </div>
            </GlassCard>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <GlassCard className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <div className="text-xs text-gray-400">Cần giảm</div>
              </div>
              <div className="text-sm text-gray-400 mb-1">Tỷ lệ hủy</div>
              <div className="text-3xl font-medium text-white">
                {mockStats.cancellationRate}%
              </div>
            </GlassCard>
          </AnimatedSection>

          <AnimatedSection delay={0.45}>
            <GlassCard className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-(--color-gold)/10 flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-(--color-gold)" />
                </div>
                <Link href="/admin/users?role=STAFF">
                  <div className="text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
                    Xem →
                  </div>
                </Link>
              </div>
              <div className="text-sm text-gray-400 mb-1">Nhân viên</div>
              <div className="text-3xl font-medium text-white">
                {mockStats.activeStaff}
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <AnimatedSection delay={0.5}>
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium text-white">
                  Doanh thu 7 ngày
                </h3>
                <div className="text-sm text-gray-400">
                  Tổng:{" "}
                  {(
                    mockRevenueData.reduce((sum, d) => sum + d.amount, 0) /
                    1000000
                  ).toFixed(1)}
                  M ₫
                </div>
              </div>

              {/* Simple SVG Line Chart */}
              <div className="relative h-64">
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="w-full h-full"
                  preserveAspectRatio="none"
                >
                  {/* Grid lines */}
                  {[0, 25, 50, 75, 100].map((percent) => (
                    <line
                      key={percent}
                      x1="0"
                      y1={(chartHeight * percent) / 100}
                      x2={chartWidth}
                      y2={(chartHeight * percent) / 100}
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Area gradient */}
                  <defs>
                    <linearGradient
                      id="revenueGradient"
                      x1="0"
                      x2="0"
                      y1="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#FFD700" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Area path */}
                  <path
                    d={`M 0 ${chartHeight} ${mockRevenueData
                      .map((d, i) => {
                        const x =
                          (chartWidth / (mockRevenueData.length - 1)) * i;
                        const y =
                          chartHeight - (d.amount / maxRevenue) * chartHeight;
                        return `L ${x} ${y}`;
                      })
                      .join(" ")} L ${chartWidth} ${chartHeight} Z`}
                    fill="url(#revenueGradient)"
                  />

                  {/* Line path */}
                  <path
                    d={mockRevenueData
                      .map((d, i) => {
                        const x =
                          (chartWidth / (mockRevenueData.length - 1)) * i;
                        const y =
                          chartHeight - (d.amount / maxRevenue) * chartHeight;
                        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                      })
                      .join(" ")}
                    fill="none"
                    stroke="#FFD700"
                    strokeWidth="2"
                  />

                  {/* Data points */}
                  {mockRevenueData.map((d, i) => {
                    const x = (chartWidth / (mockRevenueData.length - 1)) * i;
                    const y =
                      chartHeight - (d.amount / maxRevenue) * chartHeight;
                    return (
                      <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r="4"
                        fill="#FFD700"
                        className="cursor-pointer hover:r-6 transition-all"
                      />
                    );
                  })}
                </svg>

                {/* X-axis labels */}
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  {mockRevenueData.map((d, i) => (
                    <div key={i}>{d.date}</div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </AnimatedSection>

          {/* Orders by Status - Donut Chart */}
          <AnimatedSection delay={0.55}>
            <GlassCard className="p-6">
              <h3 className="text-xl font-medium text-white mb-6">
                Đơn hàng theo trạng thái
              </h3>

              <div className="flex items-center justify-center gap-8">
                {/* Simple Donut Chart */}
                <div className="relative w-48 h-48">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full -rotate-90"
                  >
                    {pieSegments.map((segment, index) => {
                      const startAngle = (segment.startAngle * Math.PI) / 180;
                      const endAngle = (segment.endAngle * Math.PI) / 180;
                      const largeArc = segment.percentage > 50 ? 1 : 0;

                      const x1 = 50 + 40 * Math.cos(startAngle);
                      const y1 = 50 + 40 * Math.sin(startAngle);
                      const x2 = 50 + 40 * Math.cos(endAngle);
                      const y2 = 50 + 40 * Math.sin(endAngle);

                      return (
                        <path
                          key={index}
                          d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                          fill={segment.color}
                          opacity="0.8"
                          className="hover:opacity-100 transition-opacity cursor-pointer"
                        />
                      );
                    })}
                    {/* Inner circle to create donut effect */}
                    <circle cx="50" cy="50" r="25" fill="rgb(15, 23, 42)" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-3xl font-medium text-white">
                      {totalOrders}
                    </div>
                    <div className="text-sm text-gray-400">Tổng đơn</div>
                  </div>
                </div>

                {/* Legend */}
                <div className="space-y-2">
                  {mockOrdersByStatus.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="flex-1">
                        <div className="text-sm text-white">{item.status}</div>
                        <div className="text-xs text-gray-500">
                          {item.count} đơn (
                          {((item.count / totalOrders) * 100).toFixed(1)}%)
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>

        {/* Bottom Row */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <AnimatedSection delay={0.6}>
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-medium text-white">
                    Hoạt động gần đây
                  </h3>
                  <Link href="/admin/orders">
                    <Button variant="outline" size="sm">
                      <span>Xem tất cả</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                <div className="space-y-3">
                  {mockRecentActivities.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <div
                          className={`w-10 h-10 rounded-lg ${activity.bgColor} flex items-center justify-center shrink-0`}
                        >
                          <Icon className={`w-5 h-5 ${activity.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-sm mb-1">
                            {activity.message}
                          </div>
                          <div className="text-xs text-gray-500">
                            {activity.user} • {activity.timestamp}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </GlassCard>
            </AnimatedSection>
          </div>

          {/* Top Products */}
          <AnimatedSection delay={0.65}>
            <GlassCard className="p-6">
              <h3 className="text-xl font-medium text-white mb-6">
                Sản phẩm bán chạy
              </h3>

              <div className="space-y-4">
                {mockTopProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-(--color-gold)/10 flex items-center justify-center shrink-0">
                      <span className="text-(--color-gold) font-medium text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium mb-1">
                        {product.name}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-400">
                          {product.count} đơn
                        </span>
                        <span className="text-gray-600">•</span>
                        <span className="text-(--color-gold)">
                          {(product.revenue / 1000000).toFixed(1)}M ₫
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/admin/products">
                <Button variant="outline" size="sm" className="w-full mt-4">
                  <span>Xem tất cả sản phẩm</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </GlassCard>
          </AnimatedSection>
        </div>

        {/* Quick Actions */}
        <AnimatedSection delay={0.7} className="mt-8">
          <GlassCard className="p-6">
            <h3 className="text-xl font-medium text-white mb-4">
              Hành động nhanh
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/admin/orders?status=Pending">
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="w-5 h-5" />
                  <span>Đơn chờ xử lý</span>
                </Button>
              </Link>
              <Link href="/admin/appointments">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-5 h-5" />
                  <span>Lịch hẹn hôm nay</span>
                </Button>
              </Link>
              <Link href="/admin/products">
                <Button variant="outline" className="w-full justify-start">
                  <Package className="w-5 h-5" />
                  <span>Quản lý sản phẩm</span>
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-5 h-5" />
                  <span>Quản lý người dùng</span>
                </Button>
              </Link>
            </div>
          </GlassCard>
        </AnimatedSection>
      </div>
    </div>
  );
}
