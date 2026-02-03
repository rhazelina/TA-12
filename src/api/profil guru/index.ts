import { UpdateProfileGuru } from "@/types/api"
import axiosInstance from "@/utils/axios"


export async function updateProfileGuru(data: UpdateProfileGuru) {
    try {
        const res = await axiosInstance.put('/api/guru/me', data)
        return res.data
    } catch (error) {
        throw error
    }
}