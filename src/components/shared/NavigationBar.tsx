"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact Us" },
  ];

  return (
    <nav className="bg-slate-900/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        
         <Link href="/" className="text-2xl font-bold text-white tracking-tight"
        >
          Shop<span className="text-purple-400">Ease</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition ${
                pathname === link.href
                  ? "text-white border-b-2 border-purple-500 pb-1"
                  : "text-slate-200 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {!user ? (
          
          <Link  href="/login"
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm hover:from-purple-700 hover:to-pink-700 transition"
          >
            Login
          </Link>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <button
  onClick={() => setDropdownOpen(!dropdownOpen)}
  className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm hover:opacity-90 transition"
>
  {user.photo ? (
    <Image
      src={user.photo}
      alt={user.name}
      className="w-full h-full object-cover"
    />
  ) : (
    user.name.charAt(0).toUpperCase()
  )}
</button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-sm font-medium text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {user.email}
                  </p>
                </div>
                
               <Link   href="/dashboard"
                  className="block px-4 py-2.5 text-sm text-slate-200 hover:bg-white/10 transition"
                  onClick={() => setDropdownOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-white/10 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}