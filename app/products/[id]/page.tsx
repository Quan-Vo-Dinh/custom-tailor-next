"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { FabricSelector } from "@/components/FabricSelector";
import { StyleSelector } from "@/components/StyleSelector";
import { PriceCalculator } from "@/components/PriceCalculator";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import {
  Heart,
  Share2,
  ShoppingCart,
  Minus,
  Plus,
  ChevronRight,
  Sparkles,
  Shield,
  Ruler,
  Clock,
} from "lucide-react";
import {
  getMockProductById,
  mockFabrics,
  mockStyleOptions,
  calculateMockPrice,
} from "@/lib/mockData";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<{
    id: string;
    name: string;
    description: string;
    basePrice: number;
    images: string[];
  } | null>(null);
  const [selectedFabricId, setSelectedFabricId] = useState<string | null>(null);
  const [selectedStyleIds, setSelectedStyleIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const productData = getMockProductById(productId);
        if (!productData) {
          setError("Không tìm thấy sản phẩm");
          return;
        }

        setProduct(productData);

        // Set default fabric if available
        if (mockFabrics.length > 0) {
          setSelectedFabricId(mockFabrics[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleStyleToggle = (styleId: string) => {
    setSelectedStyleIds((prev) =>
      prev.includes(styleId)
        ? prev.filter((id) => id !== styleId)
        : [...prev, styleId]
    );
  };

  const handleShare = async () => {
    if (!product) return;

    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert("Đã sao chép link sản phẩm");
    }
  };

  const handleAddToCart = () => {
    if (!selectedFabricId) {
      alert("Vui lòng chọn vải");
      return;
    }

    // TODO: Implement add to cart logic
    alert("Sản phẩm đã được thêm vào giỏ hàng!");
  };

  const priceCalculation = product
    ? calculateMockPrice(
        product.basePrice,
        selectedFabricId || undefined,
        selectedStyleIds
      )
    : null;

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Đang tải sản phẩm..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center space-y-6">
          <ErrorMessage
            title={error || "Không tìm thấy sản phẩm"}
            message="Sản phẩm không tồn tại hoặc đã bị xóa."
            onRetry={() => router.push("/products")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-32 pb-20 overflow-hidden">
      {/* Background Elements - matching landing page */}
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
        <motion.div
          className="absolute bottom-40 left-0 w-96 h-96 rounded-full liquid-glass blur-3xl opacity-20"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-6 lg:px-12">
        {/* Breadcrumb */}
        <AnimatedSection>
          <nav className="flex items-center gap-2 text-sm mb-8 text-gray-400">
            <Link
              href="/"
              className="hover:text-(--color-gold) transition-colors"
            >
              Trang chủ
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href="/products"
              className="hover:text-(--color-gold) transition-colors"
            >
              Bộ sưu tập
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{product.name}</span>
          </nav>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          <AnimatedSection delay={0.1}>
            <ProductImageGallery
              images={product.images}
              productName={product.name}
            />
          </AnimatedSection>

          <div className="space-y-6">
            <AnimatedSection delay={0.2}>
              <div>
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-(--color-gold)/10 border border-(--color-gold)/20 mb-4">
                      <Sparkles className="w-3 h-3 text-(--color-gold)" />
                      <span className="text-xs text-(--color-gold) font-medium">
                        May Đo Cao Cấp
                      </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-light mb-4 leading-tight">
                      {product.name}
                    </h1>
                    <p className="text-lg text-gray-400 font-light leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsFavorite(!isFavorite)}
                      className={`p-3 rounded-lg border transition-all duration-300 cursor-pointer ${
                        isFavorite
                          ? "bg-red-500/10 border-red-500 text-red-500"
                          : "bg-white/5 border-white/20 text-gray-400 hover:border-(--color-gold) hover:text-(--color-gold)"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          isFavorite ? "fill-current" : ""
                        }`}
                      />
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-3 rounded-lg bg-white/5 border border-white/20 text-gray-400 hover:border-(--color-gold) hover:text-(--color-gold) transition-all duration-300 cursor-pointer"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="p-2 rounded-lg bg-(--color-gold)/10">
                      <Ruler className="w-5 h-5 text-(--color-gold)" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">
                        May Đo
                      </div>
                      <div className="text-xs text-gray-400">Theo số đo</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="p-2 rounded-lg bg-(--color-gold)/10">
                      <Shield className="w-5 h-5 text-(--color-gold)" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">
                        Bảo Hành
                      </div>
                      <div className="text-xs text-gray-400">12 tháng</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="p-2 rounded-lg bg-(--color-gold)/10">
                      <Clock className="w-5 h-5 text-(--color-gold)" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">
                        Giao Hàng
                      </div>
                      <div className="text-xs text-gray-400">5-7 ngày</div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <GlassCard className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-white mb-1">
                    Chọn Loại Vải
                    {!selectedFabricId && (
                      <span className="text-red-400 text-sm ml-2">*</span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Vải cao cấp nhập khẩu, đa dạng màu sắc và chất liệu
                  </p>
                </div>
                <FabricSelector
                  fabrics={mockFabrics}
                  selectedFabricId={selectedFabricId}
                  onSelect={setSelectedFabricId}
                />
              </GlassCard>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <GlassCard className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-white mb-1">
                    Tùy Chọn Kiểu Dáng
                    <span className="text-gray-500 text-sm ml-2 font-normal">
                      (Không bắt buộc)
                    </span>
                  </h3>
                  <p className="text-sm text-gray-400">
                    Chọn nhiều tùy chọn để tạo phong cách riêng của bạn
                  </p>
                </div>
                <StyleSelector
                  styles={mockStyleOptions}
                  selectedStyleIds={selectedStyleIds}
                  onToggle={handleStyleToggle}
                />
              </GlassCard>
            </AnimatedSection>

            <AnimatedSection delay={0.5}>
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-1">
                      Số Lượng
                    </h3>
                    <p className="text-sm text-gray-400">
                      Mỗi sản phẩm được may đo riêng biệt
                    </p>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-xl font-light w-8 text-center text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="p-1.5 rounded hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            </AnimatedSection>

            {/* Price Display with Add to Cart */}
            <AnimatedSection delay={0.6}>
              <GlassCard className="p-6 border-2 border-(--color-gold)/20">
                {priceCalculation && (
                  <div className="mb-6">
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-sm text-gray-400">Tổng cộng:</span>
                      <div className="text-right">
                        <div className="text-3xl font-light text-(--color-gold)">
                          {(
                            (priceCalculation.basePrice +
                              priceCalculation.fabricPrice +
                              priceCalculation.stylePrice) *
                            quantity
                          ).toLocaleString("vi-VN")}
                          ₫
                        </div>
                        {quantity > 1 && (
                          <div className="text-xs text-gray-500">
                            {(
                              priceCalculation.basePrice +
                              priceCalculation.fabricPrice +
                              priceCalculation.stylePrice
                            ).toLocaleString("vi-VN")}
                            ₫ x {quantity}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1 text-xs text-gray-400">
                      <div className="flex justify-between">
                        <span>Giá cơ bản:</span>
                        <span>
                          {priceCalculation.basePrice.toLocaleString("vi-VN")}₫
                        </span>
                      </div>
                      {priceCalculation.fabricPrice > 0 && (
                        <div className="flex justify-between">
                          <span>Vải:</span>
                          <span className="text-(--color-gold)">
                            +
                            {priceCalculation.fabricPrice.toLocaleString(
                              "vi-VN"
                            )}
                            ₫
                          </span>
                        </div>
                      )}
                      {priceCalculation.stylePrice > 0 && (
                        <div className="flex justify-between">
                          <span>Kiểu dáng:</span>
                          <span className="text-(--color-gold)">
                            +
                            {priceCalculation.stylePrice.toLocaleString(
                              "vi-VN"
                            )}
                            ₫
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <Button
                  variant="luxury"
                  size="lg"
                  className="w-full"
                  onClick={handleAddToCart}
                  disabled={!selectedFabricId}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {!selectedFabricId
                    ? "Vui lòng chọn vải"
                    : "Thêm Vào Giỏ Hàng"}
                </Button>

                {!selectedFabricId && (
                  <p className="text-xs text-red-400 text-center mt-3">
                    * Bạn cần chọn loại vải trước khi thêm vào giỏ hàng
                  </p>
                )}
              </GlassCard>
            </AnimatedSection>
          </div>
        </div>

        {/* Price Calculator - Detailed Breakdown */}
        {priceCalculation && (
          <AnimatedSection delay={0.7} className="mt-12">
            <h2 className="text-2xl font-light mb-6 text-center">
              Chi Tiết Giá Cả
            </h2>
            <PriceCalculator
              basePrice={priceCalculation.basePrice}
              fabricPrice={priceCalculation.fabricPrice}
              stylePrice={priceCalculation.stylePrice}
              quantity={quantity}
            />
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}
