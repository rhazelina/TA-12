"use client";

import Link from "next/link";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Search, Plus, Building2, MapPin, Users, Filter, MoreVertical, Loader2 } from 'lucide-react';
import { useDebounce } from "@/hooks/use-debounce";
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
import { Industri } from "@/types/api";
import { getIndustri, deleteIndustri } from "@/api/admin/industri";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";


export default function IndustriPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dataIndustri, setDataIndustri] = useState<Industri[]>([]);

    // Pagination & Search State
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const debouncedSearch = useDebounce(searchQuery, 500);
    const observerTarget = useRef(null);

    // Delete State
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [industryToDelete, setIndustryToDelete] = useState<Industri | null>(null);
    const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchIndustriData = useCallback(async (pageNum: number, search: string, isNewSearch: boolean = false) => {
        setIsLoading(true);
        try {
            const response = await getIndustri(search, pageNum);
            const newData: Industri[] = response.data.data;

            if (isNewSearch) {
                setDataIndustri(newData);
            } else {
                setDataIndustri(prev => {
                    const existingIds = new Set(prev.map(i => i.id));
                    const uniqueNewData = newData.filter(i => !existingIds.has(i.id));
                    return [...prev, ...uniqueNewData];
                });
            }

            // Check if we reached the end (assuming 10 items per page default)
            setHasMore(newData.length >= 10);
        } catch (error) {
            console.error("Error fetching industri:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial load and Search change
    useEffect(() => {
        setPage(1);
        setHasMore(true);
        fetchIndustriData(1, debouncedSearch, true);
    }, [debouncedSearch, fetchIndustriData]);

    // Infinite Scroll Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    setPage(prevPage => {
                        const nextPage = prevPage + 1;
                        fetchIndustriData(nextPage, debouncedSearch);
                        return nextPage;
                    });
                }
            },
            { threshold: 1.0 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [hasMore, isLoading, debouncedSearch, fetchIndustriData]);

    const handleInitiateDelete = (industry: Industri) => {
        setIndustryToDelete(industry);
        setDeleteConfirmationText("");
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!industryToDelete) return;

        setIsDeleting(true);
        try {
            await deleteIndustri(industryToDelete.id);
            // Refresh data (reset to page 1)
            setPage(1);
            fetchIndustriData(1, debouncedSearch, true);
            setDeleteDialogOpen(false);
            setIndustryToDelete(null);
        } catch (error) {
            console.error("Failed to delete", error);
        } finally {
            setIsDeleting(false);
        }
    };

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
                {dataIndustri.length > 0 ? (
                    dataIndustri.map((industry) => (
                        <Card key={industry.id} className="group hover:shadow-lg transition-all duration-300 border-none shadow-md overflow-hidden relative">
                            <div className={`absolute top-0 w-full h-1 ${industry.is_active ? 'bg-green-500' : 'bg-gray-300'}`} />
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg font-semibold line-clamp-1" title={industry.nama}>
                                        {industry.nama}
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-1 text-xs">
                                        <Building2 className="h-3 w-3" />
                                        {industry.bidang ?? 'N/A'}
                                    </CardDescription>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link href={`/koordinator/industri/${industry.id}`}>
                                                Lihat Detail
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href={`/koordinator/industri/${industry.id}/edit`}>
                                                Ubah Data
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="text-destructive focus:text-destructive"
                                            onClick={() => handleInitiateDelete(industry)}
                                        >
                                            Hapus
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/30 p-2 rounded-md">
                                        <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                                        <span className="line-clamp-2">{industry.alamat}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <Badge variant={industry.is_active ? 'success' : 'secondary'} className="px-3">
                                            {industry.is_active ? 'Aktif' : 'Non-Aktif'}
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

            {/* Loading Indicator & Sentinel */}
            <div ref={observerTarget} className="h-10 w-full flex items-center justify-center p-4">
                {isLoading && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus data industri
                            <span className="font-semibold text-foreground"> {industryToDelete?.nama} </span>
                            secara permanen.
                            <br /><br />
                            Ketik <span className="font-bold text-foreground">{industryToDelete?.nama}</span> untuk konfirmasi.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-2">
                        <Input
                            value={deleteConfirmationText}
                            onChange={(e) => setDeleteConfirmationText(e.target.value)}
                            placeholder="Ketik nama industri..."
                            className="w-full"
                        />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                        <Button
                            variant="destructive"
                            disabled={deleteConfirmationText !== industryToDelete?.nama || isDeleting}
                            onClick={handleConfirmDelete}
                        >
                            {isDeleting ? "Menghapus..." : "Hapus Industri"}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
