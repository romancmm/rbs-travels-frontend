import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  const cookieStore = await cookies()

  // Remove all admin-related cookies
  cookieStore.delete('adminToken')
  cookieStore.delete('permissions')
  cookieStore.delete('userRole')
  cookieStore.delete('user')

  return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } })
}
