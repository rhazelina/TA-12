"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { getPindahPklBySiswa } from "@/api/siswa"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, ArrowRight, Building2, Calendar, FileText, MessageSquare, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { id as idLocale } from "date-fns/locale"
import Link from "next/link"

interface PindahPklData {
    id: number
    alasan: string
    bukti_pendukung: string[]
    created_at: string
    industri_baru: {
        id: number
        nama: string
        alamat: string
    }
    industri_lama: {
        id: number
        nama: string
        alamat: string
    }
    kaprog_catatan: string | null
    koordinator_catatan: string | null
    pembimbing_catatan: string | null
    status: string
    tanggal_efektif: string | null
    updated_at: string
}

export default function PindahPklInfoPage() {
    const router = useRouter()
    const [data, setData] = React.useState<PindahPklData | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getPindahPklBySiswa()
                // Assuming API returns the object directly, or null if empty
                if (res) {
                    setData(res)
                }
            } catch (err: any) {
                // If 404, it might mean no data found, which is fine
                if (err.response && err.response.status === 404) {
                    setData(null)
                } else {
                    console.error("Failed to fetch data", err)
                    setError("Gagal memuat data pindah PKL")
                }
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex bg-gray-50 h-screen items-center justify-center p-4">
                <Card className="max-w-md w-full border-red-200">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2">
                            <AlertCircle className="h-6 w-6 text-red-600" />
                        </div>
                        <CardTitle className="text-red-700">Terjadi Kesalahan</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // No data found state
    if (!data) {
        return (
            <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center p-4">
                <Card className="max-w-lg w-full text-center py-8">
                    <CardHeader>
                        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <Building2 className="h-8 w-8 text-blue-600" />
                        </div>
                        <CardTitle className="text-2xl">Pengajuan Pindah PKL</CardTitle>
                        <CardDescription className="text-base mt-2">
                            Anda belum memiliki riwayat pengajuan pindah tempat PKL.
                            Jika Anda perlu pindah tempat magang, silakan ajukan permohonan baru.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/siswa/pindah-pkl/buat">
                            <Button className="w-full sm:w-auto" size="lg">
                                Buat Pengajuan Baru <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Status Badge Helper
    const getStatusBadge = (status: string) => {
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning"> = {
            approved: "success",
            rejected: "destructive",
            pending_pembimbing: "warning",
            pending_koordinator: "warning",
            pending_kaprog: "warning",
        }

        let label = status.replace("_", " ").toUpperCase()
        let variant: any = "secondary"

        if (status.includes("pending")) {
            variant = "warning"
            if (status === "pending_pembimbing") label = "MENUNGGU PEMBIMBING"
            if (status === "pending_koordinator") label = "MENUNGGU KOORDINATOR"
            if (status === "pending_kaprog") label = "MENUNGGU KAPROG"
        } else if (status === "approved" || status === "disetujui") {
            variant = "success"
            label = "DISETUJUI"
        } else if (status === "rejected" || status === "ditolak") {
            variant = "destructive"
            label = "DITOLAK"
        }

        // Mapping badge variants to UI component classes if needed, but assuming Badge supports variants or using className
        const colorClasses: Record<string, string> = {
            success: "bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
            warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200",
            destructive: "bg-red-100 text-red-800 hover:bg-red-100 border-red-200",
            secondary: "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200",
        }

        return (
            <Badge className={colorClasses[variant] || colorClasses.secondary}>
                {label}
            </Badge>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50/50 py-8 px-4 md:px-8">
            <div className="max-w-4xl mx-auto space-y-6">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Detail Pengajuan Pindah</h1>
                        <p className="text-gray-500 mt-1">Status dan informasi perpindahan tempat magang.</p>
                    </div>
                    <div>
                        {getStatusBadge(data.status)}
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Left Column: Status Details */}
                    <div className="md:col-span-2 space-y-6">

                        {/* Industries Comparison */}
                        <Card className="overflow-hidden border-none shadow-md ring-1 ring-gray-200">
                            <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                                <CardTitle className="text-lg">Informasi Perpindahan</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 grid gap-6 md:grid-cols-2 relative">
                                {/* Arrow Decorator for Desktop */}
                                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-gray-200 rounded-full items-center justify-center z-10 shadow-sm">
                                    <ArrowRight className="h-4 w-4 text-gray-400" />
                                </div>

                                <div className="space-y-1 p-4 bg-red-50/50 rounded-lg border border-red-100">
                                    <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-2">Industri Lama</p>
                                    <div className="flex items-start gap-2">
                                        <Building2 className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="font-semibold text-gray-900">{data.industri_lama?.nama || "Unknown"}</p>
                                            <p className="text-sm text-gray-500 text-muted-foreground">{data.industri_lama?.alamat || "-"}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1 p-4 bg-green-50/50 rounded-lg border border-green-100">
                                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2">Industri Baru</p>
                                    <div className="flex items-start gap-2">
                                        <Building2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="font-semibold text-gray-900">{data.industri_baru?.nama || "Unknown"}</p>
                                            <p className="text-sm text-gray-500 text-muted-foreground">{data.industri_baru?.alamat || "-"}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Reason Section */}
                        <Card className="border-none shadow-md ring-1 ring-gray-200">
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-primary" />
                                    Alasan Kepindahan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {data.alasan}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Notes Section (Only show if present) */}
                        {(data.pembimbing_catatan || data.koordinator_catatan || data.kaprog_catatan) && (
                            <Card className="border-none shadow-md ring-1 ring-gray-200 bg-amber-50/30">
                                <CardHeader>
                                    <CardTitle className="text-base text-amber-900">Catatan Revisi / Persetujuan</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {data.pembimbing_catatan && (
                                        <div className="p-3 bg-white rounded-md border border-amber-100">
                                            <p className="text-xs font-bold text-amber-700 mb-1">Pembimbing</p>
                                            <p className="text-sm text-gray-700">{data.pembimbing_catatan}</p>
                                        </div>
                                    )}
                                    {data.koordinator_catatan && (
                                        <div className="p-3 bg-white rounded-md border border-amber-100">
                                            <p className="text-xs font-bold text-amber-700 mb-1">Koordinator</p>
                                            <p className="text-sm text-gray-700">{data.koordinator_catatan}</p>
                                        </div>
                                    )}
                                    {data.kaprog_catatan && (
                                        <div className="p-3 bg-white rounded-md border border-amber-100">
                                            <p className="text-xs font-bold text-amber-700 mb-1">Kepala Program</p>
                                            <p className="text-sm text-gray-700">{data.kaprog_catatan}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column: Meta Info & Files */}
                    <div className="space-y-6">
                        <Card className="border-none shadow-md ring-1 ring-gray-200">
                            <CardHeader>
                                <CardTitle className="text-sm uppercase tracking-wider text-gray-500">Detail Pengajuan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Tanggal Diajukan</p>
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        {format(new Date(data.created_at), "dd MMMM yyyy", { locale: idLocale })}
                                    </div>
                                </div>

                                {data.tanggal_efektif && (
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Tanggal Efektif Pindah</p>
                                        <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
                                            <Calendar className="h-4 w-4" />
                                            {format(new Date(data.tanggal_efektif), "dd MMMM yyyy", { locale: idLocale })}
                                        </div>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-gray-100">
                                    <p className="text-xs text-gray-500 mb-3">Bukti Pendukung</p>
                                    {data.bukti_pendukung && data.bukti_pendukung.length > 0 ? (
                                        <div className="space-y-2">
                                            {data.bukti_pendukung.map((url, index) => (
                                                <a
                                                    key={index}
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 p-2 rounded-md bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors group"
                                                >
                                                    <div className="h-8 w-8 bg-white rounded border border-gray-200 flex items-center justify-center shrink-0">
                                                        <FileText className="h-4 w-4 text-secondary group-hover:text-primary transition-colors" />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700 truncate w-full">
                                                        Bukti {index + 1}
                                                    </span>
                                                    <ArrowRight className="h-3 w-3 text-gray-400 -ml-1 mr-1" />
                                                </a>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-400 italic">Tidak ada bukti dilampirkan</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}