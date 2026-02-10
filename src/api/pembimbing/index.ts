import { PostRealisasiKegiatanPkl } from "@/types/api";
import axiosInstance from "@/utils/axios";

export async function kegiatanPklActive() {
  try {
    const res = await axiosInstance.get("/api/kegiatan-pkl/active");
    return res.data;
  } catch (error) {
    throw error;
  }
}
export async function kegiatanPklById(id: number) {
  try {
    const res = await axiosInstance.get(`/api/kegiatan-pkl/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
}
export async function getIndustri() {
  try {
    const res = await axiosInstance.get(`/api/pkl/guru/industri`);
    return res.data;
  } catch (error) {
    throw error;
  }
}
export async function getSiswa() {
  try {
    const res = await axiosInstance.get(`/api/pkl/guru/siswa`);
    return res.data;
  } catch (error) {
    throw error;
  }
}
export async function getTasksRealisasiPkl() {
  try {
    const res = await axiosInstance.get(`/api/pkl/guru/tasks`);
    return res.data;
  } catch (error) {
    throw error;
  }
}
export async function realisasiKegiatanPkl() {
  try {
    const res = await axiosInstance.get(`/api/realisasi-kegiatan/me`);
    return res.data;
  } catch (error) {
    throw error;
  }
}
export async function getRealisasiKegiatanPklById(id: number) {
  try {
    const res = await axiosInstance.get(`/api/realisasi-kegiatan/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
}
export async function createRealisasiKegiatanPkl(
  data: PostRealisasiKegiatanPkl
) {
  try {
    const res = await axiosInstance.post(
      `/api/realisasi-kegiatan/submit`,
      data
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}
export async function uploadImages(data: FormData) {
  try {
    const res = await axiosInstance.post(`/api/realisasi-kegiatan`, data);
    return res.data;
  } catch (error) {
    throw error;
  }
}
export async function updateRealisasiKegiatanPkl(
  id: number,
  data: PostRealisasiKegiatanPkl
) {
  try {
    const res = await axiosInstance.put(
      `/api/realisasi-kegiatan/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}



// izin
export async function updateIzinByPembimbing(id: number, status: "approved" | "rejected", rejection_reason?: string) {
  try {
    const res = await axiosInstance.patch(`/api/izin/${id}/decide`, {
      status,
      rejection_reason
    })
    return res.data
  } catch (error) {
    throw error
  }
}

export async function getIzinByPembimbing() {
  try {
    const res = await axiosInstance.get('/api/izin/pembimbing')
    return res.data
  } catch (error) {
    throw error
  }
}

export async function listPindahPklPembimbing() {
  try {
    const response = await axiosInstance.get(`/api/pindah-pkl/pembimbing`);
    return response.data;
  } catch (error) {
    throw error
  }
}
export async function patchPindahPklPembimbing(id: number, data: {
  catatan: string,
  status: "approved" | "rejected"
}) {
  try {
    const response = await axiosInstance.patch(`/api/pindah-pkl/${id}/pembimbing`, data);
    return response.data;
  } catch (error) {
    throw error
  }
}