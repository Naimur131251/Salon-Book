import { authClient } from "./auth-client";

export const getToken = async () => {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Failed to get JWT token. Please login again.");
  }

  return data.token;
};