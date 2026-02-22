"use client"

import { useParams, useRouter } from "next/navigation"
import {
    ArrowLeft,
    Printer,
    AlertTriangle,
    User,
    GraduationCap,
    BookOpen,
    Building2,
    CalendarDays,
    MessageSquareQuote,
    Clock,
    Phone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function PermasalahanDetailWaliKelas() {
    const { id } = useParams<{ id: string }>()
    const router = useRouter()

    // Mock data — replace with actual API calls
    const data = {
        namaSiswa: "Ahmad Fadillah",
        kelas: "XII - RPL 2",
        konsentrasiKeahlian: "Rekayasa Perangkat Lunak (RPL)",
        industriTempat: "PT. Inovasi Teknologi Nusantara",
        tanggalPengaduan: "22 Februari 2026",
        catatanPembimbing:
            '"Siswa sering datang terlambat (lebih dari 3 kali dalam seminggu terakhir) tanpa alasan yang jelas. Selain itu, siswa terlihat kurang proaktif dalam mengerjakan tugas proyek yang diberikan oleh mentor dan sering bermain ponsel saat jam kerja aktif. Mohon pihak sekolah dapat memberikan teguran atau pembinaan."',
    }

    return (
        <div className="space-y-0 max-w-4xl mx-auto">
            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="size-4" />
                    <span>Kembali</span>
                </button>

                <Button variant="outline" size="sm" className="gap-2">
                    <Printer className="size-4" />
                    Cetak
                </Button>
            </div>

            {/* Main Card */}
            <div className="rounded-2xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                {/* Alert Header */}
                <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/20 px-6 py-5 flex items-start justify-between gap-4 border-b border-red-100 dark:border-red-900/30">
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
                            <AlertTriangle className="size-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-foreground">
                                Laporan Siswa Bermasalah
                            </h2>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                Harap segera ditindaklanjuti oleh pihak sekolah.
                            </p>
                        </div>
                    </div>
                    <Badge className="bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800 hover:bg-red-100 whitespace-nowrap font-semibold text-xs uppercase tracking-wide">
                        Perlu Tindakan
                    </Badge>
                </div>

                {/* Info Section */}
                <div className="px-6 py-6 space-y-6">
                    {/* Two column grid */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Left: Profil Siswa */}
                        <div className="space-y-5">
                            <h3 className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                                Profil Siswa
                            </h3>

                            <div className="space-y-4">
                                <InfoField
                                    icon={<User className="size-4" />}
                                    label="Nama Siswa"
                                    value={data.namaSiswa}
                                />
                                <InfoField
                                    icon={<GraduationCap className="size-4" />}
                                    label="Kelas"
                                    value={data.kelas}
                                />
                                <InfoField
                                    icon={<BookOpen className="size-4" />}
                                    label="Konsentrasi Keahlian"
                                    value={data.konsentrasiKeahlian}
                                />
                            </div>
                        </div>

                        {/* Right: Detail Penempatan & Laporan */}
                        <div className="space-y-5">
                            <h3 className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                                Detail Penempatan & Laporan
                            </h3>

                            <div className="space-y-4">
                                <InfoField
                                    icon={<Building2 className="size-4" />}
                                    label="Industri / Tempat PKL"
                                    value={data.industriTempat}
                                />
                                <InfoField
                                    icon={<CalendarDays className="size-4" />}
                                    label="Tanggal Pengaduan"
                                    value={data.tanggalPengaduan}
                                />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Catatan dari Pembimbing */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <MessageSquareQuote className="size-4 text-muted-foreground" />
                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Catatan dari Pembimbing
                            </h3>
                        </div>

                        <div className="rounded-xl border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-600 p-5">
                            <p className="text-sm text-foreground/80 leading-relaxed italic">
                                {data.catatanPembimbing}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="px-6 py-5 border-t flex items-center justify-center gap-3">
                    <Button variant="outline" className="gap-2">
                        <Phone className="size-4" />
                        Hubungi Industri
                    </Button>
                    <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                        <Clock className="size-4" />
                        Tandai Sedang Diproses
                    </Button>
                </div>
            </div>
        </div>
    )
}

/* ────────────────────────────────────────────────────────── */
/*  Small helper component for labeled info fields with icon */
/* ────────────────────────────────────────────────────────── */
interface InfoFieldProps {
    icon: React.ReactNode
    label: string
    value: string
}

function InfoField({ icon, label, value }: InfoFieldProps) {
    return (
        <div className="flex items-start gap-3">
            <span className="mt-0.5 text-muted-foreground">{icon}</span>
            <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium text-foreground">{value}</p>
            </div>
        </div>
    )
}
