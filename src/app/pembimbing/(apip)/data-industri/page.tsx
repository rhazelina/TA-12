import React from "react";

const DaftarIndustri = () => {
  const industries = [
    { id: 1, name: "JV Partner Indonesia", total: "6 Anak", image: "https://via.placeholder.com/80" },
    { id: 2, name: "JV Partner Indonesia", total: "6 Anak", image: "https://via.placeholder.com/80" },
    { id: 3, name: "JV Partner Indonesia", total: "6 Anak", image: "https://via.placeholder.com/80" },
    { id: 4, name: "JV Partner Indonesia", total: "6 Anak", image: "https://via.placeholder.com/80" },
    { id: 5, name: "JV Partner Indonesia", total: "6 Anak", image: "https://via.placeholder.com/80" },
  ];

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#6B0F0F] text-white flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 p-4 text-xl font-semibold">
            <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="logo" className="w-8" />
            Dashboard PKL
          </div>
          <nav className="flex flex-col gap-2 mt-4">
            <button className="flex items-center gap-3 bg-[#872020] py-2 px-4 rounded-r-full">
              <i className="fa-solid fa-house"></i> Dashboard
            </button>
            <button className="flex items-center gap-3 py-2 px-4 hover:bg-[#872020]">
              <i className="fa-solid fa-folder"></i> Bukti
            </button>
            <button className="flex items-center gap-3 py-2 px-4 hover:bg-[#872020]">
              <i className="fa-solid fa-triangle-exclamation"></i> Permasalahan
            </button>
            <button className="flex items-center gap-3 py-2 px-4 hover:bg-[#872020]">
              <i className="fa-solid fa-calendar-check"></i> Perizinan
            </button>
            <button className="flex items-center gap-3 py-2 px-4 hover:bg-[#872020]">
              <i className="fa-solid fa-right-left"></i> Persetujuan Pindah
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-3 bg-[#5C0D0D] px-4 py-3">
          <img
            src="https://via.placeholder.com/50"
            alt="pak ilham"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-medium text-sm">Pak Ilham</p>
            <p className="text-xs opacity-80">Koordinator</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-white p-8">
        <div className="border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Daftar Industri</h2>

          {/* List Industri */}
          <div className="space-y-4">
            {industries.map((ind) => (
              <div
                key={ind.id}
                className="flex items-center justify-between border-b pb-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={ind.image}
                    alt={ind.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{ind.name}</p>
                    <p className="text-sm text-gray-500">{ind.total}</p>
                  </div>
                </div>
                <button className="bg-blue-100 text-blue-600 text-sm px-4 py-1 rounded-full hover:bg-blue-200 transition">
                  Lihat
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6 border rounded-lg px-4 py-2 text-sm">
          <p>Menampilkan 1–3 dari 7 Permohonan</p>
          <div className="flex items-center gap-1">
            <button className="border rounded-full px-2 py-1">&lt;</button>
            <button className="bg-[#6B0F0F] text-white rounded-full px-2 py-1">01</button>
            <button className="border rounded-full px-2 py-1">&gt;</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DaftarIndustri;