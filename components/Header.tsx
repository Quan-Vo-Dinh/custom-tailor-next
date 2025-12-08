"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const navItems = [
  { href: "/", label: "Trang Chủ" },
  { href: "/products", label: "Bộ Sưu Tập" },
  { href: "/custom", label: "May Đo" },
  { href: "/about", label: "Câu Chuyện" },
  { href: "/contact", label: "Liên Hệ" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled ? "glass-luxury shadow-lg py-4" : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-10">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-3xl md:text-4xl font-light tracking-wider">
                <span className="text-luxury">CUSTOM</span>
                <span className="text-[var(--color-charcoal)]"> TAILOR</span>
              </h1>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-12">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link
                  href={item.href}
                  className="text-sm tracking-widest uppercase font-light hover:text-[var(--color-gold)] transition-colors duration-300 relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-[var(--color-gold)] transition-all duration-300 group-hover:w-full" />
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* TODO: Show only for ADMIN role */}
            <Link href="/admin/dashboard">
              <Button variant="outline" size="sm">
                Admin
              </Button>
            </Link>
            <Link href="/appointments">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:text-[var(--color-gold)] transition-colors"
                title="Lịch hẹn"
              >
                <Calendar className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link href="/profile">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:text-[var(--color-gold)] transition-colors"
                title="Tài khoản"
              >
                <User className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link href="/checkout">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 hover:text-[var(--color-gold)] transition-colors"
                title="Giỏ hàng"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--color-burgundy)] text-white text-xs rounded-full flex items-center justify-center">
                  0
                </span>
              </motion.button>
            </Link>
            <Link href="/register">
              <Button variant="luxury" size="sm">
                Đăng Ký
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 hover:text-[var(--color-gold)] transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden glass-luxury mt-4 overflow-hidden"
          >
            <nav className="container mx-auto px-6 py-6 space-y-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-lg tracking-wider uppercase font-light hover:text-[var(--color-gold)] transition-colors py-2"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-4 space-y-3">
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button variant="luxury" size="default" className="w-full">
                    Tài Khoản
                  </Button>
                </Link>
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" size="default" className="w-full">
                    Đăng Nhập
                  </Button>
                </Link>
                <div className="flex justify-center space-x-6 pt-2">
                  <Link
                    href="/appointments"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <button className="p-2">
                      <Calendar className="w-6 h-6" />
                    </button>
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <button className="p-2 relative">
                      <ShoppingBag className="w-6 h-6" />
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--color-burgundy)] text-white text-xs rounded-full flex items-center justify-center">
                        0
                      </span>
                    </button>
                  </Link>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
