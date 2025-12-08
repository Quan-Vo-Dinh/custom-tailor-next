"use client";

import { useState } from "react";
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
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    Object.keys(
      styles.reduce((acc, style) => {
        acc[style.category] = true;
        return acc;
      }, {} as Record<string, boolean>)
    )[0] || "", // Expand first category by default
  ]);

  const formatPrice = (price: number) => {
    if (price === 0) return "Miễn phí";
    const sign = price > 0 ? "+" : "";
    return `${sign}${new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)}`;
  };

  // Group styles by category
  const groupedStyles = styles.reduce((acc, style) => {
    if (!acc[style.category]) {
      acc[style.category] = [];
    }
    acc[style.category].push(style);
    return acc;
  }, {} as Record<string, Style[]>);

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
      <div>
        <h3 className="text-lg font-medium">Tùy Chọn Kiểu Dáng</h3>
        <p className="text-xs opacity-60 font-light">
          Chọn các tùy chọn để tùy chỉnh sản phẩm theo ý muốn
        </p>
      </div>

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
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
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

                        return (
                          <button
                            key={style.id}
                            onClick={() => onToggle(style.id)}
                            className="w-full text-left"
                          >
                            <div
                              className={`p-2.5 rounded border transition-all duration-200 ${
                                isSelected
                                  ? "bg-gold/10 border-gold"
                                  : "border-transparent hover:border-white/10 hover:bg-white/5"
                              }`}
                            >
                              <div className="flex items-start gap-2.5">
                                {/* Checkbox */}
                                <div
                                  className={`w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0 mt-0.5 ${
                                    isSelected
                                      ? "bg-gold border-gold"
                                      : "border-white/20"
                                  }`}
                                >
                                  {isSelected && (
                                    <Check className="w-3 h-3 text-black" />
                                  )}
                                </div>

                                {/* Style Info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <h5 className="font-medium text-xs leading-tight">
                                      {style.name}
                                    </h5>
                                    <span className="text-luxury font-semibold text-xs whitespace-nowrap">
                                      {formatPrice(style.priceModifier)}
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
