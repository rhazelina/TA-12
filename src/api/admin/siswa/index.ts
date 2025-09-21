import { Siswa } from "@/types/api"
import axiosInstance from "@/utils/axios"

export const getSiswa = async () => {
    try {
        const response = await axiosInstance.get('/api/siswa')
        return response.data
    } catch (error) {
        console.error('Get siswa failed:', error)
        return null
    }
}

export const getSiswaById = async (id: number) => {
    try {
        const response = await axiosInstance.get(`/api/siswa/${id}`)
        return response.data
    } catch (error) {
        console.error('Get siswa by id failed:', error)
        return null
    }
}

export const createSiswa = async (data: Siswa) => {
    try {
        const response = await axiosInstance.post('/api/siswa', data)
        return response.data
    } catch (error) {
        console.error('Create siswa failed:', error)
        return null
    }
}

export const updateSiswa = async (id: number, data: Siswa) => {
    try {
        const response = await axiosInstance.put(`/api/siswa/${id}`, data)
        return response.data
    } catch (error) {
        console.error('Update siswa failed:', error)
        return null
    }
}

export const deleteSiswa = async (id: number) => {
    try {
        const response = await axiosInstance.delete(`/api/siswa/${id}`)
        return response.data
    } catch (error) {
        console.error('Delete siswa failed:', error)
        return null
    }
}