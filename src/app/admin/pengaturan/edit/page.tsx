"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { getSekolah, updateSekolah } from "@/api/admin/sekolah"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"

const formSchema = z.object({
    nama_sekolah: z.string().min(1, "Nama sekolah wajib diisi"),
    npsn: z.string().min(1, "NPSN wajib diisi"),
    jalan: z.string().nullable().optional(),
    kelurahan: z.string().nullable().optional(),
    kecamatan: z.string().nullable().optional(),
    kabupaten_kota: z.string().nullable().optional(),
    provinsi: z.string().nullable().optional(),
    kode_pos: z.string().nullable().optional(),
    nomor_telepon: z.string().nullable().optional(),
    email: z.string().email("Format email tidak valid").nullable().optional().or(z.literal("")),
    website: z.string().nullable().optional(),
    kepala_sekolah: z.string().nullable().optional(),
    nip_kepala_sekolah: z.string().nullable().optional(),
    akreditasi: z.string().nullable().optional(),
    logo: z.string().nullable().optional(),
})

export default function EditSekolahPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [sekolahId, setSekolahId] = useState<number | null>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nama_sekolah: "",
            npsn: "",
            jalan: "",
            kelurahan: "",
            kecamatan: "",
            kabupaten_kota: "",
            provinsi: "",
            kode_pos: "",
            nomor_telepon: "",
            email: "",
            website: "",
            kepala_sekolah: "",
            nip_kepala_sekolah: "",
            akreditasi: "",
            logo: "",
        },
    })

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await getSekolah()
                if (response && response.success) {
                    const data = response.data
                    setSekolahId(data.id)
                    form.reset({
                        nama_sekolah: data.nama_sekolah || "",
                        npsn: data.npsn || "",
                        jalan: data.jalan || "",
                        kelurahan: data.kelurahan || "",
                        kecamatan: data.kecamatan || "",
                        kabupaten_kota: data.kabupaten_kota || "",
                        provinsi: data.provinsi || "",
                        kode_pos: data.kode_pos || "",
                        nomor_telepon: data.nomor_telepon || "",
                        email: data.email || "",
                        website: data.website || "",
                        kepala_sekolah: data.kepala_sekolah || "",
                        nip_kepala_sekolah: data.nip_kepala_sekolah || "",
                        akreditasi: data.akreditasi || "",
                        logo: data.logo_url || "", // Using logo_url as the value for logo field in form for display/edit if it was a url input
                    })
                }
            } catch (error) {
                console.error("Error loading school data:", error)
                toast.error("Gagal memuat data sekolah")
            } finally {
                setIsLoading(false)
            }
        }

        loadData()
    }, [form])

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSaving(true)
        try {
            // Remove null values or convert empty strings to null if backend expects that
            // For now sending as is, assuming backend handles updates
            if (!sekolahId) {
                toast.error("ID Sekolah tidak ditemukan")
                setIsSaving(false)
                return
            }
            await updateSekolah(values, sekolahId)
            toast.success("Berhasil memperbarui data sekolah")
            router.push("/admin/pengaturan")
            router.refresh()
        } catch (error) {
            console.error("Error updating school data:", error)
            toast.error("Gagal memperbarui data sekolah")
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="p-8 max-w-4xl mx-auto space-y-6">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-[600px] w-full rounded-xl" />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8 max-w-4xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Edit Profil Sekolah</h1>
                <p className="text-muted-foreground">
                    Perbarui informasi identitas dan profil sekolah.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Formulir Data Sekolah</CardTitle>
                    <CardDescription>
                        Lengkapi data sekolah dengan informasi yang valid.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {/* Identitas Utama */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Identitas Utama</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="nama_sekolah"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nama Sekolah <span className="text-red-500">*</span></FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nama Sekolah" {...field} value={field.value || ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="npsn"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>NPSN <span className="text-red-500">*</span></FormLabel>
                                                <FormControl>
                                                    <Input placeholder="NPSN" {...field} value={field.value || ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="akreditasi"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Akreditasi</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Contoh: A, B, Unggul" {...field} value={field.value || ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="website"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Website</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://..." {...field} value={field.value || ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Kepala Sekolah */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Kepala Sekolah</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="kepala_sekolah"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nama Kepala Sekolah</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nama lengkap & gelar" {...field} value={field.value || ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="nip_kepala_sekolah"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>NIP Kepala Sekolah</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="NIP" {...field} value={field.value || ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Alamat & Lokasi */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Alamat & Lokasi</h3>
                                <FormField
                                    control={form.control}
                                    name="jalan"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Jalan / Alamat Lengkap</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Alamat lengkap sekolah" {...field} value={field.value || ''} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="kelurahan"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Kelurahan</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Kelurahan" {...field} value={field.value || ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="kecamatan"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Kecamatan</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Kecamatan" {...field} value={field.value || ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="kabupaten_kota"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Kabupaten/Kota</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Kabupaten/Kota" {...field} value={field.value || ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="provinsi"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Provinsi</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Provinsi" {...field} value={field.value || ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="kode_pos"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Kode Pos</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Kode Pos" {...field} value={field.value || ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Kontak */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Kontak</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="nomor_telepon"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nomor Telepon</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nomor Telepon" {...field} value={field.value || ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="Email" {...field} value={field.value || ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-4">
                                <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSaving}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={isSaving}>
                                    {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
