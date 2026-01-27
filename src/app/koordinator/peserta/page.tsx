"use client";

import React, { useState } from 'react';
import { Search, Filter, Download, Upload, MoreHorizontal } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

// Mock Data
const MOCK_STUDENTS = [
    { id: 1, nid: "12345678", name: "Ahmad Rizky", class: "XI RPL 1", industry: "PT. Teknologi Nusantara", status: "sedang_pkl" },
    { id: 2, nid: "12345679", name: "Budi Santoso", class: "XI RPL 1", industry: "-", status: "belum_dapat" },
    { id: 3, nid: "12345680", name: "Citra Dewi", class: "XI TKJ 2", industry: "CV. Kreatif Digital", status: "sedang_pkl" },
    { id: 4, nid: "12345681", name: "Doni Pratama", class: "XI RPL 2", industry: "Studio Desain Visual", status: "selesai" },
    { id: 5, nid: "12345682", name: "Eka Putri", class: "XI TKJ 1", industry: "-", status: "pengajuan" },
    { id: 6, nid: "12345683", name: "Fajar Nugraha", class: "XI RPL 1", industry: "PT. Jaringan Global", status: "sedang_pkl" },
    { id: 7, nid: "12345684", name: "Gita Permata", class: "XI MM 1", industry: "-", status: "belum_dapat" },
];

export default function PesertaPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [classFilter, setClassFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    // Filter Logic
    const filteredStudents = MOCK_STUDENTS.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.nid.includes(searchQuery);
        const matchesClass = classFilter === "all" ? true : student.class === classFilter;
        const matchesStatus = statusFilter === "all" ? true : student.status === statusFilter;
        return matchesSearch && matchesClass && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "sedang_pkl": return <Badge variant="success">Sedang PKL</Badge>;
            case "belum_dapat": return <Badge variant="destructive">Belum Dapat</Badge>;
            case "pengajuan": return <Badge variant="warning">Menunggu</Badge>;
            case "selesai": return <Badge variant="outline" className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">Selesai</Badge>;
            default: return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-8 bg-muted/10 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Data Peserta</h1>
                    <p className="text-muted-foreground mt-1">
                        Monitoring siswa PKL, status penempatan, dan progres.
                    </p>
                </div>
                <div className="flex gap-2">
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
                            placeholder="Cari nama atau NIS..."
                            className="pl-9 bg-muted/20 border-muted-foreground/20 focus-visible:ring-primary"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select value={classFilter} onValueChange={setClassFilter}>
                        <SelectTrigger className="w-[150px] bg-muted/20 border-muted-foreground/20">
                            <SelectValue placeholder="Kelas" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Kelas</SelectItem>
                            <SelectItem value="XI RPL 1">XI RPL 1</SelectItem>
                            <SelectItem value="XI RPL 2">XI RPL 2</SelectItem>
                            <SelectItem value="XI TKJ 1">XI TKJ 1</SelectItem>
                            <SelectItem value="XI TKJ 2">XI TKJ 2</SelectItem>
                            <SelectItem value="XI MM 1">XI MM 1</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[150px] bg-muted/20 border-muted-foreground/20">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="sedang_pkl">Sedang PKL</SelectItem>
                            <SelectItem value="belum_dapat">Belum Dapat</SelectItem>
                            <SelectItem value="pengajuan">Menunggu</SelectItem>
                            <SelectItem value="selesai">Selesai</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </Card>

            {/* Table */}
            <Card className="border-none shadow-md overflow-hidden bg-background">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-[100px]">NIS</TableHead>
                            <TableHead>Nama Peserta</TableHead>
                            <TableHead>Kelas</TableHead>
                            <TableHead>Tempat PKL</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((student) => (
                                <TableRow key={student.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell className="font-medium">{student.nid}</TableCell>
                                    <TableCell>{student.name}</TableCell>
                                    <TableCell>{student.class}</TableCell>
                                    <TableCell>
                                        {student.industry !== "-" ? (
                                            <span className="font-medium">{student.industry}</span>
                                        ) : (
                                            <span className="text-muted-foreground italic">Belum ditempatkan</span>
                                        )}
                                    </TableCell>
                                    <TableCell>{getStatusBadge(student.status)}</TableCell>
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
                                                <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                                                <DropdownMenuItem>Edit Data</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Hapus</DropdownMenuItem>
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
            </Card>
        </div>
    );
}
