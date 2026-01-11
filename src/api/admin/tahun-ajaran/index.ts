import { TahunAjaran } from "@/types/api";
import axiosInstance from "@/utils/axios";

export async function getTahunAjaran() {
  try {
    const response = await axiosInstance.get("/api/tahun-ajaran");
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getTahunAjaranById(id: number) {
  try {
    const response = await axiosInstance.get(`/api/tahun-ajaran/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getTahunAjaranActive() {
  try {
    const response = await axiosInstance.get(`/api/tahun-ajaran/active`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function postTahunAjaran(data: TahunAjaran) {
  try {
    const response = await axiosInstance.post("/api/tahun-ajaran", data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function putTahunAjaran(id: number, data: TahunAjaran) {
  try {
    const response = await axiosInstance.put(`/api/tahun-ajaran/${id}`, data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
export async function deleteTahunAjaran(id: number) {
  try {
    const response = await axiosInstance.delete(`/api/tahun-ajaran/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

// export async function putTahunAjaranActive(id: number) {
//   try {
//     const response = await axiosInstance.put(
//       `/api/tahun-ajaran/${id}/activate`
//     );
//     return response.data;
//   } catch (error) {
//     console.log(error);
//   }
// }
