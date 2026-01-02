"use client"

import { ListGuruPembimbing } from "@/api/kapro/indext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { DaftarGuruPembimbing } from "@/types/api";
import { Search } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const DataPembimbingPKL = () => {

    const [dataPembimbing, setDataPembimbing] = useState<DaftarGuruPembimbing[]>([])
    const [search, setSearch] = useState<string>("")
    const [refreshing, setRefreshing] = useState<boolean>(false)

    useEffect(() => {
        async function fetch() {
            const response = await ListGuruPembimbing(search)
            if (!response) {
                console.log("error pada saat fetch data pembimbing pkl")
            }
            console.log(response)
            setDataPembimbing(response)
        }
        fetch()
    }, [refreshing])

    return (
        <div className="bg-white border rounded-2xl p-6 shadow-sm mt-5 mx-5">
            <div className="flex justify-between items-center mb-5">
                <div>
                    <h2 className="text-lg font-semibold">Data Pembimbing PKL</h2>
                    <p className="text-sm text-gray-500">Daftar guru pembimbing praktik kerja lapangan</p>
                </div>

                <div className="flex">
                    <InputGroup>
                        <InputGroupInput onChange={(e) => {
                            if (e.target.value === "") {
                                setRefreshing(!refreshing)
                            }
                            setSearch(e.target.value)
                        }} placeholder="Cari Pembimbing" />
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                    </InputGroup>
                    <Button className="ml-2" onClick={() => setRefreshing(!refreshing)}>
                        Cari
                    </Button>
                </div>

                {/* <div className="flex items-center gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Cari pembimbing..."
                            className="pl-10 pr-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                    </div>
                </div> */}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-gray-600 bg-gray-50">
                            <th className="p-3 font-medium">No</th>
                            <th className="p-3 font-medium">Nama Guru</th>
                            <th className="p-3 font-medium">No Telepon</th>
                        </tr>
                    </thead>

                    <tbody>
                        {dataPembimbing.map((item, index) => (
                            <tr key={item.id} className="border-b last:border-none">
                                <td className="p-3">{index + 1}</td>

                                <td className="p-3">
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <p className="font-medium text-gray-800">{item.nama}</p>
                                            <p className="text-gray-500 text-xs">{item.nip}</p>
                                        </div>
                                    </div>
                                </td>

                                <td className="p-3">{item.no_telp}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataPembimbingPKL;
