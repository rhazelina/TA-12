"use client"

import { getIndustriById, updateIndustri } from "@/api/admin/industri"
import { getJurusan } from "@/api/admin/jurusan"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Jurusan } from "@/types/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import {
    Loader2,
    Building2,
    LayoutDashboard,
    MapPin,
    GraduationCap,
    Mail,
    Phone,
    User,
    Info
} from "lucide-react"

const formSchema = z.object({
    nama: z.string().min(1, "Nama industri wajib diisi"),
    bidang: z.string().min(1, "Bidang usaha wajib diisi"),
    alamat: z.string().min(1, "Alamat lengkap wajib diisi"),
    pic: z.string().min(1, "Nama penanggung jawab wajib diisi"),
    no_telp: z.string().min(1, "Nomor telepon wajib diisi"),
    pic_telp: z.string().min(1, "Nomor telepon penanggung jawab wajib diisi"),
    email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
    jurusan_id: z.string().min(1, "Jurusan wajib dipilih"),
    is_active: z.boolean(),
})

export default function EditIndustriKoordinatorPage() {
    const router = useRouter()
    const params = useParams()
    const id = Number(params.id)

    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)
    const [jurusans, setJurusans] = useState<Jurusan[]>([])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nama: "",
            bidang: "",
            alamat: "",
            pic: "",
            no_telp: "",
            pic_telp: "",
            email: "",
            jurusan_id: "",
            is_active: true,
        },
    })

    useEffect(() => {
        const loadJava = async () => {
            try {
                // Fetch Jurusan
                const jurusanRes = await getJurusan()
                const jurusanData = jurusanRes?.data?.data || jurusanRes?.data || []
                if (Array.isArray(jurusanData)) {
                    setJurusans(jurusanData)
                }

                // Fetch Industri Data
                if (id) {
                    const industriRes = await getIndustriById(id)
                    if (industriRes && industriRes.data) {
                        const data = industriRes.data
                        form.reset({
                            nama: data.nama,
                            bidang: data.bidang || "",
                            alamat: data.alamat,
                            pic: data.pic || "",
                            no_telp: data.no_telp || "",
                            pic_telp: data.pic_telp || "",
                            email: data.email || "",
                            jurusan_id: data.jurusan_id.toString(),
                            is_active: data.is_active
                        })
                    } else {
                        toast.error("Data industri tidak ditemukan")
                        router.push("/koordinator/industri")
                    }
                }
            } catch (error) {
                console.error("Error loading data:", error)
                toast.error("Terjadi kesalahan saat memuat data")
            } finally {
                setInitialLoading(false)
            }
        }

        loadJava()
    }, [id, form, router])

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true)
        try {
            const payload: any = {
                ...values,
                jurusan_id: Number(values.jurusan_id),
            }

            const res = await updateIndustri(id, payload)
            if (res) {
                toast.success("Berhasil memperbarui data industri")
                router.push(`/koordinator/industri/${id}`)
                router.refresh()
            } else {
                toast.error("Gagal memperbarui data industri")
            }
        } catch (error) {
            console.error("Error updating industri:", error)
            toast.error("Terjadi kesalahan saat menyimpan data")
        } finally {
            setLoading(false)
        }
    }

    if (initialLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#641E20]" />
            </div>
        )
    }

    const inputClasses = "bg-white border-gray-300 rounded-md focus-visible:ring-1 focus-visible:ring-[#641E20] text-gray-700"
    const labelClasses = "text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5"
    const iconStyle = "w-3.5 h-3.5 text-blue-500"

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Ubah Data Industri</h1>
                <p className="text-gray-500 text-sm">Perbarui informasi data industri tempat PKL.</p>
            </div>

            <Card className="border border-gray-200 shadow-sm rounded-xl overflow-hidden bg-white">
                <div className="bg-blue-600 h-1 w-full"></div>
                <CardContent className="p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                {/* Column 1 */}
                                <div className="space-y-6">
                                    {/* Nama Industri */}
                                    <FormField
                                        control={form.control}
                                        name="nama"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={labelClasses}>
                                                    <Building2 className={iconStyle} /> Nama Industri <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="PT. Contoh Indonesia" {...field} className={inputClasses} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Bidang Usaha */}
                                    <FormField
                                        control={form.control}
                                        name="bidang"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={labelClasses}>
                                                    <LayoutDashboard className={iconStyle} /> Bidang Usaha <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Contoh: Teknologi Informasi" {...field} className={inputClasses} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Alamat */}
                                    <FormField
                                        control={form.control}
                                        name="alamat"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={labelClasses}>
                                                    <MapPin className={iconStyle} /> Alamat <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Masukkan alamat lengkap"
                                                        className={`${inputClasses} min-h-[100px] resize-none`}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Jurusan */}
                                    <FormField
                                        control={form.control}
                                        name="jurusan_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={labelClasses}>
                                                    <GraduationCap className={iconStyle} /> Jurusan <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className={inputClasses}>
                                                            <SelectValue placeholder="Pilih Jurusan" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {jurusans.map((jurusan) => (
                                                            <SelectItem key={jurusan.id} value={jurusan.id.toString()}>
                                                                {jurusan.nama}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Email */}
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={labelClasses}>
                                                    <Mail className={iconStyle} /> Email Industri
                                                </FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="email@industri.com" {...field} className={inputClasses} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Column 2 */}
                                <div className="space-y-6">
                                    {/* Nomor Telepon */}
                                    <FormField
                                        control={form.control}
                                        name="no_telp"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={labelClasses}>
                                                    <Phone className={iconStyle} /> Nomor Telepon Industri <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="08xxxxxxxxxx" {...field} className={inputClasses} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Penanggung Jawab (PIC) */}
                                    <FormField
                                        control={form.control}
                                        name="pic"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={labelClasses}>
                                                    <User className={iconStyle} /> Nama Penanggung Jawab <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nama lengkap PJ" {...field} className={inputClasses} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Nomor Telepon PIC */}
                                    <FormField
                                        control={form.control}
                                        name="pic_telp"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={labelClasses}>
                                                    <Phone className={iconStyle} /> Kontak Penanggung Jawab <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="08xxxxxxxxxx" {...field} className={inputClasses} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Status Aktif */}
                                    <FormField
                                        control={form.control}
                                        name="is_active"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={labelClasses}>
                                                    <Info className={iconStyle} /> Status Industri
                                                </FormLabel>
                                                <Select
                                                    onValueChange={(val) => field.onChange(val === "true")}
                                                    value={field.value ? "true" : "false"}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className={inputClasses}>
                                                            <SelectValue placeholder="Pilih Status" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="true">Aktif</SelectItem>
                                                        <SelectItem value="false">Non-Aktif</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                    disabled={loading}
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-[#641E20] hover:bg-[#4a1216] text-white px-6"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        "Simpan Perubahan"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
