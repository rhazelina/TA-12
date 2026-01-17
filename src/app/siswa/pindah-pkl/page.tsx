"use client"

import { useState, useEffect } from "react"
import { useSiswaPengajuanData, useSiswaDataLogin, useJurusanSiswaLogin } from "@/hooks/useSiswaData"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2, ArrowRight, Building2, Clock, Upload, CheckCircle2 } from "lucide-react"
import { differenceInMonths, parseISO } from "date-fns"
import { getIndustriById } from "@/api/admin/industri"

export default function PindahPklPage() {
    const { dataPengajuan, loading } = useSiswaPengajuanData()
    const { siswa } = useSiswaDataLogin()
    const { jurusan } = useJurusanSiswaLogin()

    // Mock State for Transfer Request
    // In real app, this would come from a separate API endpoint like /api/pkl/transfer-requests/me
    const [transferStatus, setTransferStatus] = useState<'idle' | 'reporting' | 'pending' | 'approved_upload' | 'completed'>('idle')
    const [newIndustri, setNewIndustri] = useState("")
    const [reason, setReason] = useState("")
    const [currentIndustriName, setCurrentIndustriName] = useState("Loading...")
    const [submitting, setSubmitting] = useState(false)
    const [uploadFile, setUploadFile] = useState<File | null>(null)

    // Derived Data
    const activePkl = dataPengajuan?.find(p => p.status === "Approved")
    const durationServed = activePkl?.tanggal_mulai ? differenceInMonths(new Date(), parseISO(activePkl.tanggal_mulai)) : 0
    const totalDuration = activePkl?.tanggal_mulai && activePkl?.tanggal_selesai
        ? differenceInMonths(parseISO(activePkl.tanggal_selesai), parseISO(activePkl.tanggal_mulai))
        : 6 // Default 6 months

    useEffect(() => {
        if (activePkl) {
            getIndustriById(activePkl.industri_id).then(res => {
                setCurrentIndustriName(res?.data?.nama || "Unknown Industry")
            })
        }
    }, [activePkl])

    const handleRequestTransfer = () => {
        setSubmitting(true)
        // Simulate API Call
        setTimeout(() => {
            setSubmitting(false)
            setTransferStatus('pending')
            toast.success("Permohonan pindah berhasil dikirim", {
                description: "Menunggu persetujuan dari Kapro."
            })
        }, 1500)
    }

    // Mock functionality to simulate Kapro approval for demo purposes
    const handleSimulateApproval = () => {
        toast.info("Simulasi Persetujuan Kapro", { description: "Status diubah menjadi disetujui, silakan unggah bukti." })
        setTransferStatus('approved_upload')
    }

    const handleUpload = () => {
        if (!uploadFile) return toast.error("Pilih file terlebih dahulu")
        setSubmitting(true)
        setTimeout(() => {
            setSubmitting(false)
            setTransferStatus('completed')
            toast.success("Bukti Diterima Berhasil Diunggah", {
                description: "Proses pindah PKL selesai. Data tempat baru telah diperbarui."
            })
        }, 1500)
    }

    if (loading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>
    }

    // 1. No Active PKL -> Cannot Transfer
    if (!activePkl) {
        return (
            <div className="p-8 max-w-4xl mx-auto">
                <Card className="bg-orange-50 border-orange-200">
                    <CardHeader>
                        <CardTitle className="text-orange-700 flex items-center gap-2">
                            ⚠️ Tidak Ada PKL Aktif
                        </CardTitle>
                        <CardDescription className="text-orange-600">
                            Anda belum memiliki status PKL "Disetujui". Pindah PKL hanya tersedia untuk siswa yang sedang menjalani PKL.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header Info */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Pindah Tempat PKL</h1>
                    <p className="text-gray-600">Ajukan perpindahan tempat magang jika diperlukan.</p>
                </div>

                {/* Current PKL Status Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Status Magang Saat Ini</CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <Label className="text-gray-500">Tempat Lama</Label>
                            <div className="flex items-center gap-2 font-medium text-gray-900">
                                <Building2 className="w-4 h-4 text-blue-500" />
                                {currentIndustriName}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-gray-500">Durasi Terlaksana</Label>
                            <div className="flex items-center gap-2 font-medium text-gray-900">
                                <Clock className="w-4 h-4 text-green-500" />
                                <span>{durationServed} Bulan (dari total {totalDuration} Bulan)</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Sisa waktu: {Math.max(0, totalDuration - durationServed)} Bulan</p>
                        </div>
                    </CardContent>
                </Card>

                {/* TRANSFER FLOW STATES */}

                {/* STATE 1: IDLE - Form Request */}
                {transferStatus === 'idle' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Form Pengajuan Pindah</CardTitle>
                            <CardDescription>Isi detail tempat baru dan alasan kepindahan.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Nama Tempat Baru (Industri Tujuan)</Label>
                                <Input
                                    placeholder="PT. Teknologi Baru"
                                    value={newIndustri}
                                    onChange={(e) => setNewIndustri(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Alasan Pindah</Label>
                                <Textarea
                                    placeholder="Jelaskan alasan Anda pindah (misal: Tempat lama tutup, tidak sesuai kompetensi, dll)"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleRequestTransfer} disabled={!newIndustri || !reason || submitting} className="w-full">
                                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Kirim Permohonan Pindah
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {/* STATE 2: PENDING - Waiting for Kapro */}
                {transferStatus === 'pending' && (
                    <Card className="border-yellow-200 bg-yellow-50">
                        <CardContent className="pt-6 text-center space-y-4">
                            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                                <Clock className="w-8 h-8 text-yellow-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-yellow-800">Menunggu Persetujuan</h3>
                                <p className="text-yellow-700">Permohonan Anda sedang ditinjau oleh Kepala Program (Kapro).</p>
                            </div>
                            {/* DEMO ONLY BUTTON */}
                            <Button variant="outline" size="sm" onClick={handleSimulateApproval} className="mt-4 border-yellow-300 text-yellow-800 hover:bg-yellow-100">
                                (Demo: Simulate Approval)
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* STATE 3: APPROVED_UPLOAD - Upload Bukti Diterima Baru */}
                {transferStatus === 'approved_upload' && (
                    <Card className="border-green-200 bg-green-50">
                        <CardHeader>
                            <CardTitle className="text-green-800 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5" />
                                Permohonan Disetujui
                            </CardTitle>
                            <CardDescription className="text-green-700">
                                Silakan unggah bukti diterima dari tempat baru ({newIndustri}).
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="border-2 border-dashed border-green-300 rounded-lg p-8 text-center bg-white/50">
                                <Upload className="mx-auto h-8 w-8 text-green-500 mb-2" />
                                <p className="text-sm text-green-700 mb-2">Upload Surat Penerimaan (.pdf, .jpg)</p>
                                <Input
                                    type="file"
                                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                                    className="max-w-xs mx-auto"
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleUpload} disabled={!uploadFile || submitting} className="w-full bg-green-600 hover:bg-green-700">
                                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Unggah & Selesaikan Perpindahan
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {/* STATE 4: COMPLETED */}
                {transferStatus === 'completed' && (
                    <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="pt-6 text-center space-y-4">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 className="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-blue-800">Proses Pindah Selesai!</h3>
                                <p className="text-blue-700">Data magang Anda telah diperbarui ke tempat baru.</p>
                            </div>
                            <Button onClick={() => setTransferStatus('idle')} variant="link" className="text-blue-700">
                                Kembali ke Dashboard
                            </Button>
                        </CardContent>
                    </Card>
                )}

            </div>
        </div>
    )
}