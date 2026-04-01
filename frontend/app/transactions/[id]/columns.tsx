/**
 * Transaction Table Columns
 *
 * กำหนดคอลัมน์สำหรับตารางรายการธุรกรรม
 * ประกอบด้วย: วันที่, เวลา, ราคา, และปุ่ม Action
 */

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
/**
 *ประเภทข้อมูล Transaction สำหรับใช้ในตาราง
 */
export type Transaction = {
  id: string
  userId?: string
  date: string
  time: string
  amount: number
  status?: string
}

/**
 * Action Cell Component - ปุ่ม "พิมพ์" สีฟ้า
 */
function ActionCell({ txId, userId }: { txId: string; userId?: string }) {
  // Use userId if available, otherwise use txId as fallback
  const invoicePath = userId ? `/invoice/${userId}/${txId}` : `/invoice/${txId}`

  return (
    <Button
      asChild
      variant="default"
      className="bg-blue-600 hover:bg-blue-700 text-white"
      size="sm"
    >
      <a href={invoicePath}>พิมพ์</a>
    </Button>
  )
}

/**
 * คำนิยามคอลัมน์สำหรับตาราง Transactions
 */
export const columns: ColumnDef<Transaction>[] = [
  // คอลัมน์วันที่
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent p-0 font-semibold whitespace-nowrap"
      >
        วันที่
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium whitespace-nowrap">{row.getValue("date")}</div>
    ),
  },
  // คอลัมน์เวลา
  {
    accessorKey: "time",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent p-0 font-semibold whitespace-nowrap"
      >
        เวลา
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="whitespace-nowrap">{row.getValue("time")}</div>,
  },
  // คอลัมน์ราคา
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent p-0 font-semibold whitespace-nowrap"
      >
        ราคา
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      // แสดงราคาในรูปแบบสกุลเงินไทย
      const formatted = new Intl.NumberFormat("th-TH", {
        style: "currency",
        currency: "THB",
      }).format(amount)

      return <div className="font-medium text-foreground whitespace-nowrap">{formatted}</div>
    },
  },
  // คอลัมน์ Action (ปุ่มพิมพ์)
  {
    id: "actions",
    header: () => <div className="font-semibold">Action</div>,
    cell: ({ row }) => {
      const txId = row.original.id
      const userId = row.original.userId

      return <ActionCell txId={txId} userId={userId} />
    },
  },
]
