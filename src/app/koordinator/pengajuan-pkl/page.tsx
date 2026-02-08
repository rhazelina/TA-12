'use client';

import { useEffect, useState } from "react";
import { ListPermohonanPKL, ListGuruPembimbing, ApprovePermohonanPKL, RejectPermohonanPKL } from "@/api/kapro/indext";
import { DaftarPermohonanPKL, DaftarGuruPembimbing } from "@/types/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Search, CheckCircle, XCircle, Printer } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { getSekolah } from "@/api/admin/sekolah";
import { SuratPermohonanModal } from "@/components/koordinator/SuratPermohonanModal";

export default function PengajuanPKLPage() {
    const [applications, setApplications] = useState<DaftarPermohonanPKL[]>([]);
    const [supervisors, setSupervisors] = useState<DaftarGuruPembimbing[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // Approve Dialog State
    const [isApproveOpen, setIsApproveOpen] = useState(false);
    const [selectedApp, setSelectedApp] = useState<DaftarPermohonanPKL | null>(null);
    const [supervisorId, setSupervisorId] = useState<string>("");
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [notes, setNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reject Dialog State
    const [isRejectOpen, setIsRejectOpen] = useState(false);
    const [rejectNotes, setRejectNotes] = useState("");

    // Letter Modal State
    const [isLetterOpen, setIsLetterOpen] = useState(false);
    const [schoolData, setSchoolData] = useState<any>(null); // Should type properly but using any for simple integration

    const fetchData = async () => {
        setLoading(true);
        try {
            const [appsRes, supervisorsRes, schoolRes] = await Promise.all([
                ListPermohonanPKL(search),
                ListGuruPembimbing(),
                getSekolah()
            ]);

            if (appsRes && appsRes.data) {
                setApplications(appsRes.data);
            }
            if (supervisorsRes && supervisorsRes.data) {
                setSupervisors(supervisorsRes.data);
            }
            if (schoolRes && schoolRes.data) {
                setSchoolData(schoolRes.data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Gagal memuat data pengajuan");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 500); // Debounce search
        return () => clearTimeout(timer);
    }, [search]);

    const handleApprove = async () => {
        if (!selectedApp || !startDate || !endDate || !supervisorId) {
            toast.error("Mohon lengkapi semua data");
            return;
        }

        setIsSubmitting(true);
        try {
            await ApprovePermohonanPKL(selectedApp.application.id, {
                pembimbing_guru_id: parseInt(supervisorId),
                tanggal_mulai: format(startDate, "yyyy-MM-dd"),
                tanggal_selesai: format(endDate, "yyyy-MM-dd"),
                catatan: notes
            });
            toast.success("Pengajuan berhasil disetujui");
            setIsApproveOpen(false);
            fetchData();
        } catch (error) {
            console.error("Error approving application:", error);
            toast.error("Gagal menyetujui pengajuan");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReject = async () => {
        if (!selectedApp || !rejectNotes) {
            toast.error("Mohon isi alasan penolakan");
            return;
        }

        setIsSubmitting(true);
        try {
            await RejectPermohonanPKL(selectedApp.application.id, {
                catatan: rejectNotes
            });
            toast.success("Pengajuan berhasil ditolak");
            setIsRejectOpen(false);
            fetchData();
        } catch (error) {
            console.error("Error rejecting application:", error);
            toast.error("Gagal menolak pengajuan");
        } finally {
            setIsSubmitting(false);
        }
    };

    const openApproveDialog = (app: DaftarPermohonanPKL) => {
        setSelectedApp(app);
        setSupervisorId("");
        setStartDate(undefined);
        setEndDate(undefined);
        setNotes("");
        setIsApproveOpen(true);
    };

    const openRejectDialog = (app: DaftarPermohonanPKL) => {
        setSelectedApp(app);
        setRejectNotes("");
        setIsRejectOpen(true);
    };

    const openLetterModal = (app: DaftarPermohonanPKL) => {
        setSelectedApp(app);
        setIsLetterOpen(true);
    };

    const filteredApplications = applications.filter(app => {
        if (statusFilter === "all") return true;
        return app.application.status.toLowerCase() === statusFilter.toLowerCase();
    });

    return (
        <div className="container mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold">Pengajuan PKL</h1>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-1/3">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari nama siswa..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[200px]">
                        <SelectValue placeholder="Filter Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Disetujui</SelectItem>
                        <SelectItem value="rejected">Ditolak</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Daftar Pengajuan</CardTitle>
                    <CardDescription>Kelola pengajuan PKL dari siswa.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No</TableHead>
                                    <TableHead>Siswa</TableHead>
                                    <TableHead>Kelas</TableHead>
                                    <TableHead>Industri</TableHead>
                                    <TableHead>Tanggal Pengajuan</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-10">
                                            <div className="flex justify-center items-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredApplications.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                            Tidak ada data pengajuan.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredApplications.map((app, index) => (
                                        <TableRow key={app.application.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{app.siswa_username}</span>
                                                    <span className="text-xs text-muted-foreground">{app.siswa_nisn}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span>{app.kelas_nama}</span>
                                                    <span className="text-xs text-muted-foreground">{app.jurusan_nama}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{app.industri_nama}</TableCell>
                                            <TableCell>{format(new Date(app.application.tanggal_permohonan), "dd MMM yyyy")}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        app.application.status === "Approved" ? "default" :
                                                            app.application.status === "Rejected" || app.application.status === "Ditolak" ? "destructive" :
                                                                "secondary"
                                                    }
                                                    className={
                                                        app.application.status === "Approved" ? "bg-green-500 hover:bg-green-600" :
                                                            app.application.status === "Pending" ? "bg-yellow-500 hover:bg-yellow-600 text-white" : ""
                                                    }
                                                >
                                                    {app.application.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                                                    onClick={() => openLetterModal(app)}
                                                >
                                                    <Printer className="h-4 w-4 mr-1" />
                                                    Surat
                                                </Button>
                                                {app.application.status === "Pending" && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                                                            onClick={() => openApproveDialog(app)}
                                                        >
                                                            <CheckCircle className="h-4 w-4 mr-1" />
                                                            Setujui
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                                            onClick={() => openRejectDialog(app)}
                                                        >
                                                            <XCircle className="h-4 w-4 mr-1" />
                                                            Tolak
                                                        </Button>
                                                    </>
                                                )}
                                                {app.application.status !== "Pending" && (
                                                    <Button size="sm" variant="ghost" disabled>
                                                        Selesai
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Dialog Approve */}
            <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Setujui Pengajuan PKL</DialogTitle>
                        <DialogDescription>
                            Tentukan pembimbing dan periode PKL untuk <b>{selectedApp?.siswa_username}</b>.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="pembimbing">Guru Pembimbing</Label>
                            <Select value={supervisorId} onValueChange={setSupervisorId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Guru Pembimbing" />
                                </SelectTrigger>
                                <SelectContent>
                                    {supervisors.map((guru) => (
                                        <SelectItem key={guru.id} value={guru.id.toString()}>
                                            {guru.nama} - {guru.nip}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Tanggal Mulai</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !startDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {startDate ? format(startDate, "PPP") : <span>Pilih tanggal</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={startDate}
                                            onSelect={setStartDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="grid gap-2">
                                <Label>Tanggal Selesai</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !endDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {endDate ? format(endDate, "PPP") : <span>Pilih tanggal</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={endDate}
                                            onSelect={setEndDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="catatan">Catatan (Opsional)</Label>
                            <Textarea
                                id="catatan"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Tambahkan catatan untuk siswa..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsApproveOpen(false)} disabled={isSubmitting}>Batal</Button>
                        <Button onClick={handleApprove} disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Setujui
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog Reject */}
            <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Tolak Pengajuan PKL</DialogTitle>
                        <DialogDescription>
                            Berikan alasan penolakan untuk <b>{selectedApp?.siswa_username}</b>.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="alasan">Alasan Penolakan</Label>
                            <Textarea
                                id="alasan"
                                value={rejectNotes}
                                onChange={(e) => setRejectNotes(e.target.value)}
                                placeholder="Jelaskan kenapa pengajuan ditolak..."
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRejectOpen(false)} disabled={isSubmitting}>Batal</Button>
                        <Button variant="destructive" onClick={handleReject} disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Tolak Pengajuan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <SuratPermohonanModal
                isOpen={isLetterOpen}
                onClose={() => setIsLetterOpen(false)}
                application={selectedApp}
                allApplications={applications}
                schoolData={schoolData}
            />
        </div>
    );
}