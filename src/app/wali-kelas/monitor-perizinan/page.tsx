"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, FileText } from "lucide-react"
import { toast } from "sonner"
import { getIzinByWaliKelas, getWaliKelasDashboard, SiswaPklSummaryDto } from "@/api/wali-kelas"

// Type for Permission API Response based on provided JSON
interface IzinResponse {
    id: number
    siswa_id: number
    pembimbing_guru_id: number
    tanggal: string
    jenis: string // 'Sakit', 'Izin', etc.
    keterangan: string
    bukti_foto_urls: string[]
    status: string // 'Approved', 'Pending', etc.
    rejection_reason: string | null
    decided_at: string
    created_at: string
}

// Combined Type for UI
interface IzinWithStudent extends IzinResponse {
    siswa?: SiswaPklSummaryDto
}

export default function MonitorAbsensiPage() {
    const [izinList, setIzinList] = useState<IzinWithStudent[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch permissions and student list concurrently
                // Assuming limit 100 on dashboard is enough for a class size
                const [permissionsData, dashboardData] = await Promise.all([
                    getIzinByWaliKelas(),
                    getWaliKelasDashboard(1, 100)
                ])

                const permissions: IzinResponse[] = Array.isArray(permissionsData)
                    ? permissionsData
                    : (permissionsData?.data || [])

                const students: SiswaPklSummaryDto[] = dashboardData?.siswa_list || []

                // Join data
                const joinedData = permissions.map(p => ({
                    ...p,
                    siswa: students.find(s => s.id === p.siswa_id)
                }))

                setIzinList(joinedData)
            } catch (error) {
                console.error("Failed to fetch data:", error)
                toast.error("Gagal memuat data perizinan")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const filteredList = izinList.filter(item => {
        const studentName = item.siswa?.nama || ""
        const studentNisn = item.siswa?.nisn || ""

        const matchesSearch = studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            studentNisn.includes(searchTerm)

        const matchesStatus = statusFilter === "all" || item.jenis.toLowerCase() === statusFilter.toLowerCase()

        return matchesSearch && matchesStatus
    })

    const getStatusBadgeVariant = (status: string) => {
        if (status === 'Approved') return 'default' // or success green
        if (status === 'Rejected') return 'destructive'
        return 'secondary' // Pending
    }

    const getJenisBadgeVariant = (jenis: string) => {
        if (jenis === 'Sakit') return 'outline'
        if (jenis === 'Izin') return 'secondary'
        return 'default'
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Monitor Perizinan Siswa</h1>
                <p className="text-muted-foreground">Pantau kehadiran dan perizinan siswa bimbingan Anda.</p>
            </div>

            <Tabs defaultValue="harian" className="w-full">
                <TabsList>
                    <TabsTrigger value="harian">Daftar Perizinan</TabsTrigger>
                    {/* <TabsTrigger value="rekap">Rekap Semester (6 Bulan)</TabsTrigger> */}
                </TabsList>

                {/* TAB HARIAN */}
                <TabsContent value="harian" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Riwayat Perizinan Siswa</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4 mb-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari siswa..."
                                        className="pl-8"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Jenis Izin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Jenis</SelectItem>
                                        <SelectItem value="Sakit">Sakit</SelectItem>
                                        <SelectItem value="Izin">Izin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nama Siswa</TableHead>
                                            <TableHead>Industri</TableHead>
                                            <TableHead>Jenis</TableHead>
                                            <TableHead>Tanggal</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Bukti</TableHead>
                                            {/* <TableHead>Detail</TableHead> */}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center h-24">
                                                    Memuat data...
                                                </TableCell>
                                            </TableRow>
                                        ) : filteredList.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center h-24">
                                                    Tidak ada data perizinan.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredList.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="font-medium">
                                                        {item.siswa?.nama || `Siswa #${item.siswa_id}`}
                                                        <div className="text-xs text-muted-foreground">{item.siswa?.nisn || "-"}</div>
                                                    </TableCell>
                                                    <TableCell>{item.siswa?.industri || "-"}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={getJenisBadgeVariant(item.jenis)} className={
                                                            item.jenis === 'Sakit' ? 'bg-yellow-100 text-yellow-800 border-none' : ''
                                                        }>
                                                            {item.jenis}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Date(item.tanggal).toLocaleDateString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric'
                                                        })}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={getStatusBadgeVariant(item.status)}>
                                                            {item.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.bukti_foto_urls && item.bukti_foto_urls.length > 0 && (
                                                            <div className="flex gap-1 flex-wrap">
                                                                {item.bukti_foto_urls.map((url, idx) => (
                                                                    <Button
                                                                        key={idx}
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="text-blue-600 hover:text-blue-800 h-8 px-2"
                                                                        onClick={() => window.open(url, '_blank')}
                                                                    >
                                                                        <FileText className="w-4 h-4 mr-1" /> Bukti {idx > 0 ? idx + 1 : ''}
                                                                    </Button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    {/* <TableCell>
                                                        <Button variant="ghost" size="icon" onClick={() => toast.info("Fitur Detail Siswa akan datang")}>
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </TableCell> */}
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TAB REKAP - Disembunyikan dulu karena belum ada API */}
                {/* <TabsContent value="rekap" className="mt-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Rekapitulasi Absensi Semester</CardTitle>
                            <Button variant="outline" size="sm" onClick={() => toast.success("Mengunduh Rekap Excel...")}>
                                <Download className="w-4 h-4 mr-2" /> Unduh Excel
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border p-8 text-center text-muted-foreground">
                                Fitur Rekapitulasi sedang dalam pengembangan API.
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent> */}
            </Tabs>
        </div>
    )
}
