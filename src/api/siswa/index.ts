import { PostIzin } from "@/types/api"
import axiosInstance from "@/utils/axios"

export async function getActivePklBySiswa() {
    try {
        const res = await axiosInstance.get('/api/pkl/active/me')
        return res.data
    } catch (error) {
        throw error
    }
}

export async function createIzin(data: FormData) {
    try {
        const res = await axiosInstance.post('/api/izin', data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        return res.data
    } catch (error) {
        throw error
    }
}

export async function updateIzinBySiswa(id: number, data: FormData) {
    try {
        const res = await axiosInstance.put(`/api/izin/${id}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        return res.data
    } catch (error) {
        throw error
    }
}

export async function getIzinBySiswa(status?: "pending" | "approved" | "rejected") {
    try {
        const res = await axiosInstance.get('/api/izin/me', {
            params: {
                status,
            },
        })
        return res.data
    } catch (error) {
        throw error
    }
}

export async function deleteIzinBySiswa(id: number) {
    try {
        const res = await axiosInstance.delete(`/api/izin/${id}`)
        return res.data
    } catch (error) {
        throw error
    }
}

export async function getPindahPklBySiswa() {
    try {
        const res = await axiosInstance.get('/api/pindah-pkl/me')
        return res.data
    } catch (error) {
        throw error
    }
}

export async function requestPindahPklSiswa(data: FormData) {
    try {
        const res = await axiosInstance.post(`/api/pindah-pkl`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        return res.data
    } catch (error) {
        throw error
    }
}

// PKL Group APIs
export async function createPklGroup(data: { invited_members: string[] }) {
    try {
        const res = await axiosInstance.post('/api/pkl/group', data)
        return res.data
    } catch (error) {
        throw error
    }
}

export async function getAvailableMembers(query: string) {
    try {
        const res = await axiosInstance.get('/api/pkl/group/available-members', {
            params: { q: query }
        })
        return res.data
    } catch (error) {
        throw error
    }
}

export async function getMyInvitations() {
    try {
        const res = await axiosInstance.get('/api/pkl/group/invitations')
        return res.data
    } catch (error) {
        throw error
    }
}

export async function respondToInvitation(id: number, data: { accept: boolean }) {
    try {
        const res = await axiosInstance.post(`/api/pkl/group/invitations/${id}`, data)
        return res.data
    } catch (error) {
        throw error
    }
}

export async function getMyGroups() {
    try {
        const res = await axiosInstance.get('/api/pkl/group/my')
        return res.data
    } catch (error) {
        throw error
    }
}

export async function getGroupDetail(id: number) {
    try {
        const res = await axiosInstance.get(`/api/pkl/group/${id}`)
        return res.data
    } catch (error) {
        throw error
    }
}

export async function deleteGroup(id: number) {
    try {
        const res = await axiosInstance.delete(`/api/pkl/group/${id}`)
        return res.data
    } catch (error) {
        throw error
    }
}

export async function updateGroupMembers(id: number, data: { invited_members: string[] }) {
    try {
        const res = await axiosInstance.put(`/api/pkl/group/${id}/members`, data)
        return res.data
    } catch (error) {
        throw error
    }
}

export async function submitGroupApplication(id: number, data: {
    catatan: string,
    industri_id: number,
    tanggal_mulai: string,
    tanggal_selesai: string
}) {
    try {
        const res = await axiosInstance.post(`/api/pkl/group/${id}/submit`, data)
        return res.data
    } catch (error) {
        throw error
    }
}

export async function withdrawGroupApplication(id: number) {
    try {
        const res = await axiosInstance.post(`/api/pkl/group/${id}/withdraw`)
        return res.data
    } catch (error) {
        throw error
    }
}

export async function uploadDokumenSiswa(id: number, data: FormData) {
    try {
        const res = await axiosInstance.post(`/api/pkl/${id}/dokumen`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        return res.data
    } catch (error) {
        throw error
    }
}