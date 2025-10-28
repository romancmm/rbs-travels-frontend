import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const raw = cookieStore.get('permissions')?.value

    let permissions: any = {}
    if (raw) {
      try {
        permissions = JSON.parse(raw)
      } catch {
        // If parsing fails, return empty; encryption not supported here by default
        permissions = {}
      }
    }

    return NextResponse.json(
      { permissions },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, max-age=0, must-revalidate'
        }
      }
    )
  } catch {
    return NextResponse.json(
      { permissions: {} },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, max-age=0, must-revalidate'
        }
      }
    )
  }
}
