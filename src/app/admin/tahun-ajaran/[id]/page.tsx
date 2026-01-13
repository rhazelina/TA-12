"use client"

import { useEffect, useState } from "react"
import { getTahunAjaranById } from "@/api/admin/tahun-ajaran"
import { useParams, useRouter } from "next/navigation"
import { TahunAjaran } from "@/types/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit } from "lucide-react"
import { formatDate } from "@/utils/date"

export default function DetailTahunAjaranPage() {
    const params = useParams()
    const router = useRouter()
    const id = params?.id
    const [data, setData] = useState<TahunAjaran | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return
            try {
                const res = await getTahunAjaranById(Number(id))
                if (res && res.data) {
                    setData(res.data)
                } else {
                    setData(res as unknown as TahunAjaran)
                }
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [id])

    if (loading) return <div className="p-8 text-center flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
    if (!data) return <div className="p-8 text-center">Data tidak ditemukan</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Detail Tahun Ajaran</h1>
                    <p className="text-muted-foreground">Informasi lengkap tahun ajaran.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Informasi Tahun Ajaran</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Nama</label>
                            <p className="text-lg font-medium">{data.nama}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Kode</label>
                            <p className="text-lg font-medium">{data.kode}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Status</label>
                            <div className="mt-1">
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${data.is_active
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}>
                                    {data.is_active ? "Aktif" : "Tidak Aktif"}
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Dibuat Pada</label>
                            <p className="text-base">{data.created_at ? formatDate(data.created_at) : "-"}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Diperbarui Pada</label>
                            <p className="text-base">{data.updated_at ? formatDate(data.updated_at) : "-"}</p>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button onClick={() => router.push(`/admin/tahun-ajaran/edit/${data.id}`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Data
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
