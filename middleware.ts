import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// All admin auth is now handled client-side via Kioskit JWT stored in sessionStorage.
// No server-side middleware needed for API routes since we deleted the /api/admin/* routes.
export function middleware(_req: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: []
}
