// <!DOCTYPE html>
// <html lang="id">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Form Permohonan PKL</title>
//     <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
//     <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
//     <style>
//         /* --- CSS Reset & Variabel --- */
//         :root {
//             --primary-red: #6A1B21; /* Merah Marun Gelap untuk tombol kirim */
//             --bg-color: #F8F9FA;
//             --border-color: #2F2F2F; /* Warna border gelap */
//             --btn-add-bg: #E3D5CD; /* Warna krem tombol tambah */
//             --btn-add-text: #4A4A4A;
//             --remove-red: #D32F2F; /* Merah terang untuk tombol hapus */
//             --text-color: #000000;
//         }

//         * {
//             box-sizing: border-box;
//             margin: 0;
//             padding: 0;
//             font-family: 'Inter', sans-serif;
//         }

//         body {
//             background-color: var(--bg-color);
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             min-height: 100vh;
//             padding: 20px;
//         }

//         /* --- Main Card Container --- */
//         .card {
//             background-color: white;
//             width: 100%;
//             max-width: 900px;
//             padding: 40px;
//             border-radius: 8px;
//             box-shadow: 0 2px 10px rgba(0,0,0,0.05);
//             border: 1px solid #E0E0E0;
//         }

//         /* --- Form Labels --- */
//         label {
//             display: block;
//             font-weight: 700;
//             font-size: 16px;
//             margin-bottom: 8px;
//             color: var(--text-color);
//         }

//         .required {
//             color: var(--remove-red);
//             margin-left: 2px;
//         }

//         .form-group {
//             margin-bottom: 24px;
//         }

//         /* --- INPUT STYLING BARU (Solusi untuk ikon di dalam) --- */
        
//         /* 1. Container untuk Input Biasa (tanpa tombol hapus, misal: Nama Industri) */
//         .simple-input-container {
//             position: relative;
//             width: 100%;
//             padding: 12px 16px;
//             border: 1.5px solid var(--border-color);
//             border-radius: 10px;
//             background-color: white;
//             display: flex;
//             align-items: center;
//         }

//         /* 2. Container untuk Input Gabungan (Input + Ikon + Tombol Hapus) */
//         .combined-input-container {
//             width: 100%;
//             padding: 10px 16px; /* Padding sedikit disesuaikan */
//             border: 1.5px solid var(--border-color);
//             border-radius: 10px;
//             background-color: white;
//             display: flex;
//             align-items: center;
//             justify-content: space-between; /* Memisahkan input dan grup ikon */
//         }

//         /* 3. Style untuk tag <input> yang sekarang transparan */
//         .transparent-input {
//             flex-grow: 1; /* Mengisi ruang yang tersedia */
//             border: none;
//             background: transparent;
//             outline: none;
//             font-size: 14px;
//             color: #333;
//             padding: 0; /* Reset padding bawaan */
//             margin-right: 10px; /* Jarak agar teks tidak menabrak ikon */
//         }

//         .transparent-input::placeholder {
//             color: #555;
//             font-weight: 500;
//         }

//         /* --- Icon Styling --- */
//         /* Grup untuk ikon di sebelah kanan (panah & tombol hapus) */
//         .icon-group {
//             display: flex;
//             align-items: center;
//             gap: 12px; /* Jarak antara ikon panah dan tombol merah */
//             flex-shrink: 0; /* Mencegah ikon menyusut */
//         }

//         .chevron-icon {
//             color: #333;
//             font-size: 14px;
//             pointer-events: none;
//         }

//         /* Ikon panah dengan posisi absolut untuk input biasa */
//         .chevron-icon-abs {
//             position: absolute;
//             right: 16px;
//             color: #333;
//             font-size: 14px;
//             pointer-events: none;
//         }

//         /* Tombol Hapus (Lingkaran Merah) */
//         .btn-remove {
//             background-color: var(--remove-red);
//             color: white;
//             border: none;
//             width: 28px;
//             height: 28px;
//             border-radius: 50%;
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             cursor: pointer;
//             font-size: 12px;
//         }

//         /* --- Textarea Styling --- */
//         .styled-textarea {
//             width: 100%;
//             padding: 12px 16px;
//             border: 1.5px solid var(--border-color);
//             border-radius: 10px;
//             font-size: 14px;
//             color: #333;
//             outline: none;
//             resize: none;
//             height: 120px;
//             font-family: 'Inter', sans-serif;
//         }

//         /* --- Buttons --- */
//         .add-btn-container {
//             display: flex;
//             justify-content: flex-end;
//             margin-bottom: 24px;
//         }

//         .btn-add {
//             background-color: var(--btn-add-bg);
//             color: var(--btn-add-text);
//             border: none;
//             padding: 10px 20px;
//             border-radius: 6px;
//             font-weight: 600;
//             font-size: 14px;
//             cursor: pointer;
//             display: flex;
//             align-items: center;
//             gap: 5px;
//         }

//         .form-actions {
//             display: flex;
//             justify-content: center;
//             gap: 15px;
//             margin-top: 40px;
//         }

//         .btn {
//             padding: 12px 30px;
//             border-radius: 6px;
//             font-weight: 600;
//             font-size: 14px;
//             cursor: pointer;
//             display: flex;
//             align-items: center;
//             gap: 8px;
//         }

//         .btn-cancel {
//             background-color: white;
//             border: 1px solid #ccc;
//             color: #333;
//         }

//         .btn-submit {
//             background-color: var(--primary-red);
//             color: white;
//             border: none;
//         }
        
//         .btn-submit i {
//             font-size: 12px;
//         }

//     </style>
// </head>
// <body>

//     <div class="card">
//         <div class="form-group">
//             <label>Nama Industri <span class="required">*</span></label>
//             <div class="simple-input-container">
//                 <input type="text" class="transparent-input" placeholder="Pilih Industri..." readonly>
//                 <i class="fa-solid fa-sort chevron-icon-abs"></i>
//             </div>
//         </div>

//         <div class="form-group">
//             <label>Peserta 1 <span class="required">*</span></label>
//             <div class="combined-input-container">
//                 <input type="text" class="transparent-input" placeholder="Pilih Siswa ..." readonly>
//                 <div class="icon-group">
//                     <i class="fa-solid fa-sort chevron-icon"></i>
//                     <button class="btn-remove">
//                         <i class="fa-solid fa-minus"></i>
//                     </button>
//                 </div>
//             </div>
//         </div>

//         <div class="form-group">
//             <label>Peserta 2 <span class="required">*</span></label>
//             <div class="combined-input-container">
//                 <input type="text" class="transparent-input" placeholder="Pilih Siswa ..." readonly>
//                 <div class="icon-group">
//                     <i class="fa-solid fa-sort chevron-icon"></i>
//                     <button class="btn-remove">
//                         <i class="fa-solid fa-minus"></i>
//                     </button>
//                 </div>
//             </div>
//         </div>
        
//         <div class="form-group">
//             <label>Peserta 2 <span class="required">*</span></label>
//             <div class="combined-input-container">
//                 <input type="text" class="transparent-input" placeholder="Pilih Siswa ..." readonly>
//                 <div class="icon-group">
//                     <i class="fa-solid fa-sort chevron-icon"></i>
//                     <button class="btn-remove">
//                         <i class="fa-solid fa-minus"></i>
//                     </button>
//                 </div>
//             </div>
//         </div>

//         <div class="add-btn-container">
//             <button class="btn-add">
//                 + Tambah Peserta
//             </button>
//         </div>

//         <div class="form-group">
//             <label>Catatan <span class="required">*</span></label>
//             <textarea class="styled-textarea">PT. Secercah Harapan</textarea>
//         </div>

//         <div class="form-actions">
//             <button class="btn btn-cancel">Batal</button>
//             <button class="btn btn-submit">
//                 <i class="fa-solid fa-paper-plane"></i> Kirim Permohonan
//             </button>
//         </div>
//     </div>

// </body>
// </html>
