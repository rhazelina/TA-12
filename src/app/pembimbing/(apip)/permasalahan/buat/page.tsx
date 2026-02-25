"use client"

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Send, ArrowLeft } from "lucide-react";
import { getSiswa, createPermasalahanByPembimbing } from "@/api/pembimbing";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Student {
    siswa_id: number;
    siswa_nama: string;
    industri?: string; // name
    industri_id?: number;
    // other fields
}

export default function PermasalahanSiswaBuat() {
    const router = useRouter();
    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    const [selectedStudent, setSelectedStudent] = useState<string>("")
    const [judul, setJudul] = useState("")
    const [kategori, setKategori] = useState<"kedisiplinan" | "absensi" | "performa" | "lainnya" | "">("")
    const [problemDetail, setProblemDetail] = useState("")

    useEffect(() => {
        const loadData = async () => {
            try {
                const stuRes = await getSiswa()
                setStudents(Array.isArray(stuRes) ? stuRes : stuRes.data || [])
            } catch (error) {
                console.error(error)
                toast.error("Gagal memuat data siswa")
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    const handleSubmit = async () => {
        if (!selectedStudent || !judul || !kategori || !problemDetail) {
            toast.error("Mohon lengkapi semua field yang wajib")
            return
        }

        setSubmitting(true)
        try {
            await createPermasalahanByPembimbing({
                siswa_id: parseInt(selectedStudent),
                judul: judul,
                kategori: kategori as "kedisiplinan" | "absensi" | "performa" | "lainnya",
                deskripsi: problemDetail
            });
            toast.success("Pengaduan masalah berhasil dikirim")
            router.push("/pembimbing/permasalahan")
        } catch (error) {
            console.error(error);
            toast.error("Gagal mengirim pengaduan masalah");
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-[#6B1B1B]" /></div>
    }

    return (
        <div className="flex-1 bg-[#fafafa] min-h-screen p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <Link href="/pembimbing/permasalahan" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali ke Daftar
                </Link>

                <div className="bg-white border rounded-xl p-8 shadow-sm">
                    <h2 className="text-xl font-semibold mb-6">Buat Pengaduan Masalah</h2>

                    <div className="space-y-6">
                        {/* Student Select */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Pilih Siswa <span className="text-red-500">*</span>
                            </label>
                            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Siswa" />
                                </SelectTrigger>
                                <SelectContent>
                                    {students.length > 0 ? students.map(s => (
                                        <SelectItem key={s.siswa_id} value={s.siswa_id.toString()}>
                                            {s.siswa_nama} {s.industri ? `(${s.industri})` : ""}
                                        </SelectItem>
                                    )) : (
                                        <div className="p-2 text-sm text-gray-500 text-center">Tidak ada siswa ditemukan</div>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Title Select */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Judul Permasalahan <span className="text-red-500">*</span>
                            </label>
                            <Input
                                placeholder="Contoh: Terlambat harian tanpa keterangan yang jelas"
                                value={judul}
                                onChange={(e) => setJudul(e.target.value)}
                                className="focus-visible:ring-[#8B1E1E]"
                            />
                        </div>

                        {/* Category Select */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Kategori <span className="text-red-500">*</span>
                            </label>
                            <Select value={kategori} onValueChange={(val) => setKategori(val as "kedisiplinan" | "absensi" | "performa" | "lainnya")}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="kedisiplinan">Kedisiplinan (Terlambat, dsb)</SelectItem>
                                    <SelectItem value="absensi">Absensi (Sering bolos, izin dsb)</SelectItem>
                                    <SelectItem value="performa">Akademik/Performa (Skill kurang, dsb)</SelectItem>
                                    <SelectItem value="lainnya">Lainnya (Komunikasi, Kesehatan, Keluarga, dll)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Problem Detail */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Detail Permasalahan <span className="text-red-500">*</span>
                            </label>
                            <Textarea
                                rows={6}
                                placeholder="Deskripsikan kronologi atau penjelasan permasalahan..."
                                value={problemDetail}
                                onChange={(e) => setProblemDetail(e.target.value)}
                                className="resize-none focus-visible:ring-[#8B1E1E]"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 border-t border-gray-100">
                            <Button
                                onClick={handleSubmit}
                                disabled={submitting || !selectedStudent || !judul || !kategori || !problemDetail}
                                className="w-full bg-[#6B1B1B] hover:bg-[#5a1616] text-white py-6 text-lg transition-colors"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Sedang Mengirim...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5 mr-2" />
                                        Kirim Pengaduan Masalah
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
