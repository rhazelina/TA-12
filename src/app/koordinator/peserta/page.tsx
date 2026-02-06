"use client";

import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Upload, MoreHorizontal, Plus, Loader2 } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { getSiswa, deleteSiswa } from "@/api/admin/siswa/index";
import { getKelas } from "@/api/admin/kelas/index";
import type { Siswa, Kelas } from "@/types/api";

export default function PesertaPage() {
    const router = useRouter();
    const [siswa, setSiswa] = useState<Siswa[]>([]);
    const [kelas, setKelas] = useState<Kelas[]>([]);

    // Loading states
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);

    // Filters and Pagination
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedKelas, setSelectedKelas] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const loadData = async (search?: string, page: number = 1, kelasId?: number, isSearch = false) => {
        try {
            if (isSearch) {
                setSearchLoading(true);
            } else {
                setLoading(true);
            }

            const [siswaResponse, kelasResponse] = await Promise.all([
                getSiswa(search, page, kelasId),
                getKelas()
            ]);

            const siswaData = siswaResponse?.data?.data || [];
            const totalAll = siswaResponse?.data?.total_all || 0;

            // Calculate total pages (10 items per page default)
            const calculatedTotalPages = Math.ceil(totalAll / 10);

            setSiswa(siswaData);
            setTotalPages(calculatedTotalPages);
            setTotalItems(totalAll);
            setCurrentPage(page);

            if (kelasResponse?.data?.data) {
                setKelas(kelasResponse.data.data);
            }

        } catch (error) {
            console.error("Failed to load data:", error);
            toast.error("Gagal memuat data peserta");
        } finally {
            if (isSearch) {
                setSearchLoading(false);
            } else {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        // Debounce or just trigger load with delay could be better, but for now direct call
        // Using timeout to debounce slightly
    };

    // Effect for handling search and filter changes
    useEffect(() => {
        const timer = setTimeout(() => {
            const kelasId = selectedKelas !== "all" ? parseInt(selectedKelas) : undefined;
            loadData(searchQuery, 1, kelasId, true);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, selectedKelas]);


    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            const kelasId = selectedKelas !== "all" ? parseInt(selectedKelas) : undefined;
            loadData(searchQuery, newPage, kelasId, true);
        }
    };

    const handleDelete = async (id: number, name: string) => {
        if (confirm(`Apakah anda yakin ingin menghapus data siswa ${name}?`)) {
            try {
                await deleteSiswa(id);
                toast.success(`Data siswa ${name} berhasil dihapus`);
                const kelasId = selectedKelas !== "all" ? parseInt(selectedKelas) : undefined;
                loadData(searchQuery, currentPage, kelasId);
            } catch (err) {
                console.error("Failed to delete siswa:", err);
                toast.error("Gagal menghapus data siswa");
            }
        }
    };

    const getClassName = (kelasId: number) => {
        const found = kelas.find(k => k.id === kelasId);
        return found ? found.nama : "-";
    };

    return (
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-8 bg-muted/10 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Data Peserta</h1>
                    <p className="text-muted-foreground mt-1">
                        Manajemen data siswa dan informasi akademik.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => router.push('/koordinator/peserta/buat')} size="sm">
                        <Plus className="mr-2 h-4 w-4" /> Tambah Peserta
                    </Button>
                    <Button variant="outline" size="sm">
                        <Upload className="mr-2 h-4 w-4" /> Import
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" /> Export
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card className="border-none shadow-sm bg-background p-4">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari nama atau NISN..."
                            className="pl-9 bg-muted/20 border-muted-foreground/20 focus-visible:ring-primary"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>
                    <Select value={selectedKelas} onValueChange={setSelectedKelas}>
                        <SelectTrigger className="w-[150px] bg-muted/20 border-muted-foreground/20">
                            <SelectValue placeholder="Kelas" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Kelas</SelectItem>
                            {kelas.map((k) => (
                                <SelectItem key={k.id} value={k.id.toString()}>
                                    {k.nama}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </Card>

            {/* Table */}
            <Card className="border-none shadow-md overflow-hidden bg-background">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-[150px]">NISN</TableHead>
                            <TableHead>Nama Peserta</TableHead>
                            <TableHead>Kelas</TableHead>
                            <TableHead>Alamat</TableHead>
                            <TableHead>No. Telp</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <div className="flex justify-center items-center gap-2">
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                        <span>Memuat data...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : siswa.length > 0 ? (
                            siswa.map((student) => (
                                <TableRow key={student.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell className="font-medium">{student.nisn}</TableCell>
                                    <TableCell>{student.nama_lengkap}</TableCell>
                                    <TableCell>{getClassName(student.kelas_id)}</TableCell>
                                    <TableCell className="max-w-[200px] truncate" title={student.alamat || ""}>{student.alamat || "-"}</TableCell>
                                    <TableCell>{student.no_telp || "-"}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => router.push(`/koordinator/peserta/${student.id}`)}>
                                                    Lihat Detail
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => router.push(`/koordinator/peserta/edit/${student.id}`)}>
                                                    Edit Data
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={() => handleDelete(student.id, student.nama_lengkap)}
                                                >
                                                    Hapus
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    Data tidak ditemukan.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination Controls */}
                <div className="flex items-center justify-end space-x-2 p-4">
                    <div className="text-sm text-muted-foreground">
                        Halaman {currentPage} dari {totalPages} ({totalItems} data)
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || loading}
                    >
                        Sebelumnya
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || loading}
                    >
                        Selanjutnya
                    </Button>
                </div>
            </Card>
        </div>
    );
}
