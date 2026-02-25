"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getPermasalahanByIdWaliKelas, patchPermasalahanByWaliKelas } from "@/api/wali-kelas"
import { Item } from "@/types/permasalahan"
import { toast } from "sonner"
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
    Loader2,
    CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function PermasalahanDetailWaliKelas() {
    const { id } = useParams<{ id: string }>()
    const router = useRouter()

    const [data, setData] = useState<Item | null>(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)

    const fetchIssue = async () => {
        try {
            const res = await getPermasalahanByIdWaliKelas(parseInt(id, 10))
            setData(res)
        } catch (error) {
            console.error(error)
            toast.error("Gagal memuat detail permasalahan")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) fetchIssue()
    }, [id])

    const handleUpdateStatus = async (newStatus: "in_progress" | "resolved") => {
        if (!data) return
        setUpdating(true)
        try {
            await patchPermasalahanByWaliKelas(data.id, {
                status: newStatus,
                tindak_lanjut: data.tindak_lanjut // keep the existing tindak lanjut
            })
            toast.success("Status permasalahan berhasil diperbarui")
            fetchIssue()
        } catch (error) {
            console.error(error)
            toast.error("Gagal memperbarui status permasalahan")
        } finally {
            setUpdating(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
            </div>
        )
    }

    if (!data) {
        return (
            <div className="text-center py-20 text-muted-foreground">
                <p>Permasalahan tidak ditemukan</p>
                <Button variant="outline" className="mt-4" onClick={() => router.back()}>
                    Kembali
                </Button>
            </div>
        )
    }

    const isResolved = data.status === "resolved" || data.status === "selesai" || data.status === "approved"
    const isInProgress = data.status === "in_progress"
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
                <div className={`px-6 py-5 flex items-start justify-between gap-4 border-b ${isResolved
                    ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-100"
                    : isInProgress
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100"
                        : "bg-gradient-to-r from-red-50 to-orange-50 border-red-100"
                    }`}>
                    <div className="flex items-start gap-3">
                        <div className={`mt-0.5 flex size-10 items-center justify-center rounded-full ${isResolved ? "bg-green-100" : isInProgress ? "bg-blue-100" : "bg-red-100"
                            }`}>
                            {isResolved ? (
                                <CheckCircle2 className="size-5 text-green-600" />
                            ) : isInProgress ? (
                                <Loader2 className="size-5 text-blue-600 animate-spin" />
                            ) : (
                                <AlertTriangle className="size-5 text-red-600" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-foreground">
                                {data.judul}
                            </h2>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                Kategori: <span className="capitalize font-medium">{data.kategori}</span>
                            </p>
                        </div>
                    </div>
                    <Badge className={`whitespace-nowrap font-semibold text-xs uppercase tracking-wide ${isResolved
                        ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-100"
                        : isInProgress
                            ? "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100"
                            : "bg-red-100 text-red-700 border-red-200 hover:bg-red-100"
                        }`}>
                        {isResolved ? "Selesai" : isInProgress ? "Sedang Diproses" : "Perlu Tindakan"}
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
                                    value={data.siswa?.nama || "-"}
                                />
                                <InfoField
                                    icon={<GraduationCap className="size-4" />}
                                    label="NISN"
                                    value={data.siswa?.nisn || "-"}
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
                                    label="Pembimbing PKL"
                                    value={data.pembimbing?.nama || "-"}
                                />
                                <InfoField
                                    icon={<CalendarDays className="size-4" />}
                                    label="Tanggal Pengaduan"
                                    value={data.created_at ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(data.created_at)) : "-"}
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
                            <p className="text-sm text-foreground/80 leading-relaxed italic whitespace-pre-wrap">
                                {data.deskripsi}
                            </p>
                        </div>
                    </div>

                    {data.tindak_lanjut && (
                        <>
                            <Separator />
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Tindak Lanjut & Penanganan
                                    </h3>
                                </div>
                                <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
                                    <p className="text-sm text-blue-900 leading-relaxed whitespace-pre-wrap">
                                        {data.tindak_lanjut}
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="px-6 py-5 border-t flex items-center justify-end gap-3 bg-gray-50/50">
                    {!isResolved && !isInProgress && (
                        <Button onClick={() => handleUpdateStatus("in_progress")} disabled={updating} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                            {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Clock className="size-4" />}
                            Tandai Sedang Diproses
                        </Button>
                    )}
                    {!isResolved && (
                        <Button onClick={() => handleUpdateStatus("resolved")} disabled={updating} className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                            {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                            Tandai Selesai
                        </Button>
                    )}
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
