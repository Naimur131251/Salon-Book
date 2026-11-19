import { getToken } from "@/lib/get-token";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token = await getToken();

  const response = await fetch(`${SERVER_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  // Unauthorized or Forbidden
  if (response.status === 401 || response.status === 403) {
    if (typeof window !== "undefined") {
      window.location.assign("/unauthorized");
    }
    throw new Error("Unauthorized access");
  }

  return response;
};