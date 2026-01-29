"use client"

import { useState, useEffect } from "react"
import { getSekolah } from "@/api/admin/sekolah"
import { ApiResponseSekolah } from "@/types/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Building2,
    MapPin,
    Phone,
    Mail,
    Globe,
    User,
    Award,
    School
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"

export default function PengaturanPage() {
    const [dataSekolah, setDataSekolah] = useState<ApiResponseSekolah['data'] | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const getDataSekolah = async () => {
        try {
            setIsLoading(true)
            const response = await getSekolah()
            if (response && response.success) {
                setDataSekolah(response.data)
            }
        } catch (error) {
            console.error("Error fetching school info:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getDataSekolah()
    }, [])

    if (isLoading) {
        return (
            <div className="flex flex-col gap-6 p-4 md:p-8">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Skeleton className="h-[200px] md:col-span-2 rounded-xl" />
                    <Skeleton className="h-[200px] rounded-xl" />
                    <Skeleton className="h-[300px] md:col-span-3 rounded-xl" />
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Pengaturan Sekolah</h1>
                    <p className="text-muted-foreground">
                        Informasi detail mengenai profil dan identitas sekolah.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/pengaturan/edit">
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Profil
                    </Link>
                </Button>
            </div>

            {dataSekolah && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Card 1: Identitas Sekolah (Spans 2 cols on large) */}
                    <Card className="md:col-span-2 lg:col-span-2 shadow-sm">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-2">
                                <School className="h-5 w-5 text-primary" />
                                <CardTitle>Identitas Sekolah</CardTitle>
                            </div>
                            <CardDescription>Informasi dasar dan status sekolah.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                {/* Logo Section */}
                                <div className="flex flex-col items-center gap-3 shrink-0 mx-auto md:mx-0">
                                    <Avatar className="w-32 h-32 rounded-xl border-2 border-border shadow-sm">
                                        <AvatarImage src={dataSekolah.logo_url} className="object-cover" alt="Logo Sekolah" />
                                        <AvatarFallback className="text-4xl font-bold rounded-xl bg-primary/5 text-primary">
                                            {dataSekolah.nama_sekolah?.substring(0, 2).toUpperCase() || "SC"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <p className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                        Logo Sekolah
                                    </p>
                                </div>

                                {/* Details Grid */}
                                <div className="grid gap-6 flex-1 w-full grid-cols-1 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <Label className="text-muted-foreground text-xs uppercase tracking-wider">Nama Sekolah</Label>
                                        <div className="font-semibold text-lg">{dataSekolah.nama_sekolah}</div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-muted-foreground text-xs uppercase tracking-wider">NPSN</Label>
                                        <div className="font-medium font-mono bg-muted/50 inline-block px-2 py-0.5 rounded text-sm">
                                            {dataSekolah.npsn}
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-muted-foreground text-xs uppercase tracking-wider">Akreditasi</Label>
                                        <div className="flex items-center gap-2">
                                            <Award className="h-4 w-4 text-amber-500" />
                                            <span className="font-medium">{dataSekolah.akreditasi || "-"}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-muted-foreground text-xs uppercase tracking-wider">Website</Label>
                                        <div className="flex items-center gap-2">
                                            <Globe className="h-4 w-4 text-blue-500" />
                                            <a
                                                href={dataSekolah.website?.startsWith('http') ? dataSekolah.website : `https://${dataSekolah.website}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="font-medium text-primary hover:underline truncate"
                                            >
                                                {dataSekolah.website || "-"}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card 2: Kepala Sekolah */}
                    <Card className="shadow-sm h-full">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                <CardTitle>Kepala Sekolah</CardTitle>
                            </div>
                            <CardDescription>Pimpinan sekolah saat ini.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16 border border-border">
                                    <AvatarFallback className="bg-primary/5 text-primary font-bold text-lg">KS</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <p className="font-semibold text-lg leading-none">{dataSekolah.kepala_sekolah}</p>
                                    <p className="text-sm text-muted-foreground">Kepala Sekolah</p>
                                </div>
                            </div>
                            <div className="space-y-1.5 p-3 bg-muted/30 rounded-lg border border-dashed text-center">
                                <Label className="text-muted-foreground text-xs uppercase tracking-wider block mb-1">NIP</Label>
                                <span className="font-mono font-medium tracking-wide">{dataSekolah.nip_kepala_sekolah}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card 3: Lokasi & Kontak (Spans full width) */}
                    <Card className="md:col-span-2 lg:col-span-3 shadow-sm">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-primary" />
                                <CardTitle>Lokasi & Kontak</CardTitle>
                            </div>
                            <CardDescription>Alamat lengkap dan informasi kontak resmi.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {/* Address Section */}
                                <div className="space-y-4 lg:col-span-2">
                                    <h4 className="font-medium text-sm text-foreground/80 flex items-center gap-2 border-b pb-2">
                                        <Building2 className="h-4 w-4" /> Alamat Lengkap
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="col-span-1 sm:col-span-2 space-y-1">
                                            <Label className="text-xs text-muted-foreground">Jalan / Alamat</Label>
                                            <p className="font-medium">{dataSekolah.jalan}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Kelurahan</Label>
                                            <p className="font-medium">{dataSekolah.kelurahan}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Kecamatan</Label>
                                            <p className="font-medium">{dataSekolah.kecamatan}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Kabupaten/Kota</Label>
                                            <p className="font-medium">{dataSekolah.kabupaten_kota}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Provinsi</Label>
                                            <p className="font-medium">{dataSekolah.provinsi}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Kode Pos</Label>
                                            <p className="font-medium">{dataSekolah.kode_pos}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Section */}
                                <div className="space-y-4">
                                    <h4 className="font-medium text-sm text-foreground/80 flex items-center gap-2 border-b pb-2">
                                        <Phone className="h-4 w-4" /> Kontak Resmi
                                    </h4>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-50/50 dark:bg-orange-950/20 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors">
                                            <Phone className="h-5 w-5 text-orange-600 mt-0.5" />
                                            <div>
                                                <Label className="text-xs text-muted-foreground block mb-0.5">Nomor Telepon</Label>
                                                <p className="font-medium">{dataSekolah.nomor_telepon}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors">
                                            <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                                            <div>
                                                <Label className="text-xs text-muted-foreground block mb-0.5">Email</Label>
                                                <p className="font-medium break-all">{dataSekolah.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}