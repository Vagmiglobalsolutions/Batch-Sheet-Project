import type {
  LoginRequest,
  LoginResponse,
} from "./authService";

const mockUsers = [
  {
    username: "production",
    password: "production123",
    userId: "USR-PROD-001",
    role: "PRODUCTION" as const,
    branch: "Bangalore",
  },
  {
    username: "qa",
    password: "qa123",
    userId: "USR-QA-001",
    role: "QA" as const,
    branch: "Bangalore",
  },
  {
    username: "technical",
    password: "technical123",
    userId: "USR-TECH-001",
    role: "TECHNICAL" as const,
    branch: "Hyderabad",
  },
  {
    username: "admin",
    password: "admin123",
    userId: "USR-ADMIN-001",
    role: "ADMIN" as const,
    branch: "Bangalore",
  },
];

export const mockLogin = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const matchedUser = mockUsers.find(
    (user) =>
      user.username === credentials.username &&
      user.password === credentials.password
  );

  if (!matchedUser) {
    throw new Error("Invalid username or password");
  }

  return {
    success: true,
    data: {
      accessToken: `mock-token-${matchedUser.userId}`,
      user: {
        userId: matchedUser.userId,
        username: matchedUser.username,
        role: matchedUser.role,
        branch: matchedUser.branch,
      },
    },
  };
};