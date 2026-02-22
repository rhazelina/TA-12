'use client'

import { ListPermohonanPKL } from "@/api/kapro/indext";
import { Spinner } from "@/components/ui/spinner";
import { DaftarPermohonanPKL } from "@/types/api";
import Link from "next/link";
import { useEffect, useState } from "react";

const DashboardAdminPKL = () => {
    const [dataPengajuan, setDataPengajuan] = useState<DaftarPermohonanPKL[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await ListPermohonanPKL("", 3);
                if (!response) {
                    setDataPengajuan([]);
                } else {
                    setDataPengajuan(response.data);
                }
            } catch (error) {
                setDataPengajuan([]);
                console.error("Error fetching pengajuan PKL:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return <Spinner className="absolute top-1/2 left-1/2 w-7 h-7" />
    }

    return (
        <div className="min-h-screen bg-[#f4f4f4] p-10 font-inter">

            {/* ===== TOP SUMMARY ===== */}
            <div className="grid grid-cols-4 gap-6 mb-9">

                <div className="bg-white rounded-xl px-6 py-5 flex justify-between items-center shadow-[0_0_0_1px_#e5e5e5]">
                    <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">
                            Total Siswa PKL
                        </h4>
                        <div className="text-4xl font-bold text-gray-900">156</div>
                    </div>
                    <div className="w-[45px] h-[45px] rounded-lg bg-indigo-100 flex items-center justify-center">
                        👥
                    </div>
                </div>

                <div className="bg-white rounded-xl px-6 py-5 flex justify-between items-center shadow-[0_0_0_1px_#e5e5e5]">
                    <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">
                            Pengajuan PKL Disetujui
                        </h4>
                        <div className="text-4xl font-bold text-gray-900">142</div>
                    </div>
                    <div className="w-[45px] h-[45px] rounded-lg bg-green-100 flex items-center justify-center">
                        ✔
                    </div>
                </div>

                <div className="bg-white rounded-xl px-6 py-5 flex justify-between items-center shadow-[0_0_0_1px_#e5e5e5]">
                    <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">
                            Menunggu Persetujuan PKL dan Izin
                        </h4>
                        <div className="text-4xl font-bold text-gray-900">8</div>
                    </div>
                    <div className="w-[45px] h-[45px] rounded-lg bg-yellow-100 flex items-center justify-center">
                        ⏳
                    </div>
                </div>

                <div className="bg-white rounded-xl px-6 py-5 flex justify-between items-center shadow-[0_0_0_1px_#e5e5e5]">
                    <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">
                            Tempat Magang
                        </h4>
                        <div className="text-4xl font-bold text-gray-900">45</div>
                    </div>
                    <div className="w-[45px] h-[45px] rounded-lg bg-red-100 flex items-center justify-center">
                        🏢
                    </div>
                </div>

            </div>

            {/* ===== MAIN SECTION ===== */}
            <div className="grid grid-cols-2 gap-8">

                <div className="bg-white rounded-2xl p-6 shadow-[0_0_0_1px_#e5e5e5]">
                    <h3 className="text-base font-semibold mb-4">
                        Pengajuan PKL Terbaru
                    </h3>

                    <div className="h-px bg-gray-200 mb-5"></div>

                    {dataPengajuan.length > 0 ? dataPengajuan.map((item, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 rounded-xl px-5 py-4 mb-4 flex justify-between items-center"
                        >
                            <div>
                                <h5 className="text-sm font-semibold mb-1">
                                    {item.siswa_username}
                                </h5>
                                <span className="text-xs text-gray-500">
                                    {item.kelas_nama} - {item.industri_nama}
                                </span>
                            </div>

                            <div className="flex gap-2">
                                <button className="text-xs px-3 py-1.5 rounded-md bg-green-600 text-white font-medium">
                                    ✓ Setujui
                                </button>
                                <button className="text-xs px-3 py-1.5 rounded-md bg-red-600 text-white font-medium">
                                    ✕ Tolak
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="text-sm text-gray-500 text-center py-4">Tidak ada pengajuan PKL</div>
                    )}

                    {dataPengajuan.length > 0 && (
                        <Link href="/kapro/pengajuan-pkl">
                            <div className="text-center mt-4 text-sm text-red-800 font-medium cursor-pointer">
                                Lihat Semua Pengajuan →
                            </div>
                        </Link>
                    )}
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-[0_0_0_1px_#e5e5e5]">
                    <h3 className="text-base font-semibold mb-4">
                        Pengajuan Pindah PKL Terbaru
                    </h3>

                    <div className="h-px bg-gray-200 mb-5"></div>

                    {[
                        { name: "Maya Sari", desc: "Teknologi Digital → Digital Marketing" },
                        { name: "Riko Permana", desc: "Digital Marketing → Teknologi Digital" },
                        { name: "Lina Kartika", desc: "Digital Marketing → Teknologi Karya" },
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 rounded-xl px-5 py-4 mb-4 flex justify-between items-center"
                        >
                            <div>
                                <h5 className="text-sm font-semibold mb-1">
                                    {item.name}
                                </h5>
                                <span className="text-xs text-gray-500">
                                    {item.desc}
                                </span>
                            </div>

                            <button className="text-xs px-3 py-1.5 rounded-md bg-red-900 text-white font-medium">
                                Lihat Detail
                            </button>
                        </div>
                    ))}

                    <div className="text-center mt-4 text-sm text-red-800 font-medium cursor-pointer">
                        Lihat Semua Pengajuan Pindah PKL →
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DashboardAdminPKL;
