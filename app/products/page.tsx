"use client";

import { useState, useEffect } from "react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/ErrorMessage";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getMockProducts, mockCategories } from "@/lib/mockData";

export default function ProductsPage() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000000 });
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 12;

  const { products, total, totalPages } = getMockProducts({
    search: searchQuery,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    minPrice: priceRange.min > 0 ? priceRange.min : undefined,
    maxPrice: priceRange.max < 50000000 ? priceRange.max : undefined,
    sort: sortBy,
    page: currentPage,
    limit: itemsPerPage,
  });

  useEffect(() => {
    // Simulate API loading with async pattern
    let cancelled = false;

    const loadProducts = async () => {
      if (cancelled) return;
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 500));

      if (!cancelled) {
        setLoading(false);
      }
    };

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [searchQuery, selectedCategory, priceRange, sortBy, currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange({ min, max });
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setPriceRange({ min: 0, max: 50000000 });
    setSortBy("newest");
    setCurrentPage(1);
  };

  // Removed unused getCategoryLabel function

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push(-1);
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push(-1);
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push(-1);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push(-1);
        pages.push(totalPages);
      }
    } else {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-12">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-200 hover:border-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {pages.map((page, idx) =>
          page === -1 ? (
            <span key={`ellipsis-${idx}`} className="px-2">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                currentPage === page
                  ? "bg-yellow-600 text-white border-yellow-600"
                  : "border-gray-200 hover:border-yellow-600"
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-200 hover:border-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 lg:px-12">
        <AnimatedSection className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light mb-6">
            Bộ Sưu Tập
            <br />
            <span className="text-luxury italic">May Đo Cao Cấp</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-light">
            Khám phá những thiết kế độc quyền, được chế tác tỉ mỉ theo số đo của
            bạn
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <GlassCard variant="luxury" className="mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm sản phẩm..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-800 text-gray-100 placeholder-gray-400 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Tìm
                </button>
              </form>

              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-4 py-3 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price-asc">Giá tăng dần</option>
                  <option value="price-desc">Giá giảm dần</option>
                  <option value="name-asc">Tên A-Z</option>
                  <option value="name-desc">Tên Z-A</option>
                </select>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                    showFilters
                      ? "bg-yellow-600 text-white border-yellow-600"
                      : "bg-white border-gray-200 hover:border-yellow-600"
                  }`}
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  Bộ lọc
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Danh mục</h3>
                    <button
                      onClick={resetFilters}
                      className="text-sm text-gray-600 hover:text-yellow-600 flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      Xóa bộ lọc
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleCategoryChange("all")}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        selectedCategory === "all"
                          ? "bg-yellow-600 text-white border-yellow-600"
                          : "border-gray-200 hover:border-yellow-600"
                      }`}
                    >
                      Tất cả
                    </button>
                    {mockCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.name)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          selectedCategory === cat.name
                            ? "bg-yellow-600 text-white border-yellow-600"
                            : "border-gray-200 hover:border-yellow-600"
                        }`}
                      >
                        {cat.name} ({cat.count})
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Khoảng giá</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="text-sm text-gray-300 mb-1 block">
                        Từ
                      </label>
                      <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) =>
                          handlePriceRangeChange(
                            parseInt(e.target.value) || 0,
                            priceRange.max
                          )
                        }
                        className="w-full px-4 py-2 bg-gray-800 text-gray-100 placeholder-gray-500 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                        placeholder="0"
                      />
                    </div>
                    <span className="text-gray-400 mt-6">—</span>
                    <div className="flex-1">
                      <label className="text-sm text-gray-300 mb-1 block">
                        Đến
                      </label>
                      <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) =>
                          handlePriceRangeChange(
                            priceRange.min,
                            parseInt(e.target.value) || 50000000
                          )
                        }
                        className="w-full px-4 py-2 bg-gray-800 text-gray-100 placeholder-gray-500 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                        placeholder="50000000"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </GlassCard>
        </AnimatedSection>

        <div className="mb-6 text-sm text-gray-600">
          Hiển thị {products.length} trong tổng số {total} sản phẩm
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: itemsPerPage }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            title="Không tìm thấy sản phẩm"
            message="Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm"
            action={{
              label: "Xóa bộ lọc",
              onClick: resetFilters,
            }}
          />
        ) : (
          <>
            <AnimatedSection delay={0.2}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))}
              </div>
            </AnimatedSection>

            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
}
