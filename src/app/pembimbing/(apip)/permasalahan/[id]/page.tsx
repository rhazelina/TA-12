"use client"

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPermasalahanById } from "@/api/pembimbing";
import { Item } from "@/types/permasalahan";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Calendar, CheckCircle2, Clock, MapPin, User, FileText, Activity } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function DetailPermasalahanContent() {
    const params = useParams();
    const idValue = params?.id;
    const id = Array.isArray(idValue) ? idValue[0] : idValue;

    const [permasalahan, setPermasalahan] = useState<Item | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            try {
                const res = await getPermasalahanById(parseInt(id, 10));
                setPermasalahan(res);
            } catch (error) {
                console.error(error);
                toast.error("Gagal memuat detail permasalahan");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const getStatusBadge = (status: string) => {
        const s = status?.toLowerCase() || "";
        switch (s) {
            case "resolved":
            case "selesai":
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 text-sm py-1"><CheckCircle2 className="w-4 h-4 mr-2" /> Selesai</Badge>;
            case "in_progress":
                return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200 text-sm py-1"><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sedang Diproses</Badge>;
            case "opened":
            default:
                return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200 text-sm py-1"><Clock className="w-4 h-4 mr-2" /> Belum Diproses</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#fafafa]">
                <Loader2 className="animate-spin w-10 h-10 text-[#6B1B1B]" />
            </div>
        );
    }

    if (!permasalahan) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-[#fafafa]">
                <FileText className="w-16 h-16 text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold text-gray-900">Data Tidak Ditemukan</h2>
                <p className="text-gray-500 mt-2 mb-6 text-center max-w-sm">Permasalahan yang Anda cari tidak tersedia atau telah dihapus.</p>
                <Link href="/pembimbing/permasalahan" className="text-[#6B1B1B] font-medium hover:underline inline-flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Daftar
                </Link>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-[#fafafa] min-h-screen p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header Navigation */}
                <div>
                    <Link href="/pembimbing/permasalahan" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-6">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Kembali ke Daftar Permasalahan
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                                {permasalahan.judul}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 mt-4 text-sm text-gray-600">
                                <span className="flex items-center bg-white px-3 py-1.5 rounded-full border shadow-sm">
                                    <User className="w-4 h-4 mr-2 text-gray-400" />
                                    Siswa: <strong className="ml-1 text-gray-800">{permasalahan.siswa?.nama} ({permasalahan.siswa?.nisn || "-"})</strong>
                                </span>
                                <span className="flex items-center bg-white px-3 py-1.5 rounded-full border shadow-sm">
                                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                    Dilaporkan: <strong className="ml-1 text-gray-800">
                                        {permasalahan.created_at ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date(permasalahan.created_at)) : "-"}
                                    </strong>
                                </span>
                            </div>
                        </div>
                        <div className="shrink-0 flex flex-col gap-2 items-end">
                            {getStatusBadge(permasalahan.status)}
                            <Badge variant="outline" className="text-gray-600 capitalize text-sm py-1 border-gray-300">
                                Kategori: {permasalahan.kategori}
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Main Content Area */}
                    <div className="md:col-span-2 space-y-6">
                        <Card className="border shadow-sm overflow-hidden">
                            <div className="bg-gray-50/50 border-b px-6 py-4 flex items-center">
                                <FileText className="w-5 h-5 text-gray-500 mr-2" />
                                <h3 className="font-semibold text-gray-900">Deskripsi Permasalahan</h3>
                            </div>
                            <CardContent className="p-6">
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {permasalahan.deskripsi || <span className="text-gray-400 italic">Tidak ada deskripsi.</span>}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border shadow-sm overflow-hidden">
                            <div className="bg-gray-50/50 border-b px-6 py-4 flex items-center">
                                <Activity className="w-5 h-5 text-gray-500 mr-2" />
                                <h3 className="font-semibold text-gray-900">Tindak Lanjut & Penanganan</h3>
                            </div>
                            <CardContent className="p-6">
                                {permasalahan.tindak_lanjut ? (
                                    <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4">
                                        <p className="text-blue-900 whitespace-pre-wrap leading-relaxed">
                                            {permasalahan.tindak_lanjut}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500 italic">Belum ada keterangan tindak lanjut untuk permasalahan ini.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-6">
                        <Card className="border shadow-sm">
                            <CardHeader className="pb-3 border-b bg-gray-50/50">
                                <CardTitle className="text-base flex items-center">
                                    <User className="w-4 h-4 mr-2" /> Pembimbing
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-4">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-[#6B1B1B]/10 text-[#6B1B1B] rounded-full flex items-center justify-center font-bold mr-3 border border-[#6B1B1B]/20">
                                        {permasalahan.pembimbing?.nama?.charAt(0) || "P"}
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">{permasalahan.pembimbing?.nama || "-"}</h4>
                                        <p className="text-xs text-gray-500">Pembimbing PKL</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {(permasalahan.status === "resolved" || permasalahan.status === "selesai") && permasalahan.resolved_at && (
                            <Card className="border shadow-sm border-green-100 bg-green-50/30">
                                <CardContent className="p-5 flex flex-col items-center text-center">
                                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <h4 className="font-semibold text-green-900 mb-1">Permasalahan Selesai</h4>
                                    <p className="text-sm text-green-700">
                                        Diselesaikan pada: <br /><strong>{new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(permasalahan.resolved_at))}</strong>
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
