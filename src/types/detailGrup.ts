export interface Industri {
    id: number;
    nama: string;
    alamat: string;
}

export interface Siswa {
    id: number;
    nama: string;
    nisn: string;
    kelas: string;
}

export interface Member {
    is_leader: boolean;
    invitation_status: string;
    joined_at: string; // ISO Date String
    responded_at: string; // ISO Date String
    siswa: Siswa;
}

export interface GroupRegistration {
    id: number;
    catatan: string;
    status: string;
    member_count: number;
    tanggal_mulai: string; // YYYY-MM-DD
    tanggal_selesai: string; // YYYY-MM-DD
    created_at: string;
    submitted_at: string;
    approved_at: string;
    industri: Industri;
    leader: Siswa;
    members: Member[];
}