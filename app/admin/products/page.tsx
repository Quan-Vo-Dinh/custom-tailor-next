"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Package,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Upload,
  X,
  Save,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
} from "@/services/products";
import { Product, ProductCategory } from "@/types";
import toast from "react-hot-toast";
import Link from "next/link";

const categoryLabels: Record<ProductCategory, string> = {
  SUIT: "Vest",
  SHIRT: "Sơ Mi",
  DRESS: "Áo Dài",
  COAT: "Áo Khoác",
  PANTS: "Quần",
  VEST: "Áo Vest",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | "All">("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 8;
  const [categories, setCategories] = useState<ProductCategory[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    category: "" as ProductCategory | "",
    basePrice: "",
    description: "",
    imageUrl: "",
    isActive: true,
  });

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getProducts({
          page: currentPage,
          limit: itemsPerPage,
          search: searchQuery || undefined,
          category: categoryFilter !== "All" ? categoryFilter : undefined,
        });
        setProducts(response.data || []);
        setTotalPages(response.meta?.totalPages || 1);
        setTotalItems(response.meta?.total || 0);
      } catch (err: any) {
        setError(err.message || "Không thể tải danh sách sản phẩm");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, searchQuery, categoryFilter]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats.map((c) => c.value));
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "" as ProductCategory | "",
      basePrice: "",
      description: "",
      imageUrl: "",
      isActive: true,
    });
    setIsFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      basePrice: product.basePrice.toString(),
      description: product.description || "",
      imageUrl: product.images?.[0] || "",
      isActive: true,
    });
    setIsFormOpen(true);
  };

  const handleSave = async () => {
    try {
    if (editingProduct) {
        await updateProduct(editingProduct.id, {
                name: formData.name,
          description: formData.description,
                basePrice: Number(formData.basePrice),
          category: formData.category || undefined,
          imageUrl: formData.imageUrl || undefined,
          isActive: formData.isActive,
        });
        toast.success("Đã cập nhật sản phẩm");
    } else {
        await createProduct({
        name: formData.name,
          description: formData.description,
        basePrice: Number(formData.basePrice),
          category: formData.category || undefined,
          imageUrl: formData.imageUrl || undefined,
          isActive: formData.isActive,
        });
        toast.success("Đã thêm sản phẩm mới");
    }
    setIsFormOpen(false);
      // Refresh products
      const response = await getProducts({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery || undefined,
        category: categoryFilter !== "All" ? categoryFilter : undefined,
      });
      setProducts(response.data || []);
      setTotalPages(response.meta?.totalPages || 1);
      setTotalItems(response.meta?.total || 0);
    } catch (err: any) {
      toast.error(err.message || "Không thể lưu sản phẩm");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      return;
    }
    try {
      await deleteProduct(id);
      toast.success("Đã xóa sản phẩm");
      // Refresh products
      const response = await getProducts({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery || undefined,
        category: categoryFilter !== "All" ? categoryFilter : undefined,
      });
      setProducts(response.data || []);
      setTotalPages(response.meta?.totalPages || 1);
      setTotalItems(response.meta?.total || 0);
    } catch (err: any) {
      toast.error(err.message || "Không thể xóa sản phẩm");
    }
  };

  const stats = {
    total: totalItems,
    vest: products.filter((p) => p.category === ProductCategory.VEST || p.category === ProductCategory.SUIT).length,
    shirt: products.filter((p) => p.category === ProductCategory.SHIRT).length,
    aodai: products.filter((p) => p.category === ProductCategory.DRESS).length,
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <AnimatedSection className="mb-12">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-light mb-2">
                Quản Lý <span className="text-luxury italic">Sản Phẩm</span>
              </h1>
              <p className="text-gray-400">
                Thêm, sửa, xóa các sản phẩm may đo
              </p>
            </div>
            <Button variant="luxury" size="lg" onClick={handleAdd}>
              <Plus className="w-5 h-5" />
              <span>Thêm sản phẩm</span>
            </Button>
          </div>
        </AnimatedSection>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <AnimatedSection delay={0.1}>
            <GlassCard className="p-6">
              <div className="text-sm text-gray-400 mb-1">Tổng sản phẩm</div>
              <div className="text-3xl font-medium text-white">
                {stats.total}
              </div>
            </GlassCard>
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <GlassCard className="p-6">
              <div className="text-sm text-gray-400 mb-1">Vest</div>
              <div className="text-3xl font-medium text-[var(--color-gold)]">
                {stats.vest}
              </div>
            </GlassCard>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <GlassCard className="p-6">
              <div className="text-sm text-gray-400 mb-1">Sơ Mi</div>
              <div className="text-3xl font-medium text-blue-400">
                {stats.shirt}
              </div>
            </GlassCard>
          </AnimatedSection>
          <AnimatedSection delay={0.25}>
            <GlassCard className="p-6">
              <div className="text-sm text-gray-400 mb-1">Áo Dài</div>
              <div className="text-3xl font-medium text-purple-400">
                {stats.aodai}
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>

        {/* Filters & Search */}
        <AnimatedSection delay={0.3} className="mb-6">
          <GlassCard className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm sản phẩm theo tên hoặc mô tả..."
                  className="w-full pl-10 pr-4 py-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-5 h-5 text-gray-400" />
                <button
                  onClick={() => setCategoryFilter("All")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    categoryFilter === "All"
                      ? "bg-[var(--color-gold)] text-charcoal"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  Tất cả
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setCategoryFilter(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      categoryFilter === category
                        ? "bg-[var(--color-gold)] text-charcoal"
                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    {categoryLabels[category] || category}
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>
        </AnimatedSection>

        {/* Loading State */}
        {loading && (
          <AnimatedSection delay={0.35}>
            <div className="flex justify-center py-20">
              <LoadingSpinner />
            </div>
          </AnimatedSection>
        )}

        {/* Error State */}
        {error && !loading && (
          <AnimatedSection delay={0.35}>
            <ErrorMessage message={error} />
          </AnimatedSection>
        )}

        {/* Products Grid */}
        {!loading && !error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {products.map((product, index) => (
            <AnimatedSection key={product.id} delay={0.05 * index}>
                <GlassCard className="overflow-hidden hover:border-[var(--color-gold)]/50 transition-colors group">
                <div className="relative h-48 bg-white/5">
                  <Image
                      src={product.images?.[0] || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%23f3f4f6' width='800' height='600'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='24' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EProduct%3C/text%3E%3C/svg%3E"}
                    alt={product.name}
                    fill
                    className="object-cover"
                      unoptimized
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                        className="p-2 bg-[var(--color-gold)]/90 hover:bg-[var(--color-gold)] rounded-lg transition-colors cursor-pointer"
                      title="Chỉnh sửa"
                    >
                      <Edit2 className="w-5 h-5 text-charcoal" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 bg-red-500/90 hover:bg-red-500 rounded-lg transition-colors cursor-pointer"
                      title="Xóa"
                    >
                      <Trash2 className="w-5 h-5 text-white" />
                    </button>
                      <Link href={`/products/${product.id}`}>
                    <button
                      className="p-2 bg-blue-500/90 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-5 h-5 text-white" />
                    </button>
                      </Link>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                      <span className="text-xs px-2 py-1 rounded bg-[var(--color-gold)]/10 text-[var(--color-gold)] border border-[var(--color-gold)]/20">
                        {categoryLabels[product.category] || product.category}
                    </span>
                      <span className={`text-xs ${product.featured ? "text-green-400" : "text-gray-400"}`}>
                        {product.featured ? "Nổi bật" : "Bình thường"}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                      {product.description || "Không có mô tả"}
                  </p>
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-gray-400">
                        {product.availableFabrics?.length || 0} vải
                    </span>
                    <span className="text-gray-400">
                        {product.availableStyles?.length || 0} kiểu
                    </span>
                  </div>
                    <div className="text-xl font-medium text-[var(--color-gold)]">
                    {product.basePrice.toLocaleString()} đ
                  </div>
                </div>
              </GlassCard>
            </AnimatedSection>
          ))}
        </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <AnimatedSection delay={0.4}>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      currentPage === page
                        ? "bg-[var(--color-gold)] text-charcoal"
                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </AnimatedSection>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <AnimatedSection delay={0.5}>
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-[var(--color-gold)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-[var(--color-gold)]" />
              </div>
              <h3 className="text-2xl font-light text-white mb-2">
                Không tìm thấy sản phẩm
              </h3>
              <p className="text-gray-400 mb-6">
                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
              </p>
              <Button variant="luxury" size="lg" onClick={handleAdd}>
                <Plus className="w-5 h-5" />
                <span>Thêm sản phẩm mới</span>
              </Button>
            </div>
          </AnimatedSection>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setIsFormOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <GlassCard className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-light text-white">
                    {editingProduct
                      ? "Chỉnh sửa sản phẩm"
                      : "Thêm sản phẩm mới"}
                  </h2>
                  <button
                    onClick={() => setIsFormOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tên sản phẩm <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                      placeholder="Vest Truyền Thống"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Danh mục <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value as ProductCategory })
                      }
                      className="w-full px-4 py-3 bg-white/10 text-white border border-white/20 rounded-lg focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {categoryLabels[cat] || cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Base Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Giá cơ bản (VNĐ) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.basePrice}
                      onChange={(e) =>
                        setFormData({ ...formData, basePrice: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                      placeholder="3500000"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Mô tả
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full px-4 py-3 bg-white/10 text-white placeholder-gray-500 border border-white/20 rounded-lg focus:outline-none focus:border-[var(--color-gold)] transition-colors resize-none"
                      placeholder="Mô tả chi tiết về sản phẩm..."
                    />
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      URL hình ảnh sản phẩm
                    </label>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                      placeholder="https://example.com/image.jpg"
                    />
                      <p className="text-xs text-gray-500 mt-1">
                      Nhập URL hình ảnh hoặc để trống
                      </p>
                    </div>

                  {/* Active Status */}
                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) =>
                          setFormData({ ...formData, isActive: e.target.checked })
                        }
                        className="w-4 h-4 rounded border-white/20 bg-white/10 cursor-pointer"
                      />
                      <span className="text-sm font-medium text-gray-300">
                        Sản phẩm đang hoạt động
                      </span>
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      variant="luxury"
                      onClick={handleSave}
                      className="flex-1"
                      disabled={
                        !formData.name ||
                        !formData.category ||
                        !formData.basePrice
                      }
                    >
                      <Save className="w-5 h-5" />
                      <span>
                        {editingProduct ? "Lưu thay đổi" : "Thêm sản phẩm"}
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsFormOpen(false)}
                    >
                      Hủy
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
