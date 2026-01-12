import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    BookOpen,
    CalendarDays,
    CheckCircle2,
    Clock,
    MapPin,
    MoreHorizontal,
    MoveRight,
    Package,
    Plus,
    Truck,
    Users,
} from "lucide-react";

export default function JadwalPage() {
    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Garis Waktu PKL</h1>
            </div>

            {/* Premium Horizontal Timeline UI */}
            <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-background via-muted/20 to-muted/50 p-1 shadow-2xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent)] pointer-events-none" />
                <Card className="border-none bg-transparent shadow-none">
                    <CardContent className="p-10">
                        <div className="relative flex flex-col md:flex-row justify-between items-center gap-12 md:gap-4 px-4">
                            {/* Timeline Track */}
                            <div className="absolute top-[32px] left-8 right-8 h-[2px] bg-gradient-to-r from-rose-200 via-blue-200 to-emerald-200 hidden md:block opacity-30 z-0" />

                            {[
                                {
                                    title: "Pembekalan",
                                    icon: BookOpen,
                                    color: "text-rose-600",
                                    iconBg: "bg-rose-500/10",
                                    border: "border-rose-200",
                                    desc: "Materi & Persiapan",
                                    status: "Selesai"
                                },
                                {
                                    title: "Pengantaran",
                                    icon: Truck,
                                    color: "text-amber-600",
                                    iconBg: "bg-amber-500/10",
                                    border: "border-amber-200",
                                    desc: "Mobilisasi Industri",
                                    status: "Aktif"
                                },
                                {
                                    title: "Monitoring",
                                    icon: Users,
                                    color: "text-blue-600",
                                    iconBg: "bg-blue-500/10",
                                    border: "border-blue-200",
                                    desc: "Pemantauan Berkala",
                                    status: "Mendatang"
                                },
                                {
                                    title: "Penjemputan",
                                    icon: Package,
                                    color: "text-emerald-600",
                                    iconBg: "bg-emerald-500/10",
                                    border: "border-emerald-200",
                                    desc: "Penarikan Peserta",
                                    status: "Mendatang"
                                },
                            ].map((item, i) => (
                                <div key={i} className="relative z-10 flex flex-col items-center text-center group cursor-default">
                                    <div className={`relative flex h-16 w-16 items-center justify-center rounded-2xl border ${item.border} bg-white dark:bg-zinc-900 border-opacity-50 shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                                        <div className={`absolute inset-0 rounded-2xl ${item.iconBg} opacity-20`} />
                                        <item.icon className={`h-7 w-7 ${item.color} relative z-10`} />

                                        {item.status === "Aktif" && (
                                            <div className="absolute -top-1 -right-1 flex h-4 w-4">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500"></span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6 space-y-1.5 px-2">
                                        <h3 className="font-bold text-sm tracking-tight text-foreground/90">{item.title}</h3>
                                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.1em]">{item.desc}</p>
                                        <div className="mx-auto h-0.5 w-0 transition-all duration-500 group-hover:w-full bg-gradient-to-r from-transparent via-foreground/10 to-transparent mt-1" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-7">
                {/* Main Content - Pengingat (Enhanced) */}
                <Card className="col-span-4 lg:col-span-5 h-fit">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Pengingat</CardTitle>
                            <CardDescription>
                                Agenda kegiatan PKL yang akan datang
                            </CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="hidden sm:flex">
                            Lihat Semua
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {[
                                {
                                    title: "Pembekalan Jurusan DKV",
                                    date: "27",
                                    month: "Aug",
                                    year: "2025",
                                    pic: "Pak Taufiq",
                                    color: "bg-blue-500",
                                    bg: "bg-blue-50",
                                    text: "text-blue-700",
                                },
                                {
                                    title: "Pengantaran PKL Peserta Didik ke PT. Zeus",
                                    date: "01",
                                    month: "Sep",
                                    year: "2025",
                                    pic: "Pak Dimas",
                                    color: "bg-emerald-500",
                                    bg: "bg-emerald-50",
                                    text: "text-emerald-700",
                                },
                                {
                                    title: "Monitoring ke JV Partner Indonesia",
                                    date: "04",
                                    month: "Oct",
                                    year: "2025",
                                    pic: "Bu Husna",
                                    color: "bg-rose-500",
                                    bg: "bg-rose-50",
                                    text: "text-rose-700",
                                },
                                {
                                    title: "Penjemputan Peserta Didik di BLK Wonojati",
                                    date: "31",
                                    month: "Dec",
                                    year: "2025",
                                    pic: "Bu Rere",
                                    color: "bg-purple-500",
                                    bg: "bg-purple-50",
                                    text: "text-purple-700",
                                },
                            ].map((item, i) => (
                                <div key={i} className="group flex items-start gap-4 rounded-lg bg-background p-3 transition-colors hover:bg-muted/50">
                                    {/* Date Badge */}
                                    <div className={`flex h-14 w-14 flex-col items-center justify-center rounded-lg border ${item.bg} ${item.text} shadow-sm`}>
                                        <span className="text-xl font-bold leading-none">{item.date}</span>
                                        <span className="text-[10px] font-medium uppercase leading-none mt-1">{item.month}</span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-1 flex-col gap-1">
                                        <div className="flex items-center justify-between">
                                            <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                                {item.title}
                                            </p>
                                            {i === 0 && (
                                                <div className="flex items-center text-[10px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                                                    <Clock className="mr-1 h-3 w-3" />
                                                    Segera
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <div className="flex items-center">
                                                <Users className="mr-1.5 h-3.5 w-3.5" />
                                                {item.pic}
                                            </div>
                                            <div className="hidden sm:flex items-center">
                                                <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
                                                {item.year}
                                            </div>
                                        </div>
                                    </div>

                                    <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Right Sidebar - Aksi Cepat */}
                <div className="col-span-3 lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Aksi Cepat</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button className="w-full justify-start bg-[#5A1B1B] hover:bg-[#4a1616] text-white" size="lg">
                                <Plus className="mr-2 h-5 w-5" />
                                Tambah Jadwal Pembekalan
                            </Button>
                            <Button variant="outline" className="w-full justify-start h-auto py-3 text-left whitespace-normal" size="lg">
                                <Truck className="mr-2 h-5 w-5 shrink-0" />
                                <span>Tambah Jadwal Pengantaran</span>
                            </Button>
                            <Button variant="outline" className="w-full justify-start h-auto py-3 text-left whitespace-normal" size="lg">
                                <Users className="mr-2 h-5 w-5 shrink-0" />
                                <span>Tambah Jadwal Monitoring</span>
                            </Button>
                            <Button variant="outline" className="w-full justify-start h-auto py-3 text-left whitespace-normal" size="lg">
                                <Package className="mr-2 h-5 w-5 shrink-0" />
                                <span>Tambah Jadwal Penjemputan</span>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
