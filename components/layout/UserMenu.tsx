"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  LogOut,
  Settings,
  LayoutDashboard,
  Heart,
  Briefcase,
  ChevronDown,
  Mail,
  Shield,
  Loader2,
} from "lucide-react";

interface UserData {
  id?: string;
  email?: string;
  username?: string;
  name?: string;
  role?: string;
  dashboard?: string;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  image?: string;
}

export default function UserMenu() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setUser(data.user);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      </div>
    );
  }

  // Not logged in - show login button
  if (!user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-700 hover:text-brand-600 font-medium transition-all duration-300"
      >
        <User className="w-5 h-5" />
        <span className="text-sm font-medium whitespace-nowrap">Sign In</span>
      </Link>
    );
  }

  // Logged in - show user menu
  const getInitials = () => {
    if (user.name) {
      return user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  const getDashboardLink = () => {
    if (user.dashboard === "BOTH" || user.isSuperAdmin) {
      return "/dashboard";
    }
    if (user.dashboard === "PORTFOLIO") {
      return "/portfolio";
    }
    if (user.dashboard === "HERPROMISE") {
      return "/dashboard";
    }
    return "/dashboard";
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/50 transition-all group"
      >
        {/* User Avatar */}
        <div className="relative">
          {user.image ? (
            <div className="w-8 h-8 rounded-full border-2 border-gray-200 group-hover:border-brand-400 transition-colors overflow-hidden">
              <Image
                src={user.image}
                alt={user.name || "User"}
                width={32}
                height={32}
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-accent-purple-500 flex items-center justify-center text-white font-bold text-xs border-2 border-gray-200 group-hover:border-brand-400 transition-colors">
              {getInitials()}
            </div>
          )}
          {/* Online indicator */}
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50"
          >
            {/* User Info Header */}
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-4">
              <div className="flex items-center gap-3">
                {user.image ? (
                  <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden">
                    <Image
                      src={user.image}
                      alt={user.name || "User"}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold border-2 border-white">
                    {getInitials()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">
                    {user.name || user.username || "User"}
                  </p>
                  <p className="text-white/80 text-xs truncate flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {user.email}
                  </p>
                </div>
              </div>
              {user.isAdmin && (
                <div className="mt-2 flex items-center gap-1 text-white/90 text-xs">
                  <Shield className="w-3 h-3" />
                  <span>
                    {user.isSuperAdmin ? "Super Admin" : "Admin"} Access
                  </span>
                </div>
              )}
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {/* Dashboard Links */}
              <div className="px-2 pb-2 border-b border-gray-100">
                <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                  Dashboards
                </p>

                {/* Admin Dashboard - Only for SUPER_ADMIN */}
                {user.isSuperAdmin && (
                  <Link
                    href="/admin/overview"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors group"
                  >
                    <Shield className="w-4 h-4 group-hover:text-blue-600" />
                    <span className="text-sm font-medium">Admin Dashboard</span>
                  </Link>
                )}

                {(user.dashboard === "BOTH" ||
                  user.dashboard === "HERPROMISE" ||
                  user.isSuperAdmin) && (
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-pink-50 text-gray-700 hover:text-pink-600 transition-colors group"
                  >
                    <Heart className="w-4 h-4 group-hover:fill-pink-600" />
                    <span className="text-sm font-medium">
                      Her Promise Dashboard
                    </span>
                  </Link>
                )}

                {(user.dashboard === "BOTH" ||
                  user.dashboard === "PORTFOLIO" ||
                  user.isSuperAdmin) && (
                  <Link
                    href="/portfolio/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors group"
                  >
                    <Briefcase className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Portfolio Dashboard
                    </span>
                  </Link>
                )}

                {!user.isSuperAdmin &&
                  user.dashboard !== "BOTH" &&
                  user.dashboard !== "PORTFOLIO" &&
                  user.dashboard !== "HERPROMISE" && (
                    <Link
                      href={getDashboardLink()}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-colors group"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span className="text-sm font-medium">Dashboard</span>
                    </Link>
                  )}
              </div>

              {/* Account Links */}
              <div className="px-2 py-2 border-b border-gray-100">
                <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                  Account
                </p>
                <Link
                  href="/settings/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Profile Settings</span>
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-sm font-medium">Account Settings</span>
                </Link>
              </div>

              {/* Logout */}
              <div className="px-2 pt-2">
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoggingOut ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <LogOut className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {isLoggingOut ? "Logging out..." : "Sign Out"}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
