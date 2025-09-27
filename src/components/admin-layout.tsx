'use client'

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Building2, 
  BookOpen, 
  School,
  LogOut,
  Menu,
  X,
  User,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminLayoutProps {
  children: React.ReactNode
  onLogout?: () => void
  user?: {
    username: string
    role: string
  }
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Guru', href: '/admin/guru', icon: GraduationCap },
  { name: 'Siswa', href: '/admin/siswa', icon: Users },
  { name: 'Jurusan', href: '/admin/jurusan', icon: BookOpen },
  { name: 'Kelas', href: '/admin/kelas', icon: School },
  { name: 'Industri', href: '/admin/industri', icon: Building2 },
]

export function AdminLayout({ children, onLogout, user }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // Function to check if current path matches navigation item
  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  const sidebarWidth = collapsed ? "w-16" : "w-64"

  return (
    <div className="min-h-screen bg-gray-50/40">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 lg:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-xl transition-transform duration-300 ease-in-out lg:hidden",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Mobile header */}
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <div className="flex items-center space-x-3">
              <Image
                src="/logo/logo_magangHub.png"
                alt="MagangHub Logo"
                width={100}
                height={28}
                className="h-7 w-auto"
              />
              <span className="text-sm font-medium text-gray-500">Admin</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Button
                  key={item.name}
                  variant="ghost"
                  onClick={() => {
                    router.push(item.href)
                    setSidebarOpen(false)
                  }}
                  className={cn(
                    "w-full justify-start rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-gray-100",
                    active
                      ? "bg-[#641E20] text-white hover:bg-[#641E20]/90"
                      : "text-gray-700 hover:text-gray-900"
                  )}
                >
                  <Icon className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0",
                    active ? "text-white" : "text-gray-400 group-hover:text-gray-600"
                  )} />
                  {item.name}
                </Button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 hidden bg-white shadow-sm transition-all duration-300 lg:block",
        sidebarWidth
      )}>
        <div className="flex h-full flex-col border-r border-gray-200">
          {/* Desktop header */}
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <div className={cn(
              "flex items-center space-x-3 transition-opacity duration-200",
              collapsed ? "opacity-0" : "opacity-100"
            )}>
              <Image
                src="/logo/logo_magangHub.png"
                alt="MagangHub Logo"
                width={100}
                height={28}
                className="h-7 w-auto"
              />
              {!collapsed && <span className="text-sm font-medium text-gray-500">Admin</span>}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className="h-8 w-8 p-0"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Desktop navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Button
                  key={item.name}
                  variant="ghost"
                  onClick={() => router.push(item.href)}
                  className={cn(
                    "w-full justify-start rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-gray-100",
                    active
                      ? "bg-[#641E20] text-white hover:bg-[#641E20]/90"
                      : "text-gray-700 hover:text-gray-900",
                    collapsed && "justify-center"
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon className={cn(
                    "h-5 w-5 flex-shrink-0",
                    active ? "text-white" : "text-gray-400 group-hover:text-gray-600",
                    collapsed ? "mr-0" : "mr-3"
                  )} />
                  <span className={cn(
                    "transition-opacity duration-200",
                    collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                  )}>
                    {item.name}
                  </span>
                </Button>
              )
            })}
          </nav>

          {/* Sidebar footer */}
          <div className="border-t p-3">
            <div className={cn(
              "flex items-center space-x-3 rounded-lg p-2 transition-colors hover:bg-gray-100",
              collapsed && "justify-center"
            )}>
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt={user?.username} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.username}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.role}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={cn(
        "transition-all duration-300",
        collapsed ? "lg:pl-16" : "lg:pl-64"
      )}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 shadow-sm sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex flex-1 items-center justify-end gap-4">
            {/* User menu - Always in top right */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="" alt={user?.username} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.role}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}