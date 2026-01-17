'use client'

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSekolah, updateSekolah, SekolahDto } from "@/api/admin/sekolah"
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
    nama_sekolah: z.string().min(1, "Nama sekolah wajib diisi"),
    npsn: z.string().optional(),
    jalan: z.string().optional(),
    kelurahan: z.string().optional(),
    kecamatan: z.string().optional(),
    kabupaten_kota: z.string().optional(),
    provinsi: z.string().optional(),
    kode_pos: z.string().optional(),
    nomor_telepon: z.string().optional(),
    email: z.string().email("Email tidak valid").optional().or(z.literal("")),
    website: z.string().url("URL tidak valid").optional().or(z.literal("")),
    kepala_sekolah: z.string().optional(),
    nip_kepala_sekolah: z.string().optional(),
    akreditasi: z.string().optional(),
    logo: z.string().optional(), // Handle file upload separately effectively
})

export default function SettingsPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

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
        loadData()
    }, [])

    const loadData = async () => {
        try {
            setLoading(true)
            const res = await getSekolah()
            if (res && res.data) {
                // Reset form with API data, handling nulls
                const data = res.data
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
                    logo: data.logo || "",
                })
            }
        } catch (error) {
            console.error(error)
            toast.error("Gagal memuat data sekolah")
        } finally {
            setLoading(false)
        }
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setSaving(true)
            await updateSekolah(values)
            toast.success("Pengaturan sekolah berhasil disimpan")
        } catch (error) {
            console.error(error)
            toast.error("Gagal menyimpan perubahan")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Pengaturan Sekolah</h3>
                <p className="text-sm text-muted-foreground">
                    Kelola profil dan informasi sekolah.
                </p>
            </div>
            <Separator />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Identitas Sekolah */}
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Identitas Sekolah</CardTitle>
                                <CardDescription>Informasi dasar sekolah.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="nama_sekolah"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nama Sekolah</FormLabel>
                                            <FormControl>
                                                <Input placeholder="SMK Negeri..." {...field} />
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
                                            <FormLabel>NPSN</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nomor Pokok Sekolah Nasional" {...field} />
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
                                                <Input placeholder="A / B / C" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Kontak & Alamat */}
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Kontak & Alamat</CardTitle>
                                <CardDescription>Lokasi dan kontak sekolah.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="contoh@sekolah.sch.id" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="nomor_telepon"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>No. Telepon</FormLabel>
                                            <FormControl>
                                                <Input placeholder="021-xxxxxx" {...field} />
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
                                                <Input placeholder="https://..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="jalan"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>Alamat (Jalan)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Jl. Raya..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="kelurahan"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kelurahan</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
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
                                                <Input {...field} />
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
                                                <Input {...field} />
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
                                                <Input {...field} />
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
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Kepala Sekolah */}
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Kepala Sekolah</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="kepala_sekolah"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nama Kepala Sekolah</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Drs. ..." {...field} />
                                            </FormControl>
                                            <FormDescription>Termasuk gelar</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="nip_kepala_sekolah"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>NIP</FormLabel>
                                            <FormControl>
                                                <Input placeholder="19xxxx..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={saving}>
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Simpan Perubahan
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
