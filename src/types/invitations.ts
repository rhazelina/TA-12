interface Industri {
    id: number;
    nama: string;
    alamat: string;
}

interface Leader {
    id: number;
    nama: string;
    nisn: string;
    kelas: string;
}

export interface GroupInvitation {
    id: number;
    group_id: number;
    member_count: number;
    invited_at: string; // ISO Date String
    industri: Industri;
    leader: Leader;
}

// Jika kamu ingin mendefinisikan array-nya secara eksplisit:
export type GroupInvitationList = GroupInvitation[];