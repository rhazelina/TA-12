import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, Plus, Loader2 } from "lucide-react";
import { getAvailableMembers, createPklGroup } from "@/api/siswa/index";
import { toast } from "sonner";

interface Siswa {
    id: number;
    nama: string;
    nisn: string;
    kelas: string;
}

interface Props {
    children: React.ReactNode;
    onSuccess: () => void;
}

export default function CreateGroupModal({ children, onSuccess }: Props) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Siswa[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<Siswa[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) return;
        setIsSearching(true);
        try {
            const res = await getAvailableMembers(query);
            const data = res || [];

            // Filter out already selected members
            const filteredData = data.filter(
                (student: Siswa) => !selectedMembers.some(sm => sm.id === student.id) // return boolean
            );
            setSearchResults(filteredData);
        } catch (error) {
            console.error(error);
            toast.error("Gagal mencari data siswa");
        } finally {
            setIsSearching(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const addMember = (student: Siswa) => {
        setSelectedMembers([...selectedMembers, student]);
        setSearchResults(searchResults.filter(s => s.id !== student.id));
    };

    const removeMember = (studentId: number) => {
        setSelectedMembers(selectedMembers.filter(s => s.id !== studentId));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const memberIds = selectedMembers.map(s => s.nisn.toString());
            await createPklGroup({ invited_members: memberIds });
            toast.success("Kelompok berhasil dibuat");
            setOpen(false);

            // Reset state
            setSelectedMembers([]);
            setSearchResults([]);
            setQuery("");

            // Refresh data
            onSuccess();
        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Gagal membuat kelompok");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            // Reset when closed
            setTimeout(() => {
                setQuery("");
                setSearchResults([]);
                setSelectedMembers([]);
            }, 300);
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Buat Kelompok Baru</DialogTitle>
                    <DialogDescription>
                        Cari teman Anda berdasarkan Nama atau NISN untuk diundang ke kelompok PKL.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Search Input */}
                    <div className="flex gap-2">
                        <Input
                            placeholder="Cari nama atau NISN..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <Button type="button" onClick={handleSearch} disabled={isSearching} className="bg-blue-600 hover:bg-blue-700 text-white">
                            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                        </Button>
                    </div>

                    {/* Search Results */}
                    {searchResults.length > 0 && (
                        <div className="border border-gray-200 rounded-md overflow-hidden bg-white max-h-48 overflow-y-auto shadow-sm">
                            {searchResults.map(student => (
                                <div
                                    key={student.id}
                                    className="px-4 py-3 border-b last:border-0 flex justify-between items-center hover:bg-gray-50 transition-colors cursor-pointer"
                                    onClick={() => addMember(student)}
                                >
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">{student.nama}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{student.nisn} • {student.kelas}</p>
                                    </div>
                                    <button className="p-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors">
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {searchResults.length === 0 && query && !isSearching && (
                        <div className="text-center py-4 bg-gray-50 rounded-md border border-gray-100">
                            <p className="text-sm text-gray-500">Gunakan pencarian untuk menemukan siswa.</p>
                        </div>
                    )}

                    {/* Selected Members */}
                    <div className="space-y-3 mt-4">
                        <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                            Anggota Terpilih
                            <span className="bg-blue-100 text-blue-700 py-0.5 px-2 rounded-full text-xs">{selectedMembers.length}</span>
                        </h4>

                        {selectedMembers.length === 0 ? (
                            <div className="text-center py-6 bg-gray-50 border border-gray-100 border-dashed rounded-lg">
                                <p className="text-sm text-gray-400">Belum ada anggota yang dipilih</p>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                {selectedMembers.map(student => (
                                    <div key={student.id} className="flex justify-between items-center bg-white border border-gray-200 px-4 py-3 rounded-lg shadow-sm">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">{student.nama}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{student.nisn} • {student.kelas}</p>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                                            onClick={() => removeMember(student.id)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t mt-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Batal
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]">
                        {isSubmitting ? (
                            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Memproses...</>
                        ) : (
                            'Buat Kelompok & Kirim Undangan'
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
