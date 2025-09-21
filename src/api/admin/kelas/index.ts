import axiosInstance from "@/utils/axios"
import { Kelas } from "@/types/api"

export const getKelas = async () => {
    try {
        const response = await axiosInstance.get('/api/kelas')
        return response.data
    } catch (error) {
        console.error('Get kelas failed:', error)
        return null
    }
}

export const getKelasById = async (id: number) => {
    try {
        const response = await axiosInstance.get(`/api/kelas/${id}`)
        return response.data
    } catch (error) {
        console.error('Get kelas by id failed:', error)
        return null
    }
}

export const createKelas = async (data: Kelas) => {
    try {
        const response = await axiosInstance.post('/api/kelas', data)
        return response.data
    } catch (error) {
        console.error('Create kelas failed:', error)
        return null
    }
}

export const updateKelas = async (id: number, data: Kelas) => {
    try {
        const response = await axiosInstance.put(`/api/kelas/${id}`, data)
        return response.data
    } catch (error) {
        console.error('Update kelas failed:', error)
        return null
    }
}

export const deleteKelas = async (id: number) => {
    try {
        const response = await axiosInstance.delete(`/api/kelas/${id}`)
        return response.data
    } catch (error) {
        console.error('Delete kelas failed:', error)
        return null
    }
}