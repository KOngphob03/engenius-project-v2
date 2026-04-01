"use client";

import { useState, useEffect, use } from "react";
import { Printer, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InvoiceData {
  date: string;
  invoiceNo: string;
  bookNo: string;
  amount: number;
  price: string;
  day: number;
  subjects: string[];
  sheets: string[];
  user: {
    name: string;
    email: string;
    phone: string;
    university: string;
    department: string;
  } | null;
}

const SELLER_INFO = {
  name: "บริษัท เนเบอร์ซอฟต์ จำกัด",
  address: "123/45 ถนนสุขุมวิท แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ 10110",
  taxId: "0105551234567",
  phone: "02-123-4567",
};

export default function InvoicePage({
  params,
}: {
  params: Promise<{ userId: string; paymentId: string }>;
}) {
  const { userId, paymentId } = use(params);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInvoiceData();
  }, [userId, paymentId]);

  const fetchInvoiceData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("access_token");
      const response = await fetch(`/api/users/${userId}/payments/${paymentId}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json();

      if (data.success && data.payment) {
        setInvoiceData(data.payment);
      } else {
        setError(data.error || "ไม่พบข้อมูลใบกำกับภาษี");
      }
    } catch (err) {
      console.error("Fetch invoice error:", err);
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Format currency
  const formatCurrency = (amount: number | string): string => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  // Calculate VAT and totals
  const subtotal = invoiceData ? parseFloat(invoiceData.price) : 0;
  const vat = subtotal * 0.07;
  const total = subtotal + vat;

  // Generate invoice items based on subjects/sheets
  const generateItems = () => {
    if (!invoiceData) return [];

    const items = [];

    // Add subjects as items
    if (invoiceData.subjects && invoiceData.subjects.length > 0) {
      invoiceData.subjects.forEach((subject, idx) => {
        items.push({
          no: (idx + 1).toString(),
          description: `ค่าเรียนวิชา: ${subject}`,
          quantity: "1",
          unitPrice: formatCurrency(subtotal / (invoiceData.subjects.length + (invoiceData.sheets?.length || 0))),
          amount: formatCurrency(subtotal / (invoiceData.subjects.length + (invoiceData.sheets?.length || 0))),
        });
      });
    }

    // Add sheets as items
    if (invoiceData.sheets && invoiceData.sheets.length > 0) {
      invoiceData.sheets.forEach((sheet, idx) => {
        items.push({
          no: ((invoiceData.subjects?.length || 0) + idx + 1).toString(),
          description: `ค่าใบงาน: ${sheet}`,
          quantity: "1",
          unitPrice: formatCurrency(subtotal / (invoiceData.sheets.length + (invoiceData.subjects?.length || 0))),
          amount: formatCurrency(subtotal / (invoiceData.sheets.length + (invoiceData.subjects?.length || 0))),
        });
      });
    }

    // If no subjects or sheets, add a generic item
    if (items.length === 0) {
      items.push({
        no: "1",
        description: `ค่าบริการการศึกษา (${invoiceData.day} วัน)`,
        quantity: "1",
        unitPrice: formatCurrency(subtotal),
        amount: formatCurrency(subtotal),
      });
    }

    return items;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  if (error || !invoiceData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "ไม่พบข้อมูล"}</p>
          <Button onClick={() => window.history.back()}>ย้อนกลับ</Button>
        </div>
      </div>
    );
  }

  const items = generateItems();

  return (
    <>
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          .invoice-page {
            box-shadow: none !important;
            margin: 0 !important;
            max-width: none !important;
            border: none !important;
          }
          @page {
            size: A4;
            margin: 15mm;
          }
        }
      `}</style>

      {/* Main Container */}
      <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
        {/* Sticky Action Bar */}
        <div className="no-print sticky top-0 z-50 border-b border-gray-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-sm">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.history.back()}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              ย้อนกลับ
            </Button>
            <Button
              onClick={handlePrint}
              size="sm"
              className="gap-2 bg-blue-600 text-white hover:bg-blue-700"
            >
              <Printer className="h-4 w-4" />
              พิมพ์ใบกำกับภาษี
            </Button>
          </div>
        </div>

        {/* Invoice Preview */}
        <div className="flex justify-center p-4 sm:p-8">
          <div className="invoice-page relative w-full max-w-[210mm] bg-white shadow-xl">
            <div className="aspect-[210/297] w-full p-6 sm:p-8 md:p-10 lg:p-12">
              {/* Header */}
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#800000]">
                    <span className="text-[#800000]">EN</span>
                    <span className="text-black">Genius</span>
                  </h1>
                </div>
                <div className="text-center">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                    ใบเสร็จรับเงิน / ใบกำกับภาษี
                  </h2>
                </div>
              </div>

              {/* Date and Document Info */}
              <div className="mb-6 mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium whitespace-nowrap">วันที่</span>
                  <span className="border-b border-dotted border-gray-400 px-2 py-0.5 min-w-[100px] text-center">
                    {invoiceData.date}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="font-medium whitespace-nowrap">เล่มที่</span>
                    <span className="border-b border-dotted border-gray-400 px-2 py-0.5 min-w-[50px] text-center">
                      {invoiceData.bookNo}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium whitespace-nowrap">เลขที่</span>
                    <span className="border-b border-dotted border-gray-400 px-2 py-0.5 min-w-[80px] text-center">
                      {invoiceData.invoiceNo}
                    </span>
                  </div>
                </div>
              </div>

              {/* Seller / Buyer Details */}
              <div className="mb-6 space-y-4 text-xs sm:text-sm">
                {/* Seller */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-medium whitespace-nowrap min-w-[100px] sm:min-w-[120px]">ชื่อผู้ขาย</span>
                    <span className="flex-1 border-b border-dotted border-gray-400 px-2 py-0.5 break-words">
                      {SELLER_INFO.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium whitespace-nowrap min-w-[100px] sm:min-w-[120px]">ที่อยู่</span>
                    <span className="flex-1 border-b border-dotted border-gray-400 px-2 py-0.5 break-words">
                      {SELLER_INFO.address}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-medium whitespace-nowrap">เลขประจำตัวผู้เสียภาษี</span>
                    <span className="border-b border-dotted border-gray-400 px-2 py-0.5 break-all sm:flex-1">
                      {SELLER_INFO.taxId}
                    </span>
                    <span className="font-medium whitespace-nowrap">โทรศัพท์</span>
                    <span className="border-b border-dotted border-gray-400 px-2 py-0.5">
                      {SELLER_INFO.phone}
                    </span>
                  </div>
                </div>

                {/* Buyer */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-medium whitespace-nowrap min-w-[100px] sm:min-w-[120px]">ชื่อผู้ซื้อ</span>
                    <span className="flex-1 border-b border-dotted border-gray-400 px-2 py-0.5 break-words">
                      {invoiceData.user?.name || "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium whitespace-nowrap min-w-[100px] sm:min-w-[120px]">ที่อยู่</span>
                    <span className="flex-1 border-b border-dotted border-gray-400 px-2 py-0.5 break-words">
                      {invoiceData.user?.university || invoiceData.user?.department || "-"}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-medium whitespace-nowrap">เลขประจำตัวผู้เสียภาษี</span>
                    <span className="border-b border-dotted border-gray-400 px-2 py-0.5 break-all sm:flex-1">
                      -
                    </span>
                    <span className="font-medium whitespace-nowrap">โทรศัพท์</span>
                    <span className="border-b border-dotted border-gray-400 px-2 py-0.5">
                      {invoiceData.user?.phone || "-"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="border border-gray-300">
                {/* Table Header */}
                <div className="flex border-b border-gray-300 bg-gray-50 py-2 text-xs sm:text-sm font-semibold text-gray-800">
                  <div className="w-[10%] text-center border-r border-gray-300">ลำดับ</div>
                  <div className="w-[40%] sm:w-[45%] text-center border-r border-gray-300">รายการ</div>
                  <div className="w-[15%] text-center border-r border-gray-300 hidden sm:block">จำนวน</div>
                  <div className="w-[15%] sm:w-[15%] text-center border-r border-gray-300">หน่วยละ</div>
                  <div className="w-[35%] sm:w-[15%] text-center">จำนวนเงิน</div>
                </div>

                {/* Table Body */}
                <div className="min-h-[180px]">
                  {items.map((item) => (
                    <div key={item.no} className="flex border-b border-gray-200 text-xs sm:text-sm">
                      <div className="w-[10%] text-center border-r border-gray-200 py-2">{item.no}</div>
                      <div className="w-[40%] sm:w-[45%] px-2 py-2 break-words border-r border-gray-200">{item.description}</div>
                      <div className="w-[15%] text-center border-r border-gray-200 py-2 hidden sm:block">{item.quantity}</div>
                      <div className="w-[15%] sm:w-[15%] text-center border-r border-gray-200 py-2">{item.unitPrice}</div>
                      <div className="w-[35%] sm:w-[15%] text-center py-2">{item.amount}</div>
                    </div>
                  ))}
                </div>

                {/* Table Footer */}
                <div className="border-t border-gray-300 bg-gray-50 text-xs sm:text-sm">
                  <div className="flex py-1.5">
                    <div className="w-[60%] sm:w-[70%] pr-2 text-right font-medium text-gray-700">
                      มูลค่ารวมก่อนเสียภาษี
                    </div>
                    <div className="w-[40%] sm:w-[30%] text-center font-medium text-gray-800 border-l border-gray-300">
                      {formatCurrency(subtotal)}
                    </div>
                  </div>
                  <div className="flex py-1.5">
                    <div className="w-[60%] sm:w-[70%] pr-2 text-right font-medium text-gray-700">
                      ภาษีมูลค่าเพิ่ม (VAT 7%)
                    </div>
                    <div className="w-[40%] sm:w-[30%] text-center font-medium text-gray-800 border-l border-gray-300">
                      {formatCurrency(vat)}
                    </div>
                  </div>
                  <div className="flex py-2 border-t border-gray-300">
                    <div className="w-[60%] sm:w-[70%] pr-2 text-right font-bold text-gray-900">
                      ยอดรวมสุทธิ
                    </div>
                    <div className="w-[40%] sm:w-[30%] text-center font-bold text-gray-900 border-l border-gray-300">
                      {formatCurrency(total)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Signature Section */}
              <div className="mt-4 flex justify-between text-xs sm:text-sm">
                <div className="text-center">
                  <p className="mb-8">ผู้รับเงิน</p>
                  <p className="font-medium">................................................</p>
                  <p className="text-gray-600 mt-1">( ผู้มีอำนาจลงนาม )</p>
                </div>
                <div className="text-center">
                  <p className="mb-8">ผู้รับสินค้า / บริการ</p>
                  <p className="font-medium">................................................</p>
                  <p className="text-gray-600 mt-1">( ลายมือชื่อ )</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
