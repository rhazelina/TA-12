"use client"

import { detailKelompok, submitGroupApplication, getAvailableIndustri, withdrawGroupApplication } from "@/api/siswa";
import { GroupRegistration, Member, Industri } from "@/types/detailGrup";
import { use, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
    Loader2,
    ArrowLeft,
    Building2,
    Calendar,
    Users,
    User,
    AlertCircle,
    CheckCircle2,
    Clock,
    MapPin,
    Hash,
    Send
} from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CompanyData, ICompanyResponse } from "@/types/availableIndustri";

export default function DetailKelompokPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { user } = useAuth();

    const [data, setData] = useState<GroupRegistration | null>(null);
    const [loading, setLoading] = useState(true);

    // Submit Application States
    const [submitModalOpen, setSubmitModalOpen] = useState(false);
    const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [notes, setNotes] = useState("");
    const [industriList, setIndustriList] = useState<CompanyData[]>();
    const [selectedIndustriId, setSelectedIndustriId] = useState<string>("");

    const fetchIndustriData = async () => {
        try {
            // Note: Adust this based on the actual getIndustri response structure
            const response = await getAvailableIndustri();
            if (response && response.data && Array.isArray(response.data)) {
                setIndustriList(response.data);
            } else if (response && Array.isArray(response.data)) {
                setIndustriList(response.data);
            } else if (Array.isArray(response)) {
                setIndustriList(response);
            }
        } catch (error) {
            console.error("Failed to fetch industri", error);
        }
    };

    const fetchGroupData = () => {
        setLoading(true);
        detailKelompok(Number(id)).then((res: GroupRegistration) => {
            setData(res);
            // Pre-fill form if data already exists
            if (res.tanggal_mulai) setStartDate(res.tanggal_mulai.split('T')[0]);
            if (res.tanggal_selesai) setEndDate(res.tanggal_selesai.split('T')[0]);
            if (res.catatan) setNotes(res.catatan);
            if (res.industri?.id) setSelectedIndustriId(res.industri.id.toString());
        }).catch((err) => {
            toast.error(err.response?.data?.message || "Gagal memuat data kelompok");
            console.error(err);
        }).finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchGroupData();
    }, [id]);

    useEffect(() => {
        if (submitModalOpen) {
            fetchIndustriData();
        }
    }, [submitModalOpen]);

    const getStatusBadge = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200 uppercase"><CheckCircle2 className="w-3.5 h-3.5" /> Disetujui</span>;
            case 'rejected':
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200 uppercase"><AlertCircle className="w-3.5 h-3.5" /> Ditolak</span>;
            case 'submitted':
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200 uppercase"><Clock className="w-3.5 h-3.5" /> Diajukan</span>;
            case 'pending':
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 uppercase"><AlertCircle className="w-3.5 h-3.5" /> Tertunda</span>;
            default:
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200 uppercase">{status || 'Unknown'}</span>;
        }
    };

    const getMemberStatusBadge = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'approved':
            case 'accepted':
                return <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-green-50 text-green-600 border border-green-100 uppercase tracking-wider">Diterima</span>;
            case 'pending':
                return <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-yellow-50 text-yellow-600 border border-yellow-100 uppercase tracking-wider">Menunggu</span>;
            case 'rejected':
                return <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-red-50 text-red-600 border border-red-100 uppercase tracking-wider">Ditolak</span>;
            default:
                return <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-gray-50 text-gray-600 border border-gray-100 uppercase tracking-wider">{status}</span>;
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-500 font-medium">Memuat detail kelompok...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
                <div className="bg-red-50 p-4 rounded-full mb-4">
                    <AlertCircle className="h-10 w-10 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Data Tidak Ditemukan</h2>
                <p className="text-gray-500 mb-6 max-w-md">Maaf, kami tidak dapat menemukan detail kelompok yang Anda cari. Mungkin data telah dihapus atau Anda tidak memiliki akses.</p>
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Kembali
                </button>
            </div>
        );
    }

    const handleSubmitApplication = async () => {
        if (!selectedIndustriId && !data?.industri?.id) {
            toast.error("Harap lengkapi profil industri kelompok Anda terlebih dahulu.");
            return;
        }
        if (!startDate || !endDate) {
            toast.error("Tanggal mulai dan tanggal selesai wajib diisi.");
            return;
        }

        setIsSubmitting(true);
        try {
            await submitGroupApplication(Number(id), {
                catatan: notes,
                industri_id: Number(selectedIndustriId) || data!.industri!.id,
                tanggal_mulai: startDate,
                tanggal_selesai: endDate
            });
            toast.success("Pengajuan kelompok PKL berhasil dikirim!");
            setSubmitModalOpen(false);
            fetchGroupData(); // Refresh data
        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Gagal mengirim pengajuan");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleWithDraw = async () => {
        try {
            setIsWithdrawing(true);
            await withdrawGroupApplication(Number(id));
            toast.success("Pengajuan kelompok PKL berhasil ditarik!");
            setWithdrawModalOpen(false);
            fetchGroupData(); // Refresh data
        } catch (error) {
            console.log(error);
            toast.error("Gagal menarik pengajuan");
        } finally {
            setIsWithdrawing(false);
        }
    }

    console.log(data)

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali
                    </button>
                    {getStatusBadge(data.status)}
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 md:p-8 border-b border-gray-100">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                            <div className="space-y-4 flex-1">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                                        <Building2 className="w-8 h-8 text-blue-600" />
                                        {data.industri?.nama || 'Belum memilih industri'}
                                    </h1>
                                    {data.industri?.alamat && (
                                        <p className="mt-2 text-gray-600 flex items-start gap-2 max-w-2xl">
                                            <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
                                            <span>{data.industri.alamat}</span>
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                                    <div className="flex flex-wrap items-center gap-4 text-sm">
                                        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-gray-700">
                                            <Users className="w-4 h-4 text-gray-400" />
                                            <span className="font-medium">{data.member_count} Anggota</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-gray-700">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span className="font-medium">
                                                {data.tanggal_mulai ? format(new Date(data.tanggal_mulai), "dd MMM yyyy", { locale: idLocale }) : '-'}
                                                <span className="mx-2 text-gray-400">s/d</span>
                                                {data.tanggal_selesai ? format(new Date(data.tanggal_selesai), "dd MMM yyyy", { locale: idLocale }) : '-'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons for Leader */}
                                    {user.username === data.leader?.nama && data.status?.toLowerCase() === 'pending' && (
                                        <button
                                            onClick={() => setSubmitModalOpen(true)}
                                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2"
                                        >
                                            <Send className="w-4 h-4" />
                                            Kirim Pengajuan
                                        </button>
                                    )}
                                    {user.username === data.leader?.nama && data.status?.toLowerCase() === 'submitted' && (
                                        <button
                                            onClick={() => setWithdrawModalOpen(true)}
                                            className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2"
                                        >
                                            <Send className="w-4 h-4" />
                                            Tarik Pengajuan
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {data.catatan && (
                            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100 flex gap-3">
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-800 mb-1">Catatan</h4>
                                    <p className="text-sm text-gray-700 leading-relaxed">{data.catatan}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Members List Section */}
                    <div className="p-6 md:p-8 bg-gray-50/50">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-600" />
                                Anggota Kelompok
                            </h2>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            {/* Leader Card */}
                            {data.leader && (
                                <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center shrink-0 border border-blue-100">
                                                <User className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-bold text-gray-900">{data.leader.nama}</h3>
                                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider rounded">Ketua</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1"><Hash className="w-3.5 h-3.5" />{data.leader.nisn}</span>
                                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                    <span>{data.leader.kelas}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Regular Members Card */}
                            {data.members?.filter(m => !m.is_leader).map((member: Member, index: number) => (
                                <div key={index} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-gray-300 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center shrink-0 border border-gray-100 text-gray-400">
                                                <User className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold text-gray-900">{member.siswa.nama}</h3>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                                    <span className="flex items-center gap-1"><Hash className="w-3.5 h-3.5" />{member.siswa.nisn}</span>
                                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                    <span>{member.siswa.kelas}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {getMemberStatusBadge(member.invitation_status)}
                                    </div>
                                    {member.responded_at && (
                                        <p className="text-[11px] text-gray-400 mt-4 text-right">
                                            Direspon: {format(new Date(member.responded_at), "d MMM yyyy, HH:mm", { locale: idLocale })}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="bg-gray-50 p-4 border-t border-gray-100 text-center md:text-left text-xs text-gray-400 flex flex-col md:flex-row md:justify-between items-center gap-2">
                        <span>Dibuat pada {format(new Date(data.created_at), "dd MMMM yyyy, HH:mm", { locale: idLocale })}</span>
                        {data.approved_at && (
                            <span>Disetujui pada {format(new Date(data.approved_at), "dd MMMM yyyy, HH:mm", { locale: idLocale })}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Submit Document Modal */}
            <AlertDialog open={submitModalOpen} onOpenChange={setSubmitModalOpen}>
                <AlertDialogContent className="sm:max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <Send className="w-5 h-5 text-blue-600" />
                            Kirim Pengajuan Kelompok
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Lengkapi detail pelaksanaan PKL Anda sebelum mengirimkan pengajuan ke koordinator PKL.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="industri" className="text-gray-700 font-semibold">Tempat Industri / Magang <span className="text-red-500">*</span></Label>
                            <Select
                                value={selectedIndustriId}
                                onValueChange={setSelectedIndustriId}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Industri Tempat PKL" />
                                </SelectTrigger>
                                <SelectContent>
                                    {industriList?.map((industri) => (
                                        <SelectItem key={industri.id} value={industri.id.toString()}>
                                            {industri.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="start-date" className="text-gray-700 font-semibold">Tanggal Mulai <span className="text-red-500">*</span></Label>
                                <Input
                                    id="start-date"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="border-gray-300"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="end-date" className="text-gray-700 font-semibold">Tanggal Selesai <span className="text-red-500">*</span></Label>
                                <Input
                                    id="end-date"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="border-gray-300"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes" className="text-gray-700 font-semibold">Catatan / Pesan Tambahan</Label>
                            <Input
                                id="notes"
                                placeholder="Cth: Mengajukan PKL bulan depan"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="border-gray-300"
                            />
                            <p className="text-xs text-gray-500">Opsional, tinggalkan catatan tambahan untuk koordinator.</p>
                        </div>

                        {(!data?.industri && !selectedIndustriId) && (
                            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm flex gap-2 border border-red-200">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <p>Anda harus memilih industri tempat PKL terlebih dahulu sebelum dapat mengajukan.</p>
                            </div>
                        )}
                    </div>

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSubmitting}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleSubmitApplication();
                            }}
                            disabled={isSubmitting || !startDate || !endDate || (!selectedIndustriId && !data?.industri?.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isSubmitting ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Mengirim...</>
                            ) : (
                                "Kirim Pengajuan"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={withdrawModalOpen} onOpenChange={setWithdrawModalOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Tarik Pengajuan</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menarik pengajuan PKL ini? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleWithDraw();
                            }}
                            disabled={isWithdrawing}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isWithdrawing ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menarik...</>
                            ) : (
                                "Tarik Pengajuan"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
