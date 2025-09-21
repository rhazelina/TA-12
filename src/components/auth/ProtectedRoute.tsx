'use client'

import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Loader2 } from 'lucide-react'

// Map API roles to expected roles
const mapRole = (apiRole: string | undefined): 'admin' | 'guru' | 'siswa' | undefined => {
  switch (apiRole) {
    case 'adm': return 'admin'
    case 'gru': return 'guru' 
    case 'ssw': return 'siswa'
    default: return undefined
  }
}

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'guru' | 'siswa'
  fallback?: React.ReactNode
}

// Komponen loading default
const DefaultLoadingComponent = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
      <p className="text-muted-foreground">Memuat...</p>
    </div>
  </div>
)

// Komponen untuk proteksi route
export const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  fallback = <DefaultLoadingComponent /> 
}: ProtectedRouteProps) => {
  const { user, loading, isLoggedIn } = useAuth()
  const mappedRole = mapRole(user?.role)

  useEffect(() => {
    // Jika loading selesai dan user belum login
    if (!loading && !isLoggedIn) {
      const currentPath = window.location.pathname
      window.location.href = `/login?returnUrl=${encodeURIComponent(currentPath)}`
      return
    }

    // Jika loading selesai, user sudah login, tapi tidak memiliki role yang diperlukan
    if (!loading && isLoggedIn && requiredRole && mappedRole !== requiredRole) {
      // Redirect ke dashboard sesuai role user
      if (mappedRole) {
        window.location.href = `/${mappedRole}`
      } else {
        window.location.href = '/login'
      }
      return
    }
  }, [loading, isLoggedIn, mappedRole, requiredRole])

  // Tampilkan loading jika masih mengecek autentikasi
  if (loading) {
    return fallback
  }

  // Jika belum login, tampilkan loading (akan redirect)
  if (!isLoggedIn) {
    return fallback
  }

  // Jika ada required role tapi user tidak memiliki role tersebut
  if (requiredRole && mappedRole !== requiredRole) {
    return fallback
  }

  // Jika semua pengecekan passed, render children
  return <>{children}</>
}

// HOC untuk wrap komponen dengan proteksi
export const withAuth = <T extends object>(
  WrappedComponent: React.ComponentType<T>,
  requiredRole?: 'admin' | 'guru' | 'siswa'
) => {
  return function AuthenticatedComponent(props: T) {
    return (
      <ProtectedRoute requiredRole={requiredRole}>
        <WrappedComponent {...props} />
      </ProtectedRoute>
    )
  }
}

// Komponen khusus untuk halaman admin
export const AdminRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute requiredRole="admin">
    {children}
  </ProtectedRoute>
)

// Komponen khusus untuk halaman guru
export const GuruRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute requiredRole="guru">
    {children}
  </ProtectedRoute>
)

// Komponen khusus untuk halaman siswa
export const SiswaRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute requiredRole="siswa">
    {children}
  </ProtectedRoute>
)
