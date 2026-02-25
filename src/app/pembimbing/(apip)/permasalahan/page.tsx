"use client"

import React, { useEffect, useState } from "react";
import { getPermasalahanByPembimbing } from "@/api/pembimbing";
import { Item } from "@/types/permasalahan";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Search, Calendar, CheckCircle2, AlertCircle, Clock, Info } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function PermasalahanList() {
  const [permasalahan, setPermasalahan] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPermasalahanByPembimbing();
        setPermasalahan(res.items || []);
      } catch (error) {
        console.error(error);
        toast.error("Gagal memuat data permasalahan");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = permasalahan.filter(item =>
    item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.siswa?.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || "";
    switch (s) {
      case "approved":
      case "selesai":
      case "resolved":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Selesai</Badge>;
      case "rejected":
      case "ditolak":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200"><AlertCircle className="w-3 h-3 mr-1" /> Ditolak</Badge>;
      case "pending":
      case "menunggu":
      default:
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200"><Clock className="w-3 h-3 mr-1" />{status || "Pending"}</Badge>;
    }
  };

  return (
    <div className="flex-1 bg-[#fafafa] min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Daftar Permasalahan</h2>
            <p className="text-gray-500 mt-1">Daftar pengaduan masalah siswa PKL yang Anda bimbing</p>
          </div>
          <Link href="/pembimbing/permasalahan/buat">
            <Button className="bg-[#6B1B1B] hover:bg-[#5a1616] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Buat Pengaduan
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari judul atau nama siswa..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin w-8 h-8 text-[#6B1B1B]" />
          </div>
        ) : filteredData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map(item => (
              <Card key={item.id} className="hover:shadow-md transition-shadow group flex flex-col">
                <CardHeader className="pb-3 border-b">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-gray-600">{item.kategori || "Umum"}</Badge>
                    {getStatusBadge(item.status)}
                  </div>
                  <CardTitle className="text-lg leading-tight line-clamp-2" title={item.judul}>
                    {item.judul}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 flex-1 flex flex-col">
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4" title={item.deskripsi}>
                    {item.deskripsi}
                  </p>

                  <div className="space-y-2 mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                      <Info className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-medium text-gray-700 mr-1">Siswa:</span> {item.siswa?.nama || "-"}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-medium text-gray-700 mr-1">Tgl:</span>
                      {item.created_at ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(item.created_at)) : "-"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Belum ada permasalahan</h3>
            <p className="text-gray-500 mt-1 max-w-sm">
              {searchQuery ? "Tidak ada permasalahan yang cocok dengan pencarian Anda." : "Saat ini tidak ada data permasalahan yang dilaporkan."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
