import { Guru } from "@/types/api"
import axiosInstance from "@/utils/axios"

export const getGuru = async () => {
    try {
        const response = await axiosInstance.get('/api/guru')
        return response.data
    } catch (error) {
        console.error('Get guru failed:', error)
        return null
    }
}

export const getGuruById = async (id: number) => {
    try {
        const response = await axiosInstance.get(`/api/guru/${id}`)
        return response.data
    } catch (error) {
        console.error('Get guru by id failed:', error)
        return null
    }
}

export const createGuru = async (data: Guru) => {
    try {
        const response = await axiosInstance.post('/api/guru', data)
        return response.data
    } catch (error) {
        console.error('Create guru failed:', error)
        return null
    }
}

export const updateGuru = async (id: number, data: Guru) => {
    try {
        const response = await axiosInstance.put(`/api/guru/${id}`, data)
        return response.data
    } catch (error) {
        console.error('Update guru failed:', error)
        return null
    }
}

export const deleteGuru = async (id: number) => {
    try {
        const response = await axiosInstance.delete(`/api/guru/${id}`)
        return response.data
    } catch (error) {
        console.error('Delete guru failed:', error)
        return null
    }
}