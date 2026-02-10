"use client";

import { useState, useEffect } from "react";
import { listPindahPklKapro, patchPindahPklKapro } from "@/api/kapro/indext";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
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

export default function DaftarPengajuanPindahPKL() {
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
    const limit = 5;
    const router = useRouter();

    const fetchData = async () => {
        setLoading(true);
        try {
            const res: ApiResponse = await listPindahPklKapro();
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

    const handleApprove = async (id: number) => {
        try {
            await patchPindahPklKapro(id);
            toast.success("Pengajuan berhasil disetujui");
            fetchData(); // Refresh data
        } catch (error) {
            console.error("Failed to approve", error);
            toast.error("Gagal menyetujui pengajuan");
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
        <div className="min-h-screen bg-gray-50 font-sans">
            <div className="mx-auto max-w-7xl p-8">

                {/* Header */}
                <h1 className="text-2xl font-bold text-gray-800">
                    Daftar Pengajuan Pindah PKL
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Kelola permohonan kepindahan tempat PKL siswa.
                </p>

                {/* Statistik */}
                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4">
                    {[
                        { label: "Total Pengajuan", value: stats.total, bg: "bg-blue-100", text: "text-blue-600", icon: "⇄" },
                        { label: "Menunggu Persetujuan", value: stats.menunggu, bg: "bg-yellow-100", text: "text-yellow-600", icon: "⏳" },
                        { label: "Disetujui", value: stats.disetujui, bg: "bg-green-100", text: "text-green-600", icon: "✔" },
                        { label: "Ditolak", value: stats.ditolak, bg: "bg-red-100", text: "text-red-600", icon: "✖" },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="flex items-center justify-between rounded-xl bg-white p-6 shadow"
                        >
                            <div>
                                <p className="text-sm text-gray-500">{item.label}</p>
                                <p className={`text-3xl font-bold ${item.text}`}>
                                    {item.value}
                                </p>
                            </div>
                            <div
                                className={`flex h-10 w-10 items-center justify-center rounded-full ${item.bg} ${item.text}`}
                            >
                                {item.icon}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filter */}
                <div className="mt-6 flex items-center justify-between">
                    <input
                        type="text"
                        placeholder="Cari siswa atau industri..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="w-1/3 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(1);
                        }}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                        <option>Semua Status</option>
                        <option>Menunggu</option>
                        <option>Disetujui</option>
                        <option>Ditolak</option>
                    </select>
                </div>

                {/* Table */}
                <div className="mt-4 overflow-x-auto rounded-xl bg-white shadow">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-left text-gray-600">
                            <tr>
                                <th className="px-6 py-4">Tanggal</th>
                                <th className="px-6 py-4">Nama Siswa</th>
                                <th className="px-6 py-4">Tempat Lama</th>
                                <th className="px-6 py-4">Tempat Baru</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-8">
                                        <div className="flex justify-center items-center">
                                            <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                                            Memuat data...
                                        </div>
                                    </td>
                                </tr>
                            ) : paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-gray-500">
                                        Tidak ada data pengajuan.
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((item) => (
                                    <tr key={item.id} className="border-t">
                                        <td className="px-6 py-4 text-gray-500">
                                            {formatDate(item.created_at)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-semibold">{item.siswa_nama}</p>
                                        </td>

                                        <td className="px-6 py-4">
                                            {item.industri_lama_nama}
                                        </td>

                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-primary">{item.industri_baru_nama}</p>
                                        </td>

                                        <td className="px-6 py-4">
                                            {getStatusLabel(item.status) === "Menunggu" && (
                                                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                                                    Menunggu
                                                </span>
                                            )}
                                            {getStatusLabel(item.status) === "Disetujui" && (
                                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                                    Disetujui
                                                </span>
                                            )}
                                            {getStatusLabel(item.status) === "Ditolak" && (
                                                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                                                    Ditolak
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            {getStatusLabel(item.status) === "Menunggu" ? (
                                                <div className="flex flex-col items-end gap-3">
                                                    <div className="flex gap-2">
                                                        {/* Since we don't have reject endpoint in the new methods, we might only expose Approve or link to detail */}
                                                        {/* Assuming patchPindahPklKapro is for approve/proceed */}
                                                        <button
                                                            onClick={() => handleApprove(item.id)}
                                                            className="rounded-md bg-green-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-green-700"
                                                        >
                                                            Setujui
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 italic">Sudah diproses</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        Menampilkan <span className="font-medium">{paginatedData.length > 0 ? (page - 1) * limit + 1 : 0}</span> hingga <span className="font-medium">{Math.min(page * limit, filteredData.length)}</span> dari <span className="font-medium">{filteredData.length}</span> data
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className={`rounded-lg px-4 py-2 text-sm font-medium ${page === 1
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                                }`}
                        >
                            Sebelumnya
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => setPage(pageNum)}
                                    className={`h-8 w-8 rounded-lg text-sm font-medium ${page === pageNum
                                        ? "bg-primary text-primary-foreground" // using primary color variable if typically available, or hardcoded
                                        : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-300"
                                        }`}
                                    style={page === pageNum ? { backgroundColor: '#641E20', color: 'white' } : {}}
                                >
                                    {pageNum}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages || totalPages === 0}
                            className={`rounded-lg px-4 py-2 text-sm font-medium ${page === totalPages || totalPages === 0
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                                }`}
                        >
                            Selanjutnya
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
