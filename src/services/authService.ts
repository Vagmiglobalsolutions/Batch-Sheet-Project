import api from "./api";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginUser {
  userId: string;
  username: string;
  role: "PRODUCTION" | "QA" | "TECHNICAL" | "ADMIN";
  branch: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken?: string;
    user: LoginUser;
  };
}

export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    "/auth/login",
    credentials
  );

  return response.data;
};

export const logout = async (): Promise<void> => {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    console.warn(
      "Backend logout request failed. Clearing local session.",
      error
    );
  }
};

export const refreshToken = async () => {
  const response = await api.post("/auth/refresh");

  return response.data;
};

export const verifyDevice = async (deviceId: string) => {
  const response = await api.post("/devices/verify", {
    deviceId,
  });

  return response.data;
};