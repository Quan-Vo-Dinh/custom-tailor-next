import api, { getErrorMessage, setAuthToken, removeAuthToken } from "@/lib/api";

// Auth types
export interface SignUpDto {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface SignInDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
    profile?: {
      fullName: string;
      phone?: string;
      avatarUrl?: string;
    };
  };
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordDto {
  email: string;
}

// Sign up
export const signUp = async (data: SignUpDto): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>("/auth/sign-up", data);
    if (response.data.accessToken) {
      setAuthToken(response.data.accessToken);
    }
    if (response.data.refreshToken && typeof window !== "undefined") {
      localStorage.setItem("refreshToken", response.data.refreshToken);
    }
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Sign in
export const signIn = async (data: SignInDto): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>("/auth/sign-in", data);
    
    // Debug logging
    if (process.env.NODE_ENV === "development") {
      console.log("[Auth] Sign in successful", {
        hasAccessToken: !!response.data.accessToken,
        hasRefreshToken: !!response.data.refreshToken,
        userRole: response.data.user?.role,
      });
    }
    
    if (response.data.accessToken) {
      setAuthToken(response.data.accessToken);
      // Verify token was set
      if (process.env.NODE_ENV === "development") {
        const storedToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
        console.log("[Auth] Token stored:", !!storedToken, "Length:", storedToken?.length);
      }
    }
    if (response.data.refreshToken && typeof window !== "undefined") {
      localStorage.setItem("refreshToken", response.data.refreshToken);
    }
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Auth] Sign in failed:", error);
    }
    throw new Error(getErrorMessage(error));
  }
};

// Sign out
export const signOut = () => {
  removeAuthToken();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

// Get current user
export const getCurrentUser = async (): Promise<AuthResponse["user"]> => {
  try {
    // Backend uses POST for /auth/me
    const response = await api.post<AuthResponse["user"]>("/auth/me");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Refresh token
export const refreshToken = async (): Promise<AuthResponse> => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token found");
    }
    const response = await api.post<AuthResponse>("/auth/refresh", {
      refreshToken,
    });
    if (response.data.accessToken) {
      setAuthToken(response.data.accessToken);
    }
    return response.data;
  } catch (error) {
    removeAuthToken();
    throw new Error(getErrorMessage(error));
  }
};

// Change password
export const changePassword = async (
  data: ChangePasswordDto
): Promise<{ message: string }> => {
  try {
    const response = await api.post<{ message: string }>(
      "/auth/change-password",
      data
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Forgot password
export const forgotPassword = async (
  data: ForgotPasswordDto
): Promise<{ message: string }> => {
  try {
    const response = await api.post<{ message: string }>(
      "/auth/forgot-password",
      data
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

