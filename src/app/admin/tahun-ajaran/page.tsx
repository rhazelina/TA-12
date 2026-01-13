"use client"

import { deleteTahunAjaran, getTahunAjaran } from "@/api/admin/tahun-ajaran";
import { DataTable } from "@/components/data-table"
import { TahunAjaran } from "@/types/api"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function TahunAjaranPage() {
    const router = useRouter()
    const [data, setData] = useState<TahunAjaran[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await getTahunAjaran();
            // Handle various response structures just in case
            if (response && response.data) {
                setData(response.data);
            } else if (Array.isArray(response)) {
                setData(response);
            } else {
                setData([]);
            }
        } catch (error) {
            console.log(error);
            toast.error("Gagal mengambil data tahun ajaran");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    const columns = [
        {
            key: 'nama',
            label: 'Nama',
            sortable: true,
        },
        {
            key: 'kode',
            label: 'Kode',
            sortable: true,
        },
        {
            key: 'is_active',
            label: 'Status',
            sortable: true,
            render: (value: unknown) => (
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${value
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                    {value ? "Aktif" : "Tidak Aktif"}
                </span>
            ),
        },
    ]

    const handleAdd = () => {
        router.push('/admin/tahun-ajaran/buat')
    }

    const handleEdit = (row: TahunAjaran) => {
        router.push(`/admin/tahun-ajaran/edit/${row.id}`)
    }

    const handleDelete = async (row: TahunAjaran) => {
        try {
            await deleteTahunAjaran(row.id || 0)
            toast.success(`Data tahun ajaran ${row.nama} berhasil dihapus`)
            fetchData()
        } catch (err) {
            console.error('Failed to delete tahun ajaran:', err)
            toast.error('Gagal menghapus data tahun ajaran')
        }
    }

    const handleView = (row: TahunAjaran) => {
        router.push(`/admin/tahun-ajaran/${row.id}`)
    }

    return (
        <div className="space-y-6">

            <div>
                <h1 className="text-3xl font-bold text-gray-900">Manajemen Tahun Ajaran</h1>
                <p className="text-gray-600">Kelola data tahun ajaran dan informasi pribadi</p>
            </div>

            <DataTable
                columns={columns}
                data={data}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                loading={loading}
                addButtonText="Tambah Tahun Ajaran"
                title="Daftar Tahun Ajaran"
                searchPlaceholder="Cari tahun ajaran..."
            />
        </div>
    )
}