import api, { getErrorMessage } from "@/lib/api";
import {
  Order,
  OrderStatus,
  User,
  Appointment,
  AppointmentStatus,
} from "@/types";

// Dashboard Stats
export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalAppointments: number;
  pendingAppointments: number;
}

// Revenue Report
export interface RevenueReport {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  revenueByPeriod: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

// Staff Info
export interface StaffInfo {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  activeOrders: number;
  completedOrders: number;
}

// Staff Workload
export interface StaffWorkload {
  staffId: string;
  staffName: string;
  activeOrders: number;
  pendingAppointments: number;
  workload: "LOW" | "MEDIUM" | "HIGH";
}

// Get Dashboard Stats
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await api.get<any>("/admin/dashboard");
    const data = response.data?.data ?? response.data;

    // Map backend response to frontend expected format
    return {
      totalOrders: data?.orders?.total ?? 0,
      pendingOrders: data?.orders?.pending ?? 0,
      completedOrders: data?.orders?.completed ?? 0,
      totalRevenue: data?.revenue?.total ?? 0,
      totalCustomers: data?.customers?.total ?? 0,
      totalAppointments: data?.appointments?.total ?? 0,
      pendingAppointments: data?.appointments?.pending ?? 0,
    };
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get Recent Orders
export const getRecentOrders = async (limit: number = 10): Promise<Order[]> => {
  try {
    const response = await api.get<Order[]>("/admin/orders/recent", {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get Recent Appointments
export const getRecentAppointments = async (
  limit: number = 10
): Promise<Appointment[]> => {
  try {
    const response = await api.get<Appointment[]>(
      "/admin/appointments/recent",
      {
        params: { limit },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get Revenue Report
export const getRevenueReport = async (params: {
  startDate: string;
  endDate: string;
  groupBy?: "day" | "week" | "month";
}): Promise<RevenueReport> => {
  try {
    const response = await api.get<RevenueReport>("/admin/revenue", {
      params,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get All Orders (Admin)
export const getAllOrders = async (params?: {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  userId?: string;
  startDate?: string;
  endDate?: string;
}): Promise<{ orders: Order[]; pagination: any }> => {
  try {
    const response = await api.get<{ orders: Order[]; pagination: any }>(
      "/orders/admin/all",
      { params }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get Order Detail (Admin)
export const getOrderDetailAdmin = async (orderId: string): Promise<Order> => {
  try {
    const response = await api.get<Order>(`/admin/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Update Order Status (Admin/Staff)
export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus,
  notes?: string
): Promise<Order> => {
  try {
    const response = await api.put<Order>(`/orders/${orderId}/status`, {
      status,
      notes,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Assign Staff to Order
export const assignStaffToOrder = async (
  orderId: string,
  staffId: string
): Promise<Order> => {
  try {
    const response = await api.patch<Order>(
      `/orders/${orderId}/assign-staff/${staffId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get All Users (Admin)
export const getAllUsers = async (params?: {
  page?: number;
  limit?: number;
  role?: "CUSTOMER" | "STAFF" | "ADMIN";
  search?: string;
}): Promise<{ users: User[]; pagination: any }> => {
  try {
    const response = await api.get<{ users: User[]; pagination: any }>(
      "/users",
      {
        params,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get User Detail (Admin)
export const getUserDetail = async (userId: string): Promise<User> => {
  try {
    const response = await api.get<User>(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Update User (Admin)
export const updateUser = async (
  userId: string,
  data: {
    fullName?: string;
    phoneNumber?: string;
    role?: "CUSTOMER" | "STAFF" | "ADMIN";
  }
): Promise<User> => {
  try {
    const response = await api.put<User>(`/users/${userId}`, data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Delete User (Admin)
export const deleteUser = async (userId: string): Promise<void> => {
  try {
    await api.delete(`/users/${userId}`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get All Appointments (Admin)
export const getAllAppointments = async (params?: {
  page?: number;
  limit?: number;
  status?: AppointmentStatus;
  startDate?: string;
  endDate?: string;
}): Promise<{ appointments: Appointment[]; pagination: any }> => {
  try {
    const response = await api.get<{
      appointments: Appointment[];
      pagination: any;
    }>("/appointments/admin/all", {
      params,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Update Appointment Status (Admin/Staff)
export const updateAppointmentStatus = async (
  appointmentId: string,
  status: AppointmentStatus,
  notes?: string
): Promise<Appointment> => {
  try {
    const response = await api.patch<Appointment>(
      `/appointments/${appointmentId}/status`,
      { status, notes }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Assign Staff to Appointment
export const assignStaffToAppointment = async (
  appointmentId: string,
  staffId: string
): Promise<Appointment> => {
  try {
    const response = await api.patch<Appointment>(
      `/appointments/${appointmentId}/assign-staff`,
      { staffId }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get Staff List
export const getStaffList = async (): Promise<StaffInfo[]> => {
  try {
    const response = await api.get<StaffInfo[]>("/admin/staff");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get Staff Workload
export const getStaffWorkload = async (): Promise<StaffWorkload[]> => {
  try {
    const response = await api.get<StaffWorkload[]>("/admin/staff/workload");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get Customer Statistics
export const getCustomerStatistics = async (params?: {
  sortBy?: "totalSpent" | "orderCount" | "lastOrderDate";
  limit?: number;
}): Promise<any> => {
  try {
    const response = await api.get("/admin/customers", { params });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
