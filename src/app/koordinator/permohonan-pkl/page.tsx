"use client";

import React, { useState } from 'react';
import { Printer, RotateCcw, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface StudentData {
    id: number;
    nama: string;
    nis: string;
    kelas: string;
    jurusan: string;
}

export default function PermohonanPkl() {
    // School & Letter Data
    const [letterData, setLetterData] = useState({
        industri: "PT. Teknologi Maju Indonesia",
        sekolah: "SMK Negeri 2 Singosari",
        kepsek: "Sumijah S.Pd, M.Si",
        nomor_surat: "001/SMK-N2/PKL/I/2026",
        tanggal_surat: "13 Januari 2026",
        periode: "1 November - 31 Desember 2026"
    });

    // Student List Data
    const [students, setStudents] = useState<StudentData[]>([
        { id: 1, nama: "Ahmad Rizki Pratama", nis: "8329849289482", kelas: "XII RPL 1", jurusan: "Rekayasa Perangkat Lunak" }
    ]);

    // Temp Form for New Student
    const [newStudent, setNewStudent] = useState<Omit<StudentData, 'id'>>({
        nama: "",
        nis: "",
        kelas: "",
        jurusan: ""
    });

    const handleLetterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLetterData(prev => ({ ...prev, [name]: value }));
    };

    const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewStudent(prev => ({ ...prev, [name]: value }));
    };

    const addStudent = () => {
        if (!newStudent.nama || !newStudent.nis) return;
        setStudents(prev => [
            ...prev,
            { ...newStudent, id: Date.now() }
        ]);
        setNewStudent({ nama: "", nis: "", kelas: "", jurusan: "" });
    };

    const removeStudent = (id: number) => {
        setStudents(prev => prev.filter(s => s.id !== id));
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex flex-col lg:flex-row gap-[30px] p-[30px] bg-white min-h-screen text-[#333] font-['Poppins']">
            {/* FORM SECTION - Hidden when printing */}
            <div className="w-full lg:w-[450px] bg-[#f0f0f0] p-[25px] rounded-[20px] shadow-sm print:hidden h-fit overflow-y-auto max-h-screen">
                <h2 className="text-[18px] mb-[15px] border-b border-[#ccc] pb-[10px] font-bold">
                    Konfigurasi Surat
                </h2>

                <div className="space-y-4">
                    {/* Letter Info */}
                    <div>
                        <Label className="text-[11px] font-bold mb-1 text-[#555]">Industri Tujuan *</Label>
                        <Input name="industri" value={letterData.industri} onChange={handleLetterChange} className="bg-white" />
                    </div>
                    <div>
                        <Label className="text-[11px] font-bold mb-1 text-[#555]">Nomor Surat *</Label>
                        <Input name="nomor_surat" value={letterData.nomor_surat} onChange={handleLetterChange} className="bg-white" />
                    </div>
                    <div>
                        <Label className="text-[11px] font-bold mb-1 text-[#555]">Periode PKL *</Label>
                        <Input name="periode" value={letterData.periode} onChange={handleLetterChange} className="bg-white" />
                    </div>

                    <h3 className="text-[15px] mt-[20px] mb-[10px] font-semibold flex justify-between items-center">
                        Daftar Siswa
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">{students.length} Siswa</span>
                    </h3>

                    {/* Add Student Form */}
                    <div className="bg-white p-3 rounded-lg border border-gray-200 space-y-2">
                        <Input placeholder="Nama Siswa" name="nama" value={newStudent.nama} onChange={handleStudentChange} className="text-xs py-1 h-8" />
                        <div className="flex gap-2">
                            <Input placeholder="NIS" name="nis" value={newStudent.nis} onChange={handleStudentChange} className="text-xs py-1 h-8 w-1/3" />
                            <Input placeholder="Kelas" name="kelas" value={newStudent.kelas} onChange={handleStudentChange} className="text-xs py-1 h-8 w-1/3" />
                            <Input placeholder="Jurusan" name="jurusan" value={newStudent.jurusan} onChange={handleStudentChange} className="text-xs py-1 h-8 w-1/3" />
                        </div>
                        <Button size="sm" onClick={addStudent} className="w-full bg-[#641E20] hover:bg-[#4a1618] h-8 text-xs">
                            <Plus className="w-3 h-3 mr-1" /> Tambah Siswa
                        </Button>
                    </div>

                    {/* Student List */}
                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                        {students.map((student) => (
                            <div key={student.id} className="flex justify-between items-center bg-white p-2 rounded border text-xs">
                                <div>
                                    <p className="font-bold">{student.nama}</p>
                                    <p className="text-gray-500">{student.kelas}</p>
                                </div>
                                <button onClick={() => removeStudent(student.id)} className="text-red-500 hover:text-red-700">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <h3 className="text-[15px] mt-[20px] mb-[10px] font-semibold">Data Sekolah</h3>
                    <div>
                        <Label className="text-[11px] font-bold mb-1 text-[#555]">Nama Sekolah</Label>
                        <Input name="sekolah" value={letterData.sekolah} onChange={handleLetterChange} className="bg-white" />
                    </div>
                    <div>
                        <Label className="text-[11px] font-bold mb-1 text-[#555]">Kepala Sekolah</Label>
                        <Input name="kepsek" value={letterData.kepsek} onChange={handleLetterChange} className="bg-white" />
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
                        onClick={() => setStudents([])}
                        className="flex items-center gap-[10px] bg-transparent border border-[#641E20] text-[#641E20] px-[20px] py-[12px] rounded-lg cursor-pointer font-semibold text-[13px] hover:bg-[#641E20] hover:text-white transition-colors"
                    >
                        <RotateCcw size={16} /> Reset
                    </button>
                </div>
            </div>

            {/* PREVIEW SECTION */}
            <div className="flex-1 bg-white p-[50px] shadow-lg text-black text-[12px] leading-[1.5] border border-[#eee] print:shadow-none print:border-none print:w-full print:p-0 print:absolute print:top-0 print:left-0 min-h-[29.7cm]">

                {/* Letter Kop */}
                <div className="flex items-center border-b-[2px] border-black pb-[15px] mb-[20px] text-center">
                    <div className="w-[60px] h-[60px] bg-[#eee] rounded-full flex items-center justify-center text-[8px] text-center flex-shrink-0">
                        Logo
                    </div>
                    <div className="flex-1">
                        <h2 className="m-0 text-[18px] uppercase font-bold tracking-wide">{letterData.sekolah}</h2>
                        <p className="text-[10px] m-0 text-black">
                            JL. PERUSAHAAN NO. 20 TUNJUNGTIRTO-SINGOSARI<br />
                            Kab. Malang, Jawa Timur
                        </p>
                    </div>
                </div>

                <div className="text-right mb-[20px]">
                    {letterData.tanggal_surat}
                </div>

                <div className="mb-[25px]">
                    <p>Kepada Yth.</p>
                    <b className="block">{letterData.industri}</b>
                    <p>Di tempat</p>
                </div>

                <div className="text-center my-[25px]">
                    <b className="underline block">SURAT PERMOHONAN</b>
                    <span className="text-[11px]">Nomor: {letterData.nomor_surat}</span>
                </div>

                <div className="text-justify">
                    <p className="mb-4">Dengan hormat,</p>
                    <p className="mb-4">
                        Sehubungan dengan program Praktik Kerja Lapangan (PKL), kami mengajukan permohonan untuk siswa-siswa berikut:
                    </p>

                    <table className="w-full mb-[20px] border-collapse border border-black">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-black px-2 py-1 text-center w-[40px]">No</th>
                                <th className="border border-black px-2 py-1 text-left">Nama Siswa</th>
                                <th className="border border-black px-2 py-1 text-center">NIS</th>
                                <th className="border border-black px-2 py-1 text-center">Kelas</th>
                                <th className="border border-black px-2 py-1 text-center">Jurusan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.length > 0 ? students.map((s, idx) => (
                                <tr key={s.id}>
                                    <td className="border border-black px-2 py-1 text-center">{idx + 1}</td>
                                    <td className="border border-black px-2 py-1">{s.nama}</td>
                                    <td className="border border-black px-2 py-1 text-center">{s.nis}</td>
                                    <td className="border border-black px-2 py-1 text-center">{s.kelas}</td>
                                    <td className="border border-black px-2 py-1 text-center">{s.jurusan}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan={5} className="border border-black text-center py-4">Belum ada siswa</td></tr>
                            )}
                        </tbody>
                    </table>

                    <p className="mb-2">
                        Adapun periode pelaksanaan PKL direncanakan pada tanggal <b>{letterData.periode}</b>.
                    </p>

                    <p>Demikian surat ini kami sampaikan, atas perhatian dan kerjasamanya kami ucapkan terima kasih.</p>
                </div>

                <div className="mt-[50px] float-right text-left w-[200px]">
                    <p>Kepala Sekolah,</p>
                    <br /><br /><br />
                    <b className="block border-b border-black inline-block min-w-[150px] pb-1">{letterData.kepsek}</b>
                    <span className="block text-[11px] mt-1">NIP. 196505121990031004</span>
                </div>
                <div className="clear-both"></div>

            </div>
        </div>
    );
}
