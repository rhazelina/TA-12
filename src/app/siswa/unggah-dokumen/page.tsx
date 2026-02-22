'use client';

import { Upload, FileMinus, Info, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useSiswaPengajuanData } from "@/hooks/useSiswaData";
import { uploadDokumenSiswa } from '@/api/siswa';
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

export default function UploadPage() {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const { dataPengajuan, loading: loadingPengajuan } = useSiswaPengajuanData()
    const router = useRouter()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);

            if (files.length > 3) {
                toast.warning("Hanya boleh mengunggah maksimal 3 file");
                e.target.value = "";
                setSelectedFiles([]);
                return;
            }

            const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
            const maxSize = 5 * 1024 * 1024;
            const validFiles: File[] = [];

            for (const file of files) {
                // Validasi Tipe File
                if (!validTypes.includes(file.type)) {
                    toast.warning(`Format file ${file.name} harus berupa JPEG, PNG, atau WebP`);
                    e.target.value = "";
                    setSelectedFiles([]);
                    return;
                }

                // Validasi Ukuran File (5MB)
                if (file.size > maxSize) {
                    toast.warning(`Ukuran maksimal file ${file.name} adalah 5MB`);
                    e.target.value = "";
                    setSelectedFiles([]);
                    return;
                }

                validFiles.push(file);
            }

            setSelectedFiles(validFiles);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedFiles.length === 0) return;

        const formData = new FormData();
        selectedFiles.forEach(file => {
            formData.append("files", file);
        });

        try {
            const res = await uploadDokumenSiswa(dataPengajuan[0].id, formData);
            toast.success("File berhasil diunggah");
            setSelectedFiles([]);
            router.refresh();
            console.log('Form submitted:', res);
        } catch (error) {
            console.error("Failed to upload document", error);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">

            {/* Main Content */}
            <main className="ml-[70px] flex-1">

                {/* Dashboard Grid */}
                <div className="p-8 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
                    {/* Main Card - Upload Section */}
                    <section className="bg-white border border-gray-200 rounded-xl p-8">
                        <h2 className="text-base font-semibold mb-6">Unggah Dokumen</h2>

                        {loadingPengajuan ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
                                <span className="ml-3 text-gray-600">Memuat data...</span>
                            </div>
                        ) : dataPengajuan && dataPengajuan.length > 0 && dataPengajuan[0].status.toLowerCase() !== "approved" ? (
                            <div className="text-center py-12">
                                <div className="bg-orange-100 text-orange-600 p-4 rounded-full inline-block mb-4">
                                    <FileMinus size={32} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Unggah Dokumen Belum Tersedia</h3>
                                <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                                    Status pengajuan PKL Anda saat ini adalah <strong className="text-gray-700">{dataPengajuan[0].status}</strong>. Anda hanya dapat mengunggah dokumen setelah pengajuan disetujui.
                                </p>
                            </div>
                        ) : dataPengajuan && dataPengajuan.length > 0 && dataPengajuan[0].dokumen_urls && dataPengajuan[0].dokumen_urls.length > 0 ? (
                            <div className="space-y-6">
                                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-start gap-3">
                                    <Check className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-sm">Dokumen Berhasil Diunggah</h3>
                                        <p className="text-xs mt-1">Anda telah mengunggah dokumen magang. Menunggu validasi dari pihak sekolah.</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {dataPengajuan[0].dokumen_urls.map((url, index) => (
                                        <div key={index} className="border rounded-lg overflow-hidden relative group">
                                            <img
                                                src={url}
                                                alt={`Dokumen ${index + 1}`}
                                                className="w-full h-48 object-cover object-top hover:object-scale-down transition-all bg-gray-100"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <a href={url} target="_blank" rel="noopener noreferrer" className="bg-white text-gray-800 text-xs px-3 py-1.5 rounded-md font-medium hover:bg-gray-100">
                                                    Lihat Penuh
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Upload Area */}
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center mb-6">
                                    <Upload className="text-[40px] text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-[15px] mb-1">
                                        Unggah surat penerimaan magang Anda
                                    </h3>
                                    <p className="text-[13px] text-gray-400">
                                        Seret dan letakkan file Anda di sini, atau klik untuk menelusuri
                                    </p>
                                    <span className="block text-[10px] text-gray-300 uppercase mt-2">
                                        Mendukung: JPG, PNG, WEBP (Maks. 5MB)
                                    </span>

                                    <label className="inline-flex items-center gap-2 bg-[#7A1B1B] text-white px-5 py-2.5 rounded-md mt-5 cursor-pointer hover:bg-[#5A1515] transition-colors">
                                        {/* <FaFolderOpen /> */}
                                        <span className="text-[13px]">Telusuri File</span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept=".jpg,.jpeg,.png,.webp"
                                            onChange={handleFileChange}
                                            multiple
                                        />
                                    </label>

                                    {selectedFiles.length > 0 && (
                                        <div className="mt-3 text-sm text-gray-600">
                                            <p className="font-semibold mb-1">File terpilih:</p>
                                            <ul className="list-disc list-inside text-left mx-auto max-w-max">
                                                {selectedFiles.map((file, idx) => (
                                                    <li key={idx}>{file.name}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {/* Document Form */}
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <button
                                        type="submit"
                                        className="w-full bg-gray-300 text-gray-600 py-4 rounded-lg font-bold flex items-center justify-center gap-2.5 hover:bg-gray-400 transition-colors"
                                    >
                                        <Upload />
                                        Unggah Dokumen
                                    </button>
                                </form>
                            </>
                        )}
                    </section>

                    {/* Side Panel */}
                    <aside className="flex flex-col gap-6">

                        {/* Guidelines Card */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                            <div className="flex items-center gap-2.5 text-blue-800 mb-4">
                                <Info />
                                <h4 className="font-semibold">Pedoman</h4>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex gap-2.5 text-xs text-blue-800/80 leading-relaxed">
                                    <Check className="mt-0.5 flex-shrink-0" />
                                    <span>Dokumen harus menyertakan kop surat perusahaan</span>
                                </li>
                                <li className="flex gap-2.5 text-xs text-blue-800/80 leading-relaxed">
                                    <Check className="mt-0.5 flex-shrink-0" />
                                    <span>Penyebutan tanggal magang yang jelas</span>
                                </li>
                                <li className="flex gap-2.5 text-xs text-blue-800/80 leading-relaxed">
                                    <Check className="mt-0.5 flex-shrink-0" />
                                    <span>Ukuran masing-masing gambar tidak boleh melebihi 5MB</span>
                                </li>
                                <li className="flex gap-2.5 text-xs text-blue-800/80 leading-relaxed">
                                    <Check className="mt-0.5 flex-shrink-0" />
                                    <span>Format file yang diizinkan: JPEG/PNG/WebP</span>
                                </li>
                            </ul>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}