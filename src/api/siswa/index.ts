import { PostIzin } from "@/types/api"
import axiosInstance from "@/utils/axios"

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

export async function getIzinBySiswa() {
    try {
        const res = await axiosInstance.get('/api/izin/me')
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