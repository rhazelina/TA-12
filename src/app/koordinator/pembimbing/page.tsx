"use client";

import React from 'react';
import { Search, Plus, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DataGuruPembimbing() {
    const mentors = [
        { initial: 'LD', name: 'Lestari Dewi, S.Pd.', company: 'PT. Cipta Karya Teknologi', color: '#AED6F1' },
        { initial: 'AP', name: 'Andi Pratama, Drs.', company: 'CV. Mitra Sejahtera', color: '#ABEBC6' },
        { initial: 'RH', name: 'Rudi Hartono, M.Pd.', company: 'PT. Indo Kreatif Media', color: '#D7BDE2' },
        { initial: 'NA', name: 'Nur Aini, S.Kom.', company: 'CV. Sentosa Mandiri', color: '#EDBB99' },
        { initial: 'DS', name: 'Dimas Saputra, M.T.', company: 'PT. Nusantara Digital', color: '#A2D9CE' },
    ];

    return (
        <div className="flex-1 bg-white min-h-screen text-[#333]">
            {/* CONTENT CARD */}
            <section className="mx-10 mb-10 border border-[#e0e0e0] rounded-xl p-6 bg-white flex flex-col">

                {/* TOOLBAR */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-base font-semibold text-[#333]">Data Guru Pembimbing PKL</h3>
                    <div className="flex gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaa]" size={16} />
                            <input
                                type="text"
                                placeholder="Cari Pembimbing..."
                                className="pl-9 pr-3 py-2 border border-[#e0e0e0] rounded-md w-[240px] text-[13px] bg-white outline-none focus:border-[#641E20] transition-colors"
                            />
                        </div>
                        <button className="bg-[#2D3E50] text-white border-none py-2 px-4 rounded-md cursor-pointer text-[13px] flex items-center gap-2 hover:opacity-90 transition-opacity">
                            <UserPlus size={16} /> Tambah Pembimbing
                        </button>
                    </div>
                </div>

                {/* MENTOR LIST */}
                <div className="flex flex-col">
                    {mentors.map((mentor, index) => (
                        <div key={index} className="flex justify-between items-center py-4 border-b border-[#f0f0f0] last:border-0 hover:bg-gray-50 transition-colors px-2">
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-[42px] h-[42px] rounded-full flex items-center justify-center text-[#333] font-semibold text-sm"
                                    style={{ backgroundColor: mentor.color }}
                                >
                                    {mentor.initial}
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-[#333]">{mentor.name}</h4>
                                    <p className="text-xs text-[#717171]">{mentor.company}</p>
                                </div>
                            </div>
                            <button className="bg-[#EBF2FF] text-[#3267E3] border-none py-1.5 px-4.5 rounded-md text-xs font-medium cursor-pointer hover:bg-[#dce9ff] transition-colors">
                                Lihat
                            </button>
                        </div>
                    ))}
                </div>

                {/* FOOTER */}
                <div className="flex justify-between items-center mt-8">
                    <div className="text-xs text-[#888]">
                        <p>Menampilkan 1-{mentors.length} dari 7 laman guru pembimbing</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <ChevronLeft size={16} className="text-[#ccc] cursor-pointer hover:text-[#333] transition-colors" />
                        <div className="bg-[#641E20] text-white w-7 h-7 flex items-center justify-center rounded text-xs font-medium">01</div>
                        <ChevronRight size={16} className="text-[#333] cursor-pointer hover:text-[#641E20] transition-colors" />
                    </div>
                </div>

            </section>
        </div>
    );
}
