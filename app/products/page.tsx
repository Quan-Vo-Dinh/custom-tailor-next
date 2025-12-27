"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Grid3x3,
  LayoutGrid,
  Sparkles,
} from "lucide-react";
import { getMockProducts, mockCategories } from "@/lib/mockData";
import {
  getProducts,
  getCategories,
  PaginatedResponse,
} from "@/services/products";
import { Product, ProductCategory } from "@/types";

export default function ProductsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000000 });
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [gridCols, setGridCols] = useState<3 | 4>(4);
  const [productsData, setProductsData] =
    useState<PaginatedResponse<Product> | null>(null);
  const [categories, setCategories] = useState<
    Array<{ value: ProductCategory; label: string; count: number }>
  >([]);
  const itemsPerPage = 12;

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      if (cancelled) return;
      setLoading(true);
      setError(null);

      try {
        // Load categories
        const categoriesData = await getCategories();
        console.log("Categories loaded:", categoriesData);
        if (!cancelled) {
          setCategories(categoriesData);
        }

        // Load products
        const productsResponse = await getProducts({
          page: currentPage,
          limit: itemsPerPage,
          search: searchQuery || undefined,
          category:
            selectedCategory !== "all"
              ? (selectedCategory as ProductCategory)
              : undefined,
          minPrice: priceRange.min > 0 ? priceRange.min : undefined,
          maxPrice: priceRange.max < 50000000 ? priceRange.max : undefined,
          sortBy:
            sortBy === "newest"
              ? "createdAt"
              : sortBy === "price"
              ? "price"
              : "name",
          sortOrder: "desc",
        });
        if (!cancelled) {
          setProductsData(productsResponse);
        }
      } catch (err) {
        console.error("Error loading products:", err);
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Có lỗi xảy ra khi tải sản phẩm"
          );
          // Don't fallback to mock data - show error instead
          // const mockData = getMockProducts({
          //   search: searchQuery,
          //   category: selectedCategory !== "all" ? selectedCategory : undefined,
          //   minPrice: priceRange.min > 0 ? priceRange.min : undefined,
          //   maxPrice: priceRange.max < 50000000 ? priceRange.max : undefined,
          //   sort: sortBy,
          //   page: currentPage,
          //   limit: itemsPerPage,
          // });
          // setProductsData({
          //   data: mockData.products as any,
          //   meta: {
          //     total: mockData.total,
          //     page: currentPage,
          //     limit: itemsPerPage,
          //     totalPages: mockData.totalPages,
          //   },
          // });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [
    searchQuery,
    selectedCategory,
    priceRange.min,
    priceRange.max,
    sortBy,
    currentPage,
    itemsPerPage,
  ]);

  const products = productsData?.data || [];
  const total = productsData?.meta.total || 0;
  const totalPages = productsData?.meta.totalPages || 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    // Use functional update to avoid object reference issues
    setPriceRange((prev) => {
      if (prev.min === min && prev.max === max) return prev;
      return { min, max };
    });
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
          className="p-2 rounded-lg border border-white/20 hover:border-[var(--color-gold)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {pages.map((page, idx) =>
          page === -1 ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg border transition-colors cursor-pointer ${
                currentPage === page
                  ? "bg-[var(--color-gold)] text-charcoal border-[var(--color-gold)]"
                  : "border-white/20 text-white hover:border-[var(--color-gold)]"
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-white/20 hover:border-[var(--color-gold)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-32 pb-20 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-20 -right-40 w-96 h-96 rounded-full bg-[var(--color-gold)]/10 blur-3xl"
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
          className="absolute bottom-40 -left-40 w-96 h-96 rounded-full bg-[var(--color-gold)]/10 blur-3xl"
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
        {/* Hero Section */}
        <AnimatedSection className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-[var(--color-gold)]" />
            <span className="text-sm text-[var(--color-gold)] font-medium">
              {total} Sản phẩm độc quyền
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light mb-6 leading-tight">
            Bộ Sưu Tập
            <br />
            <span className="text-luxury italic">May Đo Cao Cấp</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light">
            Khám phá những thiết kế độc quyền, được chế tác tỉ mỉ theo số đo của
            bạn
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar Filters - Desktop */}
          <AnimatedSection delay={0.1} className="hidden lg:block">
            <div className="sticky top-32">
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-[var(--color-gold)]" />
                    Bộ Lọc
                  </h3>
                  {(selectedCategory !== "all" ||
                    priceRange.min > 0 ||
                    priceRange.max < 50000000) && (
                    <button
                      onClick={resetFilters}
                      className="text-sm text-gray-400 hover:text-[var(--color-gold)] transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">
                    Danh Mục
                  </h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleCategoryChange("all")}
                      className={`w-full px-4 py-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                        selectedCategory === "all"
                          ? "bg-[var(--color-gold)]/10 text-[var(--color-gold)] border border-[var(--color-gold)]/20"
                          : "bg-white/5 text-gray-300 hover:bg-white/10"
                      }`}
                    >
                      <span className="font-medium">Tất cả</span>
                      <span className="text-sm ml-2 opacity-60">({total})</span>
                    </button>
                    {categories.length > 0
                      ? categories.map((cat) => (
                          <button
                            key={cat.value}
                            onClick={() => handleCategoryChange(cat.value)}
                            className={`w-full px-4 py-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                              selectedCategory === cat.value
                                ? "bg-[var(--color-gold)]/10 text-[var(--color-gold)] border border-[var(--color-gold)]/20"
                                : "bg-white/5 text-gray-300 hover:bg-white/10"
                            }`}
                          >
                            <span className="font-medium">{cat.label}</span>
                            <span className="text-sm ml-2 opacity-60">
                              ({cat.count})
                            </span>
                          </button>
                        ))
                      : mockCategories.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => handleCategoryChange(cat.name)}
                            className={`w-full px-4 py-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                              selectedCategory === cat.name
                                ? "bg-[var(--color-gold)]/10 text-[var(--color-gold)] border border-[var(--color-gold)]/20"
                                : "bg-white/5 text-gray-300 hover:bg-white/10"
                            }`}
                          >
                            <span className="font-medium">{cat.name}</span>
                            <span className="text-sm ml-2 opacity-60">
                              ({cat.count})
                            </span>
                          </button>
                        ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="pt-6 border-t border-white/10">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">
                    Khoảng Giá
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">
                        Từ (₫)
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
                        className="w-full px-3 py-2 bg-white/10 text-white placeholder-gray-500 border border-white/20 rounded-lg focus:outline-none focus:border-[var(--color-gold)] transition-colors text-sm"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">
                        Đến (₫)
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
                        className="w-full px-3 py-2 bg-white/10 text-white placeholder-gray-500 border border-white/20 rounded-lg focus:outline-none focus:border-[var(--color-gold)] transition-colors text-sm"
                        placeholder="50,000,000"
                      />
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </AnimatedSection>

          {/* Main Content */}
          <div>
            {/* Search & Toolbar */}
            <AnimatedSection delay={0.15}>
              <GlassCard className="p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Search */}
                  <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm kiếm sản phẩm..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                      />
                    </div>
                  </form>

                  {/* Sort & View Options */}
                  <div className="flex gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="px-4 py-2.5 bg-gray-800 text-white border border-white/20 rounded-lg focus:outline-none focus:border-[var(--color-gold)] transition-colors cursor-pointer"
                    >
                      <option value="newest">Mới nhất</option>
                      <option value="price-asc">Giá tăng dần</option>
                      <option value="price-desc">Giá giảm dần</option>
                      <option value="name-asc">Tên A-Z</option>
                    </select>

                    {/* Grid Toggle */}
                    <div className="hidden md:flex items-center gap-1 p-1 bg-white/5 rounded-lg">
                      <button
                        onClick={() => setGridCols(4)}
                        className={`p-2 rounded transition-colors cursor-pointer ${
                          gridCols === 4
                            ? "bg-[var(--color-gold)]/20 text-[var(--color-gold)]"
                            : "text-gray-400 hover:text-white"
                        }`}
                        title="4 cột"
                      >
                        <LayoutGrid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setGridCols(3)}
                        className={`p-2 rounded transition-colors cursor-pointer ${
                          gridCols === 3
                            ? "bg-[var(--color-gold)]/20 text-[var(--color-gold)]"
                            : "text-gray-400 hover:text-white"
                        }`}
                        title="3 cột"
                      >
                        <Grid3x3 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Mobile Filter Toggle */}
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-colors cursor-pointer bg-white/10 border-white/20 hover:border-[var(--color-gold)]"
                    >
                      <SlidersHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            </AnimatedSection>

            {/* Mobile Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="lg:hidden mb-6 overflow-hidden"
                >
                  <GlassCard className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-white">Bộ Lọc</h3>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <X className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>

                    {/* Mobile Categories */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-300 mb-3">
                        Danh Mục
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            handleCategoryChange("all");
                            setShowFilters(false);
                          }}
                          className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                            selectedCategory === "all"
                              ? "bg-[var(--color-gold)] text-charcoal"
                              : "bg-white/5 text-gray-300 hover:bg-white/10"
                          }`}
                        >
                          Tất cả
                        </button>
                        {mockCategories.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => {
                              handleCategoryChange(cat.name);
                              setShowFilters(false);
                            }}
                            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                              selectedCategory === cat.name
                                ? "bg-[var(--color-gold)] text-charcoal"
                                : "bg-white/5 text-gray-300 hover:bg-white/10"
                            }`}
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Mobile Price Range */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-3">
                        Khoảng Giá
                      </h4>
                      <div className="flex gap-3">
                        <input
                          type="number"
                          value={priceRange.min}
                          onChange={(e) =>
                            handlePriceRangeChange(
                              parseInt(e.target.value) || 0,
                              priceRange.max
                            )
                          }
                          className="flex-1 px-3 py-2 bg-white/10 text-white border border-white/20 rounded-lg focus:outline-none focus:border-[var(--color-gold)]"
                          placeholder="Từ"
                        />
                        <input
                          type="number"
                          value={priceRange.max}
                          onChange={(e) =>
                            handlePriceRangeChange(
                              priceRange.min,
                              parseInt(e.target.value) || 50000000
                            )
                          }
                          className="flex-1 px-3 py-2 bg-white/10 text-white border border-white/20 rounded-lg focus:outline-none focus:border-[var(--color-gold)]"
                          placeholder="Đến"
                        />
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results Count */}
            <div className="mb-6 text-sm text-gray-400">
              Hiển thị {products.length} trong tổng số {total} sản phẩm
              {selectedCategory !== "all" && ` • ${selectedCategory}`}
            </div>

            {/* Products Grid */}
            {loading ? (
              <div
                className={`grid grid-cols-1 md:grid-cols-2 ${
                  gridCols === 4 ? "xl:grid-cols-4" : "xl:grid-cols-3"
                } gap-6`}
              >
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
                  <div
                    className={`grid grid-cols-1 md:grid-cols-2 ${
                      gridCols === 4 ? "xl:grid-cols-4" : "xl:grid-cols-3"
                    } gap-6`}
                  >
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
      </div>
    </div>
  );
}
