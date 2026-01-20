"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { Printer, Plus, Trash2, FileText, Building2, User, Eye, X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"
import { useEffect, useState } from "react"
import { ApiResponseSekolah } from "@/types/api"
import { getSekolah } from "@/api/public"

const schoolInfoSchema = z.object({
    nama_sekolah: z.string().min(1, "Nama sekolah harus diisi"),
    alamat_jalan: z.string().min(1, "Alamat harus diisi"),
    kelurahan: z.string().min(1, "Kelurahan harus diisi"),
    kecamatan: z.string().min(1, "Kecamatan harus diisi"),
    kab_kota: z.string().min(1, "Kab/Kota harus diisi"),
    provinsi: z.string().min(1, "Provinsi harus diisi"),
    kode_pos: z.string().min(1, "Kode Pos harus diisi"),
    telepon: z.string().min(1, "Telepon harus diisi"),
    email: z.string().email("Email tidak valid"),
    website: z.string().url("Website tidak valid"),
    logo_url: z.string().url("URL Logo tidak valid"),
})

const assigneeSchema = z.object({
    nama: z.string().min(1, "Nama harus diisi"),
    nip: z.string().optional(),
    jabatan: z.string().min(1, "Jabatan harus diisi"),
    instansi: z.string().min(1, "Instansi harus diisi"),
})

const detailSchema = z.object({
    label: z.string().min(1, "Label harus diisi"),
    separator: z.string(),
    value: z.string().min(1, "Value harus diisi"),
})

const signerSchema = z.object({
    nama: z.string().min(1, "Nama harus diisi"),
    nip: z.string().min(1, "NIP harus diisi"),
    jabatan: z.string().min(1, "Jabatan harus diisi"),
    instansi: z.string().min(1, "Instansi harus diisi"),
    pangkat: z.string().optional(),
})

const formSchema = z.object({
    nomor_surat: z.string().min(1, "Nomor surat harus diisi"),
    perihal: z.string().min(1, "Perihal harus diisi"),
    tanggal_surat: z.string().min(1, "Tanggal surat harus diisi"),
    tempat_surat: z.string().min(1, "Tempat surat harus diisi"),
    pembuka: z.string().min(1, "Pembuka harus diisi"),
    penutup: z.string().min(1, "Penutup harus diisi"),
    school_info: schoolInfoSchema,
    assignees: z.array(assigneeSchema),
    details: z.array(detailSchema),
    penandatangan: signerSchema,
})

const defaultValues: z.infer<typeof formSchema> = {
    assignees: [
        {
            instansi: "SMK Negeri 2 Singosari",
            jabatan: "Guru",
            nama: "Inasni Dyah Rahmatika, S.Pd.",
            nip: "19850101 201001 2 005",
        },
    ],
    details: [
        {
            label: "Keperluan",
            separator: ":",
            value: "Pengantaran Siswa Praktik Kerja Lapangan (PKL)",
        },
        {
            label: "Hari / Tanggal",
            separator: ":",
            value: "Senin, 1 Juli 2024",
        },
        {
            label: "Waktu",
            separator: ":",
            value: "08.00 - Selesai",
        },
        {
            label: "Tempat",
            separator: ":",
            value: "BACAMALANG.COM",
        },
        {
            label: "Alamat",
            separator: ":",
            value: "JL. MOROJANTEK NO. 87 B, PANGENTAN, KEC. SINGOSARI, KAB. MALANG",
        },
    ],
    nomor_surat: "800/123/SMK.2/2024",
    pembuka: "Kepala SMK Negeri 2 Singosari Dinas Pendidikan Kabupaten Malang menugaskan kepada :",
    penandatangan: {
        instansi: "SMK Negeri 2 Singosari",
        jabatan: "Kepala SMK Negeri 2 Singosari",
        nama: "SUMIJAH, S.Pd., M.Si.",
        nip: "19700210 199802 2 009",
        pangkat: "Pembina Tk. I",
    },
    penutup: "Demikian surat tugas ini dibuat untuk dilaksanakan dengan sebaik-baiknya dan melaporkan hasilnya kepada kepala sekolah.",
    perihal: "SURAT TUGAS",
    school_info: {
        alamat_jalan: "Jalan Perusahaan No. 20",
        email: "smkn2singosari@yahoo.co.id",
        kab_kota: "Kab. Malang",
        kecamatan: "Singosari",
        kelurahan: "Tunjungtirto",
        kode_pos: "65153",
        logo_url: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Logo_SMKN_2_Singosari.png",
        nama_sekolah: "SMK NEGERI 2 SINGOSARI",
        provinsi: "Jawa Timur",
        telepon: "(0341) 4345127",
        website: "www.smkn2singosari.sch.id",
    },
    tanggal_surat: "1 Juli 2024",
    tempat_surat: "Singosari",
}

const LetterPreview = ({ data }: { data: z.infer<typeof formSchema> }) => {
    return (
        <div className="bg-white p-10 w-[210mm] min-h-auto mx-auto text-black font-serif text-sm leading-relaxed shadow-lg">
            {/* Header / Kop */}
            <div className="flex items-center gap-4 border-b-4 border-double border-black pb-4 mb-6">
                <div className="w-[100px] flex-shrink-0 flex justify-center">
                    {/* Placeholder for Logo if url exists, else generic */}
                    {data.school_info?.logo_url ? (
                        <img
                            src={data.school_info.logo_url}
                            alt="Logo"
                            className="w-24 h-24 object-contain"
                        />
                    ) : (
                        <div className="w-20 h-20 border flex items-center justify-center">Logo</div>
                    )}
                </div>
                <div className="text-center w-full uppercase">
                    <h2 className="text-lg font-bold">PEMERINTAH PROVINSI {data.school_info.provinsi}</h2>
                    <h2 className="text-lg font-bold">DINAS PENDIDIKAN</h2>
                    <h1 className="text-2xl font-black tracking-wider">{data.school_info.nama_sekolah}</h1>
                    <p className="normal-case text-xs mt-1">
                        {data.school_info.alamat_jalan}, {data.school_info.kelurahan}, {data.school_info.kecamatan}, {data.school_info.kab_kota}, {data.school_info.provinsi} {data.school_info.kode_pos}
                    </p>
                    <p className="normal-case text-xs">
                        Telepon {data.school_info.telepon} {data.school_info.email && `| Email: ${data.school_info.email}`}
                    </p>
                    <p className="normal-case text-xs">
                        {data.school_info.website}
                    </p>
                </div>
            </div>

            {/* Title */}
            <div className="text-center mb-6">
                <h2 className="text-lg font-bold underline uppercase">{data.perihal}</h2>
                <p>Nomor : {data.nomor_surat}</p>
            </div>

            {/* Body */}
            <div className="mb-4 text-justify">
                <p>{data.pembuka}</p>
            </div>

            {/* Assignees Table */}
            <div className="mb-6">
                <table className="w-full border-collapse border border-black text-sm">
                    <thead>
                        <tr className="bg-gray-100/50">
                            <th className="border border-black p-2 w-12 text-center">NO</th>
                            <th className="border border-black p-2 text-center">NAMA</th>
                            <th className="border border-black p-2 text-center">JABATAN</th>
                            <th className="border border-black p-2 text-center">DINAS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.assignees && data.assignees.length > 0 ? (
                            data.assignees.map((person, idx) => (
                                <tr key={idx}>
                                    <td className="border border-black p-2 text-center">{idx + 1}</td>
                                    <td className="border border-black p-2">
                                        <div className="font-bold">{person.nama}</div>
                                        {person.nip && <div className="text-xs">{person.nip}</div>}
                                    </td>
                                    <td className="border border-black p-2 text-center">{person.jabatan}</td>
                                    <td className="border border-black p-2 text-center">{person.instansi}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="border border-black p-4 text-center italic">
                                    Belum ada petugas ditambahkan
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Details */}
            <div className="ml-8 mb-6 space-y-1">
                {data.details && data.details.map((detail, idx) => (
                    <div key={idx} className="flex">
                        <div className="w-32 flex-shrink-0">{detail.label}</div>
                        <div className="w-4 flex-shrink-0 text-center">{detail.separator}</div>
                        <div className="flex-1 font-medium">{detail.value}</div>
                    </div>
                ))}
            </div>

            {/* Closing */}
            <div className="mb-12 text-justify">
                <p>{data.penutup}</p>
            </div>

            {/* Signature */}
            <div className="flex justify-end">
                <div className="w-[300px] text-left">
                    <p>{data.tempat_surat}, {data.tanggal_surat}</p>
                    <p className="font-bold mb-20">{data.penandatangan.jabatan}</p>

                    <p className="font-bold underline uppercase">{data.penandatangan.nama}</p>
                    <p>NIP. {data.penandatangan.nip}</p>
                </div>
            </div>
        </div>
    )
}

export default function CetakBuktiPage() {
    const [dataSekolah, setDataSekolah] = useState<ApiResponseSekolah | null>(null)

    const getDataSekolah = async () => {
        try {
            const response = await getSekolah()
            setDataSekolah(response)
        } catch (error) {
            console.error("Error fetching school info:", error)
        }
    }

    useEffect(() => {
        getDataSekolah()
    }, [])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues,
    })

    useEffect(() => {
        if (dataSekolah && dataSekolah.success && dataSekolah.data) {
            const info = dataSekolah.data
            form.setValue("school_info.nama_sekolah", info.nama_sekolah)
            form.setValue("school_info.alamat_jalan", info.jalan)
            form.setValue("school_info.kelurahan", info.kelurahan)
            form.setValue("school_info.kecamatan", info.kecamatan)
            form.setValue("school_info.kab_kota", info.kabupaten_kota)
            form.setValue("school_info.provinsi", info.provinsi)
            form.setValue("school_info.kode_pos", info.kode_pos)
            form.setValue("school_info.telepon", info.nomor_telepon)
            form.setValue("school_info.email", info.email)
            form.setValue("school_info.website", info.website)
            // form.setValue("school_info.logo_url", info.logo_url)
        }
    }, [dataSekolah, form])

    const { fields: assigneeFields, append: appendAssignee, remove: removeAssignee } = useFieldArray({
        control: form.control,
        name: "assignees",
    })

    // We can treat 'details' as a field array too if we want dynamic details
    const { fields: detailFields, append: appendDetail, remove: removeDetail } = useFieldArray({
        control: form.control,
        name: "details",
    })

    const postData = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("https://sertif.gedanggoreng.com/api/v1/letters/surat-tugas", values)
            return response.data
        } catch (error) {
            throw error
        }
    }

    const downloadPDF = async (nameFile: string) => {
        try {
            const response = await axios.get(`https://sertif.gedanggoreng.com/api/v1/letters/download/${nameFile}`, {
                responseType: "blob",
            })
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", nameFile)
            document.body.appendChild(link)
            link.click()
            link.remove() // Clean up
            window.URL.revokeObjectURL(url)
        } catch (error) {
            throw error
        }
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const response = await postData(values)

            downloadPDF(response.filename)

            toast.success("Surat Tugas berhasil dicetak", {
                description: "File PDF berhasil diunduh.",
            })
        } catch (error) {
            toast.error("Gagal mencetak Surat Tugas", {
                description: "Terjadi kesalahan saat mencetak Surat Tugas.",
            })
            console.log(error)
        }
    }

    return (
        <div className="container mx-auto py-2 px-4 md:px-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Cetak Surat Tugas</h1>
                    <p className="text-muted-foreground">
                        Formulir untuk mencetak Surat Tugas Pengantaran Siswa PKL.
                    </p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    {/* Section: Informasi Sekolah */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5" />
                                Informasi Sekolah
                            </CardTitle>
                            <CardDescription>Data kop surat sekolah (Otomatis dari sistem).</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="school_info.nama_sekolah"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nama Sekolah</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="school_info.website"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Website</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="school_info.email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="school_info.telepon"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Telepon</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Address fields could be grouped further but flat is fine for now */}
                            <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="school_info.alamat_jalan"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-3">
                                            <FormLabel>Alamat Jalan</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="school_info.kelurahan"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kelurahan</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="school_info.kecamatan"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kecamatan</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="school_info.kab_kota"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kab/Kota</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Section: Detail Surat */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Detail Surat
                            </CardTitle>
                            <CardDescription>Nomor, perihal, dan waktu surat.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="nomor_surat"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nomor Surat</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="perihal"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Perihal</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="tempat_surat"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tempat Surat</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="tanggal_surat"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tanggal Surat</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="pembuka"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Kalimat Pembuka</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Section: Petugas (Assignees) */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="space-y-1.5">
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Ditugaskan Kepada
                                </CardTitle>
                                <CardDescription>Daftar guru/staf yang ditugaskan.</CardDescription>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => appendAssignee({ nama: "", jabatan: "", instansi: "" })}
                            >
                                <Plus className="mr-2 h-4 w-4" /> Tambah Petugas
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {assigneeFields.map((field, index) => (
                                <div key={field.id} className="flex gap-4 items-start border p-4 rounded-md bg-muted/20">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                                        <FormField
                                            control={form.control}
                                            name={`assignees.${index}.nama`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nama</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="Nama Lengkap" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`assignees.${index}.nip`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>NIP (Opsional)</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="xxxxx" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`assignees.${index}.jabatan`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Jabatan</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="Guru" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`assignees.${index}.instansi`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Instansi</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="Sekolah" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeAssignee(index)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Section: Detail Isi Surat */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="space-y-1.5">
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Isi Tugas / Keterangan
                                </CardTitle>
                                <CardDescription>Rincian pelaksanaan tugas.</CardDescription>
                            </div>
                            {/* <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => appendDetail({ label: "", value: "", separator: ":" })}
                            >
                                <Plus className="mr-2 h-4 w-4" /> Tambah Baris
                            </Button> */}
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {detailFields.map((field, index) => (
                                <div key={field.id} className="flex gap-2 items-end">
                                    <FormField
                                        control={form.control}
                                        name={`details.${index}.label`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Input {...field} placeholder="Label (e.g. Hari)" />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <span className="pb-3 text-muted-foreground">:</span>
                                    <FormField
                                        control={form.control}
                                        name={`details.${index}.value`}
                                        render={({ field }) => (
                                            <FormItem className="flex-[2]">
                                                <FormControl>
                                                    <Input {...field} placeholder="Isi Keterangan" />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    {/* <Button type="button" variant="ghost" size="icon" onClick={() => removeDetail(index)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button> */}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Section: Penandatangan */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Penandatangan
                            </CardTitle>
                            <CardDescription>Pejabat yang menandatangani surat.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="penandatangan.nama"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nama Lengkap</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="penandatangan.nip"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>NIP</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="penandatangan.jabatan"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Jabatan</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="penandatangan.pangkat"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Pangkat / Golongan</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="penutup"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Kalimat Penutup</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <div className="flex justify-end pb-5 gap-4">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button type="button" variant="outline" size="lg">
                                    <Eye className="mr-2 h-5 w-5" />
                                    Preview Surat
                                </Button>
                            </DialogTrigger>

                            {/* Tambahkan class [&>button]:hidden di akhir daftar class kamu */}
                            <DialogContent className="!fixed h-[100vh] p-0 bg-white border-none shadow-none focus:outline-none overflow-y-auto !max-w-[100vw]">
                                <LetterPreview data={form.watch()} />
                            </DialogContent>
                        </Dialog>

                        <Button type="submit" size="lg" className="w-full md:w-auto">
                            <Printer className="mr-2 h-5 w-5" />
                            Cetak Surat Tugas
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}