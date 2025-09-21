"use client"

import axiosInstance from "@/utils/axios"

export const logout = async () => {
    try {
        const response = await axiosInstance.post('/auth/logout')
        return response.data
    } catch (error) {
        console.error('Logout failed:', error)
    }
}