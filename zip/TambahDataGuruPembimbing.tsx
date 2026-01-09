"use client";

import React from 'react';
import { ChevronLeft } from 'lucide-react';

export default function TambahDataGuruPembimbing() {
    return (
        <div className="min-h-screen bg-[#F8F9FA] text-[#333] font-['Poppins'] p-8">

            {/* HEADER */}
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-2xl font-bold text-[#2D2D2D]">Magang<span className="font-normal text-[#888]">Hub</span></h1>
                    <p className="text-xs text-[#888]">Ringkasan singkat mengenai sistem manajemen PKL Anda.</p>
                </div>
                {/* Header icons could go here if needed, but assuming layout handles it */}
            </header>

            {/* FORM CARD */}
            <section className="bg-white rounded-xl p-10 shadow-sm max-w-[1000px] mx-auto">
                <button
                    onClick={() => window.history.back()}
                    className="bg-[#E8E8E8] border-none px-4 py-2 rounded-full text-sm font-semibold cursor-pointer flex items-center gap-2 mb-6 hover:bg-[#d0d0d0] transition-colors"
                >
                    <ChevronLeft size={16} /> Kembali
                </button>

                <h2 className="text-base font-semibold border-b border-[#F0F0F0] pb-4 mb-8">Detail Guru Pembimbing PKL</h2>

                <div className="flex justify-center mb-9">
                    <img
                        src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                        alt="Guru Pembimbing"
                        className="w-[130px] h-[130px] rounded-full object-cover border-[5px] border-[#F8F8F8]"
                    />
                </div>

                <form className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-[13px] font-semibold text-[#444]">Nama <span className="text-[#E57373]">*</span></label>
                        <input
                            type="text"
                            placeholder="Isi Nama Pembimbing"
                            className="p-3 px-4 border border-[#E0E0E0] rounded-lg text-[13px] text-[#666] outline-none focus:border-[#641E20] transition-colors"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-semibold text-[#444]">No. Telp <span className="text-[#E57373]">*</span></label>
                            <input
                                type="text"
                                placeholder="Masukkan nomor telepon Pembimbing"
                                className="p-3 px-4 border border-[#E0E0E0] rounded-lg text-[13px] text-[#666] outline-none focus:border-[#641E20] transition-colors"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-semibold text-[#444]">NIP <span className="text-[#E57373]">*</span></label>
                            <input
                                type="text"
                                placeholder="Masukan NIP Guru Pembimbing"
                                className="p-3 px-4 border border-[#E0E0E0] rounded-lg text-[13px] text-[#666] outline-none focus:border-[#641E20] transition-colors"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[13px] font-semibold text-[#444]">Industri <span className="text-[#E57373]">*</span></label>
                        <select className="p-3 px-4 border border-[#E0E0E0] rounded-lg text-[13px] text-[#666] outline-none focus:border-[#641E20] transition-colors bg-white">
                            <option value="" disabled selected>Pilih Industri</option>
                            <option value="1">Teknologi Informasi</option>
                            <option value="2">Multimedia</option>
                            <option value="3">Rekayasa Perangkat Lunak</option>
                        </select>
                    </div>

                    <div className="flex flex-col md:flex-row justify-center gap-4 mt-10">
                        <button
                            type="submit"
                            className="px-16 py-3 border-none rounded-full font-semibold text-sm text-white cursor-pointer bg-[#00C897] hover:opacity-90 hover:-translate-y-[1px] transition-all"
                        >
                            Tambahkan
                        </button>
                        <button
                            type="button"
                            className="px-16 py-3 border-none rounded-full font-semibold text-sm text-white cursor-pointer bg-[#E57373] hover:opacity-90 hover:-translate-y-[1px] transition-all"
                        >
                            Batal
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}
