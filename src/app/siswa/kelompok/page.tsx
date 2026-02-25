"use client";

import { useState, useEffect } from "react";
import { getMyGroups, getMyInvitations, respondToInvitation, deleteGroup } from "@/api/siswa/index";
import { toast } from "sonner";
import {
    Loader2,
    Plus,
    Users,
    Building2,
    Calendar,
    ChevronRight,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Clock,
    MoreVertical,
    Eye,
    Pencil,
    Trash2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import CreateGroupModal from "@/components/siswa/CreateGroupModal";
import { GroupRegistration, Member, Siswa } from "@/types/detailGrup";
import { GroupInvitation } from "@/types/invitations";
import { useAuth } from "@/hooks/useAuth";

export default function SiswaKelompokPage() {
    const [groups, setGroups] = useState<GroupRegistration[]>([]);
    const [invitations, setInvitations] = useState<GroupInvitation[]>([]);
    const [loading, setLoading] = useState(true);
    const [responding, setResponding] = useState<number | null>(null);
    const router = useRouter();
    const { user } = useAuth();

    // Delete Group Modal States
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState<GroupRegistration | null>(null);
    const [deleteValidationName, setDeleteValidationName] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getMyGroups();
            // Ensure we handle both direct array or { data: ... } wrapper if existing
            const data = Array.isArray(res) ? res : res.data || [];
            setGroups(data);
        } catch (error) {
            console.error(error);
            toast.error("Gagal memuat data kelompok");
        } finally {
            setLoading(false);
        }
    };

    const fetchInvitations = async () => {
        setLoading(true);
        try {
            const res = await getMyInvitations();
            // Ensure we handle both direct array or { data: ... } wrapper if existing
            const data = Array.isArray(res) ? res : res || [];
            if (data.data) {
                setInvitations(data.data)
            } else {
                setInvitations(data);
            }
        } catch (error) {
            console.error(error);
            toast.error("Gagal memuat data undangan");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        fetchInvitations();
    }, []);

    const handleRespond = async (invitationId: number, accept: boolean) => {
        setResponding(invitationId);
        try {
            await respondToInvitation(invitationId, { accept });
            toast.success(accept ? "Berhasil menerima undangan" : "Undangan ditolak");
            fetchData();
            fetchInvitations();
        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Gagal merespon undangan");
        } finally {
            setResponding(null);
        }
    };

    const handleDeleteGroup = async () => {
        if (!groupToDelete) return;

        setIsDeleting(true);
        try {
            await deleteGroup(groupToDelete.id);
            toast.success("Kelompok berhasil dihapus");
            setDeleteModalOpen(false);
            setGroupToDelete(null);
            setDeleteValidationName("");
            fetchData();
        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Gagal menghapus kelompok");
        } finally {
            setIsDeleting(false);
        }
    };

    const confirmDelete = (group: GroupRegistration) => {
        setGroupToDelete(group);
        setDeleteValidationName("");
        setDeleteModalOpen(true);
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'approved': return 'bg-green-100 text-green-700 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            case 'submitted': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    const getStatusText = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'approved': return 'Disetujui';
            case 'rejected': return 'Ditolak';
            case 'submitted': return 'Diajukan';
            case 'pending': return 'Tertunda';
            default: return 'Tidak Diketahui';
        }
    };

    return (
        <>
            <Tabs defaultValue="Kelompok">
                <TabsList className="mx-auto mt-4 mb-2">
                    <TabsTrigger value="Kelompok">Kelompok</TabsTrigger>
                    <TabsTrigger value="Undangan" className="flex items-center gap-2">
                        Undangan
                        {invitations.length > 0 && (
                            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                {invitations.length}
                            </span>
                        )}
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="Kelompok">
                    <div className="min-h-screen font-sans p-4 md:p-8">
                        <div className="mx-auto max-w-5xl">
                            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800">Daftar Kelompok PKL</h1>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Lihat riwayat dan status kelompok PKL Anda.
                                    </p>
                                </div>

                                <CreateGroupModal onSuccess={fetchData}>
                                    <button
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Buat Kelompok
                                    </button>
                                </CreateGroupModal>
                            </header>

                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                                    <p className="text-gray-500 text-sm">Memuat data kelompok...</p>
                                </div>
                            ) : groups.length === 0 ? (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                                    <div className="mx-auto h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                        <Users className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">Belum Ada Kelompok</h3>
                                    <p className="text-gray-500 mt-2 max-w-md mx-auto mb-6">
                                        Anda belum tergabung dalam kelompok manapun. Yuk buat kelompok baru sekarang!
                                    </p>
                                    <CreateGroupModal onSuccess={fetchData}>
                                        <button
                                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Buat Kelompok Baru
                                        </button>
                                    </CreateGroupModal>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {groups.map((group) => (
                                        <div
                                            key={group.id}
                                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow relative overflow-hidden group-card"
                                        >
                                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                                <div className="space-y-3 flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(group.status)} uppercase`}>
                                                            {getStatusText(group.status)}
                                                        </span>
                                                        <span className="text-xs text-gray-400">
                                                            Dibuat: {format(new Date(group.created_at), "dd MMM yyyy", { locale: idLocale })}
                                                        </span>
                                                    </div>

                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                                            {group.industri?.nama || "Belum memilih industri"}
                                                        </h3>
                                                        <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                                                            <Users className="h-3.5 w-3.5" />
                                                            Ketua: <span className="font-medium text-gray-700">{group.leader.nama}</span>
                                                            <span className="text-gray-300 mx-1">•</span>
                                                            {group.members.length} Anggota
                                                        </p>
                                                    </div>

                                                    {(group.tanggal_mulai && group.tanggal_selesai) && (
                                                        <div className="flex items-center gap-4 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg w-fit">
                                                            <div className="flex items-center gap-1.5">
                                                                <Calendar className="h-3.5 w-3.5" />
                                                                {format(new Date(group.tanggal_mulai), "dd MMM yyyy", { locale: idLocale })}
                                                            </div>
                                                            <span>-</span>
                                                            <div className="flex items-center gap-1.5">
                                                                <Calendar className="h-3.5 w-3.5" />
                                                                {format(new Date(group.tanggal_selesai), "dd MMM yyyy", { locale: idLocale })}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-end">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <button className="p-2 rounded-full bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                                                <MoreVertical className="h-5 w-5" />
                                                            </button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-40 cursor-pointer">
                                                            <DropdownMenuItem onClick={() => router.push(`/siswa/kelompok/${group.id}`)}>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                <span>Detail</span>
                                                            </DropdownMenuItem>
                                                            {user.username && (
                                                                user.username == group.leader.nama && (
                                                                    <>
                                                                        <DropdownMenuItem onClick={() => router.push(`/siswa/kelompok/edit/${group.id}`)}>
                                                                            <Pencil className="mr-2 h-4 w-4" />
                                                                            <span>Edit</span>
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuItem
                                                                            onClick={() => confirmDelete(group)}
                                                                            className="text-red-600 hover:!text-red-700 hover:!bg-red-50 focus:text-red-700"
                                                                        >
                                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                                            <span>Hapus</span>
                                                                        </DropdownMenuItem>
                                                                    </>
                                                                )
                                                            )
                                                            }
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>

                                            {group.catatan && (
                                                <div className="mt-4 pt-4 border-t border-gray-100">
                                                    <p className="text-xs text-gray-500 flex items-start gap-1.5">
                                                        <AlertCircle className="h-3.5 w-3.5 mt-0.5 text-yellow-500" />
                                                        <span className="italic">"{group.catatan}"</span>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="Undangan">
                    <div className="min-h-screen font-sans p-4 md:p-8">
                        <div className="mx-auto max-w-5xl">
                            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Undangan Bergabung</h1>
                                    <p className="text-gray-500">
                                        Undangan kelompok PKL dari teman Anda.
                                    </p>
                                </div>
                            </header>

                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
                                    <p className="text-gray-500 text-sm">Memuat undangan...</p>
                                </div>
                            ) : invitations.length === 0 ? (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                                    <div className="mx-auto h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                        <AlertCircle className="h-8 w-8 text-blue-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">Tidak Ada Undangan</h3>
                                    <p className="text-gray-500 mt-2 max-w-md mx-auto">
                                        Anda belum menerima undangan untuk bergabung ke kelompok manapun.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {invitations.map((inv) => (
                                        <div key={inv.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>

                                            <div className="flex items-center gap-3 mb-5">
                                                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100 text-lg shrink-0">
                                                    {inv.leader?.nama?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{inv.leader?.nama}</p>
                                                    <p className="text-xs text-gray-500">{inv.leader?.kelas} • {inv.leader?.nisn}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                <div className="flex items-start gap-2.5">
                                                    <Building2 className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                                                    <div>
                                                        <p className="font-semibold text-sm text-gray-800 line-clamp-2 leading-tight">
                                                            {inv.industri ? inv.industri.nama : 'Belum memilih industri'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2.5 text-sm text-gray-600">
                                                    <Users className="w-4 h-4 text-gray-400 shrink-0" />
                                                    <p className="font-medium text-gray-700">{inv.member_count} <span className="text-gray-500 font-normal">Anggota</span></p>
                                                </div>
                                                <div className="flex items-center gap-2.5 text-xs text-gray-500 pt-2 border-t border-gray-200">
                                                    <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                                    <p>Diundang: {format(new Date(inv.invited_at), "dd MMM, HH:mm", { locale: idLocale })}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleRespond(inv.id, false)}
                                                    disabled={responding === inv.id}
                                                    className="flex-1 flex justify-center items-center gap-1.5 py-2.5 px-3 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-semibold text-sm transition-colors disabled:opacity-50"
                                                >
                                                    {responding === inv.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />} Tolak
                                                </button>
                                                <button
                                                    onClick={() => handleRespond(inv.id, true)}
                                                    disabled={responding === inv.id}
                                                    className="flex-1 flex justify-center items-center gap-1.5 py-2.5 px-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold text-sm shadow-sm transition-colors disabled:opacity-50"
                                                >
                                                    {responding === inv.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Terima
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </TabsContent>
            </Tabs >

            {/* Delete Confirmation Modal */}
            <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                <AlertDialogContent className="sm:max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-red-600 flex items-center gap-2">
                            <AlertCircle className="h-5 w-5" />
                            Hapus Kelompok PKL
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus kelompok ini? Tindakan ini <strong>tidak dapat dibatalkan</strong> dan semua anggota akan dikeluarkan dari kelompok.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="my-4 space-y-4">
                        <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm">
                            Untuk melanjutkan, silakan ketik nama ketua kelompok: <strong>{groupToDelete?.leader?.nama || ''}</strong>
                        </div>
                        <Input
                            placeholder="Ketik nama ketua di sini..."
                            value={deleteValidationName}
                            onChange={(e) => setDeleteValidationName(e.target.value)}
                            className="border-red-200 focus-visible:ring-red-500"
                        />
                    </div>

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault(); // Prevent closing automatically
                                handleDeleteGroup();
                            }}
                            disabled={isDeleting || deleteValidationName !== groupToDelete?.leader?.nama}
                            className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                        >
                            {isDeleting ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menghapus...</>
                            ) : (
                                "Hapus Kelompok"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}