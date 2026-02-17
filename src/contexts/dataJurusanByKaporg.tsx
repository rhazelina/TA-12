'use client'
import { MeKaprog } from "@/api/kapro/indext";
import { createContext, useContext, useEffect, useState } from "react";

const context = createContext<string | null>(null)

export default function DataJurusanByKaporgProvider({ children }: { children: React.ReactNode }) {
    const [departmentName, setDepartmentName] = useState<string>("");

    useEffect(() => {
        const fetchDepartment = async () => {
            try {
                const res = await MeKaprog();
                if (res?.data?.data && res.data.data.length > 0) {
                    // Assuming response structure: { data: { data: [{ nama: "Teknik Tata Boga", ... }] } }
                    setDepartmentName(res.data.data[0].kode);
                }
            } catch (error) {
                console.error("Failed to fetch department info", error);
            }
        };
        fetchDepartment();
    }, []);
    return (
        <context.Provider value={departmentName}>
            {children}
        </context.Provider>
    )
}

export function useDataJurusanByKaporg() {
    const ctx = useContext(context)
    if (!ctx) {
        throw new Error("useDataJurusanByKaporg must be used within a DataJurusanByKaporgProvider")
    }
    return ctx
}