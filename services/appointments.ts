import api, { getErrorMessage } from "@/lib/api";
import {
  Appointment,
  AppointmentType,
  AppointmentStatus,
  TimeSlot,
  UserRole,
  User,
} from "@/types";

// Create appointment DTO
export interface CreateAppointmentDto {
  type: AppointmentType;
  date: string; // ISO date string (YYYY-MM-DD)
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  notes?: string;
}

// Update appointment status DTO
export interface UpdateAppointmentStatusDto {
  status: AppointmentStatus;
}

// Get available time slots for a specific date
export const getAvailableSlots = async (
  date: string,
  type?: AppointmentType
): Promise<TimeSlot[]> => {
  try {
    const response = await api.get<TimeSlot[]>(
      "/appointments/available-slots",
      {
        params: { date, type },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Create new appointment
export const createAppointment = async (
  data: CreateAppointmentDto
): Promise<Appointment> => {
  try {
    const response = await api.post<Appointment>("/appointments", data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

const toUser = (
  payload: any,
  role: UserRole.CUSTOMER | UserRole.STAFF
): User => ({
  id: payload?.id,
  email: payload?.email,
  name: payload?.email?.split("@")[0] ?? "",
  role,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const toAppointment = (apt: any): Appointment => {
  const start = new Date(apt.startTime);
  const end = new Date(apt.endTime);

  return {
    id: apt.id,
    customerId: apt.userId,
    customer: apt.user ? toUser(apt.user, UserRole.CUSTOMER) : ({} as User),
    type: (apt.type as AppointmentType) || AppointmentType.CONSULTATION,
    status: apt.status as AppointmentStatus,
    date: start,
    startTime: start.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    endTime: end.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    notes: apt.notes ?? "",
    assignedStaffId: apt.staffId ?? undefined,
    assignedStaff: apt.staff ? toUser(apt.staff, UserRole.STAFF) : undefined,
    createdAt: new Date(apt.createdAt),
    updatedAt: new Date(apt.updatedAt),
  };
};

// Get my appointments (customer)
export const getMyAppointments = async (params?: {
  status?: AppointmentStatus;
  fromDate?: string;
  toDate?: string;
}): Promise<Appointment[]> => {
  try {
    // Use dedicated /appointments/my endpoint for current customer
    const response = await api.get("/appointments/my", {
      params,
    });

    // Backend wraps data as { statusCode, data, timestamp }
    const raw = (response.data as any)?.data ?? response.data;

    if (!Array.isArray(raw)) {
      return [];
    }

    return raw.map(toAppointment);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get appointment by ID
export const getAppointmentById = async (id: string): Promise<Appointment> => {
  try {
    const response = await api.get(`/appointments/${id}`);
    const raw = (response.data as any)?.data ?? response.data;
    return toAppointment(raw);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Cancel appointment
export const cancelAppointment = async (id: string): Promise<Appointment> => {
  try {
    const response = await api.patch<Appointment>(`/appointments/${id}/cancel`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Reschedule appointment
export interface RescheduleAppointmentDto {
  date: string;
  startTime: string;
  endTime: string;
}

export const rescheduleAppointment = async (
  id: string,
  data: RescheduleAppointmentDto
): Promise<Appointment> => {
  try {
    const response = await api.patch<Appointment>(
      `/appointments/${id}/reschedule`,
      data
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Check if a time slot is available
export const checkSlotAvailability = async (
  date: string,
  startTime: string,
  endTime: string
): Promise<boolean> => {
  try {
    const response = await api.get<{ available: boolean }>(
      "/appointments/check-availability",
      {
        params: { date, startTime, endTime },
      }
    );
    return response.data.available;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get appointment statistics (for admin/staff)
export interface AppointmentStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  noShow: number;
}

export const getAppointmentStats = async (params?: {
  fromDate?: string;
  toDate?: string;
}): Promise<AppointmentStats> => {
  try {
    const response = await api.get<AppointmentStats>("/appointments/stats", {
      params,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Helper: Generate time slots for a day
export const generateTimeSlots = (
  startHour: number = 9,
  endHour: number = 18,
  intervalMinutes: number = 60
): string[] => {
  const slots: string[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      const time = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      slots.push(time);
    }
  }
  return slots;
};

// Helper: Format date for display
export const formatAppointmentDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Helper: Format time for display
export const formatAppointmentTime = (time: string): string => {
  return time;
};

// Helper: Get appointment status color
export const getAppointmentStatusColor = (
  status: AppointmentStatus
): string => {
  switch (status) {
    case AppointmentStatus.PENDING:
      return "text-yellow-600 bg-yellow-50";
    case AppointmentStatus.CONFIRMED:
      return "text-blue-600 bg-blue-50";
    case AppointmentStatus.COMPLETED:
      return "text-green-600 bg-green-50";
    case AppointmentStatus.CANCELLED:
      return "text-red-600 bg-red-50";
    case AppointmentStatus.NO_SHOW:
      return "text-gray-600 bg-gray-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

// Helper: Get appointment status label
export const getAppointmentStatusLabel = (
  status: AppointmentStatus
): string => {
  switch (status) {
    case AppointmentStatus.PENDING:
      return "Chờ xác nhận";
    case AppointmentStatus.CONFIRMED:
      return "Đã xác nhận";
    case AppointmentStatus.COMPLETED:
      return "Hoàn thành";
    case AppointmentStatus.CANCELLED:
      return "Đã hủy";
    case AppointmentStatus.NO_SHOW:
      return "Không đến";
    default:
      return status;
  }
};

// Helper: Get appointment type label
export const getAppointmentTypeLabel = (type: AppointmentType): string => {
  switch (type) {
    case AppointmentType.CONSULTATION:
      return "Tư vấn";
    case AppointmentType.FITTING:
      return "Thử đồ";
    case AppointmentType.PICKUP:
      return "Nhận hàng";
    default:
      return type;
  }
};

// Admin functions
export interface GetAllAppointmentsParams {
  page?: number;
  limit?: number;
  status?: AppointmentStatus;
  fromDate?: string;
  toDate?: string;
  search?: string;
}

export interface PaginatedAppointmentsResponse {
  appointments: Appointment[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Get all appointments (Admin/Staff)
export const getAllAppointments = async (
  params?: GetAllAppointmentsParams
): Promise<PaginatedAppointmentsResponse> => {
  try {
    const response = await api.get<any>("/appointments/admin/all", {
      params: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        status: params?.status,
        fromDate: params?.fromDate,
        toDate: params?.toDate,
        search: params?.search,
      },
    });

    // Backend returns { appointments, pagination }
    const data = response.data?.data ?? response.data;
    const rawAppointments = data?.appointments ?? [];

    return {
      appointments: rawAppointments.map((apt: any) => ({
        id: apt.id,
        customerId: apt.userId,
        customer: apt.user
          ? {
              id: apt.user.id,
              email: apt.user.email,
              name:
                apt.user.profile?.fullName ||
                apt.user.email?.split("@")[0] ||
                "",
              phone: apt.user.profile?.phone || "",
              role: UserRole.CUSTOMER,
              createdAt: new Date(),
              updatedAt: new Date(),
            }
          : undefined,
        type: apt.type || AppointmentType.CONSULTATION,
        status: apt.status as AppointmentStatus,
        startTime: apt.startTime,
        endTime: apt.endTime,
        notes: apt.notes || "",
        assignedStaffId: apt.staffId,
        assignedStaff: apt.staff
          ? {
              id: apt.staff.id,
              email: apt.staff.email,
              name:
                apt.staff.profile?.fullName ||
                apt.staff.email?.split("@")[0] ||
                "",
              role: UserRole.STAFF,
              createdAt: new Date(),
              updatedAt: new Date(),
            }
          : undefined,
        createdAt: new Date(apt.createdAt),
        updatedAt: new Date(apt.updatedAt),
      })),
      pagination: {
        currentPage: data?.pagination?.page || 1,
        totalPages: data?.pagination?.totalPages || 1,
        totalItems: data?.pagination?.totalItems || 0,
        itemsPerPage: data?.pagination?.limit || 10,
      },
    };
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Update appointment status (Admin/Staff)
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

// Assign staff to appointment (Admin)
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
