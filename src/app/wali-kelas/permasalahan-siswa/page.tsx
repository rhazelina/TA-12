"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Search, RotateCcw, Loader2, Info } from "lucide-react"
import { useEffect, useState } from "react"
import { getPermasalahanByWaliKelas } from "@/api/wali-kelas"
import { Item } from "@/types/permasalahan"
import { toast } from "sonner"

export default function PermasalahanListWaliKelas() {
    const [issues, setIssues] = useState<Item[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const res = await getPermasalahanByWaliKelas()
                setIssues(res.items || [])
            } catch (error) {
                console.error(error)
                toast.error("Gagal memuat daftar permasalahan siswa")
            } finally {
                setLoading(false)
            }
        }
        fetchIssues()
    }, [])

    const filteredIssues = issues.filter(issue =>
        issue.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.siswa?.nama.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getStatusVariant = (status: string) => {
        const s = status?.toLowerCase() || "";
        switch (s) {
            case "opened": return "warning"
            case "in_progress": return "default" // or keep warning, maybe blue
            case "resolved":
            case "selesai": return "success"
            case "rejected": return "destructive"
            default: return "secondary"
        }
    }

    const getStatusText = (status: string) => {
        const s = status?.toLowerCase() || "";
        switch (s) {
            case "opened": return "Belum Diproses"
            case "in_progress": return "Sedang Diproses"
            case "resolved":
            case "selesai": return "Selesai"
            case "rejected": return "Ditolak"
            default: return status || "Pending"
        }
    }

    return (
        <div className="space-y-6 mx-10">
            {/* Filter Section */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Filter Pengaduan</CardTitle>
                        <Button variant="outline" className="text-sm">
                            Reset Filter <RotateCcw className="ml-2 h-3 w-3" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Cari</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                className="pl-9"
                                placeholder="Cari judul atau nama siswa..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* List Section */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Notifikasi</CardTitle>
                    <span className="text-sm text-muted-foreground">Lihat Semua</span>
                </CardHeader>
                <CardContent className="space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="animate-spin w-8 h-8 text-[#5f2a2a]" />
                        </div>
                    ) : filteredIssues.length > 0 ? (
                        filteredIssues.map((issue) => (
                            <div key={issue.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-12 w-12 border bg-gray-50 flex items-center justify-center">
                                        <Info className="h-5 w-5 text-gray-400" />
                                    </Avatar>
                                    <div>
                                        <div className="font-medium flex items-center gap-2">
                                            {issue.judul}
                                        </div>
                                        <div className="text-sm text-muted-foreground flex gap-2 divide-x">
                                            <span>Siswa: <span className="text-foreground font-medium">{issue.siswa?.nama}</span></span>
                                            <span className="pl-2">Kategori: <span className="font-medium capitalize">{issue.kategori}</span></span>
                                            <span className="pl-2 flex items-center gap-1">
                                                Tgl: {new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(issue.created_at))}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant={getStatusVariant(issue.status) as "default" | "secondary" | "destructive" | "outline"} className="capitalize px-4 py-1">
                                        {getStatusText(issue.status)}
                                    </Badge>
                                    <Button size="sm" variant="outline" className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none px-4" asChild>
                                        <Link href={`/wali-kelas/permasalahan-siswa/${issue.id}`}>
                                            Periksa
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 text-muted-foreground">
                            Tidak ada data permasalahan.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
