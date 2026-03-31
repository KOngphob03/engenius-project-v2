"use client";

import { useState, useCallback } from "react";
import { Search, User, ChevronRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Toast } from "@/components/ui/toast";
import Link from "next/link";

// Mock data — 3 customers
const mockCustomers = [
  {
    id: "cust-001",
    firstName: "อดุลวิทย์",
    lastName: "ชินาภาษ",
    branch: "สำนักงานใหญ่",
    email: "adulvit.c@engenius.co.th",
  },
  {
    id: "cust-002",
    firstName: "สมศรี",
    lastName: "มั่งมีศรีสุข",
    branch: "สาขาเชียงใหม่",
    email: "somsri.m@engenius.co.th",
  },
  {
    id: "cust-003",
    firstName: "ปราณี",
    lastName: "วิชัยดิษฐ",
    branch: "สาขาภูเก็ต",
    email: "pranee.v@engenius.co.th",
  },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof mockCustomers>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | undefined>(undefined);

  const clearToast = useCallback(() => setToast(null), []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email input
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setSearchError("กรุณากรอก Email ที่ต้องการค้นหา");
      setToast("กรุณากรอก Email ที่ต้องการค้นหา");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedQuery)) {
      setSearchError("รูปแบบ Email ไม่ถูกต้อง");
      setToast("รูปแบบ Email ไม่ถูกต้อง");
      return;
    }

    setSearchError(undefined);

    setIsSearching(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const filtered = mockCustomers.filter((c) =>
      c.email.toLowerCase().includes(trimmedQuery.toLowerCase())
    );
    setResults(filtered);
    setHasSearched(true);
    setIsSearching(false);
  };

  return (
    <div className="relative min-h-screen bg-[#F8FAFC]">
      {/* Toast */}
      {toast && <Toast message={toast} onClose={clearToast} />}

      {/* Top Bar */}
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-3xl items-center px-4">
          <Link href="/login" className="group flex items-center gap-2">
            <h1 className="text-xl font-extrabold tracking-tight text-[#800000] transition-opacity group-hover:opacity-80">
              Engenius
            </h1>
          </Link>
          <span className="ml-3 rounded-full bg-[#007BFF]/10 px-2.5 py-0.5 text-xs font-semibold text-[#007BFF]">
            Admin
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-4 py-10">
        {/* Heading Section */}
        <div className="mb-8 animate-[fadeIn_0.5s_ease-out]">
          <h2 className="text-2xl font-bold text-gray-900">ค้นหาลูกค้า</h2>
          <p className="mt-1.5 text-sm text-gray-500">
            ค้นหาด้วย Email เพื่อดูประวัติการชำระเงินและออกใบกำกับภาษี
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
                placeholder="ค้นหาด้วย Email ลูกค้า..."
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
              {isSearching ? (
                <svg
                  className="h-5 w-5 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              ) : (
                "ค้นหา"
              )}
            </Button>
          </div>
          {/* Inline error — same style as login page */}
          {searchError && (
            <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-500 animate-[fieldErrorIn_0.25s_ease-out]">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {searchError}
            </p>
          )}
        </form>

        {/* Results Section */}
        <div className="space-y-3">
          {isSearching && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#007BFF]" />
              <p className="mt-3 text-sm text-gray-400">กำลังค้นหา...</p>
            </div>
          )}

          {!isSearching && hasSearched && results.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-16 text-center animate-[fadeIn_0.3s_ease-out]">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <p className="mt-4 text-sm font-medium text-gray-600">
                ไม่พบลูกค้า
              </p>
              <p className="mt-1 text-xs text-gray-400">
                ลองค้นหาด้วย Email อื่น
              </p>
            </div>
          )}

          {!isSearching &&
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
                    animationDelay: `${index * 0.1}s`,
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
