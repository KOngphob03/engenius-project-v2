"use client";

import { Printer, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockData = {
  date: "28 มี.ค. 2026",
  bookNo: "1",
  invoiceNo: "INV-2026-001",
  seller: {
    name: "บริษัท เอ็นจิเนียส จำกัด",
    address: "123/45 ถนนสุขุมวิท แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ 10110",
    taxId: "0105551234567",
    phone: "02-123-4567",
  },
  buyer: {
    name: "นายอดุลวิทย์ ชินาภาษ",
    address: "456/78 ถนนพหลโยธิน แขวงสามเสนใน เขตพญาไท กรุงเทพฯ 10400",
    taxId: "1103700123456",
    phone: "081-234-5678",
  },
  items: [
    {
      no: "1",
      description: "ค่าบริการด้านเทคนิคและการพัฒนาซอฟต์แวร์",
      quantity: "1",
      unitPrice: "100,000.00",
      amount: "100,000.00",
    },
    {
      no: "2",
      description: "ค่าธรรมเนียมการดูแลรักษาระบบประจำเดือน",
      quantity: "1",
      unitPrice: "15,000.00",
      amount: "15,000.00",
    },
    {
      no: "3",
      description: "ค่าใช้จ่ายในการติดตั้งและทดสอบระบบ",
      quantity: "1",
      unitPrice: "10,000.00",
      amount: "10,000.00",
    },
  ],
  subtotal: "125,000.00",
  vat: "8,750.00",
  total: "133,750.00",
};

export default function InvoicePage() {
  const handlePrint = () => {
    window.print();
  };

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

        {/* Invoice Preview - Responsive scaling */}
        <div className="flex justify-center p-4 sm:p-8">
          <div className="invoice-page relative w-full max-w-[210mm] bg-white shadow-xl">
            {/* Invoice Content - A4 proportion */}
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
                    {mockData.date}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="font-medium whitespace-nowrap">เล่มที่</span>
                    <span className="border-b border-dotted border-gray-400 px-2 py-0.5 min-w-[50px] text-center">
                      {mockData.bookNo}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium whitespace-nowrap">เลขที่</span>
                    <span className="border-b border-dotted border-gray-400 px-2 py-0.5 min-w-[80px] text-center">
                      {mockData.invoiceNo}
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
                      {mockData.seller.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium whitespace-nowrap min-w-[100px] sm:min-w-[120px]">ที่อยู่</span>
                    <span className="flex-1 border-b border-dotted border-gray-400 px-2 py-0.5 break-words">
                      {mockData.seller.address}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-medium whitespace-nowrap">เลขประจำตัวผู้เสียภาษี</span>
                    <span className="border-b border-dotted border-gray-400 px-2 py-0.5 break-all sm:flex-1">
                      {mockData.seller.taxId}
                    </span>
                    <span className="font-medium whitespace-nowrap">โทรศัพท์</span>
                    <span className="border-b border-dotted border-gray-400 px-2 py-0.5">
                      {mockData.seller.phone}
                    </span>
                  </div>
                </div>

                {/* Buyer */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-medium whitespace-nowrap min-w-[100px] sm:min-w-[120px]">ชื่อผู้ซื้อ</span>
                    <span className="flex-1 border-b border-dotted border-gray-400 px-2 py-0.5 break-words">
                      {mockData.buyer.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium whitespace-nowrap min-w-[100px] sm:min-w-[120px]">ที่อยู่</span>
                    <span className="flex-1 border-b border-dotted border-gray-400 px-2 py-0.5 break-words">
                      {mockData.buyer.address}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-medium whitespace-nowrap">เลขประจำตัวผู้เสียภาษี</span>
                    <span className="border-b border-dotted border-gray-400 px-2 py-0.5 break-all sm:flex-1">
                      {mockData.buyer.taxId}
                    </span>
                    <span className="font-medium whitespace-nowrap">โทรศัพท์</span>
                    <span className="border-b border-dotted border-gray-400 px-2 py-0.5">
                      {mockData.buyer.phone}
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
                  {mockData.items.map((item, idx) => (
                    <div key={idx} className="flex border-b border-gray-200 text-xs sm:text-sm">
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
                      {mockData.subtotal}
                    </div>
                  </div>
                  <div className="flex py-1.5">
                    <div className="w-[60%] sm:w-[70%] pr-2 text-right font-medium text-gray-700">
                      ภาษีมูลค่าเพิ่ม (VAT 7%)
                    </div>
                    <div className="w-[40%] sm:w-[30%] text-center font-medium text-gray-800 border-l border-gray-300">
                      {mockData.vat}
                    </div>
                  </div>
                  <div className="flex py-2 border-t border-gray-300">
                    <div className="w-[60%] sm:w-[70%] pr-2 text-right font-bold text-gray-900">
                      ยอดรวมสุทธิ
                    </div>
                    <div className="w-[40%] sm:w-[30%] text-center font-bold text-gray-900 border-l border-gray-300">
                      {mockData.total}
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
