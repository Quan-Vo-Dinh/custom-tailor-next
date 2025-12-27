import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

// Create Axios instance
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // allow larger uploads
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add token to headers
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: Error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Unwrap backend response structure
    if (response.data && typeof response.data === 'object' && 'data' in response.data && 'statusCode' in response.data) {
      return {
        ...response,
        data: response.data.data,
      };
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 - Token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh token
      const refreshTokenValue = typeof window !== "undefined"
        ? localStorage.getItem("refreshToken")
        : null;

      if (refreshTokenValue) {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            { refreshToken: refreshTokenValue }
          );

          const { accessToken } = response.data.data || response.data;
          
          if (accessToken && typeof window !== "undefined") {
            localStorage.setItem("accessToken", accessToken);
            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed - clear tokens
          if (typeof window !== "undefined") {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            // Redirect to login if on protected route
            if (window.location.pathname.startsWith("/admin") || 
                window.location.pathname.startsWith("/profile")) {
              window.location.href = "/login";
            }
          }
        }
      } else {
        // No refresh token - clear access token and redirect
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          if (window.location.pathname.startsWith("/admin") || 
              window.location.pathname.startsWith("/profile")) {
            window.location.href = "/login";
      }
        }
      }
    }

    // Handle 403 - Forbidden (user doesn't have permission)
    if (error.response?.status === 403) {
      console.error("Forbidden - You don't have permission");
    }

    return Promise.reject(error);
  }
);

// API Error type
export interface ApiError {
  message: string;
  statusCode?: number;
  error?: string;
}

// Helper function to extract error message
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    return (
      axiosError.response?.data?.message ||
      axiosError.message ||
      "An unexpected error occurred"
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
};

// Auth helpers
export const setAuthToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", token);
  }
};

export const removeAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

export default api;
