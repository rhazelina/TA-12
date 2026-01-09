<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MagangHub - Data Guru Pembimbing</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <style>
        :root {
            --primary-bg: #641E20;
            --white: #ffffff;
            --text-gray: #717171;
            --text-dark: #333333;
            --border-color: #e0e0e0;
            --btn-blue: #3267E3; /* Warna biru tombol lebih tegas sesuai foto */
            --bg-light: #F9FAFB;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Poppins', sans-serif;
        }

        body {
            display: flex;
            height: 100vh;
            background-color: #f5f5f5;
        }

        /* Sidebar Styling */
        .sidebar {
            width: 70px;
            background-color: var(--primary-bg);
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: 20px;
            color: white;
            flex-shrink: 0;
        }

        .sidebar-icon {
            margin-bottom: 25px;
            opacity: 0.6;
            cursor: pointer;
            font-size: 20px;
        }

        .sidebar-icon.active {
            opacity: 1;
        }

        /* Main Content */
        .main-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            background-color: var(--white);
            overflow-y: auto;
        }

        header {
            padding: 25px 40px;
        }

        .logo-section h2 {
            font-size: 24px;
            color: #333;
        }

        .logo-section h2 span {
            color: var(--text-gray);
            font-weight: 300;
        }

        .logo-section p {
            font-size: 13px;
            color: var(--text-gray);
        }

        /* Container Card */
        .content-card {
            margin: 0 40px 40px 40px;
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 25px;
            display: flex;
            flex-direction: column;
        }

        .toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
        }

        .toolbar h3 {
            font-size: 16px;
            color: var(--text-dark);
        }

        .actions {
            display: flex;
            gap: 12px;
        }

        .search-box {
            position: relative;
        }

        .search-box input {
            padding: 8px 12px 8px 35px;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            width: 240px;
            font-size: 13px;
            background-color: #fff;
        }

        .search-box i {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: #aaa;
        }

        .btn-add {
            background-color: #2D3E50; /* Warna gelap tombol sesuai foto */
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        /* Mentor List Items */
        .mentor-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 0;
            border-bottom: 1px solid #f0f0f0;
        }

        .mentor-info {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        /* Avatar Bulat dengan Warna Inisial */
        .avatar {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #333;
            font-weight: 600;
            font-size: 14px;
        }

        .details h4 {
            font-size: 14px;
            color: #333;
            font-weight: 600;
        }

        .details p {
            font-size: 12px;
            color: var(--text-gray);
        }

        .btn-view {
            background-color: #EBF2FF;
            color: #3267E3;
            border: none;
            padding: 6px 18px;
            border-radius: 6px;
            font-size: 12px;
            cursor: pointer;
            font-weight: 500;
        }

        /* --- Perubahan Bagian Footer --- */
        .footer-info {
            margin-top: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        /* Kolom khusus untuk teks keterangan halaman */
        .info-column {
            background-color: transparent;
            padding: 5px 0;
        }

        .info-column p {
            font-size: 12px;
            color: #888;
        }

        .pagination {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .page-num {
            background-color: var(--primary-bg);
            color: white;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
        }

        .nav-arrow {
            color: #ccc;
            font-size: 12px;
            cursor: pointer;
        }
    </style>
</head>
<body>

    <aside class="sidebar">
        <div class="sidebar-icon"><i class="fa-solid fa-graduation-cap"></i></div>
        <div class="sidebar-icon"><i class="fa-solid fa-house"></i></div>
        <div class="sidebar-icon"><i class="fa-solid fa-calendar-days"></i></div>
        <div class="sidebar-icon active"><i class="fa-solid fa-user-group"></i></div>
        <div class="sidebar-icon"><i class="fa-solid fa-file-lines"></i></div>
        <div class="sidebar-icon"><i class="fa-solid fa-gear"></i></div>
    </aside>

    <main class="main-content">
        <header>
            <div class="logo-section">
                <h2>Magang<span>Hub</span></h2>
                <p>Ringkasan singkat mengenai sistem manajemen PKL Anda.</p>
            </div>
        </header>

        <section class="content-card">
            <div class="toolbar">
                <h3>Data Guru Pembimbing PKL</h3>
                <div class="actions">
                    <div class="search-box">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <input type="text" placeholder="Cari Pembimbing...">
                    </div>
                    <button class="btn-add">
                        <i class="fa-solid fa-user-plus"></i> Tambah Pembimbing
                    </button>
                </div>
            </div>

            <div class="mentor-list">
                <div class="mentor-item">
                    <div class="mentor-info">
                        <div class="avatar" style="background-color: #AED6F1;">LD</div>
                        <div class="details">
                            <h4>Lestari Dewi, S.Pd.</h4>
                            <p>PT. Cipta Karya Teknologi</p>
                        </div>
                    </div>
                    <button class="btn-view">Lihat</button>
                </div>

                <div class="mentor-item">
                    <div class="mentor-info">
                        <div class="avatar" style="background-color: #ABEBC6;">AP</div>
                        <div class="details">
                            <h4>Andi Pratama, Drs.</h4>
                            <p>CV. Mitra Sejahtera</p>
                        </div>
                    </div>
                    <button class="btn-view">Lihat</button>
                </div>

                <div class="mentor-item">
                    <div class="mentor-info">
                        <div class="avatar" style="background-color: #D7BDE2;">RH</div>
                        <div class="details">
                            <h4>Rudi Hartono, M.Pd.</h4>
                            <p>PT. Indo Kreatif Media</p>
                        </div>
                    </div>
                    <button class="btn-view">Lihat</button>
                </div>

                <div class="mentor-item">
                    <div class="mentor-info">
                        <div class="avatar" style="background-color: #EDBB99;">NA</div>
                        <div class="details">
                            <h4>Nur Aini, S.Kom.</h4>
                            <p>CV. Sentosa Mandiri</p>
                        </div>
                    </div>
                    <button class="btn-view">Lihat</button>
                </div>

                <div class="mentor-item">
                    <div class="mentor-info">
                        <div class="avatar" style="background-color: #A2D9CE;">DS</div>
                        <div class="details">
                            <h4>Dimas Saputra, M.T.</h4>
                            <p>PT. Nusantara Digital</p>
                        </div>
                    </div>
                    <button class="btn-view">Lihat</button>
                </div>
            </div>

            <div class="footer-info">
                <div class="info-column">
                    <p>Menampilkan 1-5 dari 7 laman guru pembimbing</p>
                </div>
                
                <div class="pagination">
                    <i class="fa-solid fa-chevron-left nav-arrow"></i>
                    <div class="page-num">01</div>
                    <i class="fa-solid fa-chevron-right nav-arrow" style="color: #333;"></i>
                </div>
            </div>
        </section>
    </main>

</body>
</html>