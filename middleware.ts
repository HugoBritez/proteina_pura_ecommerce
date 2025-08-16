import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const isApiAdmin = req.nextUrl.pathname.startsWith('/api/admin')
  if (!isApiAdmin) return NextResponse.next()

  const authHeader = req.headers.get('authorization')
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/api/admin/:path*']
}


