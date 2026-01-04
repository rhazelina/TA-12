import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Building2,
    CheckCircle2,
    FileText,
    GraduationCap,
    Hourglass,
    LayoutDashboard,
    Mail,
    MoreHorizontal,
    Plus,
    ArrowUpRight,
} from "lucide-react";

export default function KoordinatorDashboardPage() {
    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            {/* Header Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Siswa Aktif PKL
                        </CardTitle>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                            <GraduationCap className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">156</div>
                        <div className="mt-1 flex items-center text-xs text-green-600">
                            <ArrowUpRight className="mr-1 h-3 w-3" />
                            +12% dari bulan lalu
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            PKL Disetujui
                        </CardTitle>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">251</div>
                        <div className="mt-1 flex items-center text-xs text-green-600">
                            <ArrowUpRight className="mr-1 h-3 w-3" />
                            +8% dari bulan lalu
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Permohonan Tertunda
                        </CardTitle>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
                            <Hourglass className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">38</div>
                        <div className="mt-1 flex items-center text-xs text-orange-600">
                            Perlu ditinjau
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Industri Partner
                        </CardTitle>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400">
                            <Building2 className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">26</div>
                        <div className="mt-1 flex items-center text-xs text-blue-600">
                            Aktif bekerjasama
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-7">
                {/* Main Content - Permohonan Terbaru */}
                <Card className="col-span-4 lg:col-span-5">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Permohonan Terbaru</CardTitle>
                            <CardDescription>
                                Daftar pengajuan PKL siswa yang perlu ditinjau
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
                                    name: "Park Jhokuwie",
                                    class: "XII RPL 1",
                                    company: "PT. Teknologi Maju",
                                    status: "Menunggu",
                                    variant: "secondary", // orange-ish usually, but secondary is grey. Let's stick to standard badge logic or override.
                                    color: "bg-orange-100 text-orange-700 hover:bg-orange-100/80",
                                    image: "/avatars/01.png",
                                },
                                {
                                    name: "Kim Shareonni",
                                    class: "XII TKJ 2",
                                    company: "CV. Solusi Digital",
                                    status: "Selesai",
                                    color: "bg-green-100 text-green-700 hover:bg-green-100/80",
                                    image: "/avatars/02.png",
                                },
                                {
                                    name: "Lee Bhouwo",
                                    class: "XII MM 1",
                                    company: "Bank Mandiri",
                                    status: "Tolak",
                                    color: "bg-red-100 text-red-700 hover:bg-red-100/80",
                                    image: "/avatars/03.png",
                                },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between space-x-4">
                                    <div className="flex items-center space-x-4">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={item.image} alt={item.name} />
                                            <AvatarFallback>{item.name.substring(0, 2)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium leading-none">{item.name}</p>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {item.class} • {item.company}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge className={`${item.color} border-0 shadow-none`}>
                                        {item.status}
                                    </Badge>
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
                                Tambah Permohonan
                            </Button>
                            <Button variant="outline" className="w-full justify-start h-12" size="lg">
                                <FileText className="mr-2 h-5 w-5" />
                                Export Data
                            </Button>
                            <Button variant="outline" className="w-full justify-start h-12" size="lg">
                                <LayoutDashboard className="mr-2 h-5 w-5" />
                                Lihat Laporan
                            </Button>
                            <Button variant="outline" className="w-full justify-start h-12" size="lg">
                                <Mail className="mr-2 h-5 w-5" />
                                Kirim Notifikasi
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
