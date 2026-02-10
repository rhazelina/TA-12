import axiosInstance from "@/utils/axios";

export async function getSekolah() {
  try {
    const res = await axiosInstance.get("/api/sekolah");
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function detailPindahPkl(id: number) {
  try {
    const res = await axiosInstance.get(`/api/pindah-pkl/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
}