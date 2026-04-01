"use client";

/**
 * Transaction History Page
 *
 * หน้ารายการธุรกรรมของลูกค้า ดึงข้อมูลจาก API
 */

import { useState, useEffect, use } from "react";
import { ArrowLeft, User, Building2, Receipt, Phone, LogOut, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { columns, type Transaction } from "./columns";
import Link from "next/link";

interface Payment {
  id: string;
  paymentId: string;
  date: string;
  time: string;
  amount: number;
  price: string;
  day: number;
  subjects: string[];
  sheets: string[];
  status: boolean;
  activate: boolean;
  activateCode: string;
  username: string;
  createdAt: string;
}

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  university: string;
  department: string;
  branch: string;
  role: string[];
  activated: boolean;
}

export default function TransactionHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
    fetchPayments();
  }, [id]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`/api/users/${id}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json();

      if (data.success && data.user) {
        setUserData(data.user);
      }
    } catch (error) {
      console.error("Fetch user error:", error);
    }
  };

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("access_token");
      const response = await fetch(`/api/users/${id}/payments`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json();

      if (data.success && data.payments) {
        setPayments(data.payments);
      } else {
        setToast(data.error || "ไม่สามารถดึงข้อมูลการชำระเงินได้");
      }
    } catch (error) {
      console.error("Fetch payments error:", error);
      setToast("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    document.cookie = "better-auth.session_token=; path=/; max-age=0";
    window.location.href = "/login";
  };

  // Convert payments to transactions format
  const transactions: Transaction[] = payments.map((p) => ({
    id: p.paymentId,
    userId: id, // Add userId for invoice navigation
    date: p.date,
    time: p.time,
    amount: p.amount,
  }));

  const totalAmount = transactions.reduce((sum, txn) => sum + txn.amount, 0);

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 2,
    }).format(amount);
  }

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#007BFF]" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#F8FAFC]">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-[toastIn_0.35s_ease-out]">
          <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-white px-5 py-3 shadow-lg">
            <span className="text-sm font-medium text-red-600">{toast}</span>
            <button
              onClick={() => setToast(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
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
      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Back Navigation */}
        <Link
          href="/search"
          id="back-to-search"
          className="group mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-[#007BFF]"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          กลับไปหน้าค้นหา
        </Link>

        {/* Customer Info Card */}
        <Card className="mb-8 border-0 shadow-md animate-[fadeIn_0.4s_ease-out]">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#007BFF]/15 to-[#800000]/10">
                <User className="h-8 w-8 text-[#007BFF]" />
              </div>

              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold text-gray-900">
                  {userData ? `${userData.firstName} ${userData.lastName}` : "ผู้ใช้"}
                </h2>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5" />
                    {userData?.university || userData?.branch || "-"}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    {userData?.phone || "-"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Section */}
        <div className="space-y-6 animate-[fadeIn_0.4s_ease-out_0.15s_both]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-gray-400" />
              <h3 className="text-lg font-bold text-gray-900">
                รายการชำระเงิน
              </h3>
              <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                {transactions.length} รายการ
              </span>
            </div>
          </div>

          <Card className="border-0 shadow-md overflow-hidden">
            <CardContent className="p-0 sm:p-6">
              {transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Receipt className="h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-sm font-medium text-gray-600">
                    ไม่พบรายการชำระเงิน
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <DataTable
                    columns={columns}
                    data={transactions}
                    enableRowSelection={false}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {transactions.length > 0 && (
            <Card className="border-0 bg-gradient-to-r from-gray-50 to-gray-100/50 shadow-sm mx-4 sm:mx-0">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 whitespace-nowrap">
                    ยอดรวมทั้งหมด
                  </span>
                  <span className="text-xl md:text-2xl font-bold text-gray-900 tabular-nums whitespace-nowrap">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-100 py-6 text-center text-sm text-gray-400">
        <p>© 2026 Engenius. All rights reserved.</p>
      </footer>
    </div>
  );
}
