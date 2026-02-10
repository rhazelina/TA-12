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