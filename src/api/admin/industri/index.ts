import { Industri } from "@/types/api"
import axiosInstance from "@/utils/axios"

export const getIndustri = async () => {
    try {
        const response = await axiosInstance.get('/api/industri')
        return response.data
    } catch (error) {
        console.error('Get industri failed:', error)
        return null
    }
}

export const getIndustriById = async (id: number) => {
    try {
        const response = await axiosInstance.get(`/api/industri/${id}`)
        return response.data
    } catch (error) {
        console.error('Get industri by id failed:', error)
        return null
    }
}       

export const createIndustri = async (data: Industri) => {
    try {
        const response = await axiosInstance.post('/api/industri', data)
        return response.data
    } catch (error) {
        console.error('Create industri failed:', error)
        return null
    }
}

export const updateIndustri = async (id: number, data: Industri) => {
    try {
        const response = await axiosInstance.put(`/api/industri/${id}`, data)
        return response.data
    } catch (error) {
        console.error('Update industri failed:', error)
        return null
    }
}

export const deleteIndustri = async (id: number) => {   
    try {
        const response = await axiosInstance.delete(`/api/industri/${id}`)
        return response.data
    } catch (error) {
        console.error('Delete industri failed:', error)
        return null
    }
}