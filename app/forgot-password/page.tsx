"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Vui lòng nhập email");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email không hợp lệ");
      return;
    }

    setIsLoading(true);
    // TODO: Integrate with backend API
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-linear-to-br from-(--color-charcoal) via-black to-(--color-charcoal-dark)" />
          <motion.div
            className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-(--color-gold)/20 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="container mx-auto px-6">
          <AnimatedSection className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-luxury p-12 rounded-2xl text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-12 h-12 text-green-500" />
              </motion.div>

              <h2 className="text-3xl font-light text-white mb-4">
                Kiểm tra Email của bạn
              </h2>
              <p className="text-gray-400 mb-2">
                Chúng tôi đã gửi link đặt lại mật khẩu đến
              </p>
              <p className="text-(--color-gold) font-medium mb-8">{email}</p>
              <p className="text-sm text-gray-500 mb-8">
                Vui lòng kiểm tra hộp thư đến (hoặc thư spam) và click vào link
                để đặt lại mật khẩu.
              </p>

              <div className="space-y-3">
                <Link href="/login">
                  <Button variant="luxury" size="lg" className="w-full">
                    Quay lại Đăng nhập
                  </Button>
                </Link>
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setEmail("");
                  }}
                  className="w-full px-6 py-3 text-gray-400 hover:text-white transition-colors"
                >
                  Gửi lại email
                </button>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-br from-(--color-charcoal) via-black to-(--color-charcoal-dark)" />
        <motion.div
          className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full liquid-glass blur-3xl"
          animate={{
            x: [0, 60, 0],
            y: [0, -40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/3 w-96 h-96 rounded-full bg-(--color-gold)/20 blur-3xl"
          animate={{
            x: [0, -60, 0],
            y: [0, 40, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-6">
        <AnimatedSection className="max-w-md mx-auto">
          {/* Logo/Brand */}
          <Link href="/" className="block text-center mb-8">
            <motion.h1
              className="text-4xl font-light tracking-wider"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-luxury">CUSTOM</span>
              <span className="text-white"> TAILOR</span>
            </motion.h1>
          </Link>

          {/* Forgot Password Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-luxury p-8 rounded-2xl"
          >
            {/* Back Button */}
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Quay lại</span>
            </Link>

            <h2 className="text-3xl font-light text-white mb-2">
              Quên Mật Khẩu?
            </h2>
            <p className="text-gray-400 mb-8">
              Nhập email của bạn và chúng tôi sẽ gửi link để đặt lại mật khẩu
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    className={`w-full pl-12 pr-4 py-3 bg-white/10 text-white placeholder-gray-400 border rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors ${
                      error ? "border-red-500" : "border-white/20"
                    }`}
                    placeholder="email@example.com"
                  />
                </div>
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="luxury"
                size="lg"
                className="w-full group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span>Đang xử lý...</span>
                ) : (
                  <>
                    <span>Gửi Link Đặt Lại</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
              <p className="text-sm text-gray-400">
                💡 <strong className="text-gray-300">Lưu ý:</strong> Link đặt
                lại mật khẩu sẽ có hiệu lực trong 24 giờ. Nếu không nhận được
                email, vui lòng kiểm tra thư mục spam.
              </p>
            </div>
          </motion.div>

          {/* Register Link */}
          <p className="mt-6 text-center text-gray-400">
            Chưa có tài khoản?{" "}
            <Link
              href="/register"
              className="text-(--color-gold) hover:text-(--color-gold-light) font-medium transition-colors"
            >
              Đăng ký ngay
            </Link>
          </p>
        </AnimatedSection>
      </div>
    </div>
  );
}
