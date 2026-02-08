"use client";

import { useEffect, useState } from "react";
import { getIzinByPembimbing, updateIzinByPembimbing, getSiswa } from "@/api/pembimbing";
import { ResponseIzinByPembimbing } from "@/types/api";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Calendar as CalendarIcon, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import { ImageCarousel } from "@/components/image-carousel";
import { Card, CardContent } from "@/components/ui/card";

// Interface locally defined based on observation of getSiswa usage
interface Student {
  siswa_id: number;
  siswa_nama: string;
  industri?: string;
  industri_id?: number;
  kelas?: string; // Optional, assuming might be present or we fallback
  foto_profil?: string; // Optional
}

interface EnrichedPermission extends ResponseIzinByPembimbing {
  student?: Student;
}

export default function PerizinanSiswa() {
  const [data, setData] = useState<EnrichedPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"pending" | "approved" | "rejected" | "all">("all");
  const [selectedIzin, setSelectedIzin] = useState<EnrichedPermission | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [izinRes, siswaRes] = await Promise.all([
        getIzinByPembimbing(),
        getSiswa()
      ]);

      const izinData: ResponseIzinByPembimbing[] = Array.isArray(izinRes) ? izinRes : (izinRes.data || []);
      const siswaData: Student[] = Array.isArray(siswaRes) ? siswaRes : (siswaRes.data || []);

      // Join data
      const enrichedData: EnrichedPermission[] = izinData.map(izin => {
        const student = siswaData.find(s => s.siswa_id === izin.siswa_id);
        return {
          ...izin,
          student
        };
      });

      setData(enrichedData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Gagal memuat data perizinan");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter((item) => {
    if (filterStatus === "all") return true;
    return item.status.toLowerCase() === filterStatus;
  });

  const handleAction = (izin: EnrichedPermission, type: "approve" | "reject") => {
    setSelectedIzin(izin);
    setActionType(type);
    setRejectionReason("");
    setOpenDialog(true);
  };

  const confirmAction = async () => {
    if (!selectedIzin || !actionType) return;

    if (actionType === "reject" && !rejectionReason.trim()) {
      toast.error("Alasan penolakan wajib diisi");
      return;
    }

    try {
      setSubmitting(true);
      await updateIzinByPembimbing(
        selectedIzin.id,
        actionType === "approve" ? "approved" : "rejected",
        actionType === "reject" ? rejectionReason : undefined
      );
      toast.success(`Izin berhasil ${actionType === "approve" ? "disetujui" : "ditolak"}`);
      setOpenDialog(false);
      fetchData();
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Gagal memproses izin");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
      case "disetujui":
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="w-3 h-3 mr-1" /> Disetujui</Badge>;
      case "pending":
      case "menunggu":
        return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20"><Clock className="w-3 h-3 mr-1" /> Menunggu</Badge>;
      case "rejected":
      case "ditolak":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Ditolak</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getJenisBadge = (jenis: string) => {
    switch (jenis.toLowerCase()) {
      case "sakit":
        return <Badge variant="default" className="bg-red-500">Sakit</Badge>;
      case "izin":
        return <Badge variant="default" className="bg-blue-500">Izin</Badge>;
      default:
        return <Badge variant="secondary">{jenis}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#8B1E1E]">Pengajuan Izin Peserta Didik</h1>
          <p className="text-muted-foreground">
            Kelola perizinan siswa bimbingan Anda.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={filterStatus}
            onValueChange={(value: "pending" | "approved" | "rejected" | "all") => setFilterStatus(value)}
          >
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="pending">Menunggu</SelectItem>
              <SelectItem value="approved">Disetujui</SelectItem>
              <SelectItem value="rejected">Ditolak</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={fetchData} className="bg-white">
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredData.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-white">
          <p className="text-lg font-medium text-muted-foreground">Tidak ada data perizinan</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredData.map((izin) => (
            <Card key={izin.id} className="overflow-hidden border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Student Info */}
                  <div className="flex gap-4 md:w-1/3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={izin.student?.foto_profil} alt={izin.student?.siswa_nama} />
                      <AvatarFallback>{izin.student?.siswa_nama?.charAt(0) || "S"}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-lg">{izin.student?.siswa_nama || `Siswa ID: ${izin.siswa_id}`}</h3>
                  </div>

                  {/* Permission Details */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap gap-2 items-center">
                      {getJenisBadge(izin.jenis)}
                      {getStatusBadge(izin.status)}
                      <span className="text-sm text-muted-foreground flex items-center gap-1 ml-auto md:ml-0">
                        <CalendarIcon className="w-3 h-3" />
                        {format(new Date(izin.tanggal), "EEEE, d MMM yyyy", { locale: id })}
                      </span>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Keterangan:</p>
                      <p className="text-sm bg-muted/30 p-3 rounded-md italic border">
                        "{izin.keterangan}"
                      </p>
                    </div>

                    {izin.bukti_foto_urls && izin.bukti_foto_urls.length > 0 && (
                      <div className="max-w-md">
                        <p className="text-sm font-medium text-muted-foreground mb-2">Bukti ({izin.bukti_foto_urls.length}):</p>
                        <ImageCarousel images={izin.bukti_foto_urls} />
                      </div>
                    )}

                    {izin.status.toLowerCase() === 'rejected' && izin.rejection_reason && (
                      <div className="bg-destructive/10 p-3 rounded-md text-sm text-destructive border border-destructive/20">
                        <strong>Alasan Penolakan:</strong> {izin.rejection_reason}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {(izin.status.toLowerCase() === "pending" || izin.status.toLowerCase() === "menunggu") && (
                    <div className="flex md:flex-col gap-2 justify-center md:justify-start min-w-[120px]">
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleAction(izin, "approve")}
                      >
                        Setujui
                      </Button>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => handleAction(izin, "reject")}
                      >
                        Tolak
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Setujui Izin" : "Tolak Izin"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve"
                ? "Apakah Anda yakin ingin menyetujui izin ini?"
                : "Berikan alasan penolakan izin ini."}
            </DialogDescription>
          </DialogHeader>

          {actionType === "reject" && (
            <div className="py-2">
              <Textarea
                placeholder="Tulis alasan penolakan..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="resize-none"
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)} disabled={submitting}>
              Batal
            </Button>
            <Button
              variant={actionType === "reject" ? "destructive" : "default"}
              onClick={confirmAction}
              disabled={submitting}
              className={actionType === "approve" ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {actionType === "approve" ? "Ya, Setujui" : "Tolak Izin"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
