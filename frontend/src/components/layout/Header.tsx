import { useAuth } from "@/hooks/useAuth";
import { useRef, useState, useEffect } from "react";
import { ChevronDown, LogOut, Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { useLocation } from "react-router-dom";
import { DarkModeToggle } from "../features/dashboard/DarkModeToggle";
import { ButtonGroup } from "../ui/button-group";

const Header = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth(); // get the user name from auth state
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // get first letter for the avatar
  const initial = user?.userGivenName.charAt(0).toUpperCase();

  // show the first name
  const displayName = user?.userGivenName;

  const handleLogout = () => {
    logout();
    // close mobile menu if open
    setOpen(false);
  };

  // check if current path is active
  const isActive = (path: string) => location.pathname === path;

  // close dropdown when you click outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary text-white">
      <div className="flex h-20 items-center justify-between px-6">
        {/* logo */}
        <div className="flex items-center gap-2">
          <img
            src="/white-android-chrome-512x512.png"
            alt="RepRight Logo"
            className="w-20 h-20"
          />
          <p className="text-2xl">
            <b>Rep</b>Right
          </p>
        </div>

        {/* navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a
            href="/dashboard"
            className={`font-bold transition-all ${
              isActive("/dashboard")
                ? "border-b-2 border-white pb-1"
                : "opacity-80 hover:opacity-100"
            }`}
          >
            Dashboard
          </a>

          <div className="h-8 w-[1px] bg-white/20" />

          <a
            href="/upload"
            className={`font-bold transition-all ${
              isActive("/upload")
                ? "border-b-2 border-white pb-1"
                : "opacity-80 hover:opacity-100"
            }`}
          >
            Upload Exercise
          </a>

          <div className="h-8 w-[1px] bg-white/20" />

          <a
            href="/library"
            className={`font-bold transition-all ${
              isActive("/library")
                ? "border-b-2 border-white pb-1"
                : "opacity-80 hover:opacity-100"
            }`}
          >
            Exercise Library
          </a>
        </nav>

        {/* profile */}
        <div
          className="hidden md:flex items-center gap-3 relative"
          ref={dropdownRef}
        >
          <p>{displayName}</p>
          <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/30 font-bold">
            {initial}
          </div>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="p-1 hover:bg-white/10 rounded"
            aria-label="User menu"
          >
            <ChevronDown
              size={20}
              className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* dropdown menu */}
          {dropdownOpen && (
            <ButtonGroup
              orientation="vertical"
              className="absolute top-full right-0 mt-2 rounded-lg shadow-lg"
            >
              <DarkModeToggle></DarkModeToggle>
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="w-full"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </ButtonGroup>
          )}
        </div>
        <div className="flex md:hidden items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/30 font-bold">
            {initial}
          </div>
          <button onClick={() => setOpen(!open)} className="p-2">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* mobile view */}
      {open && (
        <nav className="md:hidden flex flex-col border-t">
          <a
            href="/dashboard"
            className={`px-6 py-4 font-bold ${
              isActive("/dashboard") ? "bg-white/10" : ""
            }`}
          >
            Dashboard
          </a>
          <a
            href="/upload"
            className={`px-6 py-4 font-bold ${
              isActive("/upload") ? "bg-white/10" : ""
            }`}
          >
            Upload Exercise
          </a>
          <a
            href="/library"
            className={`px-6 py-4 font-bold ${
              isActive("/library") ? "bg-white/10" : ""
            }`}
          >
            Exercise Library
          </a>

          <div className="bg-black/20 flex items-center justify-between mt-2 p-4">
            <Button onClick={handleLogout} variant="destructive">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>

            <DarkModeToggle variant="icon" />
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
