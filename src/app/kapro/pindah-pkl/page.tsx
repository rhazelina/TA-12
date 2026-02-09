"use client";

import { useState } from "react";

// --- Types ---
type TransferStatus = "Menunggu" | "Disetujui" | "Ditolak";

interface TransferRequestDto {
    id: number;
    siswa_nama: string;
    siswa_nisn: string;
    jurusan: string;
    tempat_lama: string;
    durasi_lama: string; // e.g. "3 Bulan"
    tempat_baru: string;
    durasi_sisa: string; // e.g. "3 Bulan"
    alasan: string;
    status: TransferStatus;
    file_surat: string;
}

// --- Mock Data ---
const MOCK_DATA: TransferRequestDto[] = [
    {
        id: 1,
        siswa_nama: "Siti Nurhaliza",
        siswa_nisn: "12345678",
        jurusan: "Teknik Informatika",
        tempat_lama: "CV. Digital Solusi",
        durasi_lama: "2 Bulan 27 hari",
        tempat_baru: "PT. Teknologi Maju",
        durasi_sisa: "4 Bulan 3 hari",
        alasan: "Jarak terlalu jauh dari rumah",
        status: "Menunggu",
        file_surat: "surat_penerimaan_siti.pdf"
    },
    {
        id: 2,
        siswa_nama: "Ahmad Fauzi",
        siswa_nisn: "12345679",
        jurusan: "Teknik Mesin",
        tempat_lama: "PT. Otomotif Prima",
        durasi_lama: "1 Bulan 10 hari",
        tempat_baru: "PT. Manufaktur Indo",
        durasi_sisa: "5 Bulan 20 hari",
        alasan: "Bidang lebih sesuai minat",
        status: "Disetujui",
        file_surat: "surat_penerimaan_ahmad.pdf"
    },
    {
        id: 3,
        siswa_nama: "Rizki Pratama",
        siswa_nisn: "12345680",
        jurusan: "Teknik Elektro",
        tempat_lama: "CV. Elektronik Jaya",
        durasi_lama: "3 Bulan",
        tempat_baru: "PT. Listrik Negara",
        durasi_sisa: "3 Bulan",
        alasan: "Masalah transportasi",
        status: "Menunggu",
        file_surat: "surat_penerimaan_rizki.pdf"
    },
    {
        id: 4,
        siswa_nama: "Dewi Anggraini",
        siswa_nisn: "12345681",
        jurusan: "Akuntansi",
        tempat_lama: "Koperasi Unit Desa",
        durasi_lama: "1.5 Bulan",
        tempat_baru: "Bank Rakyat Cabang",
        durasi_sisa: "4.5 Bulan",
        alasan: "Ingin pengalaman perbankan",
        status: "Ditolak",
        file_surat: "surat_penerimaan_dewi.pdf"
    },
    {
        id: 5,
        siswa_nama: "Budi Santoso",
        siswa_nisn: "12345682",
        jurusan: "Multimedia",
        tempat_lama: "Studio Foto Indah",
        durasi_lama: "2 Bulan",
        tempat_baru: "Creative Agency One",
        durasi_sisa: "4 Bulan",
        alasan: "Mencari mentor yang lebih aktif",
        status: "Menunggu",
        file_surat: "surat_penerimaan_budi.pdf"
    },
    {
        id: 6,
        siswa_nama: "Citra Kirana",
        siswa_nisn: "12345683",
        jurusan: "TKJ",
        tempat_lama: "PT. Jaringan Luas",
        durasi_lama: "1 Bulan",
        tempat_baru: "PT. Solusi Network",
        durasi_sisa: "5 Bulan",
        alasan: "Kompetensi tidak sesuai",
        status: "Menunggu",
        file_surat: "surat_penerimaan_citra.pdf"
    }
];

export default function DaftarPengajuanPindahPKL() {
    const [data, setData] = useState<TransferRequestDto[]>(MOCK_DATA);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("Semua Status");
    const [page, setPage] = useState(1);
    const limit = 5;

    // Filter Logic
    const filteredData = data.filter((item) => {
        const matchSearch =
            item.siswa_nama.toLowerCase().includes(search.toLowerCase()) ||
            item.jurusan.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "Semua Status" || item.status === statusFilter;
        return matchSearch && matchStatus;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredData.length / limit);
    const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

    // Stats Logic
    const stats = {
        total: data.length,
        menunggu: data.filter((i) => i.status === "Menunggu").length,
        disetujui: data.filter((i) => i.status === "Disetujui").length,
        ditolak: data.filter((i) => i.status === "Ditolak").length,
    };

    // Action Handlers
    const handleAction = (id: number, newStatus: TransferStatus) => {
        setData((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, status: newStatus } : item
            )
        );
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
                        placeholder="Cari siswa..."
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
                                <th className="px-6 py-4">Nama</th>
                                <th className="px-6 py-4">NISN</th>
                                <th className="px-6 py-4">Tempat Baru</th>
                                <th className="px-6 py-4">Tempat Lama</th>
                                <th className="px-6 py-4">Alasan</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-gray-500">
                                        Tidak ada data pengajuan.
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((item) => (
                                    <tr key={item.id} className="border-t">
                                        <td className="px-6 py-4">
                                            <p className="font-semibold">{item.siswa_nama}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-semibold">{item.siswa_nisn}</p>
                                        </td>

                                        <td className="px-6 py-4">
                                            <p className="font-semibold">{item.tempat_baru}</p>
                                            <p className="text-xs text-gray-500">
                                                Sisa: {item.durasi_sisa}
                                            </p>
                                        </td>

                                        <td className="px-6 py-4">
                                            <p className="font-semibold">{item.tempat_lama}</p>
                                            <p className="text-xs text-gray-500">
                                                Sudah: {item.durasi_lama}
                                            </p>
                                        </td>

                                        <td className="px-6 py-4">
                                            {item.alasan}
                                        </td>

                                        <td className="px-6 py-4">
                                            {item.status === "Menunggu" && (
                                                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                                                    Menunggu
                                                </span>
                                            )}
                                            {item.status === "Disetujui" && (
                                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                                    Disetujui
                                                </span>
                                            )}
                                            {item.status === "Ditolak" && (
                                                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                                                    Ditolak
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            {item.status === "Menunggu" ? (
                                                <div className="flex flex-col items-end gap-3">
                                                    <a
                                                        href="#"
                                                        className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                                                    >
                                                        <span className="rounded bg-red-100 px-2 py-1 text-red-600">
                                                            📄
                                                        </span>
                                                        {item.file_surat}
                                                    </a>

                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleAction(item.id, "Disetujui")}
                                                            className="rounded-md bg-green-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-green-700"
                                                        >
                                                            Setujui
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(item.id, "Ditolak")}
                                                            className="rounded-md bg-red-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-700"
                                                        >
                                                            Tolak
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
                                        ? "bg-[#641E20] text-white"
                                        : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-300"
                                        }`}
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
