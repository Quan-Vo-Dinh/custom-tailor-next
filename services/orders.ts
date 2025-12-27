import api, { getErrorMessage } from "@/lib/api";
import {
  Order,
  OrderStatus,
  OrderItem,
  Product,
  Fabric,
  Style,
  User,
  UserRole,
} from "@/types";

const toUser = (payload: any, role: UserRole): User => ({
  id: payload?.id ?? "",
  email: payload?.email ?? "",
  name:
    payload?.profile?.fullName ||
    payload?.name ||
    payload?.email?.split("@")[0] ||
    "",
  role,
  phone: payload?.profile?.phone,
  avatar: payload?.profile?.avatarUrl,
  createdAt: new Date(payload?.createdAt ?? Date.now()),
  updatedAt: new Date(payload?.updatedAt ?? Date.now()),
});

const toProduct = (raw: any): Product => ({
  id: raw?.id ?? "",
  name: raw?.name ?? "Sản phẩm",
  category: raw?.category || raw?.productCategory || "SUIT",
  basePrice: Number(raw?.basePrice ?? 0),
  description: raw?.description ?? "",
  images: raw?.images || [],
  availableFabrics: [],
  availableStyles: [],
  featured: raw?.featured ?? false,
  slug: raw?.slug ?? raw?.id ?? "",
  createdAt: new Date(raw?.createdAt ?? Date.now()),
  updatedAt: new Date(raw?.updatedAt ?? Date.now()),
});

const toFabric = (raw: any): Fabric => ({
  id: raw?.id ?? "",
  name: raw?.name ?? "Vải",
  material: raw?.material ?? "",
  color: raw?.color ?? "",
  price: Number(raw?.priceAdjustment ?? raw?.price ?? 0),
  image: raw?.image ?? "",
  stock: raw?.stock ?? 0,
});

const toStyle = (raw: any): Style => ({
  id: raw?.id ?? "",
  name: raw?.name ?? "Phong cách",
  category: raw?.category ?? "",
  description: raw?.description ?? "",
  priceModifier: Number(raw?.priceAdjustment ?? 0),
});

const toOrderItem = (raw: any): OrderItem => ({
  id: raw?.id ?? "",
  productId: raw?.productId ?? "",
  product: raw?.product ? toProduct(raw.product) : ({} as Product),
  fabricId: raw?.fabricId ?? "",
  fabric: raw?.fabric ? toFabric(raw.fabric) : ({} as Fabric),
  styleId: raw?.styleOptionId ?? "",
  style: raw?.styleOption ? toStyle(raw.styleOption) : ({} as Style),
  measurementId: raw?.measurementId ?? "",
  // measurement snapshot is free-form; keep as undefined to satisfy type
  measurement: undefined as any,
  quantity: raw?.quantity ?? 1,
  unitPrice: Number(raw?.priceAtTime ?? 0),
  subtotal: Number(raw?.priceAtTime ?? 0),
});

const toOrder = (raw: any): Order => {
  const orderData = raw?.data ?? raw; // some endpoints wrap in {data,...}
  const itemsRaw: any[] = orderData?.items ?? [];

  const staff =
    orderData?.staff && Object.keys(orderData.staff).length
      ? toUser(orderData.staff, UserRole.STAFF)
      : undefined;

  const customer =
    orderData?.customer && Object.keys(orderData.customer).length
      ? toUser(orderData.customer, UserRole.CUSTOMER)
      : undefined;

  const shippingAddress =
    typeof orderData?.shippingAddress === "string"
      ? orderData.shippingAddress
      : orderData?.shippingAddress
      ? `${orderData.shippingAddress.street || ""} ${
          orderData.shippingAddress.city || ""
        } ${orderData.shippingAddress.country || ""}`.trim()
      : undefined;

  return {
    id: orderData?.id ?? "",
    orderNumber: orderData?.orderNumber ?? orderData?.id ?? "",
    customerId: orderData?.userId ?? "",
    customer: customer || ({} as User),
    items: itemsRaw.map(toOrderItem),
    status: (orderData?.status as OrderStatus) ?? OrderStatus.PENDING,
    paymentMethod:
      (orderData?.payment?.method as any) ??
      (orderData?.paymentMethod as any) ??
      "COD",
    paymentStatus:
      (orderData?.payment?.status as any) ??
      (orderData?.paymentStatus as any) ??
      "PENDING",
    totalAmount: Number(orderData?.totalAmount ?? 0),
    shippingAddress,
    notes: orderData?.notes ?? "",
    assignedStaffId: orderData?.staffId ?? undefined,
    assignedStaff: staff,
    createdAt: new Date(orderData?.createdAt ?? Date.now()),
    updatedAt: new Date(orderData?.updatedAt ?? Date.now()),
    completedAt: orderData?.completedAt
      ? new Date(orderData.completedAt)
      : undefined,
  };
};

// Create order DTO
export interface CreateOrderDto {
  addressId?: string;
  measurementId?: string;
  items: Array<{
    productId: string;
    fabricId: string;
    quantity: number;
    styleOptionId?: string;
    styleOptionIds?: string[]; // Support multiple style options
    measurementId?: string;
  }>;
  paymentMethod: "COD" | "SEPAY" | "STRIPE";
  notes?: string;
}

// Create review DTO
export interface CreateReviewDto {
  orderId: string;
  productId: string;
  rating: number;
  comment?: string;
}

// Update order status DTO
export interface UpdateOrderStatusDto {
  status: OrderStatus;
}

// Get all orders (for current user)
export const getOrders = async (params?: {
  status?: OrderStatus;
}): Promise<Order[]> => {
  try {
    const response = await api.get("/orders", {
      params,
    });
    const payload = (response.data as any)?.data ?? response.data;
    if (!payload) return [];
    const list = Array.isArray(payload) ? payload : payload?.data ?? [];
    return list.map(toOrder);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get order by ID
export const getOrderById = async (id: string): Promise<Order> => {
  try {
    const response = await api.get(`/orders/${id}`);
    return toOrder(response.data);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Create order (checkout)
export const createOrder = async (data: CreateOrderDto): Promise<Order> => {
  try {
    const response = await api.post<Order>("/orders", data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Update order status
export const updateOrderStatus = async (
  id: string,
  data: UpdateOrderStatusDto
): Promise<Order> => {
  try {
    const response = await api.patch(`/orders/${id}/status`, data);
    return toOrder(response.data);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Cancel order
export const cancelOrder = async (id: string): Promise<Order> => {
  try {
    const response = await api.put(`/orders/${id}/cancel`);
    return toOrder(response.data);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Create review
export const createReview = async (data: CreateReviewDto): Promise<any> => {
  try {
    const response = await api.post(`/orders/${data.orderId}/reviews`, {
      productId: data.productId,
      rating: data.rating,
      comment: data.comment,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get review for order
export const getOrderReview = async (orderId: string): Promise<any> => {
  try {
    const response = await api.get(`/orders/${orderId}/reviews`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Update review
export const updateReview = async (
  reviewId: string,
  data: { rating: number; comment?: string }
): Promise<any> => {
  try {
    const response = await api.put(`/orders/reviews/${reviewId}`, data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Delete review
export const deleteReview = async (reviewId: string): Promise<void> => {
  try {
    await api.delete(`/orders/reviews/${reviewId}`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Admin functions
export interface GetAllOrdersParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  staffId?: string;
  startDate?: string;
  endDate?: string;
}

export interface PaginatedOrdersResponse {
  orders: Order[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Get all orders (Admin/Staff)
export const getAllOrders = async (
  params?: GetAllOrdersParams
): Promise<PaginatedOrdersResponse> => {
  try {
    const response = await api.get("/orders/admin/all", {
      params: {
        skip: params?.page ? (params.page - 1) * (params.limit || 10) : 0,
        take: params?.limit || 10,
        status: params?.status,
        staffId: params?.staffId,
        startDate: params?.startDate,
        endDate: params?.endDate,
      },
    });
    const payload = response.data as any;
    const ordersRaw = payload?.orders ?? payload?.data ?? [];
    const pagination = payload?.pagination ?? {
      currentPage: params?.page || 1,
      totalPages: 1,
      totalItems: ordersRaw.length,
      itemsPerPage: params?.limit || 10,
    };

    return {
      orders: Array.isArray(ordersRaw) ? ordersRaw.map(toOrder) : [],
      pagination,
    };
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Update order status (Admin/Staff)
export const updateOrderStatusAdmin = async (
  orderId: string,
  status: OrderStatus,
  notes?: string
): Promise<Order> => {
  try {
    const response = await api.put(`/orders/${orderId}/status`, {
      status,
      notes,
    });
    return toOrder(response.data);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Assign staff to order (Admin only)
export const assignStaffToOrder = async (
  orderId: string,
  staffId: string
): Promise<Order> => {
  try {
    const response = await api.patch(
      `/orders/${orderId}/assign-staff/${staffId}`
    );
    return toOrder(response.data);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Admin/Staff: get order details
export const getAdminOrderById = async (id: string): Promise<Order> => {
  try {
    const response = await api.get(`/orders/admin/${id}`);
    return toOrder(response.data);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
