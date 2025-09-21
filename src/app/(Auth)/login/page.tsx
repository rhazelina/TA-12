'use client'

import Image from "next/image"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { LoginForm } from "@/components/login-form"
import { useAuth } from "@/hooks/useAuth"

export default function LoginPage() {
  const { isLoggedIn, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Jika user sudah login, redirect ke admin dashboard
    if (!loading && isLoggedIn) {
      console.log('✅ User already logged in, redirecting to admin...')
      router.push('/admin')
    }
  }, [isLoggedIn, loading, router])

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // If user is already logged in, show redirecting message
  if (isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-primary">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Image src="/img/icon.png" className="rounded-full" alt="Logo" width={24} height={24} />
            </div>
            Management Sistem PKL
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm className="bg-white dark:bg-black"/>
          </div>
        </div>
      </div>
      <div className="relative hidden lg:block">
        <Image
          src="/img/icon.png"
          alt="Login Background"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  )
}