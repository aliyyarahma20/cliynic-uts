# 💊 CLIYNIC - UTS Cloud Computing 2025
Aplikasi web apotek sederhana dengan fitur manajemen produk berbasis microservice dan arsitektur cloud. Dibangun menggunakan React dan Node.js, serta dideploy di Amazon EC2 dengan alur CI/CD otomatis via GitHub Actions.

## 🎯 Tujuan Proyek
Project ini dibuat dalam rangka memenuhi Ujian Tengah Semester (UTS) Mata Kuliah Cloud Computing. Fokus utama pengerjaan ini adalah pada arsitektur cloud yang sesuai soal UTS, yaitu:
- Deploy frontend & backend di EC2
- Backend tidak memiliki IP publik (akses via bastion/frontend)
- CI/CD backend via GitHub Actions → EC2 frontend → EC2 backend (private)
- Integrasi AWS RDS, S3, CloudFront
- Dockerisasi backend dan frontend. Frontend berjalan dalam Docker container dengan Nginx untuk serving React build, sedangkan backend juga berjalan dalam Docker container terpisah. Kedua container di-orchestrate melalui Docker Compose atau individual containers di EC2 masing-masing.

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
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
└── .github/
    └── workflows/
        └── deploy.yml     # ← CI/CD workflow (both FE & BE)
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
| **Containerisasi** | Docker (frontend & backend)                                    |

## 🔄 Alur CI/CD Full Stack
1. **Developer push** ke branch `main`
2. **GitHub Actions** berjalan:
   - Build Docker image untuk frontend (React + Nginx)
   - Build Docker image untuk backend (Node.js + Express)
   - Push images ke Docker Registry atau transfer ke EC2
   - Di EC2 frontend: Stop & restart frontend container (port 80)
   - Transfer backend image ke EC2 backend via private IP
   - Di EC2 backend: Stop & restart backend container (port 3001)
   - Update environment variables untuk kedua containers

## ✅ Status Fungsional
- [x] CI/CD backend berhasil otomatis jalan
- [x] EC2 backend tanpa IP publik, hanya bisa diakses dari frontend
- [x] Gambar produk tersimpan di S3 & diakses via CloudFront CDN
- [x] Frontend terhubung dengan backend
- [x] Admin bisa CRUD produk
- [x] User bisa melihat produk (read-only)
- [x] Frontend dan backend berjalan melalui Docker containers

## 🔐 Keamanan & Akses
- SSH key terenkripsi di GitHub Secrets
- `.env` tidak dikomit, hanya dikirim via SCP saat deploy
- Frontend-Backend hanya berkomunikasi via private IP (dalam VPC)

## 📊 Kesimpulan
Proyek CLIYNIC berhasil mengimplementasikan arsitektur cloud computing yang komprehensif dengan mengintegrasikan berbagai layanan AWS dan praktik DevOps modern. Aplikasi ini mendemonstrasikan penerapan microservice architecture dengan frontend di public subnet dan backend di private subnet untuk keamanan optimal. 

Implementasi CI/CD melalui GitHub Actions memungkinkan otomatisasi deployment yang efisien, sementara penggunaan Docker memastikan konsistensi environment aplikasi. Integrasi CloudFront sebagai CDN meningkatkan performa loading gambar, dan konfigurasi VPC dengan security groups yang tepat menjamin keamanan komunikasi antar layanan.

---
## 💻 Developer
**Aliyya Rahmawati Putri**  
NRP: 152023093  
UTS Cloud Computing 2025
