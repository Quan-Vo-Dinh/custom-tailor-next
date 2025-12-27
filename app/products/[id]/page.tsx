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
import { toast } from "react-hot-toast";
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
import { mockFabrics, mockStyleOptions } from "@/lib/mockData";
import {
  getProductById,
  getFabrics,
  getStyleOptions,
} from "@/services/products";
import { Product } from "@/types";

type StoredCartItem = {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    images: string[];
    basePrice: number;
  };
  fabricId: string;
  fabric: {
    id: string;
    name: string;
    color: string;
    price: number;
  };
  styleOptionIds: string[];
  styles: Array<{
    id: string;
    name: string;
    priceModifier: number;
  }>;
  quantity: number;
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [fabrics, setFabrics] = useState<Product["availableFabrics"]>([]);
  const [styleOptions, setStyleOptions] = useState<Product["availableStyles"]>(
    []
  );
  const [selectedFabricId, setSelectedFabricId] = useState<string | null>(null);
  const [selectedStyleIds, setSelectedStyleIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Compute a safe fallback fabric id
  const effectiveFabricId =
    selectedFabricId ||
    fabrics[0]?.id ||
    product?.availableFabrics?.[0]?.id ||
    mockFabrics[0]?.id ||
    null;

  // Ensure we always have a default fabric once data is available
  useEffect(() => {
    if (!selectedFabricId) {
      const fallbackFabricId =
        fabrics[0]?.id ||
        mockFabrics[0]?.id ||
        product?.availableFabrics?.[0]?.id;
      if (fallbackFabricId) {
        setSelectedFabricId(fallbackFabricId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fabrics, product?.availableFabrics]);

  // Helper: Get fabric code (V1, V2, etc.) from fabric name
  const getFabricCode = (fabricName: string): string | null => {
    const nameLower = fabricName.toLowerCase();
    if (nameLower.includes("cotton ai cập") || nameLower.includes("trắng"))
      return "V1";
    if (nameLower.includes("wool luxury") || nameLower.includes("xanh navy"))
      return "V2";
    if (nameLower.includes("linen premium") || nameLower.includes("be"))
      return "V3";
    if (nameLower.includes("wool cashmere") || nameLower.includes("xám than"))
      return "V4";
    if (nameLower.includes("silk cotton") || nameLower.includes("xanh nhạt"))
      return "V5";
    if (nameLower.includes("mohair blend") || nameLower.includes("đen"))
      return "V6";
    return null;
  };

  // Helper: Get style code from style option name
  const getStyleCode = (
    styleName: string,
    styleType: string
  ): string | null => {
    const nameLower = styleName.toLowerCase();

    // Nút áo
    if (styleType === "Nút áo") {
      if (nameLower.includes("kim loại vàng") || nameLower.includes("n1"))
        return "N1";
      if (nameLower.includes("vân sừng") || nameLower.includes("n2"))
        return "N2";
      if (nameLower.includes("kim loại premium") || nameLower.includes("n3"))
        return "N3";
    }

    // Kiểu tay
    if (styleType === "Kiểu tay") {
      if (nameLower.includes("dài thông thường") || nameLower.includes("t2"))
        return "T2";
      if (nameLower.includes("bồng") || nameLower.includes("t3")) return "T3";
      if (nameLower.includes("dài có gấu") || nameLower.includes("t4"))
        return "T4";
    }

    // Kiểu cổ
    if (styleType === "Kiểu cổ") {
      if (nameLower.includes("shawl") || nameLower.includes("c2")) return "C2";
      if (nameLower.includes("tròn") || nameLower.includes("c3")) return "C3";
    }

    // Túi áo
    if (styleType === "Túi áo") {
      if (nameLower.includes("nắp cài nút")) return "pocket";
      if (nameLower.includes("không có túi")) return "no-pocket";
    }

    return null;
  };

  // Get main display image based on selected fabric AND style options (for SP TEST demo product)
  const getMainDisplayImage = (): string => {
    if (!product) return "";

    // Check if this is the demo product "Váy May Đo Cao Cấp"
    const isDemoProduct =
      product.name === "Váy May Đo Cao Cấp" ||
      product.name.toLowerCase().includes("váy may đo");

    if (!isDemoProduct) {
      return product.images[0] || "";
    }

    // Find selected fabric
    const selectedFabric =
      fabrics.find((f) => f.id === selectedFabricId) ||
      product.availableFabrics?.find((f) => f.id === selectedFabricId);

    if (!selectedFabric) {
      return product.images[0] || "";
    }

    const fabricCode = getFabricCode(selectedFabric.name);
    if (!fabricCode) {
      return product.images[0] || "";
    }

    // Get selected style codes in order: Nút áo -> Kiểu tay -> Kiểu cổ -> Túi áo
    const styleTypeOrder = ["Nút áo", "Kiểu tay", "Kiểu cổ", "Túi áo"];
    const selectedStyleCodes: string[] = [];

    // Get the actual style options data
    const allStyleOptions =
      styleOptions.length > 0 ? styleOptions : mockStyleOptions;

    for (const styleType of styleTypeOrder) {
      const selectedStyle = allStyleOptions.find(
        (s: any) =>
          selectedStyleIds.includes(s.id) &&
          (s.type === styleType || s.category === styleType)
      );
      if (selectedStyle) {
        const code = getStyleCode(selectedStyle.name, styleType);
        if (code && code !== "no-pocket") {
          selectedStyleCodes.push(code);
        }
      }
    }

    // Build mockup image path based on selected combo
    // Format: V1 -> V1-N3 -> V1-N3-T4 -> V1-N3-T4-C2 -> etc.
    let bestMatchIndex = 0; // Default to fabric only (index 0 = V1)

    // Map fabric code to image index
    const fabricIndexMap: Record<string, number> = {
      V1: 0,
      V2: 1,
      V3: 2,
      V4: 3,
      V5: 4,
      V6: 5,
    };
    bestMatchIndex = fabricIndexMap[fabricCode] ?? 0;

    // Try to find the most specific mockup in product images
    // Product images are named progressively: V1.png, V1-N3.png, V1-N3-T4.png, V1-N3-T4-C2.png
    // But the actual filenames might use different separators and names
    if (selectedStyleCodes.length > 0) {
      // Build progressive paths and find the best match
      const currentCodes: string[] = [fabricCode];

      for (let i = 0; i < selectedStyleCodes.length; i++) {
        currentCodes.push(selectedStyleCodes[i]);

        // Check if there's a matching image that contains ALL current codes in sequence
        const matchingImageIndex = product.images.findIndex((img) => {
          try {
            const decodedImg = decodeURIComponent(img).toLowerCase();

            // Check if image contains all codes in the correct order
            let lastIndex = -1;
            for (const code of currentCodes) {
              const codeLower = code.toLowerCase();
              // For collar codes like C2, also check for "cổ shawl"
              const searchPatterns = [codeLower];
              if (codeLower === "c2")
                searchPatterns.push("cổ shawl", "co shawl", "shawl");
              if (codeLower === "c3")
                searchPatterns.push("cổ tròn", "co tron", "tròn");
              if (codeLower === "t4")
                searchPatterns.push("tay dài có gấu", "gấu", "gau");
              if (codeLower === "t3")
                searchPatterns.push("tay bồng", "bồng", "bong");
              if (codeLower === "n3")
                searchPatterns.push("kim loại premium", "premium");
              if (codeLower === "n2")
                searchPatterns.push("vân sừng", "sừng", "sung");
              if (codeLower === "n1")
                searchPatterns.push("kim loại vàng", "vàng", "vang");
              if (codeLower === "pocket")
                searchPatterns.push("túi", "tui", "nắp");

              let found = false;
              for (const pattern of searchPatterns) {
                const patternIndex = decodedImg.indexOf(pattern, lastIndex + 1);
                if (patternIndex > lastIndex) {
                  lastIndex = patternIndex;
                  found = true;
                  break;
                }
              }

              if (!found) return false;
            }
            return true;
          } catch {
            return false;
          }
        });

        if (matchingImageIndex >= 0) {
          bestMatchIndex = matchingImageIndex;
        }
      }
    }

    // Return the best matching image (single image for main display)
    if (bestMatchIndex >= 0 && bestMatchIndex < product.images.length) {
      return product.images[bestMatchIndex];
    }

    return product.images[0] || "";
  };

  // Get fixed 4 thumbnail images (fabric-only mockups: V1, V2, V3, V4)
  const getThumbnailImages = (): string[] => {
    if (!product || !product.images || product.images.length === 0) return [];

    // Check if this is the demo product
    const isDemoProduct =
      product.name === "Váy May Đo Cao Cấp" ||
      product.name.toLowerCase().includes("váy may đo");

    if (!isDemoProduct) {
      // For non-demo products, return first 4 images
      return product.images.slice(0, 4);
    }

    // For demo product, find fabric-only images (V1, V2, V3, V4)
    // These are images that have only fabric code, not combo codes
    const fabricCodes = ["v1", "v2", "v3", "v4"];
    const fabricOnlyImages: string[] = [];

    for (const code of fabricCodes) {
      const fabricImage = product.images.find((img) => {
        try {
          const decodedImg = decodeURIComponent(img).toLowerCase();
          // Check if image contains this fabric code
          const hasCode = decodedImg.includes(code);
          // Make sure it's not a combo image (doesn't have style codes like N, T, C)
          const isCombo = /[nN]\d|[tT]\d|[cC]\d|túi|pocket/i.test(decodedImg);
          return hasCode && !isCombo;
        } catch {
          return false;
        }
      });
      if (fabricImage) {
        fabricOnlyImages.push(fabricImage);
      }
    }

    // If we found fabric images, return them; otherwise return first 4 product images
    if (fabricOnlyImages.length > 0) {
      return fabricOnlyImages.slice(0, 4);
    }

    return product.images.slice(0, 4);
  };

  const mainDisplayImage = getMainDisplayImage();
  const thumbnailImages = getThumbnailImages();

  // Handler when thumbnail is clicked - change selected fabric
  const handleThumbnailClick = (index: number) => {
    // Map thumbnail index to fabric
    const fabricCodes = ["V1", "V2", "V3", "V4"];
    const fabricCode = fabricCodes[index];

    if (fabricCode) {
      // Find the fabric with this code
      const allFabrics = fabrics.length > 0 ? fabrics : mockFabrics;
      const fabric = allFabrics.find((f) => {
        const fCode = getFabricCode(f.name);
        return fCode === fabricCode;
      });

      if (fabric) {
        setSelectedFabricId(fabric.id);
      }
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch product from API
        const productData = await getProductById(productId);
        setProduct(productData);

        // Fetch fabrics and style options for this product
        const [fabricsData, stylesData] = await Promise.all([
          getFabrics({ productId }).catch(() => []),
          getStyleOptions({ productId }).catch(() => []),
        ]);

        setFabrics(fabricsData);
        setStyleOptions(stylesData);

        // Set default fabric with graceful fallback
        const defaultFabricId =
          fabricsData[0]?.id ||
          productData.availableFabrics?.[0]?.id ||
          mockFabrics[0]?.id ||
          null;
        if (defaultFabricId) {
          setSelectedFabricId(defaultFabricId);
        }
      } catch (err) {
        // Don't fallback to mock data - show error instead
        console.error("Failed to load product:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Không thể tải thông tin sản phẩm"
        );
        // const productData = getMockProductById(productId);
        // if (!productData) {
        //   setError("Không tìm thấy sản phẩm");
        //   return;
        // }
        // setProduct(productData as any);
        // setFabrics(mockFabrics);
        // setStyleOptions(mockStyleOptions);
        // if (mockFabrics.length > 0) {
        //   setSelectedFabricId(mockFabrics[0].id);
        // }
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleStyleToggle = (styleId: string) => {
    // Get all style options to determine the category of the clicked style
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allStyleOptions: any[] =
      styleOptions.length > 0 ? styleOptions : mockStyleOptions;
    const clickedStyle = allStyleOptions.find((s) => s.id === styleId);

    if (!clickedStyle) {
      return;
    }

    // Get the category (type) of the clicked style
    // API data uses "type", mock data uses "category"
    const clickedCategory =
      clickedStyle.type || clickedStyle.category || "Khác";

    setSelectedStyleIds((prev) => {
      // If already selected, just deselect it
      if (prev.includes(styleId)) {
        return prev.filter((id) => id !== styleId);
      }

      // Otherwise, remove any other styles from the same category and add this one
      // This ensures only ONE style per category is selected
      const otherCategoryIds = prev.filter((id) => {
        const style = allStyleOptions.find((s) => s.id === id);
        if (!style) return true; // Keep unknown styles
        const styleCategory = style.type || style.category || "Khác";
        return styleCategory !== clickedCategory;
      });

      return [...otherCategoryIds, styleId];
    });
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
      toast.success("Đã sao chép link sản phẩm");
    }
  };

  const handleAddToCart = () => {
    console.log("selectedFabricId", selectedFabricId);
    const fabricIdToUse = selectedFabricId || effectiveFabricId;
    if (!fabricIdToUse) {
      toast.error("Vui lòng chọn vải");
      return;
    }

    if (!product) return;

    const fabric =
      fabrics.find((f) => f.id === fabricIdToUse) ||
      product.availableFabrics.find((f) => f.id === fabricIdToUse) ||
      mockFabrics.find((f) => f.id === fabricIdToUse);
    const selectedStyles = styleOptions.filter((s) =>
      selectedStyleIds.includes(s.id)
    );

    let cartItems: StoredCartItem[] = [];
    try {
      const cartData = localStorage.getItem("cart");
      const parsed = cartData ? JSON.parse(cartData) : [];
      if (Array.isArray(parsed)) {
        cartItems = parsed as StoredCartItem[];
      } else {
        cartItems = [];
      }
    } catch {
      cartItems = [];
    }

    // If somehow still no fabric selected, try fallback once before error
    if (!selectedFabricId && effectiveFabricId) {
      setSelectedFabricId(effectiveFabricId);
    }

    const fabricPrice = Number(fabric?.price) || 0;

    const newItem = {
      id: `${product.id}-${fabricIdToUse}-${Date.now()}`,
      productId: product.id,
      product: {
        id: product.id,
        name: product.name,
        images: product.images || [],
        basePrice: product.basePrice,
      },
      fabricId: fabricIdToUse,
      fabric: {
        id: fabric?.id || fabricIdToUse,
        name: fabric?.name || "Chất liệu tùy chọn",
        color: fabric?.color || "",
        price: fabricPrice,
      },
      styleOptionIds: selectedStyleIds,
      styles: selectedStyles.map((s) => ({
        id: s.id,
        name: s.name,
        priceModifier: s.priceModifier,
      })),
      quantity,
    };

    const nextCart = [...cartItems, newItem];
    localStorage.setItem("cart", JSON.stringify(nextCart));
    toast.success("Đã thêm sản phẩm vào giỏ hàng");
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  // Calculate price from actual API data (not mock data)
  const calculatePrice = () => {
    if (!product) return null;

    const basePrice =
      typeof product.basePrice === "number"
        ? product.basePrice
        : Number(product.basePrice) || 0;

    // Get fabric price from API data
    const allFabrics =
      fabrics.length > 0 ? fabrics : product.availableFabrics || [];
    const selectedFabric = allFabrics.find((f) => f.id === selectedFabricId);
    const fabricPrice = selectedFabric ? Number(selectedFabric.price) || 0 : 0;

    // Get style prices from API data
    const allStyles = styleOptions.length > 0 ? styleOptions : [];
    let stylePrice = 0;
    if (selectedStyleIds.length > 0) {
      selectedStyleIds.forEach((styleId) => {
        const style = allStyles.find((s) => s.id === styleId);
        if (style) {
          stylePrice += Number(style.priceModifier) || 0;
        }
      });
    }

    const subtotal = basePrice + fabricPrice + stylePrice;

    return {
      basePrice,
      fabricPrice,
      stylePrice,
      subtotal,
    };
  };

  const priceCalculation = calculatePrice();

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
          {/* Left Column - Image Gallery & Fabric Selector */}
          <div className="space-y-6">
            <AnimatedSection delay={0.1}>
              <ProductImageGallery
                images={product.images}
                productName={product.name}
                mainImage={mainDisplayImage}
                thumbnailImages={thumbnailImages}
                onThumbnailClick={handleThumbnailClick}
              />
            </AnimatedSection>

            {/* Fabric Selector - Moved to left column */}
            <AnimatedSection delay={0.15}>
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
                  fabrics={fabrics.length > 0 ? fabrics : mockFabrics}
                  selectedFabricId={selectedFabricId}
                  onSelect={setSelectedFabricId}
                />
              </GlassCard>
            </AnimatedSection>
          </div>

          {/* Right Column - Product Info & Options */}
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
                    Tùy Chọn Kiểu Dáng
                    <span className="text-gray-500 text-sm ml-2 font-normal">
                      (Không bắt buộc)
                    </span>
                  </h3>
                  <p className="text-sm text-gray-400">
                    Chọn 1 tùy chọn mỗi loại để tạo phong cách riêng của bạn
                  </p>
                </div>
                <StyleSelector
                  styles={
                    styleOptions.length > 0 ? styleOptions : mockStyleOptions
                  }
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
                  className={`w-full ${
                    effectiveFabricId
                      ? "cursor-pointer"
                      : "cursor-not-allowed opacity-70"
                  }`}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {!effectiveFabricId
                    ? "Không có vải khả dụng"
                    : "Thêm Vào Giỏ Hàng"}
                </Button>

                {!selectedFabricId && (
                  <p className="text-xs text-red-400 text-center mt-3">
                    * Bạn cần chọn loại vải trước khi thêm vào giỏ hàng
                  </p>
                )}
                {addedFeedback && (
                  <p className="text-xs text-green-400 text-center mt-2">
                    Đã thêm vào giỏ hàng
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
