"use client";

import React from 'react';
import { useParams } from "next/navigation";

export default function SiswaDetailWaliKelas() {
    const { id } = useParams<{ id: string }>();

    // Mock logic to simulate different states based on ID (optional, but good for demo)
    // For now, we render the "Sudah PKL" view as it's the superset, but we can easily toggle styling.
    const isPKL = true; // Set to false to see the other style if we implemented toggling

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12 flex justify-center">
            <div className="w-full flex flex-col md:flex-row gap-6">

                {/* Card Data Siswa (Kiri) */}
                <div className="flex-[2] bg-white border border-gray-200 rounded-xl p-6 shadow-sm h-fit">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Data Siswa</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Nama Lengkap Siswa <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                readOnly
                                value="Ahmad Fauzi Rahman"
                                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                NISN <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                readOnly
                                value="0051234567"
                                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                No Telp. <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                readOnly
                                value="081234567890"
                                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                readOnly
                                value="ahmad.fauzi@student.smk.sch.id"
                                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Alamat <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                readOnly
                                rows={3}
                                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white resize-none"
                                value="Jl. Merdeka No. 123, RT 05/RW 03, Kelurahan Sukamaju, Kecamatan Bandung Timur, Kota Bandung, Jawa Barat 40123"
                            />
                        </div>
                    </div>
                </div>

                {/* Card Status PKL (Kanan) */}
                <div className="flex-[1.2] bg-[#eef7ee] border border-[#c8e6c9] rounded-xl p-6 h-fit shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Status PKL</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Status <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                readOnly
                                value="Sudah PKL"
                                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Nama Industri <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                readOnly
                                value="UPT. Pelatihan Koperasi"
                                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Pembimbing <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                readOnly
                                value="Wisnu Jati Pratama S. Pd"
                                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white"
                            />
                        </div>

                        {/* Box Informasi Status PKL */}
                        <div className="mt-6 p-4 bg-white border border-gray-100 rounded-lg flex gap-3 shadow-sm">
                            <div className="w-5 h-5 bg-[#2e7d32] text-white rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">
                                i
                            </div>
                            <div className="text-xs leading-relaxed text-gray-600">
                                <p className="font-bold text-[#2e7d32] mb-1 text-[13px]">Informasi Status PKL</p>
                                Siswa ini telah terdaftar dalam program PKL dan sedang menjalani magang di industri yang telah ditentukan.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
