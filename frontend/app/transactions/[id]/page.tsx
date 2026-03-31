"use client";

/**
 * Transaction History Page
 *
 * หน้ารายการธุรกรรมของลูกค้า แสดงข้อมูลในรูปแบบ Data Table พร้อม Pagination
 */

import { use } from "react";
import { ArrowLeft, User, Building2, Receipt, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { columns, type Transaction } from "./columns";
import Link from "next/link";

// Mock customer data
const mockCustomerData: Record<
  string,
  {
    name: string;
    branch: string;
    phone: string;
  }
> = {
  "cust-001": {
    name: "นายอดุลวิทย์ ชินาภาษ",
    branch: "สำนักงานใหญ่",
    phone: "081-234-5678",
  },
  "cust-002": {
    name: "นางสมศรี มั่งมีศรีสุข",
    branch: "สาขาเชียงใหม่",
    phone: "089-876-5432",
  },
  "cust-003": {
    name: "นางสาวปราณี วิชัยดิษฐ",
    branch: "สาขาภูเก็ต",
    phone: "062-345-6789",
  },
};

// Mock transactions - ข้อมูลธุรกรรมสำหรับแสดงในตาราง
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "txn-001",
    date: "28 มี.ค. 2026",
    time: "14:32:00 น.",
    amount: 12500.0,
  },
  {
    id: "txn-002",
    date: "15 มี.ค. 2026",
    time: "09:15:00 น.",
    amount: 8750.5,
  },
  {
    id: "txn-003",
    date: "02 มี.ค. 2026",
    time: "16:48:00 น.",
    amount: 23100.0,
  },
  {
    id: "txn-004",
    date: "18 ก.พ. 2026",
    time: "11:20:00 น.",
    amount: 5430.75,
  },
  {
    id: "txn-005",
    date: "05 ก.พ. 2026",
    time: "13:45:00 น.",
    amount: 15000.0,
  },
  {
    id: "txn-006",
    date: "22 ม.ค. 2026",
    time: "10:30:00 น.",
    amount: 9200.25,
  },
  {
    id: "txn-007",
    date: "10 ม.ค. 2026",
    time: "15:20:00 น.",
    amount: 18000.0,
  },
  {
    id: "txn-008",
    date: "05 ม.ค. 2026",
    time: "11:00:00 น.",
    amount: 7500.5,
  },
];

/**
 * ฟังก์ชันแปลงตัวเลขเป็นรูปแบบสกุลเงินไทย
 */
function formatCurrency(amount: number) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * คำนวณยอดรวมทั้งหมดของรายการธุรกรรม
 */
function calculateTotal(transactions: Transaction[]) {
  return transactions.reduce((sum, txn) => sum + txn.amount, 0);
}

export default function TransactionHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  // ดึงข้อมูลลูกค้า ถ้าไม่พบให้ใช้ค่า default
  const customer = mockCustomerData[id] ?? {
    name: "นายอดุลวิทย์ ชินาภาษ",
    branch: "สำนักงานใหญ่",
    phone: "081-234-5678",
  };

  const totalAmount = calculateTotal(MOCK_TRANSACTIONS);

  return (
    <div className="relative min-h-screen bg-[#F8FAFC]">
      {/* Top Bar - แถบด้านบนพร้อมโลโก้ */}
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-5xl items-center px-4">
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
      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Back Navigation - ปุ่มกลับ */}
        <Link
          href="/search"
          id="back-to-search"
          className="group mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-[#007BFF]"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          กลับไปหน้าค้นหา
        </Link>

        {/* Customer Info Card - การ์ดข้อมูลลูกค้า */}
        <Card className="mb-8 border-0 shadow-md animate-[fadeIn_0.4s_ease-out]">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              {/* Avatar */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#007BFF]/15 to-[#800000]/10">
                <User className="h-8 w-8 text-[#007BFF]" />
              </div>

              {/* Customer Details */}
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold text-gray-900">
                  {customer.name}
                </h2>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5" />
                    {customer.branch}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    {customer.phone}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Section - ส่วนตารางรายการธุรกรรม */}
        <div className="space-y-6 animate-[fadeIn_0.4s_ease-out_0.15s_both]">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-gray-400" />
              <h3 className="text-lg font-bold text-gray-900">
                รายการชำระเงิน
              </h3>
              <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                {MOCK_TRANSACTIONS.length} รายการ
              </span>
            </div>
          </div>

          {/* Data Table with Pagination - ตารางข้อมูลพร้อมแบ่งหน้า */}
          <Card className="border-0 shadow-md overflow-hidden">
            <CardContent className="p-0 sm:p-6">
              <div className="overflow-x-auto">
                <DataTable
                  columns={columns}
                  data={MOCK_TRANSACTIONS}
                  enableRowSelection={false}
                />
              </div>
            </CardContent>
          </Card>

          {/* Summary Card - การ์ดยอดรวม */}
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
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-100 py-6 text-center text-sm text-gray-400">
        <p>© 2026 Engenius. All rights reserved.</p>
      </footer>
    </div>
  );
}
