"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
  ArrowLeft,
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
        <AnimatedSection>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[var(--color-charcoal-lighter)] hover:text-[var(--color-gold)] mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-light">Quay lại</span>
          </button>
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
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-4xl md:text-5xl font-light mb-4 leading-tight">
                    {product.name}
                  </h1>
                  <p className="text-lg text-[var(--color-charcoal-lighter)] font-light">
                    {product.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-3 rounded-lg glass-luxury border border-transparent transition-all duration-300 ${
                      isFavorite
                        ? "!bg-red-50 !border-red-600 text-red-600"
                        : "hover:border-[var(--color-gold)]"
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`}
                    />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-3 rounded-lg glass-luxury border border-transparent hover:border-[var(--color-gold)] transition-all duration-300"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="glass-luxury p-6 rounded-xl">
                <FabricSelector
                  fabrics={mockFabrics}
                  selectedFabricId={selectedFabricId}
                  onSelect={setSelectedFabricId}
                />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <div className="glass-luxury p-6 rounded-xl">
                <StyleSelector
                  styles={mockStyleOptions}
                  selectedStyleIds={selectedStyleIds}
                  onToggle={handleStyleToggle}
                />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.5}>
              <GlassCard variant="luxury" className="p-6">
                <h3 className="text-lg font-medium mb-4">Số Lượng</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="p-3 rounded-lg glass-luxury border border-transparent hover:border-gold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-2xl font-light w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-3 rounded-lg glass-luxury border border-transparent hover:border-gold transition-all duration-300"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </GlassCard>
            </AnimatedSection>

            <AnimatedSection delay={0.6}>
              <Button
                variant="luxury"
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
                disabled={!selectedFabricId}
              >
                <ShoppingCart className="w-5 h-5" />
                Thêm Vào Giỏ Hàng
              </Button>
            </AnimatedSection>

            {!selectedFabricId && (
              <AnimatedSection delay={0.7}>
                <p className="text-sm text-red-400 text-center font-light">
                  * Vui lòng chọn loại vải để tiếp tục
                </p>
              </AnimatedSection>
            )}
          </div>
        </div>

        {priceCalculation && (
          <AnimatedSection delay={0.8}>
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
