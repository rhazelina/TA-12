"use client";

import { useState, useEffect } from "react";
import { getMyGroups } from "@/api/siswa/index";
import { toast } from "sonner";
import {
    Loader2,
    Plus,
    Users,
    Building2,
    Calendar,
    ChevronRight,
    AlertCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateGroupModal from "@/components/siswa/CreateGroupModal";
import { GroupRegistration } from "@/types/detailGrup";

export default function SiswaKelompokPage() {
    const [groups, setGroups] = useState<GroupRegistration[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getMyGroups();
            // Ensure we handle both direct array or { data: ... } wrapper if existing
            const data = Array.isArray(res) ? res : res.data || [];
            setGroups(data);
        } catch (error) {
            console.error(error);
            toast.error("Gagal memuat data kelompok");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'approved': return 'bg-green-100 text-green-700 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            case 'submitted': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    const getStatusText = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'approved': return 'Disetujui';
            case 'rejected': return 'Ditolak';
            case 'submitted': return 'Diajukan';
            case 'pending': return 'Tertunda';
            default: return 'Tidak Diketahui';
        }
    };

    return (
        <Tabs defaultValue="Kelompok">
            <TabsList className="mx-auto">
                <TabsTrigger value="Kelompok">Kelompok</TabsTrigger>
                <TabsTrigger value="Undangan">Undangan</TabsTrigger>
            </TabsList>
            <TabsContent value="Kelompok">
                <div className="min-h-screen font-sans p-4 md:p-8">
                    <div className="mx-auto max-w-5xl">
                        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Daftar Kelompok PKL</h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    Lihat riwayat dan status kelompok PKL Anda.
                                </p>
                            </div>

                            <CreateGroupModal onSuccess={fetchData}>
                                <button
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                    <Plus className="h-4 w-4" />
                                    Buat Kelompok
                                </button>
                            </CreateGroupModal>
                        </header>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                                <p className="text-gray-500 text-sm">Memuat data kelompok...</p>
                            </div>
                        ) : groups.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                                <div className="mx-auto h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <Users className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Belum Ada Kelompok</h3>
                                <p className="text-gray-500 mt-2 max-w-md mx-auto mb-6">
                                    Anda belum tergabung dalam kelompok manapun. Yuk buat kelompok baru sekarang!
                                </p>
                                <CreateGroupModal onSuccess={fetchData}>
                                    <button
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Buat Kelompok Baru
                                    </button>
                                </CreateGroupModal>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {groups.map((group) => (
                                    <div
                                        key={group.id}
                                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow relative overflow-hidden group-card"
                                    >
                                        <div className="flex flex-col md:flex-row justify-between gap-4">
                                            <div className="space-y-3 flex-1">
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(group.status)} uppercase`}>
                                                        {getStatusText(group.status)}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        Dibuat: {format(new Date(group.created_at), "dd MMM yyyy", { locale: idLocale })}
                                                    </span>
                                                </div>

                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                                        {group.industri?.nama || "Belum memilih industri"}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                                                        <Users className="h-3.5 w-3.5" />
                                                        Ketua: <span className="font-medium text-gray-700">{group.leader.nama}</span>
                                                        <span className="text-gray-300 mx-1">•</span>
                                                        {group.members.length} Anggota
                                                    </p>
                                                </div>

                                                {(group.tanggal_mulai && group.tanggal_selesai) && (
                                                    <div className="flex items-center gap-4 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg w-fit">
                                                        <div className="flex items-center gap-1.5">
                                                            <Calendar className="h-3.5 w-3.5" />
                                                            {format(new Date(group.tanggal_mulai), "dd MMM yyyy", { locale: idLocale })}
                                                        </div>
                                                        <span>-</span>
                                                        <div className="flex items-center gap-1.5">
                                                            <Calendar className="h-3.5 w-3.5" />
                                                            {format(new Date(group.tanggal_selesai), "dd MMM yyyy", { locale: idLocale })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-end">
                                                <button className="p-2 rounded-full bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors" onClick={() => router.push(`/siswa/kelompok/${group.id}`)}>
                                                    <ChevronRight className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>

                                        {group.catatan && (
                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                <p className="text-xs text-gray-500 flex items-start gap-1.5">
                                                    <AlertCircle className="h-3.5 w-3.5 mt-0.5 text-yellow-500" />
                                                    <span className="italic">"{group.catatan}"</span>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="Undangan">
                <div className="min-h-screen font-sans p-4 md:p-8">
                    <div className="mx-auto max-w-5xl">
                        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Undangan</h1>
                                <p className="text-gray-500">
                                    Kelola kelompok Anda dan undang anggota
                                </p>
                            </div>
                        </header>
                    </div>
                </div>
            </TabsContent>
        </Tabs>
    );
}