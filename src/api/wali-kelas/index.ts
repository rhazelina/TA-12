
import axiosInstance from "@/utils/axios";
import { PaginationDto } from "@/types/api";

export interface WaliKelasDashboardDto {
    kelas_info: {
        id: number;
        nama: string;
        jurusan: string;
        wali_kelas: string;
        total_siswa: number;
    };
    pagination: PaginationDto;
    siswa_list: SiswaPklSummaryDto[];
}

export interface SiswaPklSummaryDto {
    id: number;
    nisn: string;
    nama: string;
    status_pkl: string;
    industri: string | null;
    pembimbing: string | null; // Guru Pembimbing
    pembimbing_industri: string | null;
    alamat_industri: string | null;
    no_telp_industri: string | null;
    no_telp_pembimbing_sekolah: string | null;
}

export const getWaliKelasDashboard = async (
    page: number = 1,
    limit: number = 10,
    search: string = "",
    status_pkl: string = ""
) => {
    try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (search) params.append("search", search);
        if (status_pkl) params.append("status_pkl", status_pkl);

        const response = await axiosInstance.get("/api/guru/dashboard/wali-kelas", { params });
        return response.data;
    } catch (error) {
        console.error("Get Wali Kelas dashboard failed:", error);
        return null;
    }
};
