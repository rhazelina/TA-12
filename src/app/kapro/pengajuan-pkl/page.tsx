"use client"

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PengajuanIndividu from "@/components/kapro/pengajuan/individu";
import PengajuanKelompok from "@/components/kapro/pengajuan/kelompok";

export default function PengajuanPKL() {
    return (
        <div className="w-full p-6 space-y-6">
            <h1 className="text-2xl font-bold">Daftar Pengajuan PKL</h1>
            <Tabs defaultValue="individu" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-6">
                    <TabsTrigger value="individu">Individu</TabsTrigger>
                    <TabsTrigger value="kelompok">Kelompok</TabsTrigger>
                </TabsList>

                <TabsContent value="individu" className="space-y-6 outline-none">
                    <PengajuanIndividu />
                </TabsContent>

                <TabsContent value="kelompok" className="space-y-6 outline-none">
                    <PengajuanKelompok />
                </TabsContent>
            </Tabs>
        </div>
    );
}