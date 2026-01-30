export default function DaftarPengajuanPindahPKL() {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <div className="mx-auto max-w-7xl p-8">

                {/* Header */}
                <h1 className="text-2xl font-bold text-gray-800">
                    Daftar Pengajuan Pindah PKL
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Kelola permohonan kepindahan tempat PKL siswa.
                </p>

                {/* Statistik */}
                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4">
                    {[
                        { label: "Total Pengajuan", value: 5, bg: "bg-blue-100", text: "text-blue-600", icon: "⇄" },
                        { label: "Menunggu Persetujuan", value: 3, bg: "bg-yellow-100", text: "text-yellow-600", icon: "⏳" },
                        { label: "Disetujui", value: 1, bg: "bg-green-100", text: "text-green-600", icon: "✔" },
                        { label: "Ditolak", value: 1, bg: "bg-red-100", text: "text-red-600", icon: "✖" },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="flex items-center justify-between rounded-xl bg-white p-6 shadow"
                        >
                            <div>
                                <p className="text-sm text-gray-500">{item.label}</p>
                                <p className={`text-3xl font-bold ${item.text}`}>
                                    {item.value}
                                </p>
                            </div>
                            <div
                                className={`flex h-10 w-10 items-center justify-center rounded-full ${item.bg} ${item.text}`}
                            >
                                {item.icon}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filter */}
                <div className="mt-6 flex items-center justify-between">
                    <input
                        type="text"
                        placeholder="Cari siswa..."
                        className="w-1/3 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <select className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200">
                        <option>Semua Status</option>
                        <option>Menunggu</option>
                        <option>Disetujui</option>
                        <option>Ditolak</option>
                    </select>
                </div>

                {/* Table */}
                <div className="mt-4 overflow-x-auto rounded-xl bg-white shadow">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-left text-gray-600">
                            <tr>
                                <th className="px-6 py-4">Nama</th>
                                <th className="px-6 py-4">Tempat Baru</th>
                                <th className="px-6 py-4">Tempat Lama</th>
                                <th className="px-6 py-4">Alasan</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {/* Menunggu */}
                            <tr className="border-t">
                                <td className="px-6 py-4">
                                    <p className="font-semibold">Siti Nurhaliza</p>
                                    <p className="text-xs text-gray-500">12345678</p>
                                </td>

                                <td className="px-6 py-4">
                                    <p className="font-semibold">PT. Teknologi Maju</p>
                                    <p className="text-xs text-gray-500">
                                        Sisa: 4 Bulan 3 hari
                                    </p>
                                </td>

                                <td className="px-6 py-4">
                                    <p className="font-semibold">CV. Digital Solusi</p>
                                    <p className="text-xs text-gray-500">
                                        Sudah: 2 Bulan 27 hari
                                    </p>
                                </td>

                                <td className="px-6 py-4">
                                    Jarak terlalu jauh dari rumah
                                </td>

                                <td className="px-6 py-4">
                                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                                        Menunggu
                                    </span>
                                </td>

                                <td className="px-6 py-4 text-right">
                                    <div className="flex flex-col items-end gap-3">
                                        <a
                                            href="#"
                                            className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                                        >
                                            <span className="rounded bg-red-100 px-2 py-1 text-red-600">
                                                📄
                                            </span>
                                            surat_penerimaan_siti.pdf
                                        </a>

                                        <div className="flex gap-2">
                                            <button className="rounded-md bg-green-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-green-700">
                                                Setujui
                                            </button>
                                            <button className="rounded-md bg-red-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-700">
                                                Tolak
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>

                            {/* Disetujui */}
                            <tr className="border-t">
                                <td className="px-6 py-4">
                                    <p className="font-semibold">Ahmad Fauzi</p>
                                    <p className="text-xs text-gray-500">12345679</p>
                                </td>

                                <td className="px-6 py-4">
                                    <p className="font-semibold">PT. Manufaktur Indo</p>
                                    <p className="text-xs text-gray-500">
                                        Sisa: 5 Bulan 20 hari
                                    </p>
                                </td>

                                <td className="px-6 py-4">
                                    <p className="font-semibold">PT. Otomotif Prima</p>
                                    <p className="text-xs text-gray-500">
                                        Sudah: 1 Bulan 10 hari
                                    </p>
                                </td>

                                <td className="px-6 py-4">
                                    Bidang lebih sesuai minat
                                </td>

                                <td className="px-6 py-4">
                                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                        Disetujui
                                    </span>
                                </td>

                                <td className="px-6 py-4 text-right text-gray-400 italic">
                                    Sudah diproses
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}
