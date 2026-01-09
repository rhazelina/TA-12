"use client";

import React, { useState } from 'react';
import { Printer, RotateCcw } from 'lucide-react';

export default function PermohonanPkl() {
    const defaultData = {
        industri: "PT. Teknologi Maju Indonesia",
        nama: "Ahmad Rizki Pratama",
        nis: "8329849289482",
        kelas: "XII RPL 1",
        jurusan: "Rekayasa Perangkat Lunak",
        sekolah: "SMK Negeri 2 Singosari",
        kepsek: "Sumijah S.Pd, M.Si"
    };

    const [formData, setFormData] = useState(defaultData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleReset = () => {
        setFormData(defaultData);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex flex-col lg:flex-row gap-[30px] p-[30px] bg-white min-h-screen text-[#333] font-['Poppins']">
            {/* FORM SECTION - Hidden when printing */}
            <div className="w-full lg:w-[450px] bg-[#f0f0f0] p-[25px] rounded-[20px] shadow-sm print:hidden h-fit">
                <h2 className="text-[18px] mb-[15px] border-b border-[#ccc] pb-[10px] font-bold">
                    Form Permohonan PKL
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-[11px] font-bold mb-1 text-[#555]">Industri *</label>
                        <input
                            type="text"
                            name="industri"
                            value={formData.industri}
                            onChange={handleChange}
                            className="w-full p-[10px] border border-[#bbb] rounded-lg bg-white text-[13px] outline-none focus:border-[#641E20] transition-colors"
                        />
                    </div>

                    <h3 className="text-[15px] mt-[20px] mb-[10px] font-semibold">Data Siswa</h3>

                    <div>
                        <label className="block text-[11px] font-bold mb-1 text-[#555]">Nama *</label>
                        <input
                            type="text"
                            name="nama"
                            value={formData.nama}
                            onChange={handleChange}
                            className="w-full p-[10px] border border-[#bbb] rounded-lg bg-white text-[13px] outline-none focus:border-[#641E20] transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold mb-1 text-[#555]">NIS *</label>
                        <input
                            type="text"
                            name="nis"
                            value={formData.nis}
                            onChange={handleChange}
                            className="w-full p-[10px] border border-[#bbb] rounded-lg bg-white text-[13px] outline-none focus:border-[#641E20] transition-colors"
                        />
                    </div>

                    <div className="flex gap-[15px]">
                        <div className="flex-1">
                            <label className="block text-[11px] font-bold mb-1 text-[#555]">Kelas *</label>
                            <input
                                type="text"
                                name="kelas"
                                value={formData.kelas}
                                onChange={handleChange}
                                className="w-full p-[10px] border border-[#bbb] rounded-lg bg-white text-[13px] outline-none focus:border-[#641E20] transition-colors"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-[11px] font-bold mb-1 text-[#555]">Jurusan *</label>
                            <input
                                type="text"
                                name="jurusan"
                                value={formData.jurusan}
                                onChange={handleChange}
                                className="w-full p-[10px] border border-[#bbb] rounded-lg bg-white text-[13px] outline-none focus:border-[#641E20] transition-colors"
                            />
                        </div>
                    </div>

                    <h3 className="text-[15px] mt-[20px] mb-[10px] font-semibold">Data Sekolah</h3>

                    <div>
                        <label className="block text-[11px] font-bold mb-1 text-[#555]">Nama Sekolah *</label>
                        <input
                            type="text"
                            name="sekolah"
                            value={formData.sekolah}
                            onChange={handleChange}
                            className="w-full p-[10px] border border-[#bbb] rounded-lg bg-white text-[13px] outline-none focus:border-[#641E20] transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold mb-1 text-[#555]">Nama Kepala Sekolah *</label>
                        <input
                            type="text"
                            name="kepsek"
                            value={formData.kepsek}
                            onChange={handleChange}
                            className="w-full p-[10px] border border-[#bbb] rounded-lg bg-white text-[13px] outline-none focus:border-[#641E20] transition-colors"
                        />
                    </div>
                </div>

                <div className="flex gap-[10px] mt-[20px]">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-[10px] bg-[#641E20] text-white border-none px-[20px] py-[12px] rounded-lg cursor-pointer font-semibold text-[13px] hover:bg-[#4a1618] transition-colors"
                    >
                        <Printer size={16} /> Cetak Surat
                    </button>
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-[10px] bg-transparent border border-[#641E20] text-[#641E20] px-[20px] py-[12px] rounded-lg cursor-pointer font-semibold text-[13px] hover:bg-[#641E20] hover:text-white transition-colors"
                    >
                        <RotateCcw size={16} /> Reset
                    </button>
                </div>
            </div>

            {/* PREVIEW SECTION */}
            <div className="flex-1 bg-white p-[50px] shadow-lg text-black text-[12px] leading-[1.5] border border-[#eee] print:shadow-none print:border-none print:w-full print:p-0 print:absolute print:top-0 print:left-0">

                {/* Letter Kop */}
                <div className="flex items-center border-b-[2px] border-black pb-[15px] mb-[20px] text-center">
                    <div className="w-[60px] h-[60px] bg-[#eee] rounded-full flex items-center justify-center text-[8px] text-center flex-shrink-0">
                        Logo
                    </div>
                    <div className="flex-1">
                        <h2 className="m-0 text-[18px] uppercase font-bold tracking-wide">{formData.sekolah}</h2>
                        <p className="text-[10px] m-0 text-black">
                            JL. PERUSAHAAN NO. 20 TUNJUNGTIRTO-SINGOSARI<br />
                            Kab. Malang, Jawa Timur
                        </p>
                    </div>
                </div>

                <div className="text-right mb-[20px]">
                    Jakarta, 13 Januari 2026
                </div>

                <div className="mb-[25px]">
                    <p>Kepada Yth.</p>
                    <b className="block">{formData.industri}</b>
                    <p>Di tempat</p>
                </div>

                <div className="text-center my-[25px]">
                    <b className="underline block">SURAT PERMOHONAN</b>
                    <span className="text-[11px]">Nomor: 001/SMK-N2/PKL/I/2026</span>
                </div>

                <div className="text-justify">
                    <p className="mb-4">Dengan hormat,</p>
                    <p className="mb-4">
                        Sehubungan dengan program Praktik Kerja Lapangan (PKL), kami mengajukan permohonan untuk siswa berikut:
                    </p>

                    <table className="w-full mb-[15px]">
                        <tbody>
                            <tr>
                                <td className="w-[120px] py-[2px]">Nama</td>
                                <td className="py-[2px]">: {formData.nama}</td>
                            </tr>
                            <tr>
                                <td className="py-[2px]">NIS</td>
                                <td className="py-[2px]">: {formData.nis}</td>
                            </tr>
                            <tr>
                                <td className="py-[2px]">Kelas</td>
                                <td className="py-[2px]">: {formData.kelas}</td>
                            </tr>
                            <tr>
                                <td className="py-[2px]">Jurusan</td>
                                <td className="py-[2px]">: {formData.jurusan}</td>
                            </tr>
                            <tr>
                                <td className="py-[2px]">Periode PKL</td>
                                <td className="py-[2px]">: 1 November - 31 Desember 2026</td>
                            </tr>
                        </tbody>
                    </table>

                    <p>Demikian surat ini kami sampaikan, terima kasih atas kerjasamanya.</p>
                </div>

                <div className="mt-[50px] float-right text-left w-[200px]">
                    <p>Kepala Sekolah,</p>
                    <br /><br /><br />
                    <b className="block border-b border-black inline-block min-w-[150px] pb-1">{formData.kepsek}</b>
                    <span className="block text-[11px] mt-1">NIP. 196505121990031004</span>
                </div>
                <div className="clear-both"></div>

            </div>
        </div>
    );
}
