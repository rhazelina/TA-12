import axiosInstance from "@/utils/axios";

export async function getSekolah() {
  try {
    const res = await axiosInstance.get("/api/sekolah");
    return res.data;
  } catch (error) {
    throw error;
  }
}
