"use client";

import Image from "next/image";
import { GlassCard } from "./ui/GlassCard";
import { Check } from "lucide-react";
import type { Fabric } from "@/types";

interface FabricSelectorProps {
  fabrics: Fabric[];
  selectedFabricId: string | null;
  onSelect: (fabricId: string) => void;
}

export const FabricSelector = ({
  fabrics,
  selectedFabricId,
  onSelect,
}: FabricSelectorProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium">Chọn Loại Vải</h3>
      <p className="text-xs text-gray-500">
        Chọn loại vải phù hợp với nhu cầu và phong cách của bạn
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {fabrics.map((fabric) => (
          <button
            key={fabric.id}
            onClick={() => onSelect(fabric.id)}
            className="text-left"
          >
            <GlassCard
              variant="luxury"
              className={`relative transition-all duration-200 hover:shadow-md p-3 ${
                selectedFabricId === fabric.id
                  ? "ring-2 ring-yellow-600 shadow-md"
                  : ""
              }`}
            >
              {/* Selected Badge */}
              {selectedFabricId === fabric.id && (
                <div className="absolute top-2 right-2 z-10 bg-yellow-600 text-white p-0.5 rounded-full">
                  <Check className="w-3 h-3" />
                </div>
              )}

              {/* Fabric Image */}
              <div className="relative aspect-square mb-2 rounded overflow-hidden bg-gray-100">
                <Image
                  src={fabric.image}
                  alt={fabric.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Fabric Info */}
              <div className="space-y-1">
                <h4 className="font-medium text-sm leading-tight">
                  {fabric.name}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <span className="capitalize">{fabric.material}</span>
                  <span>•</span>
                  <span className="capitalize">{fabric.color}</span>
                </div>
                <div className="text-yellow-700 font-semibold text-xs">
                  {fabric.price === 0
                    ? "Miễn phí"
                    : `+${formatPrice(fabric.price)}`}
                </div>
                {fabric.stock < 10 && fabric.stock > 0 && (
                  <div className="text-xs text-orange-600">
                    Chỉ còn {fabric.stock}
                  </div>
                )}
                {fabric.stock === 0 && (
                  <div className="text-xs text-red-600">Hết hàng</div>
                )}
              </div>
            </GlassCard>
          </button>
        ))}
      </div>
    </div>
  );
};
