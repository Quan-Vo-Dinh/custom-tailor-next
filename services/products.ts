import api, { getErrorMessage } from "@/lib/api";
import { Product, Fabric, Style, ProductCategory } from "@/types";

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
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get single product by ID
export const getProductById = async (id: string): Promise<Product> => {
  try {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
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
    return response.data.data;
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
    return response.data;
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
    return response.data;
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
    return response.data.data;
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
