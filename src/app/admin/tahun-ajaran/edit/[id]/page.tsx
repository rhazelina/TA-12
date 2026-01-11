"use client"

import { useEffect, useState } from "react"
import { getTahunAjaranById, putTahunAjaran } from "@/api/admin/tahun-ajaran"
import { TahunAjaranForm } from "@/components/tahun-ajaran-form"
import { useRouter, useParams } from "next/navigation"
import { toast } from "sonner"
import { TahunAjaran } from "@/types/api"

export default function EditTahunAjaranPage() {
    const router = useRouter()
    const params = useParams()
    const id = params?.id

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<TahunAjaran | null>(null)
    const [fetching, setFetching] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return
            try {
                const res = await getTahunAjaranById(Number(id))
                // Assumption: res follows the standard response structure { data: TahunAjaran }
                if (res && res.data) {
                    setData(res.data)
                } else {
                    setData(res as unknown as TahunAjaran) // Fallback
                }
            } catch (error) {
                toast.error("Gagal mengambil data tahun ajaran")
            } finally {
                setFetching(false)
            }
        }
        fetchData()
    }, [id])

    const onSubmit = async (values: any) => {
        if (!id) return
        try {
            setLoading(true)
            await putTahunAjaran(Number(id), values as TahunAjaran)
            toast.success("Tahun ajaran berhasil diperbarui")
            router.push("/admin/tahun-ajaran")
            router.refresh()
        } catch (error) {
            console.error(error)
            toast.error("Gagal memperbarui tahun ajaran")
        } finally {
            setLoading(false)
        }
    }

    if (fetching) return <div className="p-8 text-center flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
    if (!data) return <div className="p-8 text-center">Data tidak ditemukan</div>

    return (
        <div className="max-w-2xl mx-auto py-8">
            <TahunAjaranForm
                title="Edit Tahun Ajaran"
                description="Perbarui informasi tahun ajaran."
                initialData={data}
                onSubmit={onSubmit}
                isLoading={loading}
            />
        </div>
    )
}
