"use client"

import * as React from "react"
import { useSiswaPengajuanData, useSiswaDataLogin, useJurusanSiswaLogin } from "@/hooks/useSiswaData"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2, Building2, Check, ChevronsUpDown, X, Upload, FileText } from "lucide-react"
import { getIndustri, getIndustriById } from "@/api/admin/industri"
import { pindahPklSiswa } from "@/api/siswa"
import { cn } from "@/lib/utils"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Industri } from "@/types/api"
import { useDebounce } from "@/hooks/use-debounce"
import { useRouter } from "next/navigation"

export default function PindahPklPage() {
    const { dataPengajuan, loading: loadingPengajuan } = useSiswaPengajuanData()
    const { siswa } = useSiswaDataLogin()
    const { jurusan } = useJurusanSiswaLogin()
    const router = useRouter()

    const [activePkl, setActivePkl] = React.useState<any | null>(null)
    const [currentIndustriName, setCurrentIndustriName] = React.useState("Loading...")

    // Form State
    const [alasan, setAlasan] = React.useState("")
    const [files, setFiles] = React.useState<File[]>([])
    const [selectedIndustri, setSelectedIndustri] = React.useState<Industri | null>(null)

    // Industry Search State
    const [open, setOpen] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [industries, setIndustries] = React.useState<Industri[]>([])
    const [loadingIndustries, setLoadingIndustries] = React.useState(false)

    // Submission State
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const debouncedSearch = useDebounce(searchQuery, 300)

    // Check for Active PKL
    React.useEffect(() => {
        if (dataPengajuan) {
            const approved = dataPengajuan.find(p => p.status === "Approved")
            setActivePkl(approved || null)

            if (approved) {
                getIndustriById(approved.industri_id).then(res => {
                    setCurrentIndustriName(res?.data?.nama || "Unknown Industry")
                }).catch(() => setCurrentIndustriName("Error loading industry"))
            }
        }
    }, [dataPengajuan])

    // Load Industries (Debounced)
    React.useEffect(() => {
        const fetchIndustries = async () => {
            setLoadingIndustries(true)
            try {
                // Fetch industries, possibly filtered by jurusan if that's a requirement, 
                // typically page 1 with search query
                const res = await getIndustri(debouncedSearch, 1, jurusan?.id)
                if (res?.data?.data) {
                    setIndustries(res.data.data)
                } else {
                    setIndustries([])
                }
            } catch (error) {
                console.error("Failed to fetch industries", error)
                toast.error("Gagal memuat daftar industri")
            } finally {
                setLoadingIndustries(false)
            }
        }

        // Only search if open or initial load
        if (open || debouncedSearch) {
            fetchIndustries()
        }
    }, [debouncedSearch, open, jurusan?.id])


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files)

            // Validation
            const validFiles: File[] = []
            let errorMsg = ""

            if (files.length + newFiles.length > 5) {
                toast.error("Maksimal 5 file yang diperbolehkan")
                return
            }

            for (const file of newFiles) {
                // Check size (5MB)
                if (file.size > 5 * 1024 * 1024) {
                    errorMsg = `File ${file.name} terlalu besar (max 5MB)`
                    continue
                }
                // Check type (JPEG/PNG/PDF)
                if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
                    errorMsg = `File ${file.name} format tidak valid (hanya JPEG, PNG, PDF)`
                    continue
                }
                validFiles.push(file)
            }

            if (errorMsg) {
                toast.error(errorMsg)
            }

            setFiles(prev => [...prev, ...validFiles])
        }
        // Reset input value to allow selecting same file again if needed (though controlled usually handles this via state)
        e.target.value = ''
    }

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async () => {
        if (!selectedIndustri) {
            toast.error("Silakan pilih industri tujuan baru")
            return
        }
        if (!alasan.trim()) {
            toast.error("Silakan isi alasan kepindahan")
            return
        }
        if (files.length === 0) {
            toast.error("Silakan unggah minimal 1 file pendukung")
            return
        }

        setIsSubmitting(true)
        try {
            const formData = new FormData()
            formData.append("industri_baru_id", selectedIndustri.id.toString())
            formData.append("alasan", alasan)

            files.forEach((file) => {
                formData.append("files", file)
            })

            await pindahPklSiswa(formData)

            toast.success("Permohonan pindah PKL berhasil dikirim", {
                description: "Menunggu persetujuan dari Kaprodi"
            })

            // Reset form or redirect
            setAlasan("")
            setFiles([])
            setSelectedIndustri(null)

            // Optionally redirect
            router.refresh()

        } catch (error: any) {
            console.error(error)
            toast.error(error.response?.data?.message || "Gagal mengirim permohonan")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loadingPengajuan) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!activePkl) {
        return (
            <div className="p-8 max-w-4xl mx-auto">
                <Card className="bg-orange-50 border-orange-200">
                    <CardHeader>
                        <CardTitle className="text-orange-700 flex items-center gap-2">
                            ⚠️ Tidak Ada PKL Aktif
                        </CardTitle>
                        <CardDescription className="text-orange-600">
                            Anda belum memiliki status PKL "Disetujui". Pindah PKL hanya tersedia untuk siswa yang sedang menjalani PKL.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50/50 py-8 px-4 md:px-8">
            <div className="max-w-3xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Pindah Tempat PKL</h1>
                    <p className="text-gray-500 mt-1">Ajukan pemindahan tempat magang ke industri baru.</p>
                </div>

                {/* Info PKL Saat Ini */}
                <Card className="bg-white shadow-sm border-none ring-1 ring-gray-200">
                    <CardHeader className="pb-3 border-b border-gray-100">
                        <CardTitle className="text-lg font-medium">Status Magang Saat Ini</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50/50 border border-blue-100">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                <Building2 className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Industri Lama</p>
                                <p className="font-semibold text-gray-900">{currentIndustriName}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Form Pindah */}
                <Card className="bg-white shadow-md border-none ring-1 ring-gray-200">
                    <CardHeader>
                        <CardTitle>Formulir Pengajuan</CardTitle>
                        <CardDescription>Lengkapi data tempat tujuan baru dan alasan pindah.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* 1. Pilih Industri Baru */}
                        <div className="space-y-2">
                            <Label>Industri Tujuan Baru</Label>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className="w-full justify-between h-11 bg-white"
                                    >
                                        {selectedIndustri
                                            ? selectedIndustri.nama
                                            : "Pilih industri tujuan..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                                    <Command shouldFilter={false}>
                                        <CommandInput
                                            placeholder="Cari nama industri..."
                                            value={searchQuery}
                                            onValueChange={setSearchQuery}
                                        />
                                        <CommandList>
                                            {loadingIndustries && (
                                                <div className="py-6 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Memuat data...
                                                </div>
                                            )}

                                            {!loadingIndustries && industries.length === 0 && (
                                                <CommandEmpty>Tidak ada industri ditemukan.</CommandEmpty>
                                            )}

                                            {!loadingIndustries && (
                                                <CommandGroup>
                                                    {industries.map((industri) => (
                                                        <CommandItem
                                                            key={industri.id}
                                                            value={industri.nama} // Use name for internal command filter if enabled, but we use ID
                                                            onSelect={() => {
                                                                setSelectedIndustri(industri)
                                                                setOpen(false)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    selectedIndustri?.id === industri.id ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            <div className="flex flex-col">
                                                                <span>{industri.nama}</span>
                                                                <span className="text-xs text-muted-foreground">{industri.alamat}</span>
                                                            </div>
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            )}
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <p className="text-[0.8rem] text-muted-foreground">
                                Pilih industri dari daftar mitra yang tersedia.
                            </p>
                        </div>

                        {/* 2. Alasan */}
                        <div className="space-y-2">
                            <Label htmlFor="alasan">Alasan Pindah</Label>
                            <Textarea
                                id="alasan"
                                placeholder="Jelaskan secara rinci alasan Anda mengajukan kepindahan..."
                                className="min-h-[120px] resize-y"
                                value={alasan}
                                onChange={(e) => setAlasan(e.target.value)}
                            />
                        </div>

                        {/* 3. Upload File */}
                        <div className="space-y-4">
                            <Label>Dokumen Pendukung <span className="text-muted-foreground text-xs font-normal">(Surat permohonan, bukti penerimaan baru, dll)</span></Label>

                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors text-center cursor-pointer relative">
                                <Input
                                    type="file"
                                    multiple
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    onChange={handleFileChange}
                                    disabled={files.length >= 5}
                                />
                                <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                        <Upload className="h-5 w-5" />
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">
                                        Klik untuk upload atau drag & drop
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Max 5 files (PDF, JPEG, PNG, max 5MB/file)
                                    </div>
                                </div>
                            </div>

                            {/* File List */}
                            {files.length > 0 && (
                                <div className="grid gap-2">
                                    {files.map((file, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-md group">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="h-8 w-8 bg-white border border-gray-200 rounded flex items-center justify-center shrink-0">
                                                    <FileText className="h-4 w-4 text-blue-500" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
                                                onClick={() => removeFile(idx)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="pt-2 pb-6">
                        <Button
                            className="w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 h-11 text-base"
                            onClick={handleSubmit}
                            disabled={isSubmitting || !selectedIndustri || !alasan || files.length === 0}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Mengirim Permohonan...
                                </>
                            ) : (
                                "Kirim Permohonan Pindah PKL"
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}