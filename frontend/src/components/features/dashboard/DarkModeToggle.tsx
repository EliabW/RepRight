import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { userService } from "@/services/userService";
import { useState, useEffect } from "react";

export function DarkModeToggle() {
  const { user, token, updateUser } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(false);

  // initialize dark mode from user preference
  useEffect(() => {
    if (user?.darkMode) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, [user?.darkMode]);

  const toggleDarkMode = async () => {
    if (!user || !token) return;

    setLoading(true);
    const newDarkMode = !isDark;

    try {
      // optimistically update ui
      setIsDark(newDarkMode);
      if (newDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      // save to localstorage as well
      localStorage.setItem("darkMode", String(newDarkMode));

      // save to database
      await userService.toggleDarkMode(user.userID, newDarkMode);

      // update user in context
      updateUser({ ...user, darkMode: newDarkMode });
    } catch (error) {
      // revert ui changes on error
      setIsDark(!newDarkMode);
      if (!newDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("darkMode", String(!newDarkMode));
      console.error("Failed to toggle dark mode:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleDarkMode}
      disabled={loading}
      aria-label="Toggle dark mode"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
