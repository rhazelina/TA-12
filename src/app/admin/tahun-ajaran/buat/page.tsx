"use client"

import { TahunAjaranForm } from "@/components/tahun-ajaran-form"
import { postTahunAjaran } from "@/api/admin/tahun-ajaran"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { TahunAjaran } from "@/types/api"

export default function CreateTahunAjaranPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const onSubmit = async (values: any) => {
        try {
            setLoading(true)
            await postTahunAjaran(values as TahunAjaran)
            toast.success("Tahun ajaran berhasil ditambahkan")
            router.push("/admin/tahun-ajaran")
            router.refresh()
        } catch (error) {
            console.error(error)
            toast.error("Gagal menambahkan tahun ajaran")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto py-8">
            <TahunAjaranForm
                title="Buat Tahun Ajaran"
                description="Tambahkan tahun ajaran baru ke dalam sistem."
                onSubmit={onSubmit}
                isLoading={loading}
            />
        </div>
    )
}
