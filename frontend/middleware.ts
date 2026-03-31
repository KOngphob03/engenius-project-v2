/**
 * Middleware - ยามเฝ้าประตู (Gatekeeper)
 *
 * ป้องกันการเข้าถึงหน้าที่ต้องการ Authentication โดยไม่ได้เข้าสู่ระบบ
 * หากผู้ใช้พยายามเข้าถึงหน้าที่มีการป้องกันโดยไม่มี Session ที่ถูกต้อง
 * จะถูก Redirect กลับไปที่หน้า Login ทันที
 *
 * Routes ที่มีการป้องกัน:
 * - /search (หน้าค้นหา)
 * - /transactions/* (หน้ารายการธุรกรรมทั้งหมด)
 * - /invoice/* (หน้าใบแจ้งหนี้ทั้งหมด)
 *
 * Public Routes (ไม่ต้อง Authentication):
 * - / (หน้าแรก)
 * - /login (หน้าเข้าสู่ระบบ)
 * - /api/* (API Routes)
 */

import { NextResponse, type NextRequest } from "next/server"
import { cookies } from "next/headers"

/**
 * กำหนด Routes ที่ต้องการป้องกัน (Protected Routes)
 * ผู้ใช้ต้องเข้าสู่ระบบก่อนจึงจะเข้าถึงได้
 */
const PROTECTED_ROUTES = [
  "/search",
  "/transactions",
  "/invoice",
]

/**
 * กำหนด Routes สาธารณะที่ไม่ต้อง Authentication
 */
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/api",
]

/**
 * ชื่อ Cookie ที่ใช้เก็บ Session Token
 * ค่านี้ควรตรงกับที่ตั้งใน Better Auth config
 */
const SESSION_COOKIE_NAME = "better-auth.session_token"

/**
 * Middleware Function
 *
 * @param request - NextRequest object
 * @returns NextResponse พร้อม Redirect หรือ Pass ไปยัง Route ถัดไป
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ตรวจสอบว่าเป็น Public Route หรือไม่
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname === route || pathname.startsWith(route)
  )

  // ถ้าเป็น Public Route ให้ผ่านไปได้เลย
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // ตรวจสอบว่าเป็น Protected Route หรือไม่
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname === route || pathname.startsWith(route)
  )

  // ถ้าไม่ใช่ Protected Route ให้ผ่านไปได้เลย
  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  try {
    // ตรวจสอบ Session จาก Cookie
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)

    // ถ้าไม่มี Session Token ให้ Redirect ไปหน้า Login
    if (!sessionToken) {
      const loginUrl = new URL("/login", request.url)
      // เพิ่ม callback URL เพื่อ Redirect กลับมาหลังจากเข้าสู่ระบบ
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }

    // มี Session Token ถูกต้อง ให้ผ่านไปได้
    // หมายเหตุ: ในการใช้งานจริง ควรตรวจสอบความถูกต้องของ Token กับ Backend
    return NextResponse.next()
  } catch (error) {
    // กรณีเกิด Error ให้ Redirect ไปหน้า Login เพื่อความปลอดภัย
    console.error("Middleware error:", error)
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }
}

/**
 * กำหนด Routes ที่ Middleware จะทำงาน
 * Matcher นี้จะบอกให้ Middleware ทำงานเฉพาะ Routes ที่ระบุ
 */
export const config = {
  matcher: [
    /*
     * จับคู่ทุก Request ยกเว้น:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
