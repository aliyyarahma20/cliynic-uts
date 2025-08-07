# 💊 CLIYNIC - UTS Cloud Computing 2025

Aplikasi web apotek sederhana dengan fitur manajemen produk berbasis microservice dan arsitektur cloud. Dibangun menggunakan React dan Node.js, serta dideploy di Amazon EC2 dengan alur CI/CD otomatis via GitHub Actions.

## 🎯 Tujuan Proyek

Project ini dibuat dalam rangka memenuhi Ujian Tengah Semester (UTS) Mata Kuliah Cloud Computing. Fokus utama pengerjaan ini adalah pada arsitektur cloud yang sesuai soal UTS, yaitu:

- Deploy frontend & backend di EC2
- Backend tidak memiliki IP publik (akses via bastion/frontend)
- CI/CD backend via GitHub Actions → EC2 frontend → EC2 backend (private)
- Integrasi AWS RDS, S3, CloudFront
- Dockerisasi backend. Frontend tidak dijalankan menggunakan Docker karena sudah dideploy langsung di EC2 frontend menggunakan Nginx, dengan konfigurasi yang telah disesuaikan melalui file nginx.conf. Deploy dilakukan via CI/CD dan hasil build React disajikan melalui port 80.

## 👤 Role & Fitur

| Role   | Fitur                                                                 |
|--------|-----------------------------------------------------------------------|
| Admin  | ✅ CRUD produk (tambah, edit, hapus, lihat) + Upload gambar ke S3     |
| User   | ✅ Hanya bisa melihat daftar produk (read-only)                       |

> **Note:** Fitur user masih akan terus dikembangkan. Saat ini difokuskan pada implementasi CI/CD, cloud infrastructure, dan deployment.

## 📂 Struktur Folder

```
cliynic-uts/
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── app.js
│   ├── s3.js
│   ├── db.js
│   ├── Dockerfile
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── AdminProductPage.js
│   │   │   ├── ProductPage.js
│   │   │   └── ...
│   │   └── styles/
│   └── package.json
└── .github/
    └── workflows/
        └── deploy.yml     # ← CI/CD workflow
```

## 🚀 Stack & Layanan Cloud

| Komponen      | Teknologi / Layanan                                                    |
|---------------|------------------------------------------------------------------------|
| **Frontend**  | React.js                                                               |
| **Backend**   | Express.js (Node.js)                                                   |
| **Database**  | Amazon RDS (MySQL)                                                     |
| **Storage**   | Amazon S3 + CloudFront                                                 |
| **CI/CD**     | GitHub Actions                                                         |
| **Infrastructure** | 2 EC2 instances (FE & BE), VPC, private IP communication        |
| **Containerisasi** | Docker (backend)                                                                 |

## 🔄 Alur CI/CD Backend

1. **Developer push** ke branch `main`
2. **GitHub Actions** berjalan:
   - Mengirim folder backend ke EC2 frontend (sebagai bastion) via SCP
   - Dari EC2 frontend, folder backend diteruskan ke EC2 backend via private IP (SCP)
   - Di EC2 backend:
     - Stop & remove container lama
     - Docker build image backend terbaru
     - Jalankan ulang container backend dengan port 3001
     - Salin file `.env` ke dalam container baru

## ✅ Status Fungsional

- [x] CI/CD backend berhasil otomatis jalan
- [x] EC2 backend tanpa IP publik, hanya bisa diakses dari frontend
- [x] Gambar produk tersimpan di S3 & diakses via CloudFront CDN
- [x] Frontend terhubung dengan backend
- [x] Admin bisa CRUD produk
- [x] User bisa melihat produk (read-only)
- [x] Backend berjalan melalui Docker

## 🔐 Keamanan & Akses

- SSH key terenkripsi di GitHub Secrets
- `.env` tidak dikomit, hanya dikirim via SCP saat deploy
- Frontend-Backend hanya berkomunikasi via private IP (dalam VPC)

---

## 💻 Developer

**Aliyya Rahmawati Putri**  
NRP: 152023093  
UTS Cloud Computing 2025
