'use client';

import { ListPermohonanPKL } from "@/api/kapro/indext";
import { DaftarPermohonanPKL } from "@/types/api";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Printer } from "lucide-react";

interface GroupedData {
    industryName: string;
    students: DaftarPermohonanPKL[];
}

export default function PersetujuanPkl() {
    const [groupedData, setGroupedData] = useState<Record<number, GroupedData>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await ListPermohonanPKL();
                // Filter only approved applications if necessary, based on previous context 
                // "res.data.filter((item: DaftarPermohonanPKL) => item.application.status === "Approved")"
                // The API might return all, so we keep the filtering from the original file.
                const approvedData = res?.data?.filter((item: DaftarPermohonanPKL) => item.application.status === "Approved") || [];

                const grouped: Record<number, GroupedData> = {};

                approvedData.forEach((item: DaftarPermohonanPKL) => {
                    const industryId = item.application.industri_id;
                    if (!grouped[industryId]) {
                        grouped[industryId] = {
                            industryName: item.industri_nama,
                            students: []
                        };
                    }
                    grouped[industryId].students.push(item);
                });

                setGroupedData(grouped);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetch();
    }, []);

    const handlePrintLetter = (industryName: string, students: DaftarPermohonanPKL[]) => {
        const printWindow = window.open('', '', 'width=800,height=600');
        if (!printWindow) return;

        const date = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

        const studentsList = students.map((s, index) => `
            <div style="margin-bottom: 4px;">
                ${index + 1}. ${s.siswa_username}
            </div>
        `).join('');

        const content = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Lembar Persetujuan - ${industryName}</title>
                <style>
                    body { font-family: 'Times New Roman', serif; padding: 20px; line-height: 1.5; color: #000; }
                    .header { text-align: center; border-bottom: 3px double black; padding-bottom: 10px; margin-bottom: 20px; position: relative; }
                    .header img { position: absolute; left: 0; top: 0; width: 80px; height: auto; }
                    .header h2, .header h3, .header h4 { margin: 0; font-weight: bold; }
                    .header h2 { font-size: 14pt; }
                    .header h3 { font-size: 16pt; }
                    .header p { margin: 0; font-size: 10pt; }
                    
                    .title { text-align: center; font-weight: bold; text-decoration: underline; margin: 20px 0; font-size: 12pt; text-transform: uppercase; }
                    
                    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                    th, td { border: 1px solid black; padding: 8px; vertical-align: top; font-size: 11pt; }
                    th { font-weight: bold; text-align: center; }
                    
                    .col-no { width: 40px; text-align: center; }
                    .col-perihal { width: 35%; }
                    .col-du-di { width: 35%; }
                    .col-ket { width: 25%; }
                    
                    .field-label { display: inline-block; width: 60px; }
                    .dotted-line { border-bottom: 1px dotted #000; display: inline-block; width: calc(100% - 70px); }
                    
                    .footer { margin-top: 40px; text-align: right; }
                    
                    @media print {
                        body { padding: 0; }
                        @page { size: A4; margin: 2cm; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <!-- Placeholder for logo if available, or just space -->
                    <img src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Logo_SMKN_2_Singosari.png" alt="Logo" />
                    <h3>PEMERINTAH PROVINSI JAWA TIMUR</h3>
                    <h3>DINAS PENDIDIKAN</h3>
                    <h2>SMK NEGERI 2 SINGOSARI</h2>
                    <p>Jalan Perusahaan No. 20, Kab. Malang, Jawa Timur, 65153</p>
                    <p>Telepon (0341) 458823</p>
                </div>
                
                <h3 class="title">LEMBAR PERSETUJUAN</h3>
                
                <table>
                    <thead>
                        <tr>
                            <th class="col-no">NO</th>
                            <th class="col-perihal">PERIHAL</th>
                            <th class="col-du-di">DISETUJUI OLEH<br>PIHAK DU/DI</th>
                            <th class="col-ket">KETERANGAN</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="col-no">1.</td>
                            <td>
                                <p style="margin-bottom: 10px;">
                                    Permohonan pelaksanaan Pembelajaran Praktik Industri (PJBL) untuk ${students.length} orang siswa, atas nama:
                                </p>
                                ${studentsList}
                            </td>
                            <td>
                                <div style="margin-bottom: 8px;">
                                    Nama : <br>
                                    <div style="border-bottom: 1px dotted black; height: 20px; margin-top: 5px;"></div>
                                </div>
                                <div style="margin-bottom: 8px;">
                                    Tanggal : <br>
                                    <div style="border-bottom: 1px dotted black; height: 20px; margin-top: 5px;"></div>
                                </div>
                                <div style="margin-bottom: 20px;">
                                    Paraf : <br>
                                    <div style="height: 40px;"></div>
                                </div>
                                <div style="margin-bottom: 8px;">
                                    Catatan : <br>
                                    <div style="border-bottom: 1px dotted black; height: 20px; margin-top: 5px;"></div>
                                    <div style="border-bottom: 1px dotted black; height: 20px; margin-top: 5px;"></div>
                                </div>
                                <div style="margin-bottom: 8px;">
                                    1. Mulai PKL pada tanggal : <br>
                                    ............................. s/d .............................
                                </div>
                                <div>
                                    2. Diterima Sebanyak ......... siswa.
                                </div>
                            </td>
                            <td>
                                Telah disetujui Siswa Siswi SMK NEGERI 2 SINGOSARI untuk melaksanakan PKL di ${industryName}
                            </td>
                        </tr>
                    </tbody>
                </table>
                
                <div class="footer">
                    <p>Malang, ${date}</p>
                    <p>Bapak / Ibu Pimpinan</p>
                    <br><br><br><br>
                    <p>( ........................................................... )</p>
                </div>
                
                <script>
                    window.onload = function() { window.print(); }
                </script>
            </body>
            </html>
        `;

        printWindow.document.write(content);
        printWindow.document.close();
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold mb-6">Persetujuan PKL</h1>

            {isLoading ? (
                <p>Loading data...</p>
            ) : Object.keys(groupedData).length === 0 ? (
                <p className="text-muted-foreground">Tidak ada data persetujuan PKL.</p>
            ) : (
                <div className="grid gap-6">
                    {Object.values(groupedData).map((group, idx) => (
                        <Card key={idx} className="w-full">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div>
                                    <CardTitle className="text-xl font-bold">{group.industryName}</CardTitle>
                                    <CardDescription>{group.students.length} Siswa</CardDescription>
                                </div>
                                <Button
                                    onClick={() => handlePrintLetter(group.industryName, group.students)}
                                    variant="outline"
                                    className="gap-2"
                                >
                                    <Printer className="h-4 w-4" />
                                    Generate Surat
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[50px]">No</TableHead>
                                            <TableHead>Nama Siswa</TableHead>
                                            <TableHead>NISN</TableHead>
                                            <TableHead>Kelas</TableHead>
                                            <TableHead>Jurusan</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {group.students.map((student, index) => (
                                            <TableRow key={student.application.id}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell className="font-medium">{student.siswa_username}</TableCell>
                                                <TableCell>{student.siswa_nisn}</TableCell>
                                                <TableCell>{student.kelas_nama}</TableCell>
                                                <TableCell>{student.jurusan_nama}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}