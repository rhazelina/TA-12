"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Loader2, Plus, IdCard, User, FileDigit, Phone, Save, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card"
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
    InputGroup,
    InputGroupAddon,
    InputGroupText,
} from "@/components/ui/input-group"
import { updateProfileGuru } from "@/api/profil guru"
import { UpdateProfileGuru } from "@/types/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const profileSchema = z.object({
    kode_guru: z.string().min(1, "Kode guru wajib diisi"),
    nama: z.string().min(1, "Nama wajib diisi"),
    nip: z.string().min(1, "NIP wajib diisi"),
    no_telp: z.string().min(1, "Nomor telepon wajib diisi"),
})

export default function ProfilPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [initials, setInitials] = useState("GU")

    const form = useForm<UpdateProfileGuru>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            kode_guru: "",
            nama: "",
            nip: "",
            no_telp: "",
        },
    })

    useEffect(() => {
        // Load data from localStorage on mount
        const storedData = localStorage.getItem("guruData")
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData)
                form.reset({
                    kode_guru: parsedData.kode_guru || "",
                    nama: parsedData.nama || "",
                    nip: parsedData.nip || "",
                    no_telp: parsedData.no_telp || "",
                })

                if (parsedData.nama) {
                    const nameParts = parsedData.nama.split(" ")
                    if (nameParts.length >= 2) {
                        setInitials(`${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase())
                    } else if (nameParts.length === 1) {
                        setInitials(nameParts[0].substring(0, 2).toUpperCase())
                    }
                }
            } catch (error) {
                console.error("Failed to parse guruData from localStorage", error)
            }
        }
    }, [form])

    async function onSubmit(data: UpdateProfileGuru) {
        setIsLoading(true)
        try {
            await updateProfileGuru(data)

            // Update localStorage with new data
            localStorage.setItem("guruData", JSON.stringify(data))

            // Update initials
            if (data.nama) {
                const nameParts = data.nama.split(" ")
                if (nameParts.length >= 2) {
                    setInitials(`${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase())
                } else if (nameParts.length === 1) {
                    setInitials(nameParts[0].substring(0, 2).toUpperCase())
                }
            }

            toast.success("Profil berhasil diperbarui")
        } catch (error) {
            console.error(error)
            toast.error("Gagal memperbarui profil")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container max-w-4xl mx-auto py-10 px-4 md:px-0">
            <Button
                variant="ghost"
                className="mb-4 gap-2 pl-0 hover:pl-2 transition-all"
                onClick={() => router.back()}
            >
                <ArrowLeft className="h-4 w-4" />
                Kembali
            </Button>
            <div className="relative mb-8">
                <div className="h-48 rounded-xl bg-primary shadow-lg"></div>
                <div className="absolute -bottom-12 left-8 md:left-12 p-1 bg-background rounded-full">
                    <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                        <AvatarImage src="" alt="@shadcn" />
                        <AvatarFallback className="text-4xl font-bold bg-muted text-primary">{initials}</AvatarFallback>
                    </Avatar>
                </div>
            </div>

            <div className="mt-16 grid gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Pengaturan Profil</h1>
                    <p className="text-muted-foreground">
                        Kelola informasi pribadi dan detail akun Anda.
                    </p>
                </div>

                <Card className="shadow-md border-muted/40 overflow-hidden">
                    <CardHeader className="bg-muted/30 border-b border-muted/20 pb-8">
                        <CardTitle className="text-xl">Informasi Pribadi</CardTitle>
                        <CardDescription>
                            Perbarui detail identitas anda di sini.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="kode_guru"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Kode Guru</FormLabel>
                                                <FormControl>
                                                    <InputGroup>
                                                        <InputGroupAddon>
                                                            <IdCard className="h-4 w-4" />
                                                        </InputGroupAddon>
                                                        <Input placeholder="G001" {...field} />
                                                    </InputGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="nip"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>NIP</FormLabel>
                                                <FormControl>
                                                    <InputGroup>
                                                        <InputGroupAddon>
                                                            <FileDigit className="h-4 w-4" />
                                                        </InputGroupAddon>
                                                        <Input placeholder="1987654321" {...field} />
                                                    </InputGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="nama"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nama Lengkap</FormLabel>
                                            <FormControl>
                                                <InputGroup>
                                                    <InputGroupAddon>
                                                        <User className="h-4 w-4" />
                                                    </InputGroupAddon>
                                                    <Input placeholder="Masukan nama lengkap anda" {...field} />
                                                </InputGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="no_telp"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nomor Telepon</FormLabel>
                                            <FormControl>
                                                <InputGroup>
                                                    <InputGroupAddon>
                                                        <Phone className="h-4 w-4" />
                                                    </InputGroupAddon>
                                                    <Input placeholder="+62 812 3456 7890" {...field} />
                                                </InputGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-end pt-4 border-t border-muted/20">
                                    <Button type="submit" disabled={isLoading} size="lg" className="min-w-[150px]">
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Menyimpan...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="mr-2 h-4 w-4" />
                                                Simpan Perubahan
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}