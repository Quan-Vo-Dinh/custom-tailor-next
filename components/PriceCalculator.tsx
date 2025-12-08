"use client";

import { GlassCard } from "./ui/GlassCard";
import { Calculator } from "lucide-react";

interface PriceCalculatorProps {
  basePrice: number;
  fabricPrice: number;
  stylePrice: number;
  quantity?: number;
}

export const PriceCalculator = ({
  basePrice,
  fabricPrice,
  stylePrice,
  quantity = 1,
}: PriceCalculatorProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const subtotal = basePrice + fabricPrice + stylePrice;
  const total = subtotal * quantity;
  const savings =
    fabricPrice < 0 || stylePrice < 0
      ? Math.abs(Math.min(0, fabricPrice + stylePrice)) * quantity
      : 0;

  return (
    <GlassCard variant="luxury" className="sticky top-32 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-5 h-5 text-luxury" />
        <h3 className="text-lg font-medium">Chi Tiết Giá</h3>
      </div>

      <div className="space-y-3">
        {/* Base Price */}
        <div className="flex items-center justify-between py-2 border-b border-white/10">
          <span className="text-sm font-light opacity-80">Giá cơ bản</span>
          <span className="font-medium">{formatPrice(basePrice)}</span>
        </div>

        {/* Fabric Price */}
        {fabricPrice !== 0 && (
          <div className="flex items-center justify-between py-2 border-b border-white/10">
            <span className="text-sm font-light opacity-80">Loại vải</span>
            <span
              className={`font-medium ${
                fabricPrice > 0 ? "" : "text-green-400"
              }`}
            >
              {fabricPrice > 0 ? "+" : ""}
              {formatPrice(fabricPrice)}
            </span>
          </div>
        )}

        {/* Style Price */}
        {stylePrice !== 0 && (
          <div className="flex items-center justify-between py-2 border-b border-white/10">
            <span className="text-sm font-light opacity-80">
              Tùy chỉnh kiểu dáng
            </span>
            <span
              className={`font-medium ${
                stylePrice > 0 ? "" : "text-green-400"
              }`}
            >
              {stylePrice > 0 ? "+" : ""}
              {formatPrice(stylePrice)}
            </span>
          </div>
        )}

        {/* Subtotal */}
        <div className="flex items-center justify-between py-3 border-b-2 border-gold/30 mt-2">
          <span className="text-sm font-light opacity-80">
            Tạm tính (1 sản phẩm)
          </span>
          <span className="font-medium text-lg">{formatPrice(subtotal)}</span>
        </div>

        {/* Quantity */}
        {quantity > 1 && (
          <div className="flex items-center justify-between py-2 border-b border-white/10">
            <span className="text-sm font-light opacity-80">Số lượng</span>
            <span className="font-medium">× {quantity}</span>
          </div>
        )}

        {/* Savings */}
        {savings > 0 && (
          <div className="flex items-center justify-between py-3 bg-green-500/10 -mx-6 px-6 rounded border border-green-500/20">
            <span className="text-green-400 font-medium text-sm">
              Tiết kiệm
            </span>
            <span className="text-green-400 font-medium">
              -{formatPrice(savings)}
            </span>
          </div>
        )}

        {/* Total */}
        <div className="flex items-center justify-between pt-4 pb-2">
          <span className="text-lg font-light">Tổng cộng</span>
          <span className="text-2xl font-medium text-luxury">
            {formatPrice(total)}
          </span>
        </div>

        {/* Tax Notice */}
        <p className="text-xs opacity-60 text-center font-light">
          Đã bao gồm VAT. Phí vận chuyển sẽ được tính khi thanh toán.
        </p>
      </div>
    </GlassCard>
  );
};
