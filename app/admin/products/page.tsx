"use client";

import { useState } from "react";
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

// Mock data
const mockProducts = [
  {
    id: "1",
    name: "Vest Truyền Thống",
    category: "Vest",
    basePrice: 3500000,
    description: "Vest may đo cao cấp theo phong cách truyền thống",
    image: "/images/products/vest-1.jpg",
    stock: "In Stock",
    fabricOptions: 5,
    styleOptions: 8,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Sơ Mi Cao Cấp",
    category: "Sơ Mi",
    basePrice: 1500000,
    description: "Sơ mi may đo với chất liệu cao cấp",
    image: "/images/products/shirt-1.jpg",
    stock: "In Stock",
    fabricOptions: 4,
    styleOptions: 6,
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    name: "Vest Hiện Đại",
    category: "Vest",
    basePrice: 4200000,
    description: "Vest phong cách hiện đại, trẻ trung",
    image: "/images/products/vest-2.jpg",
    stock: "In Stock",
    fabricOptions: 6,
    styleOptions: 10,
    createdAt: "2024-02-01",
  },
  {
    id: "4",
    name: "Áo Dài Truyền Thống",
    category: "Áo Dài",
    basePrice: 5500000,
    description: "Áo dài may đo theo truyền thống Việt Nam",
    image: "/images/products/aodai-1.jpg",
    stock: "In Stock",
    fabricOptions: 7,
    styleOptions: 5,
    createdAt: "2024-02-10",
  },
];

const categories = ["Vest", "Sơ Mi", "Áo Dài", "Quần", "Phụ Kiện"];

type Product = (typeof mockProducts)[0];

export default function AdminProductsPage() {
  const [products, setProducts] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    basePrice: "",
    description: "",
    image: "",
    fabricOptions: "",
    styleOptions: "",
  });

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" ? true : product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "",
      basePrice: "",
      description: "",
      image: "",
      fabricOptions: "",
      styleOptions: "",
    });
    setIsFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      basePrice: product.basePrice.toString(),
      description: product.description,
      image: product.image,
      fabricOptions: product.fabricOptions.toString(),
      styleOptions: product.styleOptions.toString(),
    });
    setIsFormOpen(true);
  };

  const handleSave = () => {
    // TODO: Integrate with backend
    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: formData.name,
                category: formData.category,
                basePrice: Number(formData.basePrice),
                description: formData.description,
                fabricOptions: Number(formData.fabricOptions),
                styleOptions: Number(formData.styleOptions),
              }
            : p
        )
      );
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: formData.name,
        category: formData.category,
        basePrice: Number(formData.basePrice),
        description: formData.description,
        image: formData.image || "/images/products/default.jpg",
        stock: "In Stock",
        fabricOptions: Number(formData.fabricOptions),
        styleOptions: Number(formData.styleOptions),
        createdAt: new Date().toISOString(),
      };
      setProducts([newProduct, ...products]);
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    // TODO: Add confirmation dialog
    // TODO: Integrate with backend
    setProducts(products.filter((p) => p.id !== id));
  };

  const stats = {
    total: products.length,
    vest: products.filter((p) => p.category === "Vest").length,
    shirt: products.filter((p) => p.category === "Sơ Mi").length,
    aodai: products.filter((p) => p.category === "Áo Dài").length,
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
              <div className="text-3xl font-medium text-(--color-gold)">
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
                  className="w-full pl-10 pr-4 py-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-5 h-5 text-gray-400" />
                <button
                  onClick={() => setCategoryFilter("All")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    categoryFilter === "All"
                      ? "bg-(--color-gold) text-charcoal"
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
                        ? "bg-(--color-gold) text-charcoal"
                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>
        </AnimatedSection>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {paginatedProducts.map((product, index) => (
            <AnimatedSection key={product.id} delay={0.05 * index}>
              <GlassCard className="overflow-hidden hover:border-(--color-gold)/50 transition-colors group">
                <div className="relative h-48 bg-white/5">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 bg-(--color-gold)/90 hover:bg-(--color-gold) rounded-lg transition-colors cursor-pointer"
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
                    <button
                      className="p-2 bg-blue-500/90 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs px-2 py-1 rounded bg-(--color-gold)/10 text-(--color-gold) border border-(--color-gold)/20">
                      {product.category}
                    </span>
                    <span className="text-xs text-green-400">
                      {product.stock}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-gray-400">
                      {product.fabricOptions} vải
                    </span>
                    <span className="text-gray-400">
                      {product.styleOptions} kiểu
                    </span>
                  </div>
                  <div className="text-xl font-medium text-(--color-gold)">
                    {product.basePrice.toLocaleString()} đ
                  </div>
                </div>
              </GlassCard>
            </AnimatedSection>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
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
                        ? "bg-(--color-gold) text-charcoal"
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
        {filteredProducts.length === 0 && (
          <AnimatedSection delay={0.5}>
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-(--color-gold)/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-(--color-gold)" />
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
                      className="w-full px-4 py-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors"
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
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/10 text-white border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors"
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
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
                      className="w-full px-4 py-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors"
                      placeholder="3500000"
                    />
                  </div>

                  {/* Options */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Số lượng vải
                      </label>
                      <input
                        type="number"
                        value={formData.fabricOptions}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            fabricOptions: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors"
                        placeholder="5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Số lượng kiểu dáng
                      </label>
                      <input
                        type="number"
                        value={formData.styleOptions}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            styleOptions: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors"
                        placeholder="8"
                      />
                    </div>
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
                      className="w-full px-4 py-3 bg-white/10 text-white placeholder-gray-500 border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors resize-none"
                      placeholder="Mô tả chi tiết về sản phẩm..."
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Hình ảnh sản phẩm
                    </label>
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-(--color-gold)/50 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">
                        Click để tải ảnh lên hoặc kéo thả vào đây
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, WEBP (Max 5MB)
                      </p>
                    </div>
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
