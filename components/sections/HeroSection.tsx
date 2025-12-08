"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with white gradient overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/hero-section.jpg')",
          }}
        />

        {/* White gradient overlay from left side */}
        <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-12 py-32">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <AnimatedSection>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 glass-luxury px-6 py-3 rounded-full mb-8"
            >
              <Sparkles className="w-4 h-4 text-[var(--color-gold)]" />
              <span className="text-sm tracking-widest uppercase font-light">
                Thời trang may đo cao cấp
              </span>
            </motion.div>
          </AnimatedSection>

          {/* Main Heading */}
          <AnimatedSection delay={0.3}>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-light mb-6 leading-tight">
              Nghệ Thuật
              <br />
              <span className="text-luxury italic">May Đo Tinh Tế</span>
            </h1>
          </AnimatedSection>

          {/* Subheading */}
          <AnimatedSection delay={0.5}>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
              Từng đường kim mũi chỉ được chăm chút bởi những bàn tay tài hoa,
              <br className="hidden md:block" />
              tạo nên trang phục phản ánh đẳng cấp và phong cách riêng của bạn.
            </p>
          </AnimatedSection>

          {/* CTA Buttons */}
          <AnimatedSection delay={0.7}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/products">
                <Button variant="luxury" size="lg" className="group">
                  <span className="flex items-center gap-2">
                    Khám Phá Bộ Sưu Tập
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Button>
              </Link>
              <Link href="/custom">
                <Button variant="outline" size="lg">
                  Đặt May Riêng
                </Button>
              </Link>
            </div>
          </AnimatedSection>

          {/* Stats */}
          <AnimatedSection delay={0.9}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 glass-luxury p-8 rounded-2xl max-w-4xl mx-auto">
              {[
                { number: "15+", label: "Năm Kinh Nghiệm" },
                { number: "5000+", label: "Khách Hàng Hài Lòng" },
                { number: "100%", label: "Đo Lường Chính Xác" },
                { number: "24/7", label: "Hỗ Trợ Tận Tâm" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.6 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-light text-luxury mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm tracking-wider uppercase text-[var(--color-charcoal-lighter)]">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-[var(--color-gold)] rounded-full flex items-start justify-center p-2">
          <motion.div
            className="w-1.5 h-1.5 bg-[var(--color-gold)] rounded-full"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
};
