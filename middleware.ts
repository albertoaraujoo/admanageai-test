import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/login']
const API_PREFIX = '/api'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p))
  const isApi = pathname.startsWith(API_PREFIX)

  if (isPublic || isApi) return NextResponse.next()

  const authCookie = request.cookies.get('admanage-auth')
  if (!authCookie?.value) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
