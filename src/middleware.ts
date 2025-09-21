import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Fungsi untuk mengecek apakah token masih valid
function isTokenValid(token: string | undefined): boolean {
  if (!token) return false
  
  try {
    // Decode JWT token untuk mengecek expiry
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Math.floor(Date.now() / 1000)
    
    // Cek apakah token sudah expired
    return payload.exp > currentTime
  } catch (error) {
    // Jika error saat decode, berarti token tidak valid
    return false
  }
}

// Fungsi untuk decrypt token dari cookie/localStorage (simulasi)
function getTokenFromRequest(request: NextRequest): string | undefined {
  // Coba ambil dari cookie terlebih dahulu
  const tokenFromCookie = request.cookies.get('accessToken')?.value
  if (tokenFromCookie) {
    return tokenFromCookie
  }
  
  // Jika tidak ada di cookie, cek dari header Authorization
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  
  return undefined
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // TEMPORARY: Disable middleware untuk testing client-side auth
  // Middleware tidak bisa akses localStorage, jadi kita gunakan client-side protection
  console.log('🚀 Middleware bypassed for:', pathname)
  
  // Langsung lanjutkan request tanpa authentication check
  return NextResponse.next()
  
  /* DISABLED - Akan diaktifkan nanti setelah client-side auth bekerja
  // Daftar route yang memerlukan autentikasi
  const protectedRoutes = [
    '/admin',
    '/guru', 
    '/siswa',
    '/dashboard',
    '/profile'
  ]
  
  // Daftar route yang hanya bisa diakses jika belum login
  const authRoutes = [
    '/login',
    '/register'
  ]
  
  // Ambil token dari request
  const token = getTokenFromRequest(request)
  const isAuthenticated = isTokenValid(token)
  
  // Cek apakah user mencoba mengakses route yang dilindungi
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // Cek apakah user mencoba mengakses route auth
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // Jika user belum login dan mencoba akses protected route
  if (isProtectedRoute && !isAuthenticated) {
    // Redirect ke halaman login dengan return URL
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('returnUrl', pathname)
    
    return NextResponse.redirect(loginUrl)
  }
  
  // Jika user sudah login dan mencoba akses auth route (login/register)
  if (isAuthRoute && isAuthenticated) {
    // Redirect ke dashboard sesuai role
    // Untuk sekarang redirect ke admin, nanti bisa disesuaikan dengan role
    return NextResponse.redirect(new URL('/admin', request.url))
  }
  
  // Jika tidak ada kondisi khusus, lanjutkan request
  return NextResponse.next()
  */
}

// Konfigurasi matcher untuk menentukan route mana yang akan diproses middleware
export const config = {
  matcher: [
    /*
     * Match semua request paths kecuali:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (png, jpg, jpeg, gif, svg, ico)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$).*)',
  ],
}
