import api, { getErrorMessage } from "@/lib/api";
import { Product, Fabric, Style, ProductCategory } from "@/types";

const toNumber = (value: any, fallback = 0) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : fallback;
  }
  if (value === null || value === undefined) return fallback;

  // Handle Prisma Decimal-like objects or bigint or strings
  try {
    const asString =
      typeof value === "bigint"
        ? value.toString()
        : value.toString
        ? value.toString()
        : String(value);
    const n = parseFloat(asString);
    return Number.isFinite(n) ? n : fallback;
  } catch {
    return fallback;
  }
};

const mapFabric = (fabric: any): Fabric => ({
  id: fabric.id,
  name: fabric.name,
  material: fabric.material || "",
  color: fabric.color || "",
  price: toNumber(fabric.priceAdjustment || fabric.price, 0),
  image: fabric.imageUrl || fabric.image || "",
  stock: toNumber(fabric.stock, 0),
  // Also pass through API fields for components that need them
  imageUrl: fabric.imageUrl,
  priceAdjustment: fabric.priceAdjustment,
  description: fabric.description,
});

const mapStyle = (style: any): Style => ({
  id: style.id,
  name: style.name,
  category: style.type || style.category || "Khác",
  description: style.description || "",
  priceModifier: toNumber(style.priceAdjustment || style.priceModifier, 0),
  // Also pass through API fields for components that need them
  type: style.type,
  imageUrl: style.imageUrl,
  priceAdjustment: style.priceAdjustment,
});

const mapProduct = (product: any): Product => ({
  ...product,
  basePrice: toNumber(product.basePrice, 0),
  availableFabrics: Array.isArray(product.availableFabrics)
    ? product.availableFabrics.map(mapFabric)
    : [],
  availableStyles: Array.isArray(product.availableStyles)
    ? product.availableStyles.map(mapStyle)
    : [],
});

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  sortBy?: "name" | "price" | "createdAt";
  sortOrder?: "asc" | "desc";
}

// Get all products with filters and pagination
export const getProducts = async (
  params?: ProductsQueryParams
): Promise<PaginatedResponse<Product>> => {
  try {
    const response = await api.get<PaginatedResponse<Product>>("/products", {
      params: {
        page: params?.page || 1,
        limit: params?.limit || 12,
        search: params?.search,
        category: params?.category,
        minPrice: params?.minPrice,
        maxPrice: params?.maxPrice,
        featured: params?.featured,
        sortBy: params?.sortBy || "createdAt",
        sortOrder: params?.sortOrder || "desc",
      },
    });
    console.log("[getProducts] Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("[getProducts] Error:", error);
    throw new Error(getErrorMessage(error));
  }
};

// Get single product by ID
export const getProductById = async (id: string): Promise<Product> => {
  try {
    const response = await api.get<Product>(`/products/${id}`);
    return mapProduct(response.data);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Search products
export const searchProducts = async (
  query: string,
  limit: number = 10
): Promise<Product[]> => {
  try {
    const response = await api.get<PaginatedResponse<Product>>(
      "/products/search",
      {
        params: { query, limit },
      }
    );
    return response.data.data || response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get all categories
export const getCategories = async (): Promise<
  Array<{ value: ProductCategory; label: string; count: number }>
> => {
  try {
    const response = await api.get<
      Array<{ value: ProductCategory; label: string; count: number }>
    >("/products/categories");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get all fabrics
export const getFabrics = async (params?: {
  productId?: string;
  category?: string;
}): Promise<Fabric[]> => {
  try {
    const response = await api.get<Fabric[]>("/products/fabrics", {
      params,
    });
    return Array.isArray(response.data) ? response.data.map(mapFabric) : [];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get fabric by ID
export const getFabricById = async (id: string): Promise<Fabric> => {
  try {
    const response = await api.get<Fabric>(`/products/fabrics/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get all style options
export const getStyleOptions = async (params?: {
  productId?: string;
  category?: string;
}): Promise<Style[]> => {
  try {
    const response = await api.get<Style[]>("/products/style-options", {
      params,
    });
    return Array.isArray(response.data) ? response.data.map(mapStyle) : [];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get style option by ID
export const getStyleById = async (id: string): Promise<Style> => {
  try {
    const response = await api.get<Style>(`/products/style-options/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get featured products
export const getFeaturedProducts = async (
  limit: number = 4
): Promise<Product[]> => {
  try {
    const response = await api.get<PaginatedResponse<Product>>("/products", {
      params: { featured: true, limit },
    });
    return response.data.data || response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Calculate product price with customizations
export interface PriceCalculation {
  basePrice: number;
  fabricPrice: number;
  stylePrice: number;
  totalPrice: number;
}

export const calculatePrice = (
  product: Product,
  fabricId?: string,
  styleId?: string
): PriceCalculation => {
  const basePrice = product.basePrice;

  let fabricPrice = 0;
  if (fabricId) {
    const fabric = product.availableFabrics.find((f) => f.id === fabricId);
    if (fabric) {
      fabricPrice = fabric.price;
    }
  }

  let stylePrice = 0;
  if (styleId) {
    const style = product.availableStyles.find((s) => s.id === styleId);
    if (style) {
      stylePrice = style.priceModifier;
    }
  }

  return {
    basePrice,
    fabricPrice,
    stylePrice,
    totalPrice: basePrice + fabricPrice + stylePrice,
  };
};

// Admin CRUD functions
export interface CreateProductDto {
  name: string;
  description?: string;
  basePrice: number;
  imageUrl?: string;
  categoryId?: string;
  category?: ProductCategory;
  isActive?: boolean;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  basePrice?: number;
  imageUrl?: string;
  categoryId?: string;
  category?: ProductCategory;
  isActive?: boolean;
}

// Create product (Admin)
export const createProduct = async (
  data: CreateProductDto
): Promise<Product> => {
  try {
    const response = await api.post<Product>("/products", {
      name: data.name,
      description: data.description,
      basePrice: data.basePrice,
      imageUrl: data.imageUrl,
      categoryId: data.categoryId,
      category: data.category,
      isActive: data.isActive !== false,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Update product (Admin)
export const updateProduct = async (
  id: string,
  data: UpdateProductDto
): Promise<Product> => {
  try {
    const response = await api.put<Product>(`/products/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Delete product (Admin)
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await api.delete(`/products/${id}`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
