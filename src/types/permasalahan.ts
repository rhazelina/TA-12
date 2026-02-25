export interface ApiResponsePermasalahan {
    items: Item[];
    pagination: Pagination;
}

export interface Item {
    id: number;
    judul: string;
    deskripsi: string;
    kategori: string;
    status: string;
    tindak_lanjut: string;
    siswa: Siswa;
    pembimbing: Pembimbing;
    created_at: string; // Bisa menggunakan Date jika akan di-parse
    updated_at: string;
    resolved_at: string | null; // Mengantisipasi jika belum selesai/null
}

export interface Siswa {
    id: number;
    nama: string;
    nisn: string;
}

export interface Pembimbing {
    id: number;
    nama: string;
}

export interface Pagination {
    limit: number;
    page: number;
    total_items: number;
    total_pages: number;
}