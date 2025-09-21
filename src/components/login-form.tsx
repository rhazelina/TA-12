'use client'

import { useState } from 'react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { GuruLoginRequest, SiswaLoginRequest } from "@/types/api"
import { useRouter } from 'next/navigation'
import axiosInstance, { setTokens } from '@/utils/axios'
import { toast } from "sonner"

// Type untuk error handling
interface ApiError {
  response?: {
    data?: {
      message?: string
      error?: string
    }
  }
  request?: unknown
  message?: string
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [adminData, setAdminData] = useState({ username: '', password: '' })
  const [guruData, setGuruData] = useState({ kode_guru: '', password: '' })
  const [siswaData, setSiswaData] = useState({ nama_lengkap: '', nisn: '' })
  const [loading, setLoading] = useState(false)

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await axiosInstance.post('/auth/login', {
        username: adminData.username,
        password: adminData.password
      })
      
      // Pastikan response memiliki struktur data yang benar
      if (response.data && response.data.access_token && response.data.refresh_token) {
        // Coba simpan token dengan error handling
        try {
          setTokens(response.data.access_token, response.data.refresh_token)
          
          // Show success toast
          toast.success("Login berhasil!", {
            description: "Selamat datang di dashboard admin"
          })
          
          // Redirect to admin dashboard
          router.push('/admin')
        } catch (tokenError) {
          console.error('Error saat menyimpan token:', tokenError)
          throw new Error('Gagal menyimpan token login')
        }
      } else {
        throw new Error('Response tidak memiliki format yang benar')
      }
    } catch (err: unknown) {
      console.error('Login error:', err)
      
      let errorMessage = 'Username atau password salah'
      
      // Handle different types of errors
      const apiError = err as ApiError
      if (apiError.response) {
        // Server responded with error status
        errorMessage = apiError.response.data?.message || apiError.response.data?.error || errorMessage
      } else if (apiError.request) {
        // Request was made but no response received
        errorMessage = 'Tidak dapat terhubung ke server'
      } else if (apiError.message) {
        // Something else happened
        errorMessage = apiError.message
      }
      
      toast.error("Login gagal")
    } finally {
      setLoading(false)
    }
  }

  const handleGuruSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await axiosInstance.post('/auth/guru/login', {
        kode_guru: guruData.kode_guru,
        password: guruData.password
      } as GuruLoginRequest)

      // Pastikan response memiliki struktur data yang benar
      if (response.data && response.data.access_token && response.data.refresh_token) {
        setTokens(response.data.access_token, response.data.refresh_token)
        
        // Show success toast
        toast.success("Login berhasil!", {
          description: "Selamat datang di dashboard guru"
        })
        
        // Redirect to appropriate dashboard based on role
        router.push('/admin') // For now, redirect to admin
      } else {
        throw new Error('Response tidak memiliki format yang benar')
      }
    } catch (err: unknown) {
      console.error('Guru login error:', err)
      
      let errorMessage = 'Kode guru atau password salah'
      
      // Handle different types of errors
      const apiError = err as ApiError
      if (apiError.response) {
        errorMessage = apiError.response.data?.message || apiError.response.data?.error || errorMessage
      } else if (apiError.request) {
        errorMessage = 'Tidak dapat terhubung ke server'
      } else if (apiError.message) {
        errorMessage = apiError.message
      }
      
      toast.error("Login gagal", {
        description: errorMessage
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSiswaSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await axiosInstance.post('/auth/siswa/login', {
        nama_lengkap: siswaData.nama_lengkap,
        nisn: siswaData.nisn
      } as SiswaLoginRequest)
      
      // Pastikan response memiliki struktur data yang benar
      if (response.data && response.data.access_token && response.data.refresh_token) {
        // Store tokens
        setTokens(response.data.access_token, response.data.refresh_token)
        
        // Show success toast
        toast.success("Login berhasil!", {
          description: "Selamat datang di dashboard siswa"
        })
        
        // Redirect to appropriate dashboard based on role
        router.push('/admin') // For now, redirect to admin
      } else {
        throw new Error('Response tidak memiliki format yang benar')
      }
    } catch (err: unknown) {
      console.error('Siswa login error:', err)
      
      let errorMessage = 'Nama lengkap atau NISN salah'
      
      // Handle different types of errors
      const apiError = err as ApiError
      if (apiError.response) {
        errorMessage = apiError.response.data?.message || apiError.response.data?.error || errorMessage
      } else if (apiError.request) {
        errorMessage = 'Tidak dapat terhubung ke server'
      } else if (apiError.message) {
        errorMessage = apiError.message
      }
      
      toast.error("Login gagal", {
        description: errorMessage
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6 rounded-lg p-6 shadow-lg", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login Ke Akun Anda</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Pilih role Anda untuk masuk ke sistem
        </p>
      </div>
      
      <div>
        <div className="grid gap-6">
          <Tabs defaultValue="admin" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="admin">Admin</TabsTrigger>
              <TabsTrigger value="guru">Guru</TabsTrigger>
              <TabsTrigger value="siswa">Siswa</TabsTrigger>
            </TabsList>
            <TabsContent value="admin">
              <form onSubmit={handleAdminSubmit}>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="admin-username">Username</Label>
                    <Input
                      id="admin-username"
                      type="text"
                      placeholder="Masukkan username"
                      value={adminData.username}
                      onChange={(e) => setAdminData({ ...adminData, username: e.target.value })}
                      className="placeholder:text-primary-foreground/70"
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="admin-password">Password</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="Masukkan password"
                      value={adminData.password}
                      onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                      className="placeholder:text-primary-foreground/70"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[#641E20] text-white hover:bg-gray-100" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login sebagai Admin'}
                  </Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="guru">
              <form onSubmit={handleGuruSubmit}>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="guru-kode">Kode Guru</Label>
                    <Input
                      id="guru-kode"
                      type="text"
                      placeholder="Masukkan kode guru"
                      value={guruData.kode_guru}
                      onChange={(e) => setGuruData({ ...guruData, kode_guru: e.target.value })}
                      className="placeholder:text-primary-foreground/70"
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="guru-password">Password</Label>
                    <Input
                      id="guru-password"
                      type="password"
                      placeholder="password"
                      value={guruData.password}
                      onChange={(e) => setGuruData({ ...guruData, password: e.target.value })}
                      className="placeholder:text-primary-foreground/70"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[#641E20] text-white hover:bg-gray-100" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login sebagai Guru'}
                  </Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="siswa">
              <form onSubmit={handleSiswaSubmit}>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="siswa-nama">Nama Lengkap</Label>
                    <Input
                      id="siswa-nama"
                      type="text"
                      placeholder="John Doe"
                      value={siswaData.nama_lengkap}
                      onChange={(e) => setSiswaData({ ...siswaData, nama_lengkap: e.target.value })}
                      className="placeholder:text-primary-foreground/70"
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="siswa-nisn">NISN</Label>
                    <Input
                      id="siswa-nisn"
                      type="text"
                      placeholder="1234567890"
                      value={siswaData.nisn}
                      onChange={(e) => setSiswaData({ ...siswaData, nisn: e.target.value })}
                      className="placeholder:text-primary-foreground/70"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[#641E20] text-white hover:bg-gray-100" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login sebagai Siswa'}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
