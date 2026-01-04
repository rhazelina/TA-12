"use client"

import * as React from "react"
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Clock,
    Edit,
    Filter,
    MoreVertical,
    Plus,
    Save,
    Search,
    Trash2,
} from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export default function PembekalanPage() {
    const [date, setDate] = React.useState<Date | undefined>(new Date())

    // Mock data for the table
    const schedules = [
        {
            id: 1,
            title: "Orientasi PKL",
            description: "Pengenalan program PKL",
            date: "5 Nov 2024",
            time: "09:00 - 11:00 WIB",
            location: "Aula Pertemuan",
            status: "Terjadwal",
            statusVariant: "default", // blue
        },
        {
            id: 2,
            title: "Teknik Wawancara",
            description: "Persiapan wawancara kerja",
            date: "12 Nov 2024",
            time: "13:00 - 15:00 WIB",
            location: "Lab RPL 1",
            status: "Selesai",
            statusVariant: "success", // green
        },
        {
            id: 3,
            title: "Etika Profesional",
            description: "Sikap dan perilaku di tempat kerja",
            date: "18 Nov 2024",
            time: "10:00 - 12:00 WIB",
            location: "Lab DKV",
            status: "Draft",
            statusVariant: "outline", // gray/orange
        },
        {
            id: 4,
            title: "Evaluasi Akhir PKL",
            description: "Penilaian dan feedback",
            date: "25 Nov 2024",
            time: "14:00 - 16:00 WIB",
            location: "Ruang Bahasa",
            status: "Selesai",
            statusVariant: "success",
        },
    ]

    const getStatusBadge = (status: string, variant: string) => {
        let className = ""
        switch (status) {
            case "Terjadwal":
                className = "bg-blue-100 text-blue-700 hover:bg-blue-100/80 border-transparent"
                break
            case "Selesai":
                className = "bg-green-100 text-green-700 hover:bg-green-100/80 border-transparent"
                break
            case "Draft":
                className = "bg-orange-100 text-orange-700 hover:bg-orange-100/80 border-transparent"
                break
            default:
                className = "bg-gray-100 text-gray-700 hover:bg-gray-100/80 border-transparent"
        }
        return <Badge className={className}>{status}</Badge>
    }

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Column - Form */}
                <Card className="lg:col-span-1 border-none shadow-sm h-fit">
                    <CardHeader className="space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5A1B1B] text-white">
                                <Plus className="h-5 w-5" />
                            </div>
                            <CardTitle className="text-xl">Tambah Jadwal Baru</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Judul Pembekalan</Label>
                            <Input id="title" placeholder="Masukkan Judul Pembekalan" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Tanggal</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "P") : <span>DD/MM/YYYY</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="time">Waktu</Label>
                                <div className="relative">
                                    <Input id="time" placeholder="--:--" />
                                    <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Lokasi</Label>
                            <Input id="location" placeholder="Lokasi/Ruang Pembekalan" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="speaker">Pemateri</Label>
                            <Input id="speaker" placeholder="Pemateri Pembekalan" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Keterangan</Label>
                            <Input id="notes" placeholder="Opsional" />
                        </div>

                        <Button className="w-full bg-[#5A1B1B] hover:bg-[#4a1616] text-white" size="lg">
                            <Save className="mr-2 h-4 w-4" />
                            Simpan Jadwal
                        </Button>
                    </CardContent>
                </Card>

                {/* Right Column - Calendar */}
                <Card className="lg:col-span-2 border-none shadow-sm h-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xl">Kalender Jadwal</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 sm:p-6">
                        <div className="flex justify-center w-full">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md border shadow-sm w-full max-w-full"
                                numberOfMonths={2}
                                classNames={{
                                    months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full relative",
                                    month: "space-y-4 w-full",
                                    table: "w-full border-collapse space-y-1",
                                    head_row: "flex w-full",
                                    head_cell: "text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem]",
                                    row: "flex w-full mt-2",
                                    cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 flex-1 flex items-center justify-center",
                                    day: "h-9 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md flex items-center justify-center",
                                    day_selected:
                                        "bg-[#5A1B1B] text-primary-foreground hover:bg-[#5A1B1B] hover:text-primary-foreground focus:bg-[#5A1B1B] focus:text-primary-foreground",
                                    day_today: "bg-accent text-accent-foreground",
                                    day_outside: "text-muted-foreground opacity-50",
                                    day_disabled: "text-muted-foreground opacity-50",
                                    day_range_middle:
                                        "aria-selected:bg-accent aria-selected:text-accent-foreground",
                                    day_hidden: "invisible",
                                }}
                            />
                        </div>

                        <div className="flex flex-wrap gap-4 mt-6 justify-center">
                            <div className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-[#5A1B1B]"></span>
                                <span className="text-sm text-muted-foreground">Pembekalan Wajib</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-blue-200"></span>
                                <span className="text-sm text-muted-foreground">Pembekalan Pilihan</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-green-200"></span>
                                <span className="text-sm text-muted-foreground">Workshop</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Section - Table */}
            <Card className="border-none shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl">Daftar Jadwal Pembekalan</CardTitle>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Cari Jadwal..."
                                className="w-[200px] pl-8 lg:w-[300px]"
                            />
                        </div>
                        <Button variant="outline" size="sm" className="h-10 gap-1">
                            <Filter className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Filter
                            </span>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Judul Pembekalan</TableHead>
                                <TableHead>Tanggal & Waktu</TableHead>
                                <TableHead>Lokasi</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {schedules.map((schedule) => (
                                <TableRow key={schedule.id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-semibold">{schedule.title}</span>
                                            <span className="text-xs text-muted-foreground">{schedule.description}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">{schedule.date}</span>
                                            <span className="text-xs text-muted-foreground">{schedule.time}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{schedule.location}</TableCell>
                                    <TableCell>
                                        {getStatusBadge(schedule.status, schedule.statusVariant)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="outline" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pagination Mock */}
                    <div className="flex items-center justify-between px-2 pt-4">
                        <div className="text-xs text-muted-foreground">
                            Menampilkan 1-4 dari 4 jadwal
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" className="h-8 w-8 p-0" disabled>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="default" className="h-8 w-8 p-0 bg-[#5A1B1B] text-white hover:bg-[#4a1616]">
                                1
                            </Button>
                            <Button variant="outline" className="h-8 w-8 p-0">
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
