import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import type { User, AuthContextValue } from "@/types";

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  // clear token/localstorage
  const clearAuth = (): void => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("darkMode");
    document.documentElement.classList.remove("dark");
  };

  // load token from localstorage on initial render
  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = localStorage.getItem("token");
      const storedDarkMode = localStorage.getItem("darkMode");

      // apply dark mode immediately to prevent flash
      if (storedDarkMode === "true") {
        document.documentElement.classList.add("dark");
      }

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const user = await authService.getCurrentUser();

        setUser(user);
        setToken(storedToken);
        localStorage.setItem("user", JSON.stringify(user));

        // sync dark mode from database (in case it changed on another device)
        if (user.darkMode) {
          document.documentElement.classList.add("dark");
          localStorage.setItem("darkMode", "true");
        } else {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("darkMode", "false");
        }
      } catch {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // set user data and token on login
  const login = (userData: User, authToken: string): void => {
    // apply dark mode on login
    if (userData.darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }

    setUser(userData);
    setToken(authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
  };

  // clear user data and token on logout
  const logout = (): void => {
    clearAuth();
    navigate("/login");
  };

  // update user data
  const updateUser = (updatedUserData: User): void => {
    setUser(updatedUserData);
    localStorage.setItem("user", JSON.stringify(updatedUserData));
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!token,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
