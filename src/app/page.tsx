'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Users, 
  GraduationCap, 
  Building2, 
  BookOpen, 
  School,
  ArrowRight,
  CheckCircle,
  BarChart3,
  Shield,
  Zap
} from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <Image
              src="/logo/logo_magangHub.png"
              alt="MagangHub Logo"
              width={120}
              height={32}
              className="h-8 w-auto"
            />
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-gray-700 hover:text-[#641E20] transition-colors">
              Fitur
            </a>
            <a href="#about" className="text-sm font-medium text-gray-700 hover:text-[#641E20] transition-colors">
              Tentang
            </a>
            <Link href="/login">
              <Button className="bg-[#641E20] hover:bg-[#641E20]/90 text-white">
                Masuk
              </Button>
            </Link>
          </nav>
          <div className="md:hidden">
            <Link href="/login">
              <Button size="sm" className="bg-[#641E20] hover:bg-[#641E20]/90 text-white">
                Masuk
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl animate-fade-in">
              Sistem Manajemen
              <span className="block text-[#641E20]">Magang Terpadu</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 animate-fade-in-delay-1">
              Platform komprehensif untuk mengelola data siswa, industri, dan program magang 
              dengan interface yang modern dan user-friendly.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 animate-fade-in-delay-2">
              <Link href="/login">
                <Button size="lg" className="bg-[#641E20] hover:bg-[#641E20]/90 text-white px-8 py-3 text-base">
                  Mulai Sekarang
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="#features" className="text-sm font-semibold leading-6 text-gray-900 hover:text-[#641E20] transition-colors">
                Pelajari Lebih Lanjut <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#641E20] to-[#8B2635] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-32 bg-gray-50/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Fitur Unggulan
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Solusi lengkap untuk kebutuhan manajemen magang modern
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-7xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature Cards */}
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#641E20]/10 group-hover:bg-[#641E20]/20 transition-colors">
                      <GraduationCap className="h-5 w-5 text-[#641E20]" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Manajemen Siswa</h3>
                  </div>
                  <p className="text-gray-600">
                    Kelola data siswa magang dengan mudah, termasuk profil, penempatan, dan evaluasi kinerja.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#641E20]/10 group-hover:bg-[#641E20]/20 transition-colors">
                      <Users className="h-5 w-5 text-[#641E20]" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Penempatan Magang</h3>
                  </div>
                  <p className="text-gray-600">
                    Sistem komprehensif untuk mencatat dan memantau penempatan magang siswa di industri.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#641E20]/10 group-hover:bg-[#641E20]/20 transition-colors">
                      <BookOpen className="h-5 w-5 text-[#641E20]" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Program Magang</h3>
                  </div>
                  <p className="text-gray-600">
                    Organisasi program magang yang terstruktur dengan kurikulum yang dapat disesuaikan.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#641E20]/10 group-hover:bg-[#641E20]/20 transition-colors">
                      <School className="h-5 w-5 text-[#641E20]" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Monitoring Magang</h3>
                  </div>
                  <p className="text-gray-600">
                    Monitoring dan evaluasi magang yang fleksibel dengan laporan perkembangan yang optimal.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#641E20]/10 group-hover:bg-[#641E20]/20 transition-colors">
                      <Building2 className="h-5 w-5 text-[#641E20]" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Kemitraan Industri</h3>
                  </div>
                  <p className="text-gray-600">
                    Kelola hubungan dengan industri untuk program magang dan kerjasama profesional.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#641E20]/10 group-hover:bg-[#641E20]/20 transition-colors">
                      <BarChart3 className="h-5 w-5 text-[#641E20]" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Laporan & Analitik</h3>
                  </div>
                  <p className="text-gray-600">
                    Dashboard komprehensif dengan visualisasi data dan laporan yang dapat diekspor.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="about" className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Mengapa Memilih MagangHub?
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Platform yang dirancang khusus untuk kebutuhan manajemen magang modern dengan teknologi terdepan.
              </p>
              <div className="mt-8 space-y-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Interface Intuitif</h3>
                    <p className="text-gray-600">Desain yang user-friendly memudahkan penggunaan untuk semua kalangan.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Keamanan Terjamin</h3>
                    <p className="text-gray-600">Sistem keamanan berlapis untuk melindungi data sensitif institusi.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Zap className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Performa Tinggi</h3>
                    <p className="text-gray-600">Dibangun dengan teknologi modern untuk performa optimal dan responsif.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#641E20]/10 to-[#641E20]/5 p-8">
                <div className="grid grid-cols-2 gap-4 h-full">
                  <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-center hover:shadow-md transition-shadow">
                    <Image
                      src="/logo/logo_magangHub.png"
                      alt="MagangHub Logo"
                      width={80}
                      height={24}
                      className="h-6 w-auto"
                    />
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-center hover:shadow-md transition-shadow">
                    <Users className="h-8 w-8 text-[#641E20]" />
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-center hover:shadow-md transition-shadow">
                    <GraduationCap className="h-8 w-8 text-[#641E20]" />
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-center hover:shadow-md transition-shadow">
                    <Building2 className="h-8 w-8 text-[#641E20]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#641E20]">
        <div className="container mx-auto px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Siap untuk Memulai?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/90">
              Bergabunglah dengan institusi pendidikan lainnya yang telah mempercayai MagangHub untuk mengelola sistem magang mereka.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/login">
                <Button size="lg" variant="secondary" className="px-8 py-3 text-base">
                  Akses Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <div className="flex items-center justify-center">
              <Image
                src="/logo/logo_magangHub.png"
                alt="MagangHub Logo"
                width={80}
                height={20}
                className="h-5 w-auto"
              />
            </div>
            <p className="text-sm text-gray-600">
              © 2024 MagangHub. Sistem Manajemen Magang Terpadu.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
