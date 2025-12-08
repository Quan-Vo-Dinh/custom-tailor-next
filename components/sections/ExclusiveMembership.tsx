"use client";

import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";
import { Crown, Gift, Star, Zap } from "lucide-react";

const benefits = [
  {
    icon: Crown,
    title: "Ưu Tiên Phục Vụ",
    description: "Đặt lịch ưu tiên, không cần chờ đợi",
  },
  {
    icon: Gift,
    title: "Ưu Đãi Đặc Biệt",
    description: "Giảm giá 20% cho mọi đơn hàng",
  },
  {
    icon: Star,
    title: "Chăm Sóc VIP",
    description: "Nhân viên tư vấn riêng 24/7",
  },
  {
    icon: Zap,
    title: "Sản Phẩm Độc Quyền",
    description: "Truy cập sớm bộ sưu tập mới",
  },
];

export const ExclusiveMembership = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-charcoal)] via-[var(--color-charcoal-light)] to-[var(--color-burgundy)]" />

        {/* Animated Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          {/* Main Content */}
          <AnimatedSection className="text-center mb-16">
            {/* Crown Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring" }}
              className="inline-flex mb-8"
            >
              <div className="w-20 h-20 rounded-full bg-[var(--color-gold)] flex items-center justify-center animate-pulse-gold">
                <Crown className="w-10 h-10 text-[var(--color-charcoal)]" />
              </div>
            </motion.div>

            <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6">
              Thành Viên
              <br />
              <span className="text-luxury italic">Đặc Quyền</span>
            </h2>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-4 font-light">
              Gia nhập cộng đồng khách hàng VIP và tận hưởng
              <br className="hidden md:block" />
              những đặc quyền cao cấp dành riêng cho bạn
            </p>

            <div className="inline-flex items-center gap-2 glass-dark px-6 py-3 rounded-full mt-4">
              <span className="text-sm text-[var(--color-gold)] tracking-widest uppercase font-medium">
                Chỉ còn 50 suất duy nhất
              </span>
            </div>
          </AnimatedSection>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {benefits.map((benefit, index) => (
              <AnimatedSection key={benefit.title} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="glass-dark p-6 rounded-xl text-center h-full border border-white/10 hover:border-[var(--color-gold)]/50 transition-all duration-500"
                >
                  <div className="w-14 h-14 rounded-full bg-[var(--color-gold)]/20 flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-7 h-7 text-[var(--color-gold)]" />
                  </div>
                  <h3 className="text-lg font-light text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-400 font-light">
                    {benefit.description}
                  </p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>

          {/* Pricing Card */}
          <AnimatedSection delay={0.5}>
            <div className="glass-luxury rounded-2xl p-12 text-center relative overflow-hidden">
              {/* Shimmer Effect */}
              <div className="absolute inset-0 shimmer" />

              <div className="relative z-10">
                <div className="inline-block mb-6">
                  <div className="text-sm tracking-widest uppercase text-[var(--color-gold)] font-medium mb-2">
                    Gói Thành Viên Năm
                  </div>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-6xl md:text-7xl font-light text-white">
                      5.000.000
                    </span>
                    <span className="text-2xl text-gray-400">₫/năm</span>
                  </div>
                  <div className="text-sm text-gray-400 mt-2">
                    Hoặc 450.000₫/tháng
                  </div>
                </div>

                <div className="space-y-3 mb-8 max-w-md mx-auto">
                  {[
                    "Miễn phí đo lường và tư vấn",
                    "Giảm 20% tất cả sản phẩm",
                    "Bảo hành trọn đời",
                    "Sửa chữa & chỉnh sửa miễn phí",
                    "Quà tặng sinh nhật đặc biệt",
                  ].map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center justify-center gap-3 text-gray-300"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
                      <span className="text-sm font-light">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button variant="luxury" size="lg" className="min-w-[240px]">
                    Đăng Ký Ngay
                  </Button>
                  <button className="text-sm text-gray-300 hover:text-[var(--color-gold)] transition-colors underline">
                    Tìm hiểu thêm
                  </button>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Trust Badges */}
          <AnimatedSection delay={0.7} className="text-center mt-12">
            <div className="flex flex-wrap items-center justify-center gap-8 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-[var(--color-gold)]" />
                <span>5000+ Thành viên</span>
              </div>
              <div className="w-px h-4 bg-gray-600" />
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-[var(--color-gold)]" />
                <span>Đánh giá 4.9/5</span>
              </div>
              <div className="w-px h-4 bg-gray-600" />
              <div>Hủy bất cứ lúc nào</div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};
