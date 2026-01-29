"use client";

import Link from "next/link";

import React, { useState } from 'react';
import { Search, Plus, Building2, MapPin, Users, Filter, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock Data
const MOCK_INDUSTRIES = [
    {
        id: 1,
        name: "PT. Teknologi Nusantara",
        field: "Software Development",
        address: "Jl. Sudirman No. 45, Jakarta Pusat",
        quota: 5,
        filled: 2,
        status: "active",
    },
    {
        id: 2,
        name: "CV. Kreatif Digital",
        field: "Digital Marketing",
        address: "Jl. Merdeka No. 10, Bandung",
        quota: 3,
        filled: 3,
        status: "active",
    },
    {
        id: 3,
        name: "PT. Jaringan Global",
        field: "Network Engineering",
        address: "Jl. Gatot Subroto No. 88, Surabaya",
        quota: 10,
        filled: 0,
        status: "inactive",
    },
    {
        id: 4,
        name: "Studio Desain Visual",
        field: "Multimedia",
        address: "Jl. Diponegoro No. 12, Yogyakarta",
        quota: 2,
        filled: 1,
        status: "active",
    },
    {
        id: 5,
        name: "PT. Solusi Awan",
        field: "Cloud Computing",
        address: "Jl. Thamrin No. 20, Jakarta Selatan",
        quota: 8,
        filled: 4,
        status: "active",
    },
];

export default function IndustriPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // Filter Logic
    const filteredIndustries = MOCK_INDUSTRIES.filter(industry => {
        const matchesSearch = industry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            industry.field.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" ? true : industry.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-8 bg-muted/10 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Daftar Industri</h1>
                    <p className="text-muted-foreground mt-1">
                        Kelola mitra industri dan kuota magang siswa.
                    </p>
                </div>
                <Link href="/koordinator/industri/tambah">
                    <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                        <Plus className="mr-2 h-4 w-4" /> Tambah Industri
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <Card className="border-none shadow-sm bg-background">
                <div className="p-4 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari nama industri atau bidang..."
                            className="pl-9 bg-muted/20 border-muted-foreground/20 focus-visible:ring-primary"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px] bg-muted/20 border-muted-foreground/20">
                                <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4 text-muted-foreground" />
                                    <SelectValue placeholder="Status" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value="active">Aktif</SelectItem>
                                <SelectItem value="inactive">Non-Aktif</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </Card>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredIndustries.length > 0 ? (
                    filteredIndustries.map((industry) => (
                        <Card key={industry.id} className="group hover:shadow-lg transition-all duration-300 border-none shadow-md overflow-hidden relative">
                            <div className={`absolute top-0 w-full h-1 ${industry.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`} />
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg font-semibold line-clamp-1" title={industry.name}>
                                        {industry.name}
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-1 text-xs">
                                        <Building2 className="h-3 w-3" />
                                        {industry.field}
                                    </CardDescription>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                                        <DropdownMenuItem>Ubah Data</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">Hapus</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/30 p-2 rounded-md">
                                        <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                                        <span className="line-clamp-2">{industry.address}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-full">
                                                <Users className="h-4 w-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs text-muted-foreground">Kuota</span>
                                                <span className="text-sm font-bold">{industry.filled} / {industry.quota}</span>
                                            </div>
                                        </div>
                                        <Badge variant={industry.status === 'active' ? 'success' : 'secondary'} className="px-3">
                                            {industry.status === 'active' ? 'Aktif' : 'Non-Aktif'}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                        <div className="bg-muted/30 p-4 rounded-full mb-4">
                            <Building2 className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">Tidak ada industri ditemukan</h3>
                        <p className="text-muted-foreground max-w-sm mt-2">
                            Coba ubah kata kunci pencarian atau filter untuk menemukan industri yang Anda cari.
                        </p>
                        <Button variant="outline" className="mt-6" onClick={() => { setSearchQuery(""); setStatusFilter("all") }}>
                            Reset Filter
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
