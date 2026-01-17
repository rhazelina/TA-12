"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Search, FileText, Download } from "lucide-react"
import { toast } from "sonner"

// Mock Data
const MOCK_STUDENTS = [
    { id: 1, name: "Adi Saputra", nisn: "123001", industri: "PT. Telkom", status_hari_ini: "Hadir", kehadiran_bulan_ini: 95 },
    { id: 2, name: "Budi Santoso", nisn: "123002", industri: "Bank BCA", status_hari_ini: "Sakit", kehadiran_bulan_ini: 80, bukti_sakit: "surat_dokter.jpg" },
    { id: 3, name: "Citra Lestari", nisn: "123003", industri: "Gojek", status_hari_ini: "Izin", kehadiran_bulan_ini: 90, bukti_izin: "surat_ortu.pdf" },
    { id: 4, name: "Dewi Ayu", nisn: "123004", industri: "Tokopedia", status_hari_ini: "Alpha", kehadiran_bulan_ini: 60 },
    { id: 5, name: "Eko Prasetyo", nisn: "123005", industri: "Ruangguru", status_hari_ini: "Hadir", kehadiran_bulan_ini: 100 },
]

const MOCK_RECAP = [
    { id: 1, name: "Adi Saputra", hadir: 120, sakit: 2, izin: 1, alpha: 0, persentase: 98 },
    { id: 2, name: "Budi Santoso", hadir: 110, sakit: 5, izin: 5, alpha: 2, persentase: 90 },
    { id: 3, name: "Citra Lestari", hadir: 115, sakit: 3, izin: 2, alpha: 0, persentase: 95 },
    { id: 4, name: "Dewi Ayu", hadir: 100, sakit: 2, izin: 2, alpha: 10, persentase: 85 },
    { id: 5, name: "Eko Prasetyo", hadir: 124, sakit: 0, izin: 0, alpha: 0, persentase: 100 },
]

export default function MonitorAbsensiPage() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Monitor Absensi Siswa</h1>
                <p className="text-muted-foreground">Pantau kehadiran dan perizinan siswa bimbingan Anda.</p>
            </div>

            <Tabs defaultValue="harian" className="w-full">
                <TabsList>
                    <TabsTrigger value="harian">Absensi Harian</TabsTrigger>
                    <TabsTrigger value="rekap">Rekap Semester (6 Bulan)</TabsTrigger>
                </TabsList>

                {/* TAB HARIAN */}
                <TabsContent value="harian" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Status Kehadiran Hari Ini (Mock)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4 mb-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Cari siswa..." className="pl-8" />
                                </div>
                                <Select defaultValue="all">
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Status</SelectItem>
                                        <SelectItem value="hadir">Hadir</SelectItem>
                                        <SelectItem value="sakit">Sakit</SelectItem>
                                        <SelectItem value="izin">Izin</SelectItem>
                                        <SelectItem value="alpha">Alpha</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama Siswa</TableHead>
                                        <TableHead>Industri</TableHead>
                                        <TableHead>Status Hari Ini</TableHead>
                                        <TableHead>Bukti</TableHead>
                                        <TableHead>Detail</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {MOCK_STUDENTS.map((student) => (
                                        <TableRow key={student.id}>
                                            <TableCell className="font-medium">
                                                {student.name}
                                                <div className="text-xs text-muted-foreground">{student.nisn}</div>
                                            </TableCell>
                                            <TableCell>{student.industri}</TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    student.status_hari_ini === 'Hadir' ? 'default' :
                                                        student.status_hari_ini === 'Sakit' ? 'outline' : // use outline or create custom class
                                                            student.status_hari_ini === 'Izin' ? 'secondary' : 'destructive'
                                                } className={
                                                    student.status_hari_ini === 'Sakit' ? 'bg-yellow-100 text-yellow-800 border-none' : ''
                                                }>
                                                    {student.status_hari_ini}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {(student.status_hari_ini === 'Sakit' || student.status_hari_ini === 'Izin') && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-blue-600 hover:text-blue-800 h-8 px-2"
                                                        onClick={() => toast("Lihat Bukti", { description: `Membuka file: ${student.bukti_sakit || student.bukti_izin}` })}
                                                    >
                                                        <FileText className="w-4 h-4 mr-1" /> Lihat
                                                    </Button>
                                                )}
                                                {student.status_hari_ini === 'Alpha' && <span className="text-xs text-red-400 italic">Tanpa Keterangan</span>}
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="icon" onClick={() => toast.info("Fitur Detail Siswa akan datang")}>
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TAB REKAP */}
                <TabsContent value="rekap" className="mt-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Rekapitulasi Absensi Semester</CardTitle>
                            <Button variant="outline" size="sm" onClick={() => toast.success("Mengunduh Rekap Excel...")}>
                                <Download className="w-4 h-4 mr-2" /> Unduh Excel
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama Siswa</TableHead>
                                        <TableHead className="text-center">Hadir</TableHead>
                                        <TableHead className="text-center">Sakit</TableHead>
                                        <TableHead className="text-center">Izin</TableHead>
                                        <TableHead className="text-center">Alpha</TableHead>
                                        <TableHead className="text-right">% Kehadiran</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {MOCK_RECAP.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell className="font-medium">{row.name}</TableCell>
                                            <TableCell className="text-center">{row.hadir}</TableCell>
                                            <TableCell className="text-center text-yellow-600 font-medium">{row.sakit}</TableCell>
                                            <TableCell className="text-center text-blue-600 font-medium">{row.izin}</TableCell>
                                            <TableCell className="text-center text-red-600 font-bold">{row.alpha}</TableCell>
                                            <TableCell className="text-right font-bold">
                                                <span className={row.persentase < 80 ? "text-red-600" : "text-green-600"}>
                                                    {row.persentase}%
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
