import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth(); // get the user name from auth state

  // get first letter for the avatar
  const initial = user?.userGivenName.charAt(0).toUpperCase();

  // show the first name
  const displayName = user?.userGivenName;

  return (
    <header className="bg-primary text-white">
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
          <a href="/dashboard" className="font-bold">
            Dashboard
          </a>

          <div className="h-8 w-[1px] bg-white/20" />

          <a href="/upload" className="font-bold">
            Upload Exercise
          </a>

          <div className="h-8 w-[1px] bg-white/20" />

          <a href="/library" className="font-bold">
            Exercise Library
          </a>

          <div className="h-8 w-[1px] bg-white/20" />

          <a href="/settings" className="font-bold">
            Settings
          </a>
        </nav>

        {/* profile */}
        <div className="flex items-center gap-3">
          <p>{displayName}</p>
          <div className="flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-full border-2 border-white/30 font-bold">
            {initial}
          </div>
          <button onClick={() => setOpen(!open)} className="md:hidden p-2">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* mobile view */}
      {open && (
        <nav className="md:hidden flex flex-col border-t">
          <a href="/dashboard" className="px-6 py-4 font-bold">
            Dashboard
          </a>
          <a href="/upload" className="px-6 py-4 font-bold">
            Upload Exercise
          </a>
          <a href="/library" className="px-6 py-4 font-bold">
            Exercise Exercise
          </a>
          <a href="/settings" className="px-6 py-4 font-bold">
            Settings
          </a>
        </nav>
      )}
    </header>
  );
};

export default Header;
