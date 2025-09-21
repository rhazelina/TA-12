'use client'

import { useState, useEffect } from 'react'
import { isAuthenticated, getCurrentUser, logout as authLogout, type User } from '@/utils/auth'

// Map API roles to expected roles
const mapRole = (apiRole: string | undefined): 'admin' | 'guru' | 'siswa' | undefined => {
  switch (apiRole) {
    case 'adm': return 'admin'
    case 'gru': return 'guru' 
    case 'ssw': return 'siswa'
    default: return undefined
  }
}

// Custom hook untuk autentikasi
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Fungsi untuk mengecek status autentikasi
    const checkAuth = () => {
      try {
        const authenticated = isAuthenticated()
        setIsLoggedIn(authenticated)
        
        if (authenticated) {
          const currentUser = getCurrentUser()
          setUser(currentUser)
        } else {
          setUser(null)
        }
      } catch {
        setIsLoggedIn(false)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    // Cek autentikasi saat hook pertama kali digunakan
    checkAuth()

    // Listen untuk perubahan localStorage (ketika login/logout di tab lain)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessToken') {
        checkAuth()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // Cleanup listener saat component unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // Fungsi logout
  const logout = () => {
    authLogout()
    setUser(null)
    setIsLoggedIn(false)
  }

  // Fungsi untuk refresh user data
  const refreshUser = () => {
    if (isAuthenticated()) {
      const currentUser = getCurrentUser()
      setUser(currentUser)
      setIsLoggedIn(true)
    } else {
      setUser(null)
      setIsLoggedIn(false)
    }
  }

  return {
    user,
    loading,
    isLoggedIn,
    logout,
    refreshUser,
    role: user?.role || null
  }
}

// Hook untuk proteksi route berdasarkan autentikasi
export const useRequireAuth = () => {
  const { isLoggedIn, loading } = useAuth()

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      const currentPath = window.location.pathname
      window.location.href = `/login?returnUrl=${encodeURIComponent(currentPath)}`
    }
  }, [isLoggedIn, loading])

  return { isLoggedIn, loading }
}

// Hook untuk proteksi route berdasarkan role
export const useRequireRole = (requiredRole: 'admin' | 'guru' | 'siswa') => {
  const { user, loading, isLoggedIn } = useAuth()
  const mappedRole = mapRole(user?.role)

  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn) {
        const currentPath = window.location.pathname
        window.location.href = `/login?returnUrl=${encodeURIComponent(currentPath)}`
        return
      }

      if (mappedRole !== requiredRole) {
        // Redirect ke dashboard sesuai role user
        if (mappedRole) {
          window.location.href = `/${mappedRole}`
        } else {
          window.location.href = '/login'
        }
      }
    }
  }, [user, loading, isLoggedIn, requiredRole, mappedRole])

  return { 
    user, 
    loading, 
    isLoggedIn, 
    hasRequiredRole: mappedRole === requiredRole 
  }
}
