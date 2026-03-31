# Engenius Project v2

โปรเจกต์นี้ถูกตั้งค่าให้ทำงานบนระบบ Docker ทั้งหมด เพื่อแก้ปัญหา Environment ไม่ตรงกันระหว่างเครื่องนักพัฒนา (It works on my machine)

---

## เทคโนโลยีที่ใช้
- **Frontend:** Next.js (App Router) + shadcn/ui + Bun  
- **API:** ElysiaJS + Bun  
- **Database:** PostgreSQL 17  

---

## First Time Setup

### ที่ต้องมี
- Git  
- Docker Desktop *(เปิดโปรแกรมทิ้งไว้)*  

> ❌ ไม่ต้องติดตั้ง Node.js, Bun หรือ PostgreSQL ลงในเครื่อง

---

### 1️⃣ Clone โปรเจกต์
```bash
git clone <ใส่ลิงก์_github_ของโปรเจกต์>
cd engenius-project-v2
```

---

### 2️⃣ ตั้งค่า Environment
```bash
cp .env.example .env
```
จากนั้นสามารถแก้ไขค่า Database Username / Password ได้ตามต้องการ

---

### รันระบบทั้งหมด
```bash
docker compose up -d --build
```

> การรันครั้งแรกจะใช้เวลาสักครู่ (โหลด image + install package)

---

## ช่องทางการเข้าถึง (Ports)

| Service   | URL |
|----------|-----|
| Frontend | http://localhost:3000 |
| API      | http://localhost:8000 |
| Database | localhost:5432 |

📌 Database สามารถเชื่อมผ่านโปรแกรม เช่น **DBeaver / TablePlus**  
โดยใช้ค่าใน `.env`

---

## Workflow

ระบบมี **Hot Reload**   

เมื่อแก้ไฟล์ใน:
- `frontend/`
- `api/`

ระบบจะอัปเดตอัตโนมัติ

---

### ห้าม
- ห้ามรัน `bun install` หรือ install package บนเครื่องตรงๆ

### ต้องทำผ่าน Docker

---

## ทีม Frontend

### ติดตั้ง Library
```bash
docker compose exec frontend bun add <ชื่อแพ็กเกจ>
```

### ติดตั้ง Component (shadcn/ui)
```bash
docker compose exec frontend bunx --bun shadcn@latest add <ชื่อcomponent>
```

### การเรียก API

| Type | ใช้ตัวแปร |
|------|----------|
| Client-side ("use client") | `process.env.NEXT_PUBLIC_API_URL` |
| Server-side (SSR) | `process.env.INTERNAL_API_URL` |

---

## API

### ติดตั้ง Library
```bash
docker compose exec api bun add <ชื่อแพ็กเกจ>
```

### รันคำสั่ง Database (Prisma / Drizzle)
```bash
docker compose exec api bunx <generate>
```

---

## คำสั่ง Docker พื้นฐาน

### ดู Log
```bash
docker compose logs -f frontend
docker compose logs -f api
docker compose logs -f db
```

---

### ปิดระบบ
```bash
docker compose down
```

---

## Tips
- ถ้า container มีปัญหา ให้ลอง:
```bash
docker compose down -v
docker compose up -d --build
```

- ตรวจสอบ container:
```bash
docker ps
```

---

