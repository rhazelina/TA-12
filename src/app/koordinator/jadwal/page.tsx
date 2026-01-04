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

            {/* Timeline Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                    {
                        title: "Pembekalan",
                        icon: BookOpen,
                        color: "text-rose-600",
                        bg: "bg-rose-50 dark:bg-rose-900/10",
                        desc: "Persiapan materi & mental",
                    },
                    {
                        title: "Pengantaran",
                        icon: Truck,
                        color: "text-amber-600",
                        bg: "bg-amber-50 dark:bg-amber-900/10",
                        desc: "Mobilisasi ke industri",
                    },
                    {
                        title: "Monitoring",
                        icon: Users,
                        color: "text-blue-600",
                        bg: "bg-blue-50 dark:bg-blue-900/10",
                        desc: "Pemantauan berkala",
                    },
                    {
                        title: "Penjemputan",
                        icon: Package,
                        color: "text-emerald-600",
                        bg: "bg-emerald-50 dark:bg-emerald-900/10",
                        desc: "Penarikan peserta",
                    },
                ].map((item, i) => (
                    <Card key={i} className="relative overflow-hidden transition-all hover:shadow-md">
                        <CardHeader className="pb-2">
                            <div className={`mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg ${item.bg} ${item.color}`}>
                                <item.icon className="h-6 w-6" />
                            </div>
                            <CardTitle className="text-lg">{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>{item.desc}</CardDescription>
                            {i < 3 && (
                                <div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 lg:block text-muted-foreground/30">
                                    <MoveRight className="h-8 w-8" />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
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
