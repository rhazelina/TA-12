import { FormDataPermohonanKapro, ApiResponse, DashboardKaprogData } from "@/types/api";
import { GroupRegistration } from "@/types/detailGrup";
import axiosInstance from "@/utils/axios";

export async function dashboardKapro(
  pkl_status?: ("pending" | "approved" | "rejected" | "completed")[],
  pindah_status?: ("pending_pembimbing" | "pending_kaprog" | "pending_koordinator" | "approved" | "rejected")[]
): Promise<ApiResponse<DashboardKaprogData>> {
  try {
    const params = new URLSearchParams();
    if (pkl_status && pkl_status.length > 0) {
      pkl_status.forEach((status) => params.append("pkl_status", status));
    }
    if (pindah_status && pindah_status.length > 0) {
      pindah_status.forEach((status) => params.append("pindah_status", status));
    }

    const queryString = params.toString();
    const url = queryString ? `/api/guru/dashboard/kaprog?${queryString}` : "/api/guru/dashboard/kaprog";

    const res = await axiosInstance.get<ApiResponse<DashboardKaprogData>>(url);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function MeKaprog() {
  try {
    const response = await axiosInstance.get(`/api/jurusan/kaprog/me`);
    return response.data;
  } catch (error) {
    throw error
  }
}

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
export async function ListIndustri(search?: string) {
  try {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    const response = await axiosInstance.get(
      `/api/pkl/industri/preview?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function ListPermohonanPKL(search?: string, limit?: number) {
  try {
    const params = new URLSearchParams();
    if (search) params.append("siswa_username", search);
    if (limit) params.append("limit", limit.toString());
    const response = await axiosInstance.get(
      `/api/pkl/applications?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function ApprovePermohonanPKL(
  id: number,
  form: FormDataPermohonanKapro
) {
  try {
    const response = await axiosInstance.put(
      `/api/pkl/applications/${id}/approve`,
      form
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function RejectPermohonanPKL(
  id: number,
  form: FormDataPermohonanKapro
) {
  try {
    const response = await axiosInstance.put(
      `/api/pkl/applications/${id}/reject`,
      form
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function listPindahPklKapro() {
  try {
    const response = await axiosInstance.get(`/api/pindah-pkl/kaprog`);
    return response.data;
  } catch (error) {
    throw error
  }
}
export async function patchPindahPklKapro(id: number, data: {
  catatan: string,
  status: "approved" | "rejected"
}) {
  try {
    const response = await axiosInstance.patch(`/api/pindah-pkl/${id}/kaprog`, data);
    return response.data;
  } catch (error) {
    throw error
  }
}

// PKL Group APIs (Kapro)
export async function reviewGroup() {
  try {
    const res = await axiosInstance.get('/api/pkl/group/review');
    return res.data as GroupRegistration[];
  } catch (error) {
    throw error;
  }
}

export async function approveGroup(id: number) {
  try {
    const response = await axiosInstance.post(`/api/pkl/group/review/${id}/approve`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function rejectGroup(id: number, data: { reason: string }) {
  try {
    const response = await axiosInstance.post(`/api/pkl/group/review/${id}/reject`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function generateSuratKapro(id: number) {
  try {
    const response = await axiosInstance.post(`/api/pkl/${id}/generate-surat`);
    return response.data;
  } catch (error) {
    throw error;
  }
}