"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { GlassCard } from "./GlassCard";
import { ArrowRight } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    category: string;
    basePrice: number;
    images: string[];
    featured?: boolean;
  };
  index?: number;
}

export const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <Link href={`/products/${product.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ y: -8 }}
        className="group"
      >
        <GlassCard variant="luxury" className="overflow-hidden h-full">
          {/* Product Image */}
          <div className="relative aspect-3/4 overflow-hidden bg-gray-100">
            <Image
              src={product.images[0] || "/placeholder-product.jpg"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {product.featured && (
              <div className="absolute top-4 right-4 px-3 py-1 bg-[var(--color-gold)] text-[var(--color-charcoal)] text-xs font-medium tracking-wider uppercase">
                Nổi bật
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-6 space-y-3">
            <div className="text-xs tracking-widest uppercase text-(--color-charcoal-lighter)">
              {product.category}
            </div>
            <h3 className="text-xl font-light group-hover:text-(--color-gold) transition-colors duration-300">
              {product.name}
            </h3>
            <div className="flex items-center justify-between">
              <div className="text-lg font-medium text-(--color-gold)">
                {formatPrice(product.basePrice)}
              </div>
              <ArrowRight className="w-5 h-5 text-(--color-charcoal-lighter) group-hover:text-(--color-gold) group-hover:translate-x-2 transition-all duration-300" />
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </Link>
  );
};
