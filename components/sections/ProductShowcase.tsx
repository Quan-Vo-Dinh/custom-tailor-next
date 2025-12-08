"use client";

import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const featuredProducts = [
  {
    id: "1",
    name: "Vest Doanh Nhân",
    category: "Vest Cao Cấp",
    price: "Từ 8.500.000₫",
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&q=80",
    description: "Thiết kế tinh tế, phom dáng hoàn hảo",
  },
  {
    id: "2",
    name: "Áo Sơ Mi Lụa",
    category: "Sơ Mi May Đo",
    price: "Từ 2.500.000₫",
    image:
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=1200&q=80",
    description: "Chất liệu cao cấp, đường may tỉ mỉ",
  },
  {
    id: "3",
    name: "Suit Wedding",
    category: "Vest Cưới",
    price: "Từ 15.000.000₫",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80",
    description: "Sang trọng cho ngày trọng đại",
  },
  {
    id: "4",
    name: "Áo Dài Truyền Thống",
    category: "Áo Dài Cao Cấp",
    price: "Từ 5.000.000₫",
    image:
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=1200&q=80",
    description: "Kết hợp truyền thống và hiện đại",
  },
];

export const ProductShowcase = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute top-20 right-0 w-96 h-96 rounded-full liquid-glass blur-3xl opacity-30"
          animate={{
            x: [0, -50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-20">
          <div className="inline-block">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-px bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent mb-8"
            />
          </div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light mb-6">
            Bộ Sưu Tập
            <br />
            <span className="text-luxury italic">Độc Quyền</span>
          </h2>

          <p className="text-lg md:text-xl text-[var(--color-charcoal-lighter)] max-w-2xl mx-auto font-light">
            Khám phá những thiết kế tinh túy, được chế tác thủ công
            <br className="hidden md:block" />
            từ những nghệ nhân tài hoa nhất
          </p>
        </AnimatedSection>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {featuredProducts.map((product, index) => (
            <AnimatedSection key={product.id} delay={index * 0.1}>
              <Link href={`/products/${product.id}`}>
                <motion.div
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="group relative"
                >
                  {/* Product Image Container */}
                  <div className="relative aspect-[3/4] mb-6 overflow-hidden rounded-lg">
                    {/* Glass overlay on hover */}
                    <motion.div
                      className="absolute inset-0 glass-luxury z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      initial={false}
                    />

                    {/* Image */}
                    <div className="absolute inset-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Quick View Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500"
                    >
                      <Button variant="luxury" size="sm">
                        Xem Chi Tiết
                      </Button>
                    </motion.div>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2">
                    <p className="text-xs tracking-widest uppercase text-[var(--color-gold)] font-medium">
                      {product.category}
                    </p>
                    <h3 className="text-xl font-light group-hover:text-[var(--color-gold)] transition-colors duration-300">
                      {product.name}
                    </h3>
                    <p className="text-sm text-[var(--color-charcoal-lighter)] font-light">
                      {product.description}
                    </p>
                    <p className="text-lg font-medium text-luxury pt-2">
                      {product.price}
                    </p>
                  </div>
                </motion.div>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        {/* View All Button */}
        <AnimatedSection delay={0.5} className="text-center">
          <Link href="/products">
            <Button variant="luxury" size="lg" className="group">
              <span className="flex items-center gap-2">
                Xem Toàn Bộ Bộ Sưu Tập
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Button>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
};
