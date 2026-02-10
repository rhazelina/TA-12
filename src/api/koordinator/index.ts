import { jadwalPkl } from "@/types/api";
import axiosInstance from "@/utils/axios";

export async function getActiveTahunAjaran() {
  try {
    const response = await axiosInstance.get("/api/tahun-ajaran/active");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createJadwal(data: jadwalPkl) {
  try {
    const response = await axiosInstance.post("/api/kegiatan-pkl", data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getJadwalByTahunAjaran(tahun_ajaran_id: number) {
  try {
    const response = await axiosInstance.get(
      `/api/kegiatan-pkl/tahun-ajaran/${tahun_ajaran_id}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateJadwal(id: number, data: jadwalPkl) {
  try {
    const response = await axiosInstance.put(`/api/kegiatan-pkl/${id}`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteJadwal(id: number) {
  try {
    const response = await axiosInstance.delete(`/api/kegiatan-pkl/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function listPindahPklKoordinator() {
  try {
    const response = await axiosInstance.get(`/api/pindah-pkl/koordinator`);
    return response.data;
  } catch (error) {
    throw error
  }
}
export async function patchPindahPklKoordinator(id: number) {
  try {
    const response = await axiosInstance.patch(`/api/pindah-pkl/${id}/koordinator`);
    return response.data;
  } catch (error) {
    throw error
  }
}