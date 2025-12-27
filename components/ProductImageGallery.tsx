"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  /** The main displayed image (e.g., current mockup based on style selection) */
  mainImage?: string;
  /** Fixed thumbnail images for the grid (e.g., 4 fabric mockups) */
  thumbnailImages?: string[];
  /** Callback when a thumbnail is clicked */
  onThumbnailClick?: (index: number) => void;
}

// Placeholder image as data URI
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%23f3f4f6' width='800' height='600'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='24' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EImage%3C/text%3E%3C/svg%3E";

export const ProductImageGallery = ({
  images,
  productName,
  mainImage,
  thumbnailImages,
  onThumbnailClick,
}: ProductImageGalleryProps) => {
  // Use thumbnailImages if provided, otherwise fallback to images
  const displayThumbnails =
    thumbnailImages && thumbnailImages.length > 0 ? thumbnailImages : images;

  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Determine the current main image to display
  // If mainImage prop is provided, use it; otherwise use selected from thumbnails
  const currentMainImage =
    mainImage || displayThumbnails[selectedImage] || images[0];

  const nextImage = () => {
    const newIndex = (selectedImage + 1) % displayThumbnails.length;
    setSelectedImage(newIndex);
    if (onThumbnailClick) {
      onThumbnailClick(newIndex);
    }
  };

  const prevImage = () => {
    const newIndex =
      (selectedImage - 1 + displayThumbnails.length) % displayThumbnails.length;
    setSelectedImage(newIndex);
    if (onThumbnailClick) {
      onThumbnailClick(newIndex);
    }
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedImage(index);
    if (onThumbnailClick) {
      onThumbnailClick(index);
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-3/4 glass-luxury rounded-xl overflow-hidden group">
        <Image
          src={currentMainImage || PLACEHOLDER_IMAGE}
          alt={`${productName} - Image ${selectedImage + 1}`}
          fill
          className="object-cover"
          priority
          unoptimized
        />

        {/* Zoom Button */}
        <button
          onClick={() => setIsZoomed(true)}
          className="absolute top-4 right-4 p-3 glass-luxury rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 border border-transparent hover:border-gold"
        >
          <ZoomIn className="w-5 h-5" />
        </button>

        {/* Navigation Arrows */}
        {displayThumbnails.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 glass-luxury rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 border border-transparent hover:border-gold"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 glass-luxury rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 border border-transparent hover:border-gold"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 px-4 py-2 glass-luxury text-sm rounded-full font-light">
          {selectedImage + 1} / {displayThumbnails.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-3">
        {displayThumbnails.map((image, index) => (
          <button
            key={index}
            onClick={() => handleThumbnailClick(index)}
            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${
              selectedImage === index
                ? "border-gold ring-2 ring-gold/30 scale-105"
                : "border-transparent glass-luxury hover:border-gold/50"
            }`}
          >
            <Image
              src={image || PLACEHOLDER_IMAGE}
              alt={`${productName} thumbnail ${index + 1}`}
              fill
              className="object-cover"
              unoptimized
            />
          </button>
        ))}
      </div>

      {/* Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomed(false)}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-6xl max-h-full"
            >
              <Image
                src={images[selectedImage] || PLACEHOLDER_IMAGE}
                alt={`${productName} zoomed`}
                width={1200}
                height={1600}
                className="object-contain max-h-[90vh]"
                unoptimized
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
