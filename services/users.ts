import api, { getErrorMessage } from "@/lib/api";
import { User, Measurement, Address } from "@/types";

const mapMeasurement = (raw: any): Measurement => {
  const details = raw?.details || {};
  return {
    id: raw.id,
    userId: raw.userId,
    name: raw.name,
    details,
    chest: details.chest ?? raw.chest,
    waist: details.waist ?? raw.waist,
    hips: details.hips ?? raw.hips,
    shoulders: details.shoulders ?? raw.shoulders,
    sleeveLength: details.sleeveLength ?? raw.sleeveLength,
    inseam: details.inseam ?? raw.inseam,
    neck: details.neck ?? raw.neck,
    notes: details.notes ?? raw.notes,
    isDefault: Boolean(raw.isDefault),
    createdAt: raw.createdAt ? new Date(raw.createdAt) : undefined,
    updatedAt: raw.updatedAt ? new Date(raw.updatedAt) : undefined,
  } as Measurement;
};

// Update profile DTO
export interface UpdateProfileDto {
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
}

// Create address DTO
export interface CreateAddressDto {
  street: string;
  city: string;
  country: string;
  isDefault?: boolean;
}

// Update address DTO
export interface UpdateAddressDto {
  street?: string;
  city?: string;
  country?: string;
  isDefault?: boolean;
}

// Create measurement DTO
export interface CreateMeasurementDto {
  name: string;
  details: Record<string, any>;
}

// Update measurement DTO
export interface UpdateMeasurementDto {
  name?: string;
  details?: Record<string, any>;
}

// Get profile (backend returns user with nested profile)
export const getProfile = async (): Promise<User> => {
  try {
    const response = await api.get<any>("/users/profile");
    const data = response.data;
    // Map to User shape used on frontend
    return {
      id: data.id,
      email: data.email,
      role: data.role,
      name: data.profile?.fullName,
      phone: data.profile?.phone,
      avatar: data.profile?.avatarUrl,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    } satisfies User;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Update profile
export const updateProfile = async (
  data: UpdateProfileDto
): Promise<User> => {
  try {
    const response = await api.put<User>("/users/profile", data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get profile stats (backend fields: totalOrders, totalAppointments, savedMeasurements, savedAddresses)
export interface ProfileStats {
  orders: number;
  appointments: number;
  measurements: number;
  addresses: number;
  memberSince?: string;
}

export const getProfileStats = async (): Promise<ProfileStats> => {
  try {
    const response = await api.get<any>("/users/profile/stats");
    const data = response.data;
    return {
      orders: data.totalOrders ?? 0,
      appointments: data.totalAppointments ?? 0,
      measurements: data.savedMeasurements ?? 0,
      addresses: data.savedAddresses ?? 0,
      memberSince: data.memberSince,
    };
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Addresses
export const getAddresses = async (): Promise<Address[]> => {
  try {
    const response = await api.get<Address[]>("/users/addresses");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createAddress = async (
  data: CreateAddressDto
): Promise<Address> => {
  try {
    const response = await api.post<Address>("/users/addresses", data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateAddress = async (
  id: string,
  data: UpdateAddressDto
): Promise<Address> => {
  try {
    const response = await api.put<Address>(`/users/addresses/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteAddress = async (id: string): Promise<void> => {
  try {
    await api.delete(`/users/addresses/${id}`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Measurements
export const getMeasurements = async (): Promise<Measurement[]> => {
  try {
    const response = await api.get("/users/measurements");
    const data = response.data as any[];
    return Array.isArray(data) ? data.map(mapMeasurement) : [];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createMeasurement = async (
  data: CreateMeasurementDto
): Promise<Measurement> => {
  try {
    const response = await api.post("/users/measurements", data);
    return mapMeasurement(response.data);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateMeasurement = async (
  id: string,
  data: UpdateMeasurementDto
): Promise<Measurement> => {
  try {
    const response = await api.put(`/users/measurements/${id}`, data);
    return mapMeasurement(response.data);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteMeasurement = async (id: string): Promise<void> => {
  try {
    await api.delete(`/users/measurements/${id}`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Admin functions
export interface GetAllUsersParams {
  page?: number;
  limit?: number;
  role?: "CUSTOMER" | "STAFF" | "ADMIN";
  search?: string;
}

export interface PaginatedUsersResponse {
  users: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Get all users (Admin)
export const getAllUsers = async (
  params?: GetAllUsersParams
): Promise<PaginatedUsersResponse> => {
  try {
    const response = await api.get<PaginatedUsersResponse>("/users", {
      params: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        role: params?.role,
        search: params?.search,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get user by ID (Admin)
export const getUserById = async (userId: string): Promise<User> => {
  try {
    const response = await api.get<User>(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Update user (Admin)
export interface UpdateUserDto {
  fullName?: string;
  phoneNumber?: string;
  role?: "CUSTOMER" | "STAFF" | "ADMIN";
}

export const updateUser = async (
  userId: string,
  data: UpdateUserDto
): Promise<User> => {
  try {
    const response = await api.put<User>(`/users/${userId}`, data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Delete user (Admin)
export const deleteUser = async (userId: string): Promise<void> => {
  try {
    await api.delete(`/users/${userId}`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

