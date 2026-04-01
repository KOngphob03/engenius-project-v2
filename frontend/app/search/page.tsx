"use client";

import { useState, useCallback, useEffect } from "react";
import { Search, User, ChevronRight, AlertCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Toast } from "@/components/ui/toast";
import Link from "next/link";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  branch: string;
  email: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Customer[]>([]);
  const [allUsers, setAllUsers] = useState<Customer[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | undefined>(undefined);

  const clearToast = useCallback(() => setToast(null), []);

  // Fetch all users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("/api/users", {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json();

      if (data.success && data.users) {
        const formattedUsers = data.users.map((u: any) => ({
          id: u.id,
          firstName: u.firstName,
          lastName: u.lastName,
          branch: u.branch || u.university || "-",
          email: u.email,
        }));
        setAllUsers(formattedUsers);
        setResults(formattedUsers); // Show all users by default
      } else {
        setToast(data.error || "ไม่สามารถดึงข้อมูลผู้ใช้ได้");
      }
    } catch (error) {
      console.error("Fetch users error:", error);
      setToast("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedQuery = query.trim();

    // If empty, show all users
    if (!trimmedQuery) {
      setResults(allUsers);
      setHasSearched(true);
      setSearchError(undefined);
      return;
    }

    // Filter locally from loaded users
    const filtered = allUsers.filter(
      (c) =>
        c.email.toLowerCase().includes(trimmedQuery.toLowerCase()) ||
        c.firstName.toLowerCase().includes(trimmedQuery.toLowerCase()) ||
        c.lastName.toLowerCase().includes(trimmedQuery.toLowerCase())
    );

    setResults(filtered);
    setHasSearched(true);
    setSearchError(undefined);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    document.cookie = "better-auth.session_token=; path=/; max-age=0";
    window.location.href = "/login";
  };

  return (
    <div className="relative min-h-screen bg-[#F8FAFC]">
      {/* Toast */}
      {toast && <Toast message={toast} onClose={clearToast} />}

      {/* Top Bar */}
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Link href="/search" className="group flex items-center gap-2">
            <h1 className="text-xl font-extrabold tracking-tight text-[#800000] transition-opacity group-hover:opacity-80">
              Engenius
            </h1>
          </Link>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[#007BFF]/10 px-2.5 py-0.5 text-xs font-semibold text-[#007BFF]">
              Admin
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-4 py-10">
        {/* Heading Section */}
        <div className="mb-8 animate-[fadeIn_0.5s_ease-out]">
          <h2 className="text-2xl font-bold text-gray-900">
            รายชื่อผู้ใช้ทั้งหมด
          </h2>
          <p className="mt-1.5 text-sm text-gray-500">
            ค้นหาด้วย Email หรือชื่อ เพื่อดูประวัติการชำระเงินและออกใบกำกับภาษี
          </p>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          noValidate
          className="mb-8 animate-[fadeIn_0.5s_ease-out_0.1s_both]"
        >
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search
                className={`pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 transition-colors ${
                  searchError ? "text-red-400" : "text-gray-400"
                }`}
              />
              <Input
                id="search-email"
                type="text"
                placeholder="ค้นหาด้วย Email หรือชื่อผู้ใช้..."
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setQuery(e.target.value);
                  if (searchError) setSearchError(undefined);
                }}
                className={`h-12 rounded-xl pl-11 text-base shadow-sm transition-all duration-200 ${
                  searchError
                    ? "border-red-300 focus-visible:ring-red-200 focus-visible:border-red-400"
                    : "focus-visible:ring-[#007BFF]/30 focus-visible:border-[#007BFF] focus-visible:shadow-md"
                }`}
              />
            </div>
            <Button
              id="search-submit"
              type="submit"
              disabled={isSearching}
              className="h-12 min-w-[100px] rounded-xl bg-[#007BFF] px-6 text-sm font-semibold text-white shadow-lg shadow-[#007BFF]/25 transition-all duration-200 hover:bg-blue-700 hover:shadow-xl hover:shadow-[#007BFF]/30 active:scale-[0.98]"
            >
              {isSearching ? "ค้นหา..." : "ค้นหา"}
            </Button>
          </div>
        </form>

        {/* Results Section */}
        <div className="space-y-3">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#007BFF]" />
              <p className="mt-3 text-sm text-gray-400">กำลังโหลดข้อมูล...</p>
            </div>
          )}

          {!isLoading && hasSearched && results.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-16 text-center animate-[fadeIn_0.3s_ease-out]">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <p className="mt-4 text-sm font-medium text-gray-600">
                ไม่พบผู้ใช้
              </p>
              <p className="mt-1 text-xs text-gray-400">
                ลองค้นหาด้วยคำสำคัญอื่น
              </p>
            </div>
          )}

          {!isLoading &&
            results.map((customer, index) => (
              <Link
                key={customer.id}
                href={`/transactions/${customer.id}`}
                className="block"
              >
                <Card
                  id={`customer-card-${customer.id}`}
                  className="group cursor-pointer border-0 p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-[#007BFF]/20 active:scale-[0.995]"
                  style={{
                    animationDelay: `${index * 0.05}s`,
                    animation: "fadeIn 0.4s ease-out both",
                  }}
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#007BFF]/15 to-[#800000]/10 transition-all duration-200 group-hover:from-[#007BFF]/25 group-hover:to-[#800000]/15">
                      <User className="h-5 w-5 text-[#007BFF]" />
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {customer.firstName} {customer.lastName}{" "}
                        <span className="font-normal text-gray-500">
                          ({customer.branch})
                        </span>
                      </p>
                      <p className="mt-0.5 truncate text-xs text-gray-400">
                        {customer.email}
                      </p>
                    </div>

                    {/* Arrow */}
                    <ChevronRight className="h-4 w-4 shrink-0 text-gray-300 transition-all duration-200 group-hover:text-[#007BFF] group-hover:translate-x-0.5" />
                  </div>
                </Card>
              </Link>
            ))}
        </div>
      </main>
    </div>
  );
}
