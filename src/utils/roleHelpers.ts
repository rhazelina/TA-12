import type { Guru } from "@/types/api"

export interface GuruRoleData {
  is_koordinator?: boolean
  is_pembimbing?: boolean
  is_wali_kelas?: boolean
  is_kaprog?: boolean
  kaprog_jurusan?: string
}

// ... (unchanged functions)

// Fungsi untuk mendapatkan semua role yang dimiliki guru
export const getGuruRoles = (guruData: GuruRoleData): Array<{
  key: string
  label: string
  path: string
}> => {
  const roles: Array<{ key: string; label: string; path: string }> = []

  if (guruData.is_kaprog) {
    const label = guruData.kaprog_jurusan
      ? `Kepala Konsentrasi Keahlian (${guruData.kaprog_jurusan})`
      : 'Kepala Konsentrasi Keahlian'
    roles.push({ key: 'kapro', label, path: '/kapro/beranda' })
  }
  if (guruData.is_koordinator) {
    roles.push({ key: 'koordinator', label: 'Pokja', path: '/koordinator/dashboard' })
  }
  if (guruData.is_wali_kelas) {
    roles.push({ key: 'wali-kelas', label: 'Wali Kelas', path: '/wali-kelas/dashboard' })
  }
  if (guruData.is_pembimbing) {
    roles.push({ key: 'pembimbing', label: 'Pembimbing', path: '/pembimbing/dashboard' })
  }

  return roles
}

// Fungsi untuk cek apakah guru punya multiple roles
export const hasMultipleRoles = (guruData: GuruRoleData): boolean => {
  const roleCount = [
    guruData.is_kaprog,
    guruData.is_koordinator,
    guruData.is_wali_kelas,
    guruData.is_pembimbing
  ].filter(Boolean).length

  return roleCount > 1
}

export const getGuruDefaultPath = (guruData: GuruRoleData): string => {
  if (guruData.is_kaprog) return '/kapro/beranda'
  if (guruData.is_koordinator) return '/koordinator/dashboard'
  if (guruData.is_wali_kelas) return '/wali-kelas/dashboard'
  if (guruData.is_pembimbing) return '/pembimbing/dashboard'

  return '/guru/dashboard' // Default fallback
}
