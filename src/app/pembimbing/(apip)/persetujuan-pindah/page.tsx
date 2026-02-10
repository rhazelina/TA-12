"use client";

import { useState, useEffect } from "react";
import { listPindahPklPembimbing, patchPindahPklPembimbing } from "@/api/pembimbing/index";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { toast } from "sonner";
import { Loader2, CheckCircle, FileText, XCircle, AlertCircle, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";

// --- Types ---
interface PindahPklItem {
    id: number;
    created_at: string;
    industri_baru_nama: string;
    industri_lama_nama: string;
    siswa_nama: string;
    status: string;
}

interface ApiResponse {
    items: PindahPklItem[];
    total: number;
}

export default function PindahPklPembimbingPage() {
    const [data, setData] = useState<PindahPklItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("Semua Status");
    const [page, setPage] = useState(1);
    const [stats, setStats] = useState({
        total: 0,
        menunggu: 0,
        disetujui: 0,
        ditolak: 0
    });

    const [processingId, setProcessingId] = useState<number | null>(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<PindahPklItem | null>(null);
    const [note, setNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const limit = 5;
    const router = useRouter();

    const fetchData = async () => {
        setLoading(true);
        try {
            const res: ApiResponse = await listPindahPklPembimbing();
            if (res && res.items) {
                setData(res.items);

                // Calculate stats based on fetched data
                const total = res.total || res.items.length;
                const menunggu = res.items.filter(i => i.status.includes('pending')).length;
                const disetujui = res.items.filter(i => i.status === 'approved' || i.status === 'disetujui').length;
                const ditolak = res.items.filter(i => i.status === 'rejected' || i.status === 'ditolak').length;

                setStats({ total, menunggu, disetujui, ditolak });
            }
        } catch (error) {
            console.error("Failed to fetch data", error);
            toast.error("Gagal memuat data pengajuan pindah PKL");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openActionModal = (item: PindahPklItem) => {
        setSelectedItem(item);
        setNote("");
        setIsModalOpen(true);
    };

    const closeActionModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
        setNote("");
    };

    const handleAction = async (status: "approved" | "rejected") => {
        if (!selectedItem) return;

        setIsSubmitting(true);
        try {
            await patchPindahPklPembimbing(selectedItem.id, {
                catatan: note,
                status: status
            });

            toast.success(status === "approved" ? "Pengajuan disetujui" : "Pengajuan ditolak");
            closeActionModal();
            fetchData(); // Refresh data
        } catch (error) {
            console.error(`Failed to ${status}`, error);
            toast.error(`Gagal memproses pengajuan`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Filter Logic
    const filteredData = data.filter((item) => {
        const matchSearch =
            item.siswa_nama.toLowerCase().includes(search.toLowerCase()) ||
            item.industri_baru_nama.toLowerCase().includes(search.toLowerCase());

        let matchStatus = true;
        if (statusFilter !== "Semua Status") {
            if (statusFilter === "Menunggu") matchStatus = item.status.includes('pending');
            else if (statusFilter === "Disetujui") matchStatus = item.status === 'approved' || item.status === 'disetujui';
            else if (statusFilter === "Ditolak") matchStatus = item.status === 'rejected' || item.status === 'ditolak';
        }

        return matchSearch && matchStatus;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredData.length / limit);
    const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

    const getStatusLabel = (status: string) => {
        if (status.includes('pending')) return "Menunggu";
        if (status === 'approved' || status === 'disetujui') return "Disetujui";
        if (status === 'rejected' || status === 'ditolak') return "Ditolak";
        return status;
    };

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "dd MMM yyyy", { locale: idLocale });
        } catch (e) {
            return dateString;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans p-4 md:p-8">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Daftar Pengajuan Pindah PKL - Pembimbing
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Validasi dan kelola permohonan kepindahan tempat PKL siswa bimbingan Anda.
                    </p>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

                    {/* Toolbar */}
                    <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative w-full md:w-1/3">
                            <input
                                type="text"
                                placeholder="Cari siswa, industri..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                            <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        <div className="flex gap-3">
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setPage(1);
                                }}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer bg-white"
                            >
                                <option>Semua Status</option>
                                <option>Menunggu</option>
                                <option>Disetujui</option>
                                <option>Ditolak</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-600 font-medium uppercase text-xs tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Tanggal</th>
                                    <th className="px-6 py-4">Siswa</th>
                                    <th className="px-6 py-4">Perpindahan</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-12">
                                            <div className="flex flex-col items-center justify-center text-gray-500">
                                                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                                                <p>Memuat data pengajuan...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : paginatedData.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-12 text-gray-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <FileText className="h-10 w-10 text-gray-300 mb-2" />
                                                <p>Tidak ada data pengajuan ditemukan.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedData.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                {formatDate(item.created_at)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-gray-900">{item.siswa_nama}</p>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2 text-red-600 text-xs line-through opacity-70">
                                                        <span>{item.industri_lama_nama}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-green-700 font-medium">
                                                        <span>➜ {item.industri_baru_nama}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                {getStatusLabel(item.status) === "Menunggu" && (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 border border-yellow-200">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                                                        Menunggu
                                                    </span>
                                                )}
                                                {getStatusLabel(item.status) === "Disetujui" && (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 border border-green-200">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                        Disetujui
                                                    </span>
                                                )}
                                                {getStatusLabel(item.status) === "Ditolak" && (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 border border-red-200">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                                        Ditolak
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                {getStatusLabel(item.status) === "Menunggu" ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => openActionModal(item)}
                                                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm transition-all hover:scale-105"
                                                        >
                                                            <CheckCircle className="h-3 w-3" />
                                                            Proses
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-400 font-medium italic">Selesai</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="border-t border-gray-100 p-4 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-xs text-gray-500">
                            Menampilkan <span className="font-medium">{paginatedData.length > 0 ? (page - 1) * limit + 1 : 0}</span> - <span className="font-medium">{Math.min(page * limit, filteredData.length)}</span> dari <span className="font-medium">{filteredData.length}</span>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-3 py-1.5 rounded-md border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Sebelumnya
                            </button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                    <button
                                        key={pageNum}
                                        onClick={() => setPage(pageNum)}
                                        className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-medium transition-colors ${page === pageNum
                                            ? "bg-gray-900 text-white"
                                            : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages || totalPages === 0}
                                className="px-3 py-1.5 rounded-md border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Selanjutnya
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Approval Modal */}
            {isModalOpen && selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Proses Pengajuan</h3>
                                    <p className="text-sm text-gray-500 mt-1">Tentukan status pengajuan pindah PKL.</p>
                                </div>
                                <button
                                    onClick={closeActionModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <XCircle className="h-6 w-6" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Nama Siswa:</span>
                                    <span className="font-semibold text-gray-900">{selectedItem.siswa_nama}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Dari:</span>
                                    <span className="text-gray-900">{selectedItem.industri_lama_nama}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Ke:</span>
                                    <span className="text-gray-900 font-medium text-primary">{selectedItem.industri_baru_nama}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4" />
                                    Catatan (Opsional)
                                </label>
                                <textarea
                                    className="w-full min-h-[100px] p-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all"
                                    placeholder="Tuliskan alasan persetujuan atau penolakan..."
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                ></textarea>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                            <button
                                onClick={() => handleAction("rejected")}
                                disabled={isSubmitting}
                                className="px-4 py-2 rounded-lg bg-white border border-red-200 text-red-600 font-medium hover:bg-red-50 hover:border-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                                Tolak
                            </button>
                            <button
                                onClick={() => handleAction("approved")}
                                disabled={isSubmitting}
                                className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 shadow-sm transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                                Setujui
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}