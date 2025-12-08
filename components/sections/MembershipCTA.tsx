"use client";

import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";
import { Crown, Gift, Star, Zap } from "lucide-react";

const benefits = [
  {
    icon: Crown,
    title: "Ưu Tiên Đặt Lịch",
    description:
      "Được ưu tiên trong việc đặt lịch hẹn và thời gian hoàn thành đơn hàng",
  },
  {
    icon: Gift,
    title: "Ưu Đãi Độc Quyền",
    description: "Giảm giá 15-25% cho tất cả sản phẩm và dịch vụ may đo",
  },
  {
    icon: Star,
    title: "Tư Vấn Riêng Biệt",
    description:
      "Stylist chuyên nghiệp tư vấn phong cách và xu hướng thời trang",
  },
  {
    icon: Zap,
    title: "Dịch Vụ VIP",
    description: "Giao hàng tận nơi miễn phí và bảo hành trọn đời cho sản phẩm",
  },
];

// Pre-generated particle positions to avoid hydration mismatch
const particlePositions = [
  { left: 15, top: 20 },
  { left: 85, top: 15 },
  { left: 25, top: 75 },
  { left: 70, top: 80 },
  { left: 45, top: 30 },
  { left: 60, top: 60 },
  { left: 10, top: 50 },
  { left: 90, top: 40 },
  { left: 35, top: 85 },
  { left: 75, top: 25 },
  { left: 20, top: 65 },
  { left: 55, top: 10 },
  { left: 80, top: 70 },
  { left: 40, top: 45 },
  { left: 65, top: 90 },
  { left: 30, top: 35 },
  { left: 50, top: 55 },
  { left: 95, top: 30 },
  { left: 5, top: 60 },
  { left: 72, top: 48 },
];

export const ExclusiveMembership = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-br from-(--color-charcoal) via-(--color-charcoal-light) to-(--color-burgundy)" />

        {/* Animated particles */}
        {particlePositions.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-(--color-gold) rounded-full"
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <AnimatedSection className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-(--color-gold) mb-8"
            >
              <Crown className="w-10 h-10 text-(--color-charcoal)" />
            </motion.div>

            <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6">
              Thành Viên
              <br />
              <span className="text-luxury italic">Đặc Quyền</span>
            </h2>

            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-light">
              Trải nghiệm dịch vụ cao cấp với những đặc quyền dành riêng
              <br className="hidden md:block" />
              cho khách hàng thân thiết của chúng tôi
            </p>
          </AnimatedSection>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <AnimatedSection key={benefit.title} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -10 }}
                  className="glass-dark p-8 rounded-lg text-center h-full border border-white/10 hover:border-(--color-gold) transition-all duration-500"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-(--color-gold)/20 mb-6">
                    <benefit.icon className="w-8 h-8 text-(--color-gold)" />
                  </div>
                  <h3 className="text-xl font-light text-white mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-400 font-light leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>

          {/* CTA Card */}
          <AnimatedSection delay={0.5}>
            <div className="glass-luxury p-12 rounded-2xl text-center">
              <div className="max-w-3xl mx-auto space-y-8">
                <div>
                  <h3 className="text-3xl md:text-4xl font-light text-white mb-4">
                    Tham Gia{" "}
                    <span className="text-luxury italic">Ngay Hôm Nay</span>
                  </h3>
                  <p className="text-gray-300 font-light">
                    Chỉ với 2.000.000₫/năm, trở thành thành viên đặc quyền và
                    tận hưởng
                    <br className="hidden md:block" />
                    những ưu đãi và dịch vụ cao cấp nhất
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button variant="luxury" size="lg" className="min-w-[200px]">
                    Đăng Ký Ngay
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="min-w-[200px] text-white border-white hover:bg-white hover:text-(--color-charcoal)"
                  >
                    Tìm Hiểu Thêm
                  </Button>
                </div>

                <p className="text-sm text-gray-400">
                  * Đăng ký thành viên trọn đời chỉ với 5.000.000₫ - Tiết kiệm
                  đến 60%
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};
