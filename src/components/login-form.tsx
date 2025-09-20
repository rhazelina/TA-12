'use client'

import { useState } from 'react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [adminData, setAdminData] = useState({ username: '', password: '' })
  const [guruData, setGuruData] = useState({ kode_guru: '', password: '' })
  const [siswaData, setSiswaData] = useState({ NISN: '', nama_lengkap: '' })

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Admin login:', adminData)
    // Handle login logic here
  }

  const handleGuruSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Guru login:', guruData)
    // Handle login logic here
  }

  const handleSiswaSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Siswa login:', siswaData)
    // Handle login logic here
  }

  return (
    <div className={cn("flex flex-col gap-6 bg-secondary text-secondary-foreground rounded-lg p-6 shadow-lg", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Management Sistem PKL</h1>
        <p className="text-muted-foreground text-sm text-balance text-[#818181]">
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
                      placeholder="Masukkan username admin"
                      value={adminData.username}
                      onChange={(e) => setAdminData({ ...adminData, username: e.target.value })}
                      className="bg-primary text-primary-foreground placeholder:text-primary-foreground/70"
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="admin-password">Password</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="Masukkan password admin"
                      value={adminData.password}
                      onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                      className="bg-primary text-primary-foreground placeholder:text-primary-foreground/70"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-white text-black hover:bg-gray-100">
                    Login sebagai Admin
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
                      className="bg-primary text-primary-foreground placeholder:text-primary-foreground/70"
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="guru-password">Password</Label>
                    <Input
                      id="guru-password"
                      type="password"
                      placeholder="Masukkan password guru"
                      value={guruData.password}
                      onChange={(e) => setGuruData({ ...guruData, password: e.target.value })}
                      className="bg-primary text-primary-foreground placeholder:text-primary-foreground/70"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-white text-black hover:bg-gray-100">
                    Login sebagai Guru
                  </Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="siswa">
              <form onSubmit={handleSiswaSubmit}>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="siswa-nisn">NISN</Label>
                    <Input
                      id="siswa-nisn"
                      type="text"
                      placeholder="Masukkan NISN siswa"
                      value={siswaData.NISN}
                      onChange={(e) => setSiswaData({ ...siswaData, NISN: e.target.value })}
                      className="bg-primary text-primary-foreground placeholder:text-primary-foreground/70"
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="siswa-nama">Nama Lengkap</Label>
                    <Input
                      id="siswa-nama"
                      type="text"
                      placeholder="Masukkan nama lengkap siswa"
                      value={siswaData.nama_lengkap}
                      onChange={(e) => setSiswaData({ ...siswaData, nama_lengkap: e.target.value })}
                      className="bg-primary text-primary-foreground placeholder:text-primary-foreground/70"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-white text-black hover:bg-gray-100">
                    Login sebagai Siswa
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
