"use client"

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { getIndustri, getSiswa } from "@/api/pembimbing";

interface Industry {
  id: number;
  nama: string;
}

interface Student {
  id: number;
  nama: string;
  industri?: string; // name
  industri_id?: number;
  // other fields
}

export default function PermasalahanSiswa() {
  const [industries, setIndustries] = useState<Industry[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedIndustry, setSelectedIndustry] = useState<string>("")
  const [selectedStudent, setSelectedStudent] = useState<string>("")
  const [problemDetail, setProblemDetail] = useState("")

  useEffect(() => {
    const loadData = async () => {
      try {
        const [indRes, stuRes] = await Promise.all([
          getIndustri(),
          getSiswa()
        ])
        setIndustries(Array.isArray(indRes) ? indRes : indRes.data || [])
        setStudents(Array.isArray(stuRes) ? stuRes : stuRes.data || [])
      } catch (error) {
        console.error(error)
        toast.error("Gagal memuat data")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredStudents = students.filter(s => {
    if (!selectedIndustry) return false
    // Filter logic: Check if student belongs to selected industry
    // Assuming student has 'industri' (name) or 'industri_id'
    // If API doesn't return industry info on student object, we might show all or need better API
    // For now, let's assume matching by Name if ID is missing, or ID if present

    const ind = industries.find(i => i.id.toString() === selectedIndustry)
    if (!ind) return false

    if (s.industri_id) return s.industri_id.toString() === selectedIndustry
    if (s.industri) return s.industri === ind.nama

    // Fallback: Show all if we can't filter (for development safety)
    return true
  })

  const handleSubmit = async () => {
    if (!selectedIndustry || !selectedStudent || !problemDetail) {
      toast.error("Mohon lengkapi semua field")
      return
    }

    // Submit logic mock
    toast.success("Pengaduan masalah berhasil dikirim")
    // Reset
    setProblemDetail("")
    setSelectedStudent("")
  }

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>
  }

  return (
    <div className="flex-1 bg-[#fafafa] min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white border rounded-xl p-8">
        <h2 className="text-xl font-semibold mb-6">Permasalahan Siswa</h2>

        <div className="space-y-6">
          {/* Industry Select */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Pilih Industri <span className="text-red-500">*</span>
            </label>
            <Select value={selectedIndustry} onValueChange={(val) => {
              setSelectedIndustry(val)
              setSelectedStudent("") // Reset student when industry changes
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Industri" />
              </SelectTrigger>
              <SelectContent>
                {industries.map(ind => (
                  <SelectItem key={ind.id} value={ind.id.toString()}>{ind.nama}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Student Select */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Pilih Siswa <span className="text-red-500">*</span>
            </label>
            <Select value={selectedStudent} onValueChange={setSelectedStudent} disabled={!selectedIndustry}>
              <SelectTrigger>
                <SelectValue placeholder={!selectedIndustry ? "Pilih industri terlebih dahulu" : "Pilih Siswa"} />
              </SelectTrigger>
              <SelectContent>
                {filteredStudents.length > 0 ? filteredStudents.map(s => (
                  <SelectItem key={s.id} value={s.id.toString()}>{s.nama}</SelectItem>
                )) : (
                  <div className="p-2 text-sm text-gray-500 text-center">Tidak ada siswa ditemukan</div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Problem Detail */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Detail Permasalahan <span className="text-red-500">*</span>
            </label>
            <Textarea
              rows={6}
              placeholder="Deskripsikan permasalahan..."
              value={problemDetail}
              onChange={(e) => setProblemDetail(e.target.value)}
              className="resize-none focus:ring-[#8B1E1E]"
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full bg-[#6B1B1B] hover:bg-[#5a1616] text-white py-6 text-lg"
          >
            <Send className="w-5 h-5 mr-2" />
            Kirim Pengaduan Masalah
          </Button>
        </div>
      </div>
    </div>
  );
}
