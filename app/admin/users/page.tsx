"use client";

import { useState, useEffect } from "react";
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
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import {
  getAllUsers,
  updateUser,
  deleteUser,
  type UpdateUserDto,
} from "@/services/users";
import { User as UserType, UserRole } from "@/types";
import toast from "react-hot-toast";

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
    color: "text-[var(--color-gold)]",
    bgColor: "bg-[var(--color-gold)]/10",
    borderColor: "border-[var(--color-gold)]/20",
  },
};

type Role = "CUSTOMER" | "STAFF" | "ADMIN";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "All">("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "" as Role | "",
  });

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllUsers({
          page: currentPage,
          limit: itemsPerPage,
          role: roleFilter !== "All" ? roleFilter : undefined,
          search: searchQuery || undefined,
        });
        setUsers(response.users || []);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalItems(response.pagination?.totalItems || 0);
      } catch (err: any) {
        setError(err.message || "Không thể tải danh sách người dùng");
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, searchQuery, roleFilter]);

  const handleAdd = () => {
    setEditingUser(null);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      role: "" as Role | "",
    });
    setIsFormOpen(true);
  };

  const handleEdit = (user: UserType) => {
    setEditingUser(user);
    setFormData({
      fullName: user.name || "",
      email: user.email,
      phone: user.phone || "",
      role: user.role as Role,
    });
    setIsFormOpen(true);
  };

  const handleSave = async () => {
    try {
    if (editingUser) {
        const updateData: UpdateUserDto = {
          fullName: formData.fullName || undefined,
          phoneNumber: formData.phone || undefined,
          role: formData.role || undefined,
        };
        await updateUser(editingUser.id, updateData);
        toast.success("Đã cập nhật người dùng");
    } else {
        toast.error("Chức năng tạo người dùng mới chưa được hỗ trợ");
        return;
    }
    setIsFormOpen(false);
      // Refresh users
      const response = await getAllUsers({
        page: currentPage,
        limit: itemsPerPage,
        role: roleFilter !== "All" ? roleFilter : undefined,
        search: searchQuery || undefined,
      });
      setUsers(response.users || []);
      setTotalPages(response.pagination?.totalPages || 1);
      setTotalItems(response.pagination?.totalItems || 0);
    } catch (err: any) {
      toast.error(err.message || "Không thể lưu người dùng");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      return;
    }
    try {
      await deleteUser(id);
      toast.success("Đã xóa người dùng");
      // Refresh users
      const response = await getAllUsers({
        page: currentPage,
        limit: itemsPerPage,
        role: roleFilter !== "All" ? roleFilter : undefined,
        search: searchQuery || undefined,
      });
      setUsers(response.users || []);
      setTotalPages(response.pagination?.totalPages || 1);
      setTotalItems(response.pagination?.totalItems || 0);
    } catch (err: any) {
      toast.error(err.message || "Không thể xóa người dùng");
    }
  };

  const stats = {
    total: totalItems,
    customers: users.filter((u) => u.role === UserRole.CUSTOMER).length,
    staff: users.filter((u) => u.role === UserRole.STAFF).length,
    admins: users.filter((u) => u.role === UserRole.ADMIN).length,
    active: users.length, // API không có status field
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
              <div className="text-3xl font-medium text-[var(--color-gold)]">
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
                  className="w-full pl-10 pr-4 py-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:border-[var(--color-gold)] transition-colors"
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
                        ? "bg-[var(--color-gold)] text-charcoal"
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

              </div>
            </div>
          </GlassCard>
        </AnimatedSection>

        {/* Loading State */}
        {loading && (
          <AnimatedSection delay={0.4}>
            <div className="flex justify-center py-20">
              <LoadingSpinner />
            </div>
          </AnimatedSection>
        )}

        {/* Error State */}
        {error && !loading && (
          <AnimatedSection delay={0.4}>
            <ErrorMessage message={error} />
          </AnimatedSection>
        )}

        {/* Users Table */}
        {!loading && !error && (
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
                      Ngày tham gia
                    </th>
                    <th className="text-right p-4 text-sm font-medium text-gray-300">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => {
                    const role = roleConfig[user.role as Role];
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
                              <div className="w-10 h-10 rounded-full bg-[var(--color-gold)]/10 flex items-center justify-center">
                                <span className="text-[var(--color-gold)] font-medium">
                                  {(user.name || user.email).charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="text-white font-medium">
                                  {user.name || user.email}
                              </div>
                              <div className="text-sm text-gray-400">
                                  ID: {user.id.substring(0, 8)}...
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
                              {user.phone && (
                            <div className="flex items-center gap-2 text-gray-300">
                              <Phone className="w-4 h-4 text-gray-400" />
                              {user.phone}
                            </div>
                              )}
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
                          <div className="text-sm text-gray-300">
                              <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {new Date(user.createdAt).toLocaleDateString(
                                "vi-VN"
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(user)}
                                className="p-2 hover:bg-[var(--color-gold)]/10 rounded-lg transition-colors cursor-pointer"
                              title="Chỉnh sửa"
                            >
                                <Edit2 className="w-4 h-4 text-[var(--color-gold)]" />
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="p-2 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
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
                    trong tổng số {totalItems} người dùng
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
        {!loading && !error && users.length === 0 && (
          <AnimatedSection delay={0.5}>
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-[var(--color-gold)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-[var(--color-gold)]" />
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
                      className="w-full px-4 py-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:border-[var(--color-gold)] transition-colors"
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
                      disabled={!!editingUser}
                      className="w-full px-4 py-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:border-[var(--color-gold)] transition-colors disabled:opacity-50"
                      placeholder="email@example.com"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                      placeholder="0901234567"
                    />
                  </div>

                  {/* Role */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Vai trò <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value as Role })
                        }
                      className="w-full px-4 py-3 bg-white/10 text-white border border-white/20 rounded-lg focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                      >
                        <option value="">Chọn vai trò</option>
                        {(Object.keys(roleConfig) as Role[]).map((role) => (
                          <option key={role} value={role}>
                            {roleConfig[role].label}
                          </option>
                        ))}
                      </select>
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
                        !formData.role ||
                        !editingUser
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
