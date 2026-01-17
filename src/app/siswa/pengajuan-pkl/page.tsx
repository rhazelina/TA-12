"use client"

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { getIndustri } from "@/api/admin/industri";
import { Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useJurusanSiswaLogin, useSiswaPengajuanData } from "@/hooks/useSiswaData";
import { createPengajuan } from "@/api/admin/siswa";
import { useRouter } from "next/navigation";

interface IndustriOption {
    id: number;
    nama: string;
}

export default function FormIndustri() {
    const router = useRouter();
    const [industriOptions, setIndustriOptions] = useState<IndustriOption[]>([]);
    const [loadingIndustri, setLoadingIndustri] = useState(true);
    const [open, setOpen] = useState(false);
    const [industriId, setIndustriId] = useState<number>(0);
    const [catatan, setCatatan] = useState("");
    const { jurusan } = useJurusanSiswaLogin()
    const { dataPengajuan, loading: loadingPengajuan } = useSiswaPengajuanData()

    // Check if there is any active application (not rejected)
    const activeApplication = dataPengajuan?.find(p => p.status !== "Rejected" && p.status !== "Ditolak")

    useEffect(() => {
        const loadIndustriOptions = async () => {
            try {
                setLoadingIndustri(true);
                const response = await getIndustri("", 0, jurusan?.id);
                console.log(response.data.data);
                if (response && response.data && response.data.data) {
                    setIndustriOptions(response.data.data);
                } else {
                    toast.error("Gagal memuat data industri");
                }
            } catch (error) {
                console.error("Load industri error:", error);
                toast.error("Gagal memuat data industri");
            } finally {
                setLoadingIndustri(false);
            }
        };

        loadIndustriOptions();
    }, [jurusan]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const respponse = await createPengajuan({
                industri_id: industriId,
                catatan
            })
            if (!respponse) {
                toast.warning("Masih ada permohonan pending");
                return
            }
            router.push('/siswa/dashboard')
            toast.success("Data berhasil dikirim");
        } catch (error) {
            console.log("Create pengajuan error:", error);
            toast.warning("Gagal mengirim data pengajuan");
        }
    };

    const selectedIndustri = industriOptions.find((industri) => industri.id === industriId);

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-2xl shadow-sm border space-y-6 mx-5"
        >
            {activeApplication ? (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <span className="text-xl">⚠️</span>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                Anda sudah memiliki pengajuan yang sedang diproses atau diterima.
                                <br />
                                Status: <strong>{activeApplication.status}</strong>
                                <br />
                                Harap tunggu keputusan atau selesaikan pengajuan ini sebelum membuat baru.
                            </p>
                            <Button
                                variant="link"
                                className="p-0 h-auto text-yellow-800 underline mt-2"
                                onClick={() => router.push('/siswa/dashboard')}
                                type="button"
                            >
                                Lihat Dashboard
                            </Button>
                        </div>
                    </div>
                </div>
            ) : null}

            <h2 className="text-lg font-semibold">Pengajuan PKL</h2>

            {/* Industri */}
            <div className={`flex flex-col gap-2 ${activeApplication ? 'opacity-50 pointer-events-none' : ''}`}>
                <Label>
                    Industri <span className="text-red-500">*</span>
                </Label>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between"
                            disabled={loadingIndustri}
                        >
                            {selectedIndustri
                                ? selectedIndustri.nama
                                : loadingIndustri
                                    ? "Memuat..."
                                    : "Pilih industri..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                        <Command>
                            <CommandInput placeholder="Cari industri..." />
                            <CommandList>
                                <CommandEmpty>Industri tidak ditemukan.</CommandEmpty>
                                <CommandGroup>
                                    {industriOptions.map((industri) => (
                                        <CommandItem
                                            key={industri.id}
                                            value={industri.nama}
                                            onSelect={() => {
                                                setIndustriId(industri.id);
                                                setOpen(false);
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    industriId === industri.id
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                )}
                                            />
                                            {industri.nama}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Catatan */}
            <div className="flex flex-col gap-2">
                <Label htmlFor="catatan">Catatan</Label>
                <Textarea
                    id="catatan"
                    placeholder="Masukkan catatan (opsional)"
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    rows={4}
                />
            </div>

            {/* Tombol Kirim */}
            <Button type="submit" className="w-full" disabled={!!activeApplication || loadingIndustri}>
                Kirim Pengajuan
            </Button>
        </form>
    );
}
