"use client"

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Building2, Calendar as CalendarIcon } from "lucide-react";
import { GroupRegistration } from "@/types/detailGrup";
import { reviewGroup } from "@/api/kapro/indext";
import { toast } from "sonner";

export default function PengajuanKelompok() {
    const [dataKelompok, setDataKelompok] = useState<GroupRegistration[]>([]);
    const [loadingKelompok, setLoadingKelompok] = useState(true);
    const [refresh, setRefresh] = useState(true);

    useEffect(() => {
        async function fetchGroupData() {
            try {
                setLoadingKelompok(true);
                const response = await reviewGroup();
                if (response) {
                    setDataKelompok(response);
                }
            } catch (error) {
                console.error("Error fetching groups", error);
                setDataKelompok([]);
            } finally {
                setLoadingKelompok(false);
            }
        }
        fetchGroupData();
    }, [refresh]);

    const badgeStyle = (status: string) => {
        const statusLower = status.toLowerCase();
        if (statusLower === "pending" || statusLower === "menunggu") return "bg-yellow-100 text-yellow-700";
        if (statusLower === "approved" || statusLower === "disetujui") return "bg-green-100 text-green-700";
        if (statusLower === "rejected" || statusLower === "ditolak") return "bg-red-100 text-red-700";
        return "bg-gray-100 text-gray-700";
    };

    const getStatusTextGroup = (status: string) => {
        const statusLower = status.toLowerCase();
        if (statusLower === "submitted") return "Menunggu";
        if (statusLower === "approved") return "Disetujui";
        if (statusLower === "rejected") return "Ditolak";
        return status;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    return (
        <Card className="p-6 rounded-xl border">
            <h2 className="text-lg font-semibold mb-4">Daftar Pengajuan Kelompok PKL</h2>

            {loadingKelompok ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Memuat data kelompok...</span>
                </div>
            ) : dataKelompok.length === 0 ? (
                <div className="text-center py-12">
                    <Building2 className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">
                        Belum ada pengajuan kelompok PKL
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {dataKelompok.map((group) => (
                        <div
                            key={group.id}
                            className="border rounded-xl p-5 hover:shadow-md transition-shadow bg-gradient-to-br from-white to-gray-50"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                                        <User className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Kelompok: {group.leader?.nama}</h3>
                                        <p className="text-sm text-gray-500">{group.member_count} Anggota</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 text-xs rounded-full font-medium ${badgeStyle(group.status)}`}>
                                    {getStatusTextGroup(group.status)}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="flex items-start gap-3">
                                    <div className="bg-green-100 p-2 rounded-lg">
                                        <Building2 className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Industri Tujuan</p>
                                        <p className="text-sm font-medium text-gray-900">{group.industri?.nama || "Belum dipilih"}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="bg-orange-100 p-2 rounded-lg">
                                        <CalendarIcon className="w-4 h-4 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Tanggal Pengajuan</p>
                                        <p className="text-sm font-medium text-gray-900">{group.submitted_at ? formatDate(group.submitted_at) : "-"}</p>
                                    </div>
                                </div>
                            </div>

                            {group.catatan && (
                                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4">
                                    <p className="text-xs text-blue-700 font-medium mb-1">Catatan Kelompok:</p>
                                    <p className="text-sm text-blue-900">{group.catatan}</p>
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-4 border-t">
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" onClick={() => {
                                        toast.info("Fitur kelola kelompok akan segera hadir");
                                    }}>
                                        Kelola Pengajuan
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}
