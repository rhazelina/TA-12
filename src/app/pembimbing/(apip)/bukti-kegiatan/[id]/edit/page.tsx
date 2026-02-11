"use client"

import { getRealisasiKegiatanPklById, updateRealisasiKegiatanPkl } from "@/api/pembimbing";
import { uploadImages } from "@/api/upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PostRealisasiKegiatanPkl, UpdateRealisasiKegiatanPkl } from "@/types/api";
import { useParams, useRouter } from "next/navigation";
import { useState, ChangeEvent, useEffect } from "react";
import { toast } from "sonner";
import imageCompression from 'browser-image-compression';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, X } from "lucide-react";

export default function EditBuktiKegiatan() {
    const { id } = useParams()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [images, setImages] = useState<File[]>([])
    const [existingImages, setExistingImages] = useState<string[]>([])
    const [previews, setPreviews] = useState<{
        id: string,
        url: string,
        progress: number
    }[]>([])
    const [data, setData] = useState<PostRealisasiKegiatanPkl>({
        bukti_foto_urls: [],
        catatan: "",
        industri_id: 0,
        kegiatan_id: 0,
        tanggal_realisasi: "",
    })
    const [doneCompress, setDoneCompress] = useState<boolean>(false)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true)
                const res = await getRealisasiKegiatanPklById(Number(id))
                setData({
                    bukti_foto_urls: res.bukti_foto_urls || [],
                    catatan: res.catatan || "",
                    industri_id: res.industri_id,
                    kegiatan_id: res.kegiatan_id,
                    tanggal_realisasi: res.tanggal_realisasi,
                })
                setExistingImages(res.bukti_foto_urls || [])
            } catch (error) {
                console.error(error)
                toast.error("Gagal memuat data")
                router.back()
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetch()
        }
    }, [id, router])

    const handleCompressImage = async (image: File) => {
        try {
            setDoneCompress(true)
            const options = {
                maxSizeMB: 5,
                useWebWorker: true,
                onProgress: (progress: number) => {
                    setPreviews((prev) =>
                        prev.map((p) => (p.id === image.name ? { ...p, progress } : p))
                    );
                }
            }
            const res = await imageCompression(image, options)
            return res
        } catch (error) {
            throw error
        } finally {
            setDoneCompress(false)
        }
    }

    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const chosenFiles = Array.from(e.target.files);

            // Validasi tipe file - hanya JPEG dan PNG yang diperbolehkan
            const allowedTypes = ['image/jpeg', 'image/png'];
            const invalidFiles = chosenFiles.filter(file => !allowedTypes.includes(file.type));

            if (invalidFiles.length > 0) {
                toast.error("Hanya file JPEG dan PNG yang diperbolehkan");
                e.target.value = ''; // Reset input
                return;
            }

            const validFiles = chosenFiles.filter(file => allowedTypes.includes(file.type));

            const newPreviews = chosenFiles.map((file) => ({
                id: file.name,
                url: URL.createObjectURL(file),
                progress: 0,
            }));

            setPreviews((prev) => [...prev, ...newPreviews]);

            for (let i = 0; i < validFiles.length; i++) {
                const element = validFiles[i];
                const compressedImage = await handleCompressImage(element)
                setImages((prev) => [...prev, compressedImage]);
            }
        }
    };

    const removeExistingImage = (indexToRemove: number) => {
        setExistingImages(prev => prev.filter((_, index) => index !== indexToRemove));
    }

    const removeNewImage = (indexToRemove: number) => {
        setImages(prev => prev.filter((_, index) => index !== indexToRemove));
        setPreviews(prev => prev.filter((_, index) => index !== indexToRemove));
    }

    const handleSubmit = async () => {
        try {
            setSubmitting(true)

            let uploadedUrls: string[] = []

            // Upload new images if any
            if (images.length > 0) {
                const formData = new FormData()
                images.forEach((image) => {
                    formData.append('files', image)
                })
                const resulUploadImages = await uploadImages(formData)

                if (!resulUploadImages.success) {
                    throw new Error(resulUploadImages.message || "Gagal upload gambar")
                }

                uploadedUrls = resulUploadImages.results.map((item: { url: string }) => item.url)
            }

            // Combine existing images (that weren't removed) and new uploaded images
            const finalImageUrls = [...existingImages, ...uploadedUrls]

            if (finalImageUrls.length === 0) {
                toast.warning("Harap sisakan setidaknya satu bukti foto")
                setSubmitting(false)
                return
            }

            const payload: UpdateRealisasiKegiatanPkl = {
                bukti_foto_urls: finalImageUrls
            };

            await updateRealisasiKegiatanPkl(Number(id), payload)

            toast.success("Berhasil Memperbarui Data")
            router.push(`/pembimbing/bukti-kegiatan`)
            router.refresh()
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Gagal Memperbarui Data")
            console.error("Full Error:", error)
        } finally {
            setSubmitting(false)
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.back()}
                        className="rounded-full bg-white hover:bg-gray-100"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Bukti Kegiatan</h1>
                        <p className="text-gray-500 text-sm">Perbarui foto dan catatan kegiatan</p>
                    </div>
                </div>

                <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-8">
                    {/* Section Foto */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold border-b pb-2">Bukti Foto</h2>

                        {/* Existing Images */}
                        {existingImages.length > 0 && (
                            <div className="space-y-2">
                                <Label className="text-gray-600">Foto Saat Ini</Label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {existingImages.map((url, index) => (
                                        <div key={`existing-${index}`} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                                            <img src={url} alt={`Existing ${index}`} className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => removeExistingImage(index)}
                                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Upload New */}
                        <div className="space-y-2">
                            <Label className="text-gray-600">Tambah Foto Baru</Label>
                            <div className="border-2 border-dashed rounded-xl py-8 flex flex-col items-center text-gray-500 px-4 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                                <div className="w-10 h-10 bg-gray-200 rounded-full mb-3 flex items-center justify-center text-xl">📸</div>
                                <p className="mb-4 text-center text-sm">Seret & lepaskan file atau klik untuk browse</p>
                                <label className="cursor-pointer">
                                    <span className="py-2 px-4 rounded-lg bg-[#8B1E1E] text-white text-sm font-semibold hover:bg-[#7a1a1a] transition-colors shadow-sm">
                                        Pilih File
                                    </span>
                                    <Input
                                        multiple
                                        type="file"
                                        onChange={handleImageChange}
                                        accept="image/jpeg, image/png"
                                        className="hidden"
                                    />
                                </label>
                                <p className="text-xs text-gray-400 mt-3">Format: JPEG, PNG</p>
                            </div>

                            {/* Previews of New Images */}
                            {previews.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                    {previews.map((preview, index) => (
                                        <div key={`new-${index}`} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                                            {preview.progress === 100 ? (
                                                <>
                                                    <img src={preview.url} alt="Preview" className="w-full h-full object-cover" />
                                                    <button
                                                        onClick={() => removeNewImage(index)}
                                                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full p-4 gap-2">
                                                    <Loader2 className="w-6 h-6 animate-spin text-[#8B1E1E]" />
                                                    <span className="text-xs text-center font-medium">Compressing... {Math.round(preview.progress)}%</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="outline" onClick={() => router.back()} disabled={submitting}>
                            Batal
                        </Button>
                        <Button
                            className="bg-[#8B1E1E] hover:bg-[#7a1a1a]"
                            onClick={handleSubmit}
                            disabled={submitting || doneCompress}
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                "Simpan Perubahan"
                            )}
                        </Button>
                    </div>
                </section>
            </div>
        </div>
    );
}
