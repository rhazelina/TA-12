"use client"

import React, { useEffect, useState, useCallback } from "react";
import { getPermasalahanByPembimbing, patchPermasalahanByPembimbing } from "@/api/pembimbing";
import { Item, Pagination as PaginationType } from "@/types/permasalahan";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Search, Calendar, CheckCircle2, AlertCircle, Clock, Info, Edit, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function PermasalahanList() {
  const [permasalahan, setPermasalahan] = useState<Item[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBool, setSearchBool] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [editForm, setEditForm] = useState({
    deskripsi: "",
    status: "",
    tindak_lanjut: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditClick = (item: Item) => {
    setEditingItem(item);
    setEditForm({
      deskripsi: item.deskripsi || "",
      status: item.status || "opened",
      tindak_lanjut: item.tindak_lanjut || ""
    });
    setIsEditModalOpen(true);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      console.log(searchQuery)
      const res = await getPermasalahanByPembimbing({
        page: currentPage,
        limit,
        search: searchQuery || undefined,
        status: statusFilter === "all" ? undefined : statusFilter
      });
      setPermasalahan(res.items || []);
      setPagination(res.pagination || null);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data permasalahan");
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, statusFilter, searchBool]);

  const handleEditSubmit = async () => {
    if (!editingItem) return;
    setIsSubmitting(true);
    try {
      await patchPermasalahanByPembimbing(editingItem.id, editForm as any);
      toast.success("Permasalahan berhasil diperbarui");
      setIsEditModalOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Gagal memperbarui permasalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || "";
    switch (s) {
      case "resolved":
      case "selesai":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Selesai</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200"><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Sedang Diproses</Badge>;
      case "opened":
      default:
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200"><Clock className="w-3 h-3 mr-1" /> Belum Diproses</Badge>;
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
        <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari judul atau nama siswa..."
              className="pl-9 w-full"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
              }}
            />
            <Button
              variant="outline"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-7"
              onClick={() => {
                setCurrentPage(1);
                setSearchBool(!searchBool)
              }}
            >
              Cari
              <Search className="w-3 h-3" />
            </Button>
          </div>
          <div className="w-full sm:w-auto">
            <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <SelectValue placeholder="Semua Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="opened">Belum Diproses</SelectItem>
                <SelectItem value="in_progress">Sedang Diproses</SelectItem>
                <SelectItem value="resolved">Selesai</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin w-8 h-8 text-[#6B1B1B]" />
          </div>
        ) : permasalahan.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {permasalahan.map(item => (
              <Card key={item.id} className="hover:shadow-md transition-shadow group flex flex-col">
                <CardHeader className="pb-3 border-b">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-gray-600">{item.kategori || "Umum"}</Badge>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(item.status)}
                      {
                        item.status !== "resolved" && (
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-600" onClick={() => handleEditClick(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        )
                      }
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight line-clamp-2" title={item.judul}>
                    {item.judul}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 flex-1 flex flex-col">
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4" title={item.deskripsi}>
                    {item.deskripsi}
                  </p>

                  <div className="flex items-end justify-between mt-auto pt-4 border-t border-gray-100">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Info className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium text-gray-700 mr-1">Siswa:</span> <span className="line-clamp-1">{item.siswa?.nama || "-"}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium text-gray-700 mr-1">Tgl:</span>
                        {item.created_at ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(item.created_at)) : "-"}
                      </div>
                    </div>
                    <Link href={`/pembimbing/permasalahan/${item.id}`}>
                      <Button variant="outline" size="sm" className="ml-2 whitespace-nowrap">Detail</Button>
                    </Link>
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
              {searchQuery || statusFilter !== "all" ? "Tidak ada permasalahan yang cocok dengan pencarian Anda." : "Saat ini tidak ada data permasalahan yang dilaporkan."}
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.total_pages > 1 && (
          <div className="flex items-center justify-between bg-white px-4 py-3 sm:px-6 rounded-xl border mt-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Sebelumnya
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.total_pages))}
                disabled={currentPage === pagination.total_pages}
              >
                Selanjutnya
              </Button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Menampilkan <span className="font-medium">{(currentPage - 1) * limit + 1}</span> hingga <span className="font-medium">{Math.min(currentPage * limit, pagination.total_items)}</span> dari <span className="font-medium">{pagination.total_items}</span> hasil
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="text-sm font-medium px-4 py-2 bg-gray-50 rounded-md border">
                    Halaman {currentPage} dari {pagination.total_pages}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.total_pages))}
                    disabled={currentPage === pagination.total_pages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ubah Permasalahan</DialogTitle>
            <DialogDescription>Perbarui permasalahan untuk mengubah status dan tindak lanjut.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Deskripsi</label>
              <Textarea
                value={editForm.deskripsi}
                onChange={(e) => setEditForm({ ...editForm, deskripsi: e.target.value })}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={editForm.status} onValueChange={(val) => setEditForm({ ...editForm, status: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="opened">Belum Diproses</SelectItem>
                  <SelectItem value="in_progress">Sedang Diproses</SelectItem>
                  <SelectItem value="resolved">Selesai</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tindak Lanjut</label>
              <Textarea
                value={editForm.tindak_lanjut}
                onChange={(e) => setEditForm({ ...editForm, tindak_lanjut: e.target.value })}
                rows={3}
                placeholder="Deskripsikan tindak lanjut yang telah dilakukan..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Batal</Button>
            <Button className="bg-[#6B1B1B] hover:bg-[#5a1616] text-white" onClick={handleEditSubmit} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
