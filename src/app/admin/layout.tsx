'use client'

import { AdminLayout } from "@/components/admin-layout"
import { useAuth } from "@/hooks/useAuth"

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()

  return (
    <AdminLayout
      user={user ? {
        username: user.username || 'Admin',
        role: user.role || 'adm'
      } : undefined}
    >
      {children}
    </AdminLayout>
  )
}