"use client";

import Image from "next/image";
import { GlassCard } from "./ui/GlassCard";
import { Check } from "lucide-react";
import type { Fabric } from "@/types";

// API Base URL for static images
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

// Placeholder image as data URI
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23f3f4f6' width='300' height='300'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='16' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EFabric%3C/text%3E%3C/svg%3E";

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

  // Get fabric image - support both `image` and `imageUrl` fields
  // Prepend API base URL if imageUrl is a relative path from server
  const getFabricImage = (fabric: Fabric): string => {
    const imageUrl = fabric.imageUrl || fabric.image;
    if (!imageUrl) return PLACEHOLDER_IMAGE;

    // Decode URI if needed
    const decodedUrl = decodeURIComponent(imageUrl);

    // If it's a relative path starting with /, prepend API base URL
    if (decodedUrl.startsWith("/")) {
      return `${API_BASE_URL}${decodedUrl}`;
    }

    // If it's already a full URL (http/https), use it directly
    if (decodedUrl.startsWith("http://") || decodedUrl.startsWith("https://")) {
      return decodedUrl;
    }

    // Otherwise, assume it's a relative path from server
    return `${API_BASE_URL}/${decodedUrl}`;
  };

  // Get fabric price - support both `price` and `priceAdjustment` fields
  const getFabricPrice = (fabric: Fabric): number => {
    if (fabric.priceAdjustment !== undefined) {
      return typeof fabric.priceAdjustment === "string"
        ? parseFloat(fabric.priceAdjustment)
        : fabric.priceAdjustment;
    }
    return fabric.price || 0;
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {fabrics.map((fabric) => {
          const imageUrl = getFabricImage(fabric);
          const price = getFabricPrice(fabric);

          return (
            <button
              key={fabric.id}
              onClick={() => onSelect(fabric.id)}
              className="text-left cursor-pointer"
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
                    src={imageUrl}
                    alt={fabric.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                {/* Fabric Info */}
                <div className="space-y-1">
                  <h4 className="font-medium text-sm leading-tight">
                    {fabric.name}
                  </h4>
                  {fabric.description && (
                    <p className="text-xs text-gray-400 line-clamp-2">
                      {fabric.description}
                    </p>
                  )}
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <span className="capitalize">{fabric.material}</span>
                    <span>•</span>
                    <span className="capitalize">{fabric.color}</span>
                  </div>
                  <div className="text-yellow-700 font-semibold text-xs">
                    {price === 0 ? "Miễn phí" : `+${formatPrice(price)}`}
                  </div>
                  {fabric.stock !== undefined &&
                    fabric.stock < 10 &&
                    fabric.stock > 0 && (
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
          );
        })}
      </div>
    </div>
  );
};
