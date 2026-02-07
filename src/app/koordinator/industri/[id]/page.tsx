"use client";

import { getIndustriById } from "@/api/admin/industri";
import { Industri } from "@/types/api";
import {
    Building2,
    ChevronLeft,
    ChevronRight,
    GraduationCap,
    Info,
    LayoutDashboard,
    Mail,
    Map,
    MapPin,
    Phone,
    Plus,
    User,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

export default function DetailIndustriPage() {
    const params = useParams();
    const router = useRouter();
    const id = Number(params.id);

    const [industri, setIndustri] = useState<Industri | null>(null);
    const [loading, setLoading] = useState(true);

    // Dummy Students Data
    const dummyStudents = [
        { id: 1, name: "Ahmad Syahputra", class: "XII RPL 1", major: "Rekayasa Perangkat Lunak", avatar: "AS" },
        { id: 2, name: "Siti Permatasari", class: "XII RPL 1", major: "Rekayasa Perangkat Lunak", avatar: "SP", color: "bg-green-100 text-green-600" },
        { id: 3, name: "Budi Prasetyo", class: "XII RPL 2", major: "Rekayasa Perangkat Lunak", avatar: "BP", color: "bg-purple-100 text-purple-600" },
        { id: 4, name: "Dewi Anggraini", class: "XII RPL 2", major: "Rekayasa Perangkat Lunak", avatar: "DA", color: "bg-pink-100 text-pink-600" },
        { id: 5, name: "Rizki Hidayat", class: "XII RPL 1", major: "Rekayasa Perangkat Lunak", avatar: "RH", color: "bg-orange-100 text-orange-600" },
    ];

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                const response = await getIndustriById(id);
                if (response && response.data) {
                    setIndustri(response.data);
                }
            } catch (error) {
                console.error("Error fetching industri detail:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#641E20]" />
            </div>
        );
    }

    if (!industri) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center gap-4">
                <h2 className="text-xl font-semibold">Industri tidak ditemukan</h2>
                <Button onClick={() => router.back()} className="bg-[#641E20] hover:bg-[#8B2D2F]">Kembali</Button>
            </div>
        );
    }

    // Input styles to mimic read-only look
    const inputStyle = "bg-white border-gray-300 rounded-md focus-visible:ring-1 focus-visible:ring-[#641E20] text-gray-700";
    const labelStyle = "text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5";
    const iconStyle = "w-3.5 h-3.5 text-blue-500";

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Detail Data Industri</h1>
                <p className="text-gray-500 text-sm">Silakan lengkapi data industri tempat PKL.</p>
            </div>

            {/* Card 1: Detail Data Industri */}
            <Card className="border border-gray-200 shadow-sm rounded-xl overflow-hidden bg-white">
                <div className="bg-blue-600 h-1 w-full"></div>
                <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {/* Column 1 */}
                        <div className="space-y-6">
                            <div>
                                <Label className={labelStyle}>
                                    <Building2 className={iconStyle} /> Nama Industri
                                </Label>
                                <Input readOnly value={industri.nama} className={inputStyle} />
                            </div>
                            <div>
                                <Label className={labelStyle}>
                                    <LayoutDashboard className={iconStyle} /> Bidang
                                </Label>
                                <Input readOnly value={industri.bidang || "-"} className={inputStyle} />
                            </div>
                            <div>
                                <Label className={labelStyle}>
                                    <MapPin className={iconStyle} /> Alamat
                                </Label>
                                <Textarea readOnly value={industri.alamat} className={`${inputStyle} min-h-[100px] resize-none`} />
                            </div>
                            <div>
                                <Label className={labelStyle}>
                                    <GraduationCap className={iconStyle} /> Jurusan
                                </Label>
                                <Input readOnly value={`Jurusan yang diterima (ID: ${industri.jurusan_id})`} className={inputStyle} />
                            </div>
                            <div>
                                <Label className={labelStyle}>
                                    <Mail className={iconStyle} /> Email Industri
                                </Label>
                                <Input readOnly value={industri.email || "-"} className={inputStyle} />
                            </div>
                        </div>

                        {/* Column 2 */}
                        <div className="space-y-6">
                            <div>
                                <Label className={labelStyle}>
                                    <Phone className={iconStyle} /> Nomor Telepon Industri
                                </Label>
                                <Input readOnly value={industri.no_telp || "-"} className={inputStyle} />
                            </div>
                            <div>
                                <Label className={labelStyle}>
                                    <User className={iconStyle} /> Nama Penanggung Jawab
                                </Label>
                                <Input readOnly value={industri.pic || "-"} className={inputStyle} />
                            </div>
                            <div>
                                <Label className={labelStyle}>
                                    <Map className={iconStyle} /> Link Maps
                                </Label>
                                <Input readOnly value={`https://maps.google.com/?q=${encodeURIComponent(industri.alamat)}`} className={inputStyle} />
                            </div>
                            <div>
                                <Label className={labelStyle}>
                                    <MapPin className={iconStyle} /> Jarak Tempuh dari Sekolah
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        readOnly
                                        value="Cek via Google Maps"
                                        className={`${inputStyle} flex-1`}
                                    />
                                    <Button
                                        variant="outline"
                                        className="whitespace-nowrap bg-white hover:bg-gray-50 text-blue-600 border-blue-200 hover:border-blue-300"
                                        onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&origin=SMK+Negeri+2+Singosari&destination=${encodeURIComponent(industri.alamat)}`, '_blank')}
                                    >
                                        <Map className="w-4 h-4 mr-2" />
                                        Buka Rute
                                    </Button>
                                </div>
                                <p className="text-[10px] text-gray-500 mt-1">
                                    *Lokasi sekolah: <a href="https://maps.app.goo.gl/nEqAABK5Xq6FCbAx7" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">SMK Negeri 2 Singosari</a>
                                </p>
                            </div>
                            <div>
                                <Label className={labelStyle}>
                                    <Info className={iconStyle} /> Info Terakhir Diubah
                                </Label>
                                <Input readOnly value={new Date(industri.updated_at).toLocaleString("id-ID", {
                                    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                })} className={`${inputStyle} bg-gray-50`} />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                        <Button
                            variant="outline"
                            onClick={() => router.back()}
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Kembali
                        </Button>
                        <Link href={`/koordinator/industri/${id}/edit`}>
                            <Button className="bg-[#641E20] hover:bg-[#4a1216] text-white px-6">
                                Edit
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Card 2: Daftar Peserta Didik */}
            <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
                <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2 text-blue-500 font-semibold">
                            <User className="w-5 h-5" />
                            <h2 className="text-lg text-gray-900 font-bold">Daftar Peserta Didik</h2>
                        </div>
                        <Button className="bg-blue-500 hover:bg-blue-600 text-white text-xs h-8">
                            <Plus className="w-3 h-3 mr-1" /> Tambah Siswa
                        </Button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Siswa</th>
                                    <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Jurusan</th>
                                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {dummyStudents.map((student, index) => (
                                    <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 px-4 text-sm text-gray-500">{index + 1}</td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${student.color || 'bg-blue-100 text-blue-600'}`}>
                                                    {student.avatar}
                                                </div>
                                                <span className="font-semibold text-gray-700">{student.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-center text-sm text-gray-500">{student.class}</td>
                                        <td className="py-4 px-4 text-sm text-gray-500">{student.major}</td>
                                        <td className="py-4 px-4 text-right">
                                            <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                                                <Info className="w-3 h-3 mr-1" /> Lihat Detail
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between mt-6 text-xs text-gray-500">
                        <p>Menampilkan 1-5 dari 5 siswa</p>
                        <div className="flex gap-1">
                            <Button variant="outline" size="icon" className="h-7 w-7 border-gray-200">
                                <ChevronLeft className="h-3 w-3" />
                            </Button>
                            <Button className="h-7 w-7 bg-[#641E20] hover:bg-[#4a1216] text-white">1</Button>
                            <Button variant="outline" size="icon" className="h-7 w-7 border-gray-200">
                                2
                            </Button>
                            <Button variant="outline" size="icon" className="h-7 w-7 border-gray-200">
                                <ChevronRight className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
