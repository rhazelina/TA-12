"use client";

import React, { useEffect, useState } from 'react';
import { Search, Plus, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { getGuru } from '@/api/admin/guru';
import { Guru } from '@/types/api';

export default function DataGuruPembimbing() {
    const [allGurus, setAllGurus] = useState<Guru[]>([]);
    const [filteredGurus, setFilteredGurus] = useState<Guru[]>([]);
    const [paginatedGurus, setPaginatedGurus] = useState<Guru[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchGurus();
    }, []);

    useEffect(() => {
        // Filter logic (runs when allGurus changes)
        // Note: Search is now handled during fetch or we can do it here if we want strictly client side search on the fetched set.
        // But since we want to "not burden server", we likely want to start the fetch with the search term ONLY when requested.
        // However, if we fetched *everything* (limit 1000), client side search is better. 
        // Let's assume the "burden" comment implies we ARE hitting the server.
        // So we will pass searchTerm to the API.

        let result = allGurus.filter(guru => guru.is_pembimbing);
        setFilteredGurus(result);
        setCurrentPage(1);
    }, [allGurus]);

    useEffect(() => {
        // Pagination logic
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setPaginatedGurus(filteredGurus.slice(startIndex, endIndex));
    }, [filteredGurus, currentPage]);

    const fetchGurus = async () => {
        setLoading(true);
        try {
            // Using a large limit to allow client-side filtering of 'is_pembimbing'
            // Passing searchTerm to server to reduce data load if possible, or we could filter client side.
            // Given the requirement "filter is_pembimbing client side", fetching more is safer.
            const response = await getGuru(searchTerm, 1, 1000);
            if (response && response.success) {
                setAllGurus(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch gurus:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        fetchGurus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const totalPages = Math.ceil(filteredGurus.length / itemsPerPage);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Helper to generate random pastel color based on name (consistent)
    const stringToColor = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
        return '#' + '00000'.substring(0, 6 - c.length) + c;
    };

    const getInitials = (name: string) => {
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <div className="flex-1 bg-white min-h-screen text-[#333]">
            {/* CONTENT CARD */}
            <section className="mx-10 mb-10 border border-[#e0e0e0] rounded-xl p-6 bg-white flex flex-col">

                {/* TOOLBAR */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-base font-semibold text-[#333]">Data Guru Pembimbing PKL</h3>
                    <div className="flex gap-3">
                        <div className="relative flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaa]" size={16} />
                                <input
                                    type="text"
                                    placeholder="Cari Pembimbing..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="pl-9 pr-3 py-2 border border-[#e0e0e0] rounded-md w-[240px] text-[13px] bg-white outline-none focus:border-[#641E20] transition-colors"
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                className="bg-[#641E20] text-white border-none py-2 px-4 rounded-md cursor-pointer text-[13px] hover:opacity-90 transition-opacity"
                            >
                                Cari
                            </button>
                        </div>
                    </div>
                </div>

                {/* MENTOR LIST */}
                <div className="flex flex-col min-h-[300px]">
                    {loading ? (
                        <div className="flex items-center justify-center h-full flex-1">
                            <p className="text-sm text-gray-500">Memuat data...</p>
                        </div>
                    ) : paginatedGurus.length > 0 ? (
                        paginatedGurus.map((guru) => (
                            <div key={guru.id} className="flex justify-between items-center py-4 border-b border-[#f0f0f0] last:border-0 hover:bg-gray-50 transition-colors px-2">
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-[42px] h-[42px] rounded-full flex items-center justify-center text-white font-semibold text-sm"
                                        style={{ backgroundColor: stringToColor(guru.nama) }} // Simple color gen
                                    >
                                        {getInitials(guru.nama)}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-[#333]">{guru.nama}</h4>
                                        <p className="text-xs text-[#717171]">{guru.nip || 'NIP tidak tersedia'}</p>
                                    </div>
                                </div>
                                {/* <button className="bg-[#EBF2FF] text-[#3267E3] border-none py-1.5 px-4.5 rounded-md text-xs font-medium cursor-pointer hover:bg-[#dce9ff] transition-colors">
                                    Lihat
                                </button> */}
                            </div>
                        ))
                    ) : (
                        <div className="flex items-center justify-center h-full flex-1">
                            <p className="text-sm text-gray-500">Tidak ada data pembimbing.</p>
                        </div>
                    )}
                </div>

                {/* FOOTER */}
                <div className="flex justify-between items-center mt-8">
                    <div className="text-xs text-[#888]">
                        <p>Menampilkan {paginatedGurus.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-{Math.min(currentPage * itemsPerPage, filteredGurus.length)} dari {filteredGurus.length} laman guru pembimbing</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="border-none bg-transparent"
                        >
                            <ChevronLeft size={16} className={`transition-colors ${currentPage === 1 ? 'text-[#eee] cursor-not-allowed' : 'text-[#ccc] cursor-pointer hover:text-[#333]'}`} />
                        </button>

                        <div className="bg-[#641E20] text-white w-7 h-7 flex items-center justify-center rounded text-xs font-medium">
                            {currentPage}
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="border-none bg-transparent"
                        >
                            <ChevronRight size={16} className={`transition-colors ${currentPage === totalPages || totalPages === 0 ? 'text-[#eee] cursor-not-allowed' : 'text-[#333] cursor-pointer hover:text-[#641E20]'}`} />
                        </button>
                    </div>
                </div>

            </section>
        </div>
    );
}

