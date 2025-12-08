"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Shield,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  X,
  Save,
} from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

// Mock data
const mockUsers = [
  {
    id: "1",
    fullName: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0901234567",
    role: "CUSTOMER",
    status: "Active",
    ordersCount: 5,
    appointmentsCount: 3,
    createdAt: "2024-01-15T10:30:00Z",
    lastLogin: "2024-03-10T14:20:00Z",
  },
  {
    id: "2",
    fullName: "Trần Thị B",
    email: "tranthib@example.com",
    phone: "0912345678",
    role: "CUSTOMER",
    status: "Active",
    ordersCount: 8,
    appointmentsCount: 5,
    createdAt: "2024-01-20T09:00:00Z",
    lastLogin: "2024-03-11T10:15:00Z",
  },
  {
    id: "3",
    fullName: "Lê Văn C",
    email: "levanc@example.com",
    phone: "0923456789",
    role: "STAFF",
    status: "Active",
    ordersCount: 0,
    appointmentsCount: 25,
    createdAt: "2024-02-01T11:00:00Z",
    lastLogin: "2024-03-12T09:30:00Z",
  },
  {
    id: "4",
    fullName: "Phạm Thị D",
    email: "phamthid@example.com",
    phone: "0934567890",
    role: "ADMIN",
    status: "Active",
    ordersCount: 0,
    appointmentsCount: 0,
    createdAt: "2024-01-10T08:00:00Z",
    lastLogin: "2024-03-12T08:00:00Z",
  },
  {
    id: "5",
    fullName: "Hoàng Văn E",
    email: "hoangvane@example.com",
    phone: "0945678901",
    role: "CUSTOMER",
    status: "Inactive",
    ordersCount: 2,
    appointmentsCount: 1,
    createdAt: "2024-02-05T15:30:00Z",
    lastLogin: "2024-02-20T16:00:00Z",
  },
  {
    id: "6",
    fullName: "Võ Thị F",
    email: "vothif@example.com",
    phone: "0956789012",
    role: "CUSTOMER",
    status: "Active",
    ordersCount: 12,
    appointmentsCount: 8,
    createdAt: "2024-01-25T12:00:00Z",
    lastLogin: "2024-03-11T18:45:00Z",
  },
];

const roleConfig = {
  CUSTOMER: {
    label: "Khách hàng",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  STAFF: {
    label: "Nhân viên",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
  },
  ADMIN: {
    label: "Quản trị",
    color: "text-(--color-gold)",
    bgColor: "bg-(--color-gold)/10",
    borderColor: "border-(--color-gold)/20",
  },
};

const statusConfig = {
  Active: {
    label: "Hoạt động",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
  },
  Inactive: {
    label: "Không hoạt động",
    color: "text-gray-400",
    bgColor: "bg-gray-500/10",
    borderColor: "border-gray-500/20",
  },
  Suspended: {
    label: "Tạm khóa",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
  },
};

type Role = keyof typeof roleConfig;
type Status = keyof typeof statusConfig;
type User = (typeof mockUsers)[0];

export default function AdminUsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "All">("All");
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    status: "",
  });

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);
    const matchesRole = roleFilter === "All" ? true : user.role === roleFilter;
    const matchesStatus =
      statusFilter === "All" ? true : user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAdd = () => {
    setEditingUser(null);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      role: "",
      status: "Active",
    });
    setIsFormOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
    });
    setIsFormOpen(true);
  };

  const handleSave = () => {
    // TODO: Integrate with backend
    if (editingUser) {
      setUsers(
        users.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                role: formData.role as Role,
                status: formData.status as Status,
              }
            : u
        )
      );
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role as Role,
        status: formData.status as Status,
        ordersCount: 0,
        appointmentsCount: 0,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      setUsers([newUser, ...users]);
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    // TODO: Add confirmation dialog
    // TODO: Integrate with backend
    setUsers(users.filter((u) => u.id !== id));
  };

  const handleStatusToggle = (userId: string, currentStatus: Status) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    setUsers(
      users.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
  };

  const stats = {
    total: users.length,
    customers: users.filter((u) => u.role === "CUSTOMER").length,
    staff: users.filter((u) => u.role === "STAFF").length,
    admins: users.filter((u) => u.role === "ADMIN").length,
    active: users.filter((u) => u.status === "Active").length,
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <AnimatedSection className="mb-12">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-light mb-2">
                Quản Lý <span className="text-luxury italic">Người Dùng</span>
              </h1>
              <p className="text-gray-400">
                Quản lý tài khoản và phân quyền người dùng
              </p>
            </div>
            <Button variant="luxury" size="lg" onClick={handleAdd}>
              <Plus className="w-5 h-5" />
              <span>Thêm người dùng</span>
            </Button>
          </div>
        </AnimatedSection>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <AnimatedSection delay={0.1}>
            <GlassCard className="p-6">
              <div className="text-sm text-gray-400 mb-1">Tổng số</div>
              <div className="text-3xl font-medium text-white">
                {stats.total}
              </div>
            </GlassCard>
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <GlassCard className="p-6">
              <div className="text-sm text-gray-400 mb-1">Khách hàng</div>
              <div className="text-3xl font-medium text-blue-400">
                {stats.customers}
              </div>
            </GlassCard>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <GlassCard className="p-6">
              <div className="text-sm text-gray-400 mb-1">Nhân viên</div>
              <div className="text-3xl font-medium text-purple-400">
                {stats.staff}
              </div>
            </GlassCard>
          </AnimatedSection>
          <AnimatedSection delay={0.25}>
            <GlassCard className="p-6">
              <div className="text-sm text-gray-400 mb-1">Quản trị</div>
              <div className="text-3xl font-medium text-(--color-gold)">
                {stats.admins}
              </div>
            </GlassCard>
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <GlassCard className="p-6">
              <div className="text-sm text-gray-400 mb-1">Hoạt động</div>
              <div className="text-3xl font-medium text-green-400">
                {stats.active}
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>

        {/* Filters & Search */}
        <AnimatedSection delay={0.35} className="mb-6">
          <GlassCard className="p-6">
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo tên, email, số điện thoại..."
                  className="w-full pl-10 pr-4 py-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                {/* Role Filter */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Filter className="w-5 h-5 text-gray-400 shrink-0" />
                  <span className="text-sm text-gray-400">Vai trò:</span>
                  <button
                    onClick={() => setRoleFilter("All")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      roleFilter === "All"
                        ? "bg-(--color-gold) text-charcoal"
                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    Tất cả
                  </button>
                  {(Object.keys(roleConfig) as Role[]).map((role) => (
                    <button
                      key={role}
                      onClick={() => setRoleFilter(role)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        roleFilter === role
                          ? `${roleConfig[role].bgColor} ${roleConfig[role].color} border ${roleConfig[role].borderColor}`
                          : "bg-white/5 text-gray-400 hover:bg-white/10"
                      }`}
                    >
                      {roleConfig[role].label}
                    </button>
                  ))}
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-400">Trạng thái:</span>
                  <button
                    onClick={() => setStatusFilter("All")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      statusFilter === "All"
                        ? "bg-(--color-gold) text-charcoal"
                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    Tất cả
                  </button>
                  {(Object.keys(statusConfig) as Status[]).map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
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
            </div>
          </GlassCard>
        </AnimatedSection>

        {/* Users Table */}
        <AnimatedSection delay={0.4}>
          <GlassCard className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-white/10">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-gray-300">
                      Người dùng
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-300">
                      Liên hệ
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-300">
                      Vai trò
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-300">
                      Trạng thái
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-300">
                      Hoạt động
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-300">
                      Ngày tham gia
                    </th>
                    <th className="text-right p-4 text-sm font-medium text-gray-300">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user, index) => {
                    const role = roleConfig[user.role as Role];
                    const status = statusConfig[user.status as Status];
                    return (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-(--color-gold)/10 flex items-center justify-center">
                              <span className="text-(--color-gold) font-medium">
                                {user.fullName.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="text-white font-medium">
                                {user.fullName}
                              </div>
                              <div className="text-sm text-gray-400">
                                ID: {user.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2 text-gray-300">
                              <Mail className="w-4 h-4 text-gray-400" />
                              {user.email}
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                              <Phone className="w-4 h-4 text-gray-400" />
                              {user.phone}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${role.bgColor} ${role.color} border ${role.borderColor}`}
                          >
                            <Shield className="w-4 h-4" />
                            {role.label}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() =>
                              handleStatusToggle(user.id, user.status as Status)
                            }
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${status.bgColor} ${status.color} border ${status.borderColor} hover:opacity-80 transition-opacity cursor-pointer`}
                          >
                            {user.status === "Active" ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <XCircle className="w-4 h-4" />
                            )}
                            {status.label}
                          </button>
                        </td>
                        <td className="p-4">
                          <div className="text-sm space-y-1">
                            <div className="text-white">
                              {user.ordersCount} đơn hàng
                            </div>
                            <div className="text-gray-400">
                              {user.appointmentsCount} lịch hẹn
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-gray-300">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {new Date(user.createdAt).toLocaleDateString(
                                "vi-VN"
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              Đăng nhập:{" "}
                              {new Date(user.lastLogin).toLocaleDateString(
                                "vi-VN"
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(user)}
                              className="p-2 hover:bg-(--color-gold)/10 rounded-lg transition-colors cursor-pointer"
                              title="Chỉnh sửa"
                            >
                              <Edit2 className="w-4 h-4 text-(--color-gold)" />
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="p-2 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
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
                  {Math.min(currentPage * itemsPerPage, filteredUsers.length)}{" "}
                  trong tổng số {filteredUsers.length} người dùng
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
        {filteredUsers.length === 0 && (
          <AnimatedSection delay={0.5}>
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-(--color-gold)/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-(--color-gold)" />
              </div>
              <h3 className="text-2xl font-light text-white mb-2">
                Không tìm thấy người dùng
              </h3>
              <p className="text-gray-400">
                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
              </p>
            </div>
          </AnimatedSection>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setIsFormOpen(false)}
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
                    {editingUser
                      ? "Chỉnh sửa người dùng"
                      : "Thêm người dùng mới"}
                  </h2>
                  <button
                    onClick={() => setIsFormOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors"
                      placeholder="email@example.com"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors"
                      placeholder="0901234567"
                    />
                  </div>

                  {/* Role & Status */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Vai trò <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-white/10 text-white border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors"
                      >
                        <option value="">Chọn vai trò</option>
                        {(Object.keys(roleConfig) as Role[]).map((role) => (
                          <option key={role} value={role}>
                            {roleConfig[role].label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Trạng thái <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-white/10 text-white border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors"
                      >
                        {(Object.keys(statusConfig) as Status[]).map(
                          (status) => (
                            <option key={status} value={status}>
                              {statusConfig[status].label}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      variant="luxury"
                      onClick={handleSave}
                      className="flex-1"
                      disabled={
                        !formData.fullName ||
                        !formData.email ||
                        !formData.phone ||
                        !formData.role
                      }
                    >
                      <Save className="w-5 h-5" />
                      <span>
                        {editingUser ? "Lưu thay đổi" : "Thêm người dùng"}
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsFormOpen(false)}
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
    </div>
  );
}
