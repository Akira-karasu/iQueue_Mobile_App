
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/src/context/authContext";

export const useDecodedToken = () => {
  const { token } = useAuth();

  if (!token) return null;

  try {
    return jwtDecode(token) as any;
  } catch (error) {
    console.warn("Invalid token:", error);
    return null;
  }
};
