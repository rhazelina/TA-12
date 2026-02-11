'use client'

import { useEffect, useState } from "react"

import { StatisticsCard } from "@/components/statistics-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { DashboardStats } from "@/types/api"
import {
  Users,
  GraduationCap,
  BookOpen,
  School,
  Building2,
  UserCheck,
  TrendingUp,
  Clock
} from "lucide-react"
import { useRouter } from "next/navigation"
import axiosInstance from "@/utils/axios"
import { useAuth } from "@/hooks/useAuth"


function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('/api/admin/dashboard')
      setStats(response.data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat statistik dashboard')
    } finally {
      setLoading(false)
    }
  }



  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Gagal Memuat Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadDashboardStats}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Tidak ada data tersedia</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Beranda</h1>
        <p className="text-gray-600">Ringkasan sistem manajemen PKL Anda</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatisticsCard
          title="Total Pengguna"
          value={stats?.total_users}
          description="Semua pengguna sistem"
          icon={Users}
          variant="default"
        />
        <StatisticsCard
          title="Guru"
          value={stats?.total_guru}
          description={`${stats?.guru_users || 0} aktif`}
          icon={GraduationCap}
          variant="success"
        />
        <StatisticsCard
          title="Siswa"
          value={stats?.total_siswa}
          description={`${stats?.siswa_users || 0} aktif`}
          icon={UserCheck}
          variant="warning"
        />
        <StatisticsCard
          title="Pengguna Admin"
          value={stats?.admin_users}
          description="Administrator sistem"
          icon={Users}
          variant="destructive"
        />
      </div>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatisticsCard
          title="Jurusan"
          value={stats?.total_jurusan}
          description="Program keahlian"
          icon={BookOpen}
          variant="default"
        />
        <StatisticsCard
          title="Kelas"
          value={stats?.total_kelas}
          description="Kelas"
          icon={School}
          variant="success"
        />
        <StatisticsCard
          title="Industri"
          value={stats?.total_industri}
          description="Mitra industri"
          icon={Building2}
          variant="warning"
        />
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Ringkasan Sistem
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Pengguna Aktif</span>
              <Badge variant="success">
                {(stats?.guru_users || 0) + (stats?.siswa_users || 0) + (stats?.admin_users || 0)}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Status Sistem</span>
              <Badge variant="success">Aktif</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Status Database</span>
              <Badge variant="success">Terhubung</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Terakhir Diperbarui
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 mb-2">
              Statistik terakhir diperbarui pada:
            </div>
            <div className="text-lg font-semibold">
              {formatLastUpdated(stats.last_updated)}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Data diperbarui secara otomatis setiap beberapa menit
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AdminDashboardPage() {
  return <AdminDashboard />
}
