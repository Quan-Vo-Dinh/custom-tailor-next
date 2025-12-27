"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Settings,
  Camera,
  Edit2,
  Save,
  X,
  Package,
  Clock,
  Ruler,
  MapPinned,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { getProfile, updateProfile, getProfileStats } from "@/services/users";
import { uploadAvatar } from "@/services/upload";
import { changePassword } from "@/services/auth";
import { User as UserType } from "@/types";

type TabType = "overview" | "edit" | "password";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const [profileData, statsData] = await Promise.all([
          getProfile(),
          getProfileStats(),
        ]);
        setUser(profileData);
        setStats(statsData);
        setFormData({
          fullName: profileData.name || "",
          email: profileData.email || "",
          phone: profileData.phone || "",
        });
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await updateProfile({
        fullName: formData.fullName,
        phone: formData.phone,
      });
      const updatedProfile = await getProfile();
      setUser(updatedProfile);
      setActiveTab("overview");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }
    try {
      setSaving(true);
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Đổi mật khẩu thành công");
      setActiveTab("overview");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setSaving(true);
      const url = await uploadAvatar(file);
      await updateProfile({ avatarUrl: url });
      const updatedProfile = await getProfile();
      setUser(updatedProfile);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Có lỗi xảy ra khi upload avatar"
      );
    } finally {
      setSaving(false);
    }
  };

  const statsList = [
    {
      icon: Package,
      label: "Đơn hàng",
      value: stats?.orders || 0,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      link: "/orders",
    },
    {
      icon: Clock,
      label: "Lịch hẹn",
      value: stats?.appointments || 0,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      link: "/appointments",
    },
    {
      icon: Ruler,
      label: "Số đo",
      value: stats?.measurements || 0,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      link: "/profile/measurements",
    },
    {
      icon: MapPinned,
      label: "Địa chỉ",
      value: stats?.addresses || 0,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      link: "/profile/addresses",
    },
  ];

  const quickLinks = [
    {
      icon: Ruler,
      label: "Quản lý Số đo",
      href: "/profile/measurements",
      description: "Thêm, sửa, xóa các bộ số đo",
    },
    {
      icon: MapPin,
      label: "Địa chỉ giao hàng",
      href: "/profile/addresses",
      description: "Quản lý địa chỉ nhận hàng",
    },
    {
      icon: Package,
      label: "Đơn hàng của tôi",
      href: "/orders",
      description: "Xem lịch sử đơn hàng",
    },
    {
      icon: Calendar,
      label: "Lịch hẹn",
      href: "/appointments",
      description: "Xem lịch hẹn đã đặt",
    },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <AnimatedSection className="mb-12">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-light mb-2">
                Tài Khoản <span className="text-luxury italic">Của Tôi</span>
              </h1>
              <p className="text-gray-400">
                Quản lý thông tin cá nhân và tùy chọn của bạn
              </p>
            </div>
            <Link href="/booking">
              <Button variant="luxury" size="lg">
                Đặt Lịch Hẹn Mới
              </Button>
            </Link>
          </div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <AnimatedSection delay={0.1} className="lg:col-span-1">
            <GlassCard className="p-6">
              {/* Avatar */}
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto rounded-full bg-linear-to-br from-(--color-gold) to-(--color-gold-light) p-1">
                  <div className="w-full h-full rounded-full bg-(--color-charcoal) overflow-hidden flex items-center justify-center relative">
                    {user?.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.name || "Avatar"}
                        fill
                        className="object-cover"
                        sizes="128px"
                        unoptimized
                      />
                    ) : (
                      <User className="w-16 h-16 text-(--color-gold)" />
                    )}
                  </div>
                </div>
                <label className="absolute bottom-0 right-1/2 translate-x-16 translate-y-2 w-10 h-10 bg-(--color-gold) rounded-full flex items-center justify-center hover:bg-(--color-gold-light) transition-colors group cursor-pointer">
                  <Camera className="w-5 h-5 text-(--color-charcoal)" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    disabled={saving}
                  />
                </label>
              </div>

              <div className="text-center mb-6">
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <h2 className="text-xl font-medium text-white mb-1">
                      {user?.name || "Loading..."}
                    </h2>
                    <p className="text-sm text-gray-400">
                      {user?.email || ""}
                    </p>
                  </>
                )}
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                    activeTab === "overview"
                      ? "bg-(--color-gold)/20 text-(--color-gold)"
                      : "hover:bg-white/5 text-gray-400"
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>Tổng quan</span>
                </button>
                <button
                  onClick={() => setActiveTab("edit")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                    activeTab === "edit"
                      ? "bg-(--color-gold)/20 text-(--color-gold)"
                      : "hover:bg-white/5 text-gray-400"
                  }`}
                >
                  <Edit2 className="w-5 h-5" />
                  <span>Chỉnh sửa</span>
                </button>
                <button
                  onClick={() => setActiveTab("password")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                    activeTab === "password"
                      ? "bg-(--color-gold)/20 text-(--color-gold)"
                      : "hover:bg-white/5 text-gray-400"
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span>Đổi mật khẩu</span>
                </button>
              </nav>
            </GlassCard>
          </AnimatedSection>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <>
                {/* Stats */}
                <AnimatedSection delay={0.2}>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statsList.map((stat, index) => (
                      <Link key={index} href={stat.link}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="glass-luxury p-6 rounded-xl cursor-pointer group"
                        >
                          <div
                            className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                          >
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                          </div>
                          <div className="text-3xl font-light text-white mb-1">
                            {stat.value}
                          </div>
                          <div className="text-sm text-gray-400">
                            {stat.label}
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </AnimatedSection>

                {/* Profile Info */}
                <AnimatedSection delay={0.3}>
                  <GlassCard className="p-8">
                    <h3 className="text-2xl font-light text-white mb-6">
                      Thông Tin Cá Nhân
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <User className="w-5 h-5 text-(--color-gold) mt-1" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-400 mb-1">
                            Họ và tên
                          </p>
                          <p className="text-white">{user?.name || "N/A"}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <Mail className="w-5 h-5 text-(--color-gold) mt-1" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-400 mb-1">Email</p>
                          <p className="text-white">{user?.email || "N/A"}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <Phone className="w-5 h-5 text-(--color-gold) mt-1" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-400 mb-1">
                            Số điện thoại
                          </p>
                          <p className="text-white">{user?.phone || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </AnimatedSection>

                {/* Quick Links */}
                <AnimatedSection delay={0.4}>
                  <h3 className="text-2xl font-light text-white mb-6">
                    Truy Cập Nhanh
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {quickLinks.map((link, index) => (
                      <Link key={index} href={link.href}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="glass-luxury p-6 rounded-xl cursor-pointer group"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-(--color-gold)/10 flex items-center justify-center group-hover:bg-(--color-gold)/20 transition-colors">
                              <link.icon className="w-6 h-6 text-(--color-gold)" />
                            </div>
                            <div>
                              <h4 className="text-white font-medium mb-1">
                                {link.label}
                              </h4>
                              <p className="text-sm text-gray-400">
                                {link.description}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </AnimatedSection>
              </>
            )}

            {/* Edit Tab */}
            {activeTab === "edit" && (
              <AnimatedSection delay={0.2}>
                <GlassCard className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-light text-white">
                      Chỉnh Sửa Thông Tin
                    </h3>
                  </div>

                  <form className="space-y-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Họ và Tên <span className="text-red-500">*</span>
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
                        Số điện thoại
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

                    {/* Actions */}
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="luxury"
                        onClick={handleSaveProfile}
                        className="flex-1"
                        disabled={saving}
                      >
                        <Save className="w-5 h-5" />
                        <span>{saving ? "Đang lưu..." : "Lưu thay đổi"}</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setActiveTab("overview")}
                      >
                        <X className="w-5 h-5" />
                        <span>Hủy</span>
                      </Button>
                    </div>
                  </form>
                </GlassCard>
              </AnimatedSection>
            )}

            {/* Password Tab */}
            {activeTab === "password" && (
              <AnimatedSection delay={0.2}>
                <GlassCard className="p-8">
                  <h3 className="text-2xl font-light text-white mb-6">
                    Đổi Mật Khẩu
                  </h3>

                  <form className="space-y-6">
                    {/* Current Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Mật khẩu hiện tại{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors"
                        placeholder="••••••••"
                      />
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Mật khẩu mới <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors"
                        placeholder="••••••••"
                      />
                      <p className="mt-1 text-sm text-gray-400">
                        Mật khẩu phải có ít nhất 8 ký tự
                      </p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Xác nhận mật khẩu mới{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors"
                        placeholder="••••••••"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="luxury"
                        onClick={handleChangePassword}
                        className="flex-1"
                        disabled={saving}
                      >
                        <Save className="w-5 h-5" />
                        <span>{saving ? "Đang xử lý..." : "Đổi mật khẩu"}</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setActiveTab("overview")}
                      >
                        <X className="w-5 h-5" />
                        <span>Hủy</span>
                      </Button>
                    </div>
                  </form>
                </GlassCard>
              </AnimatedSection>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
