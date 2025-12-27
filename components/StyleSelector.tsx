"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Style } from "@/types";

interface StyleSelectorProps {
  styles: Style[];
  selectedStyleIds: string[];
  onToggle: (styleId: string) => void;
}

export const StyleSelector = ({
  styles,
  selectedStyleIds,
  onToggle,
}: StyleSelectorProps) => {
  // Get style category - support both `category` and `type` fields
  const getStyleCategory = (style: Style): string => {
    return style.type || style.category || "Khác";
  };

  // Get style price - support both `priceModifier` and `priceAdjustment` fields
  const getStylePrice = (style: Style): number => {
    if (style.priceAdjustment !== undefined) {
      return typeof style.priceAdjustment === "string"
        ? parseFloat(style.priceAdjustment)
        : style.priceAdjustment;
    }
    return style.priceModifier || 0;
  };

  // Get style image
  const getStyleImage = (style: Style): string | null => {
    if (!style.imageUrl) return null;
    return decodeURIComponent(style.imageUrl);
  };

  // Group styles by category (using type field from API)
  const groupedStyles = styles.reduce((acc, style) => {
    const category = getStyleCategory(style);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(style);
    return acc;
  }, {} as Record<string, Style[]>);

  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    Object.keys(groupedStyles)[0] || "", // Expand first category by default
  ]);

  const formatPrice = (price: number) => {
    if (price === 0) return "Miễn phí";
    const sign = price > 0 ? "+" : "";
    return `${sign}${new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)}`;
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const getCategorySelectedCount = (categoryStyles: Style[]) => {
    return categoryStyles.filter((style) => selectedStyleIds.includes(style.id))
      .length;
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {Object.entries(groupedStyles).map(([category, categoryStyles]) => {
          const isExpanded = expandedCategories.includes(category);
          const selectedCount = getCategorySelectedCount(categoryStyles);

          return (
            <div
              key={category}
              className="glass-luxury rounded-lg overflow-hidden"
            >
              {/* Category Header - Clickable */}
              <button
                onClick={() => toggleCategory(category)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <h4 className="text-sm font-semibold capitalize">
                    {category}
                  </h4>
                  {selectedCount > 0 && (
                    <span className="px-2 py-0.5 bg-gold/20 text-gold text-xs rounded-full font-medium">
                      {selectedCount}
                    </span>
                  )}
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 opacity-60" />
                ) : (
                  <ChevronDown className="w-4 h-4 opacity-60" />
                )}
              </button>

              {/* Category Content - Collapsible */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 space-y-1.5">
                      {categoryStyles.map((style) => {
                        const isSelected = selectedStyleIds.includes(style.id);
                        const price = getStylePrice(style);
                        const imageUrl = getStyleImage(style);

                        return (
                          <button
                            key={style.id}
                            onClick={() => onToggle(style.id)}
                            className="w-full text-left cursor-pointer"
                          >
                            <div
                              className={`p-2.5 rounded border transition-all duration-200 ${
                                isSelected
                                  ? "bg-gold/10 border-gold"
                                  : "border-transparent hover:border-white/10 hover:bg-white/5"
                              }`}
                            >
                              <div className="flex items-start gap-2.5">
                                {/* Style Image (if available) */}
                                {imageUrl && (
                                  <div className="relative w-12 h-12 rounded overflow-hidden shrink-0 bg-gray-800">
                                    <Image
                                      src={imageUrl}
                                      alt={style.name}
                                      fill
                                      className="object-cover"
                                      unoptimized
                                    />
                                  </div>
                                )}

                                {/* Radio indicator (only show if no image) */}
                                {!imageUrl && (
                                  <div
                                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all shrink-0 mt-0.5 ${
                                      isSelected
                                        ? "bg-gold border-gold"
                                        : "border-white/20"
                                    }`}
                                  >
                                    {isSelected && (
                                      <div className="w-2 h-2 rounded-full bg-black" />
                                    )}
                                  </div>
                                )}

                                {/* Style Info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                      <h5 className="font-medium text-xs leading-tight">
                                        {style.name}
                                      </h5>
                                      {imageUrl && isSelected && (
                                        <div className="bg-gold rounded-full p-0.5">
                                          <Check className="w-2.5 h-2.5 text-black" />
                                        </div>
                                      )}
                                    </div>
                                    <span className="text-luxury font-semibold text-xs whitespace-nowrap">
                                      {formatPrice(price)}
                                    </span>
                                  </div>
                                  {style.description && (
                                    <p className="text-xs opacity-60 mt-0.5 leading-snug font-light">
                                      {style.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
