import { createContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const api_url = import.meta.env.VITE_API_URL;
  const nav = useNavigate();

  const [access_token, setAuthToken] = useState(() =>
    localStorage.getItem("accessToken")
  );
  const [current_user, setCurrentUser] = useState(null);

  // ✅ Axios interceptor: always attach token
  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // LOGIN
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${api_url}/login`, { email, password });
      if (res.data.access_token) {
        localStorage.setItem("accessToken", res.data.access_token);
        setAuthToken(res.data.access_token);

        // ✅ Pass token explicitly to avoid race condition
        await getCurrentUser(res.data.access_token);

        toast.success("Logged in successfully");
        return true;
      } else {
        toast.error(res.data.error || "Something went wrong");
        return false;
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
      return false;
    }
  };

  // FETCH CURRENT USER
  const getCurrentUser = async (token) => {
    try {
      const activeToken = token || localStorage.getItem("accessToken");
      const res = await axios.get(`${api_url}/current_user`, {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      if (res.data && res.data.id) {
        setCurrentUser(res.data); // includes roles
      }
    } catch (err) {
      console.error("Failed to fetch current user", err);
    }
  };

  useEffect(() => {
    if (access_token) {
      getCurrentUser(access_token);
    }
  }, [access_token]);

  // LOGOUT
  const logout = async () => {
    try {
      await axios.delete(`${api_url}/logout`);
    } catch (err) {
      console.warn("Logout request failed, clearing session anyway");
    } finally {
      localStorage.removeItem("accessToken");
      setAuthToken(null);
      setCurrentUser(null);
      nav("/login");
      toast.success("Logged out successfully");
    }
  };

  const context_data = {
    login,
    logout,
    getCurrentUser,
    current_user,
    access_token,
  };

  return (
    <AuthContext.Provider value={context_data}>
      {children}
    </AuthContext.Provider>
  );
};
