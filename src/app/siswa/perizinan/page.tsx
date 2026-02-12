'use client'

import { getIzinBySiswa, createIzin, deleteIzinBySiswa, updateIzinBySiswa } from "@/api/siswa";
import { ResponseIzinBySiswa } from "@/types/api";
import { useEffect, useState } from "react";
import { Plus, Calendar as CalendarIcon, FileText, Loader2, Clock, CheckCircle, XCircle, Pencil, Trash2 } from "lucide-react";
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
import { ImageCarousel } from "@/components/image-carousel";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";



const formSchema = z.object({
    jenis: z.string().min(1, "Jenis izin harus dipilih"),
    tanggal: z.date({
        message: "Tanggal harus dipilih",
    }),
    keterangan: z.string().min(5, "Keterangan harus diisi minimal 5 karakter"),
    file: z.instanceof(FileList).optional(),
});

export default function PerizinanPage() {
    const [data, setData] = useState<ResponseIzinBySiswa[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIzin, setSelectedIzin] = useState<ResponseIzinBySiswa | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [open, setOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState<"pending" | "approved" | "rejected" | "all">("all");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            jenis: "",
            keterangan: "",
        },
    });

    const fetchIzin = async function () {
        try {
            setLoading(true);
            const status = filterStatus === "all" ? undefined : filterStatus;
            const res = await getIzinBySiswa(status);
            if (Array.isArray(res)) {
                setData(res);
            } else if (res && Array.isArray(res.data)) {
                setData(res.data);
            } else {
                setData([]);
            }
        } catch (error) {
            console.error("Failed to fetch izin:", error);
            toast.error("Gagal memuat data perizinan");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIzin();
    }, [filterStatus]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (!selectedIzin && (!values.file || values.file.length === 0)) {
                form.setError("file", { message: "Bukti foto wajib diunggah" });
                return;
            }

            const submitData = new FormData();
            submitData.append("jenis", values.jenis);
            submitData.append("tanggal", format(values.tanggal, "yyyy-MM-dd"));
            submitData.append("keterangan", values.keterangan);

            if (values.file && values.file.length > 0) {
                Array.from(values.file).forEach((file) => {
                    submitData.append("files", file);
                })
            }

            if (selectedIzin) {
                await updateIzinBySiswa(selectedIzin.id, submitData);
                toast.success("Izin berhasil diperbarui");
            } else {
                await createIzin(submitData);
                toast.success("Izin berhasil diajukan");
            }

            setOpen(false);
            setSelectedIzin(null);
            form.reset();
            fetchIzin();
        } catch (error: any) {
            console.error("Submit error:", error);
            toast.error(error.response?.data?.message || "Gagal menyimpan izin");
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteIzinBySiswa(deleteId);
            toast.success("Izin berhasil dihapus");
            fetchIzin();
        } catch (error: any) {
            console.error("Delete error:", error);
            toast.error(error.response?.data?.message || "Gagal menghapus izin");
        } finally {
            setIsDeleteOpen(false);
            setDeleteId(null);
        }
    };

    const handleEdit = (izin: ResponseIzinBySiswa) => {
        setSelectedIzin(izin);
        form.reset({
            jenis: izin.jenis,
            keterangan: izin.keterangan,
            tanggal: new Date(izin.tanggal),
        });
        setOpen(true);
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
    }


    return (
        <div className="space-y-6 mx-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Riwayat Perizinan</h1>
                    <p className="text-muted-foreground">
                        Daftar riwayat perizinan yang telah Anda ajukan.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Select
                        value={filterStatus}
                        onValueChange={(value: "pending" | "approved" | "rejected" | "all") => setFilterStatus(value)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="pending">Menunggu</SelectItem>
                            <SelectItem value="approved">Disetujui</SelectItem>
                            <SelectItem value="rejected">Ditolak</SelectItem>
                        </SelectContent>
                    </Select>
                    <Dialog open={open} onOpenChange={(isOpen) => {
                        setOpen(isOpen);
                        if (!isOpen) {
                            setSelectedIzin(null);
                            form.reset();
                        }
                    }}>
                        <DialogTrigger asChild>
                            <Button onClick={() => {
                                setSelectedIzin(null);
                                form.reset({
                                    jenis: "",
                                    keterangan: "",
                                    tanggal: undefined,
                                });
                            }}>
                                <Plus className="w-4 h-4 mr-2" />
                                Ajukan Izin
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>{selectedIzin ? "Edit Izin" : "Ajukan Izin Baru"}</DialogTitle>
                                <DialogDescription>
                                    {selectedIzin ? "Ubah data perizinan yang sudah diajukan." : "Isi formulir di bawah ini untuk mengajukan perizinan baru."}
                                </DialogDescription>
                            </DialogHeader>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="jenis"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Jenis Izin</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Pilih jenis izin" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Sakit">Sakit</SelectItem>
                                                        <SelectItem value="Izin">Izin</SelectItem>
                                                        <SelectItem value="Dispen">Dispen</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="tanggal"
                                        render={({ field }) => {
                                            return (
                                                <FormItem className="flex flex-col">
                                                    <FormLabel>Tanggal</FormLabel>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    disabled={!!selectedIzin}
                                                                    variant={"outline"}
                                                                    className={`w-full pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                                                                >
                                                                    {field.value ? (
                                                                        format(field.value, "PPP", { locale: id })
                                                                    ) : (
                                                                        <span>Pilih tanggal</span>
                                                                    )}
                                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={field.value}
                                                                onSelect={field.onChange}
                                                                disabled={(date) =>
                                                                    date < new Date(new Date().setHours(0, 0, 0, 0)) // Disable past dates? Maybe allows past dates for reporting sickness. Let's allow all for now or maybe block future dates too far ahead?
                                                                    // Usually for permission, it can be future or past (if emergency). Let's keep it open or just disable nothing specific for now.
                                                                }
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage />
                                                </FormItem>
                                            )
                                        }
                                        }
                                    />

                                    <FormField
                                        control={form.control}
                                        name="keterangan"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Keterangan</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Jelaskan alasan perizinan Anda..."
                                                        className="resize-none"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="file"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Bukti Foto (Khusus Sakit)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="file"
                                                        accept="image/png, image/jpeg"
                                                        ref={field.ref}
                                                        name={field.name}
                                                        onBlur={field.onBlur}
                                                        onChange={(e) => {
                                                            field.onChange(e.target.files);
                                                        }}
                                                        multiple
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Unggah foto surat dokter atau bukti lainnya (Wajib jika Sakit). Maks 3 Foto
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <DialogFooter>
                                        <Button type="submit" disabled={form.formState.isSubmitting}>
                                            {form.formState.isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                            Kirim Pengajuan
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {
                loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-muted/10">
                        <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium text-muted-foreground">Belum ada riwayat perizinan</p>
                        <Button variant="link" onClick={() => {
                            setSelectedIzin(null);
                            form.reset({
                                jenis: "",
                                keterangan: "",
                                tanggal: undefined,
                            });
                            setOpen(true);
                        }}>Ajukan sekarang</Button>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {data.map((izin) => (
                            <Card key={izin.id} className="overflow-hidden">
                                <CardHeader className="bg-muted/30 pb-3">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <CardTitle className="text-base font-semibold">
                                                {format(new Date(izin.tanggal), "EEEE, d MMM yyyy", { locale: id })}
                                            </CardTitle>
                                            <CardDescription className="text-xs">
                                                Diajukan pada {format(new Date(izin.created_at), "d MMM yyyy HH:mm", { locale: id })}
                                            </CardDescription>
                                        </div>
                                        {getJenisBadge(izin.jenis)}
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Status</span>
                                            {getStatusBadge(izin.status)}
                                        </div>
                                        <div className="pt-2">
                                            <p className="text-sm font-medium text-muted-foreground mb-1">Keterangan:</p>
                                            <p className="text-sm line-clamp-3 italic">"{izin.keterangan}"</p>
                                        </div>
                                        {izin.bukti_foto_urls && izin.bukti_foto_urls.length > 0 && (
                                            <div className="pt-2">
                                                <p className="text-sm font-medium text-muted-foreground mb-1">Bukti ({izin.bukti_foto_urls.length} Foto):</p>
                                                <ImageCarousel images={izin.bukti_foto_urls} />
                                            </div>
                                        )}
                                        {izin.status === 'rejected' && izin.rejection_reason && (
                                            <div className="pt-2 bg-destructive/10 p-2 rounded text-xs text-destructive">
                                                <strong>Alasan Ditolak:</strong> {izin.rejection_reason}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-end gap-2 bg-muted/30 p-2">
                                    {(izin.status.toLowerCase() === 'menunggu' || izin.status.toLowerCase() === 'pending') && (
                                        <>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                onClick={() => handleEdit(izin)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                onClick={() => {
                                                    setDeleteId(izin.id);
                                                    setIsDeleteOpen(true);
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )
            }

            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Data perizinan akan dihapus secara permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div >
    );
}