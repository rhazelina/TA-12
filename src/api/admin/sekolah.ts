import { ApiResponseSekolah } from "@/types/api";
import axiosInstance from "@/utils/axios";

export interface SekolahDto {
    nama_sekolah: string | null;
    npsn: string | null;
    jalan: string | null;
    kelurahan: string | null;
    kecamatan: string | null;
    kabupaten_kota: string | null;
    provinsi: string | null;
    kode_pos: string | null;
    nomor_telepon: string | null;
    email: string | null;
    website: string | null;
    kepala_sekolah: string | null;
    nip_kepala_sekolah: string | null;
    akreditasi: string | null;
    logo: string | null;
}

export async function getSekolah(): Promise<ApiResponseSekolah> {
    try {
        const response = await axiosInstance.get<ApiResponseSekolah>("/api/sekolah");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function updateSekolah(data: Partial<SekolahDto>, id: number) {
    try {
        const response = await axiosInstance.put(`/api/sekolah/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}
