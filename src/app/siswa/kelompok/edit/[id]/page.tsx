"use client"

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getAvailableMembers, detailKelompok, updateGroupMembers } from "@/api/siswa/index";
import { GroupRegistration, Member } from "@/types/detailGrup";
import {
    Loader2,
    ArrowLeft,
    Search,
    Plus,
    X,
    User,
    Hash,
    Save
} from "lucide-react";

interface Siswa {
    id: number;
    nama: string;
    nisn: string;
    kelas: string;
}

export default function EditKelompokPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [groupData, setGroupData] = useState<GroupRegistration | null>(null);

    // Member management states
    const [query, setQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<Siswa[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<Siswa[]>([]);

    useEffect(() => {
        fetchGroupDetail();
    }, [id]);

    const fetchGroupDetail = async () => {
        try {
            const res = await detailKelompok(Number(id));
            setGroupData(res);

            console.log(res.members)

            // Populate existing members (exclude leader)
            if (res.members) {
                const existingMembers = res.members
                    .filter((m: Member) => !m.is_leader)
                    .map((m: Member) => ({
                        id: m.siswa.id,
                        nama: m.siswa.nama,
                        nisn: m.siswa.nisn,
                        kelas: m.siswa.kelas
                    }));
                setSelectedMembers(existingMembers);
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Gagal memuat detail kelompok");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!query.trim()) return;
        setIsSearching(true);
        try {
            const res = await getAvailableMembers(query);
            const data = res || [];

            // Filter out already selected members and the leader
            const filteredData = data.filter(
                (student: Siswa) =>
                    !selectedMembers.some(sm => sm.id === student.id) &&
                    student.id !== groupData?.leader?.id
            );
            setSearchResults(filteredData);
        } catch (error) {
            console.error(error);
            toast.error("Gagal mencari data siswa");
        } finally {
            setIsSearching(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const addMember = (student: Siswa) => {
        setSelectedMembers([...selectedMembers, student]);
        setSearchResults(searchResults.filter(s => s.id !== student.id));
    };

    const removeMember = (studentId: number) => {
        setSelectedMembers(selectedMembers.filter(s => s.id !== studentId));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const memberNisns = selectedMembers.map(s => s.nisn.toString());
            await updateGroupMembers(Number(id), { invited_members: memberNisns });
            toast.success("Berhasil memperbarui anggota kelompok");
            router.push(`/siswa/kelompok/${id}`);
        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Gagal memperbarui anggota kelompok");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-500 font-medium">Memuat data kelompok...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header Section */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Anggota Kelompok</h1>
                        <p className="text-gray-500 text-sm mt-1">Tambah atau hapus anggota kelompok PKL Anda.</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 md:p-8 space-y-8">

                        {/* Search Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">Cari Anggota Baru</h3>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Cari berdasarkan nama atau NISN..."
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                </div>
                                <button
                                    onClick={handleSearch}
                                    disabled={isSearching}
                                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-70 flex items-center gap-2 shadow-sm"
                                >
                                    {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                                    <span className="hidden sm:inline">Cari</span>
                                </button>
                            </div>

                            {/* Search Results */}
                            {searchResults.length > 0 && (
                                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white max-h-60 overflow-y-auto shadow-sm">
                                    {searchResults.map(student => (
                                        <div
                                            key={student.id}
                                            className="px-5 py-4 border-b last:border-0 hover:bg-gray-50 transition-colors flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{student.nama}</p>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                        <span className="flex items-center gap-1"><Hash className="w-3 h-3" />{student.nisn}</span>
                                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                        <span>{student.kelas}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => addMember(student)}
                                                className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                                title="Tambah Anggota"
                                            >
                                                <Plus className="h-5 w-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {searchResults.length === 0 && query && !isSearching && (
                                <div className="text-center py-6 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                                    <p className="text-gray-500">Tidak menemukan siswa dengan pencarian "{query}"</p>
                                </div>
                            )}
                        </div>

                        {/* Selected Members Section */}
                        <div className="space-y-4 pt-6 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    Daftar Anggota
                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                                        {selectedMembers.length + (groupData?.leader ? 1 : 0)} Anggota
                                    </span>
                                </h3>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                {/* Leader */}
                                {groupData?.leader && (
                                    <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm flex items-center gap-4 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0 border border-blue-100">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-semibold text-gray-900 truncate">{groupData.leader.nama}</p>
                                                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-bold uppercase tracking-wider rounded">Ketua</span>
                                            </div>
                                            <p className="text-xs text-gray-500 truncate">{groupData.leader.nisn} • {groupData.leader.kelas}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Selected Members */}
                                {selectedMembers.map(student => (
                                    <div key={student.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between group">
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center shrink-0 border border-gray-100">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-gray-900 truncate">{student.nama}</p>
                                                <p className="text-xs text-gray-500 truncate">{student.nisn} • {student.kelas}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeMember(student.id)}
                                            className="p-2 rounded-full text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                                            title="Hapus Anggota"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Action Footer */}
                    <div className="bg-gray-50 p-6 border-t border-gray-100 flex items-center justify-end gap-3">
                        <button
                            onClick={() => router.back()}
                            className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-200 bg-gray-100 rounded-xl transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-70 flex items-center gap-2 shadow-sm"
                        >
                            {isSubmitting ? (
                                <><Loader2 className="h-5 w-5 animate-spin" /> Menyimpan...</>
                            ) : (
                                <><Save className="h-5 w-5" /> Simpan Perubahan</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}