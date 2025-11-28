import axiosInstance from "@/utils/axios";

export async function ListGuruPembimbing(search?: string) {
  try {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    const response = await axiosInstance.get(
      `/api/pkl/pembimbing?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
