"use client";

import { motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Youtube,
} from "lucide-react";
import Link from "next/link";

const footerLinks = {
  company: [
    { label: "Về Chúng Tôi", href: "/about" },
    { label: "Câu Chuyện Thương Hiệu", href: "/story" },
    { label: "Nghệ Nhân", href: "/artisans" },
    { label: "Tuyển Dụng", href: "/careers" },
  ],
  services: [
    { label: "May Đo Cao Cấp", href: "/custom" },
    { label: "Bộ Sưu Tập", href: "/products" },
    { label: "Thành Viên VIP", href: "/membership" },
    { label: "Đặt Lịch Hẹn", href: "/booking" },
  ],
  support: [
    { label: "Hướng Dẫn Đo Size", href: "/size-guide" },
    { label: "Chính Sách Đổi Trả", href: "/return-policy" },
    { label: "Bảo Hành", href: "/warranty" },
    { label: "Câu Hỏi Thường Gặp", href: "/faq" },
  ],
};

export const Footer = () => {
  return (
    <footer className="relative bg-[var(--color-charcoal)] text-white overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full liquid-glass blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-6 lg:px-12 py-20">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/">
              <h3 className="text-3xl font-light tracking-wider mb-6">
                <span className="text-luxury">CUSTOM</span>
                <span> TAILOR</span>
              </h3>
            </Link>
            <p className="text-gray-400 font-light leading-relaxed mb-6">
              Nghệ thuật may đo tinh tế - Nơi phong cách và đẳng cấp được tôn
              vinh qua từng đường kim mũi chỉ.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[var(--color-gold)] mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">
                  123 Đường Nguyễn Huệ, Quận 1<br />
                  Thành phố Hồ Chí Minh, Việt Nam
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[var(--color-gold)]" />
                <a
                  href="tel:+84123456789"
                  className="text-gray-400 hover:text-[var(--color-gold)] transition-colors"
                >
                  +84 123 456 789
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[var(--color-gold)]" />
                <a
                  href="mailto:hello@customtailor.vn"
                  className="text-gray-400 hover:text-[var(--color-gold)] transition-colors"
                >
                  hello@customtailor.vn
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex items-center gap-4 mt-8">
              {[
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Youtube, href: "#", label: "Youtube" },
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full border border-[var(--color-gold)]/30 flex items-center justify-center hover:border-[var(--color-gold)] hover:bg-[var(--color-gold)]/10 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-lg font-light tracking-wider mb-6 text-[var(--color-gold)]">
              Công Ty
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[var(--color-gold)] transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-light tracking-wider mb-6 text-[var(--color-gold)]">
              Dịch Vụ
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[var(--color-gold)] transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-light tracking-wider mb-6 text-[var(--color-gold)]">
              Hỗ Trợ
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[var(--color-gold)] transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="glass-dark rounded-2xl p-8 mb-16">
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="text-2xl font-light mb-3">Đăng Ký Nhận Tin Tức</h4>
            <p className="text-gray-400 text-sm mb-6">
              Cập nhật xu hướng thời trang và ưu đãi đặc biệt mới nhất
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Email của bạn"
                className="flex-1 px-6 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-(--color-gold) text-(--color-charcoal) font-medium tracking-wider uppercase text-sm hover:bg-(--color-gold-light) transition-colors rounded-lg"
              >
                Đăng Ký
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>© 2024 Custom Tailor. Bảo lưu mọi quyền.</p>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="hover:text-[var(--color-gold)] transition-colors"
              >
                Chính Sách Bảo Mật
              </Link>
              <Link
                href="/terms"
                className="hover:text-[var(--color-gold)] transition-colors"
              >
                Điều Khoản Sử Dụng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
