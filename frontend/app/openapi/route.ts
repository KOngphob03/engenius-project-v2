import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const apiUrl = process.env.INTERNAL_API_URL || "http://api:3000"
  const url = new URL(request.url)
  const targetUrl = new URL(url.pathname + url.search, apiUrl)

  const response = await fetch(targetUrl.toString(), {
    headers: {
      "host": new URL(apiUrl).host,
    },
  })

  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: {
      "content-type": response.headers.get("content-type") || "text/html",
    },
  })
}

export async function POST(request: NextRequest) {
  const apiUrl = process.env.INTERNAL_API_URL || "http://api:3000"
  const url = new URL(request.url)
  const targetUrl = new URL(url.pathname + url.search, apiUrl)

  const body = await request.text()

  const response = await fetch(targetUrl.toString(), {
    method: "POST",
    headers: {
      "host": new URL(apiUrl).host,
      "content-type": request.headers.get("content-type") || "application/json",
    },
    body,
  })

  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: {
      "content-type": response.headers.get("content-type") || "application/json",
    },
  })
}
