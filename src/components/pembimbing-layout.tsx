"use client"

import { AppSidebar } from "@/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import React, { useEffect, useState } from "react"

export default function PembimbingLayout({ children, pathname }: { children: React.ReactNode, pathname: string }) {
    const [pathName, setPathName] = useState("");

    useEffect(() => {
        switch (pathname) {
            case "dashboard":
                setPathName("Dashboard");
                break;
            default:
                break;
        }
    }, [pathname])

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">
                                        {pathName}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                {children}
            </SidebarInset>
        </SidebarProvider>
    )

    // return (
    //     <div className="flex">
    //         {/* SIDEBAR */}
    //         <aside className="w-20 bg-[#6b1717] text-white h-screen flex flex-col items-center py-6 fixed">
    //             <div className="w-full flex items-center justify-center mb-6">
    //                 <GraduationCap className="w-10 h-10 bg-white rounded-sm text-[#6b1717] p-1" />
    //             </div>

    //             <nav className="flex-1 w-full flex flex-col items-center space-y-5 mt-2">
    //                 <button className="">
    //                     <Home
    //                         className="w-5 h-5s"
    //                     />
    //                 </button>

    //                 <button className="">
    //                     <FileUp />
    //                 </button>

    //                 <button className="">
    //                     <TriangleAlert />
    //                 </button>

    //                 <button className="">
    //                     <CalendarCheck />
    //                 </button>
    //                 <button className="">
    //                     <Inbox />
    //                 </button>

    //                 <div className="mt-auto mb-4">
    //                     <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/30">
    //                         <img src="https://i.pravatar.cc/100?img=12" alt="avatar" className="w-full h-full object-cover" />
    //                     </div>
    //                 </div>
    //             </nav>
    //         </aside>
    //         {/* MAIN CONTENT */}
    //         <main className="w-full">
    //             {children}
    //         </main>
    //     </div>
    // )
}