# 📡 FTPVault Cloud — Full-Stack File Management System

## 🚀 System Architecture

FTPVault Cloud is a **full-stack file management system** designed to simulate and evolve into a production-grade FTP-like platform. It combines a modern frontend, a secure backend API, and persistent storage on a VPS.

This architecture moves beyond browser-based storage and introduces **real file persistence, authentication, and server-side processing**.

### 🧠 Architectural Flow

```
Client (Next.js Frontend)
        ↓
Node.js API (Express Backend)
        ↓
Database (MongoDB / PostgreSQL)
        ↓
Local Storage (/uploads or cloud storage)
```

### 🔑 Key Architectural Decisions

**Persistent Storage Layer**
Files are stored on the server filesystem or cloud storage, ensuring durability beyond browser sessions.

**Modular Backend Design**
Separation of routes, controllers, and middleware allows scalability and maintainability.

**Security-First Approach**
Authentication, validation, and optional malware scanning ensure safe file handling.

---

## ✨ Core Features

### 🔐 Authentication System

* User registration & login
* Role-based access (Admin / User)
* JWT/session-ready authentication

### 📁 File Management

* Upload, download, and delete files
* Folder organization (virtual structure)
* Search and filtering system
* Upload progress tracking

### 👥 Admin Panel

* Manage users and roles
* Set storage quotas
* Monitor system usage
* View all uploaded files

### 📋 Activity Logs

* Track user actions
* System monitoring
* Debug and audit support

### 🎨 UI/UX

* Responsive dashboard layout
* Sidebar navigation
* Modern dark theme
* Interactive components

---

## 🛠️ Technology Stack

| Domain     | Technology                    |
| ---------- | ----------------------------- |
| Frontend   | Next.js, React, TypeScript    |
| Styling    | CSS / PostCSS                 |
| Backend    | Node.js, Express.js           |
| Database   | MongoDB / PostgreSQL          |
| Storage    | Local Disk / Cloud (Optional) |
| Deployment | VPS (Ubuntu), Nginx, PM2      |

---

## 📁 Project Structure

```
.
├── app/                # Next.js App Router pages
├── components/         # Reusable UI components
├── hooks/              # Custom hooks
├── lib/                # Utilities / helpers
├── public/             # Static assets
├── styles/             # Global styles
├── backend/            # (Optional) Express API
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── next.config.mjs
├── tsconfig.json
├── package.json
└── README.md
```

---

## ⚙️ Local Development Guide

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Run Frontend

```bash
pnpm dev
```

### 3. (Optional) Run Backend

```bash
cd backend
npm install
npm run dev
```

### 4. Open in Browser

```
http://localhost:3000
```

---

## 📡 API Reference

### Authentication

| Method | Endpoint           | Description   |
| ------ | ------------------ | ------------- |
| POST   | /api/auth/login    | Login user    |
| POST   | /api/auth/register | Register user |

### File Management

| Method | Endpoint       | Description    |
| ------ | -------------- | -------------- |
| POST   | /api/upload    | Upload file    |
| GET    | /api/files     | Get user files |
| DELETE | /api/files/:id | Delete file    |

### Admin

| Method | Endpoint         | Description  |
| ------ | ---------------- | ------------ |
| GET    | /api/admin/stats | System stats |
| POST   | /api/admin/user  | Manage users |

---

## 🌍 Production Deployment (VPS/Ubuntu)

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install nodejs npm nginx git -y
sudo npm install -g pm2
```

### Run App

```bash
pnpm build
pnpm start
```

### Setup Nginx + SSL (Optional)

* Configure reverse proxy
* Use Certbot for HTTPS

---

## 👨‍💻 Team & Contributions

Developed as a **full-stack system project**.

| Member | Role                                                   |
| ------ | ------------------------------------------------------ |
| You    | Full-Stack Developer (Frontend + Backend + Deployment) |

---

## 🗺️ Roadmap

* 🔄 Backend integration (API + DB)
* 📦 Real file upload system
* 🔐 Secure authentication (JWT + hashing)
* ☁️ Cloud storage integration
* 📊 Advanced analytics dashboard

---
## 👨‍💻 Team & Contributions

This project was developed and maintained by **Group Haphart**, with each member contributing to different aspects of system design, development, deployment, and quality assurance.

---

### 👥 Team Members

**Jerico Deliva**
Lead System Architect and Full-Stack Developer responsible for:

* Designing the overall system architecture
* Developing the React/Next.js frontend
* Building the backend API (Express.js / planned integration)
* Implementing file handling logic and validation
* Integrating authentication and database systems
* Deploying the application (Nginx, SSL, PM2)
* Handling CI/CD planning and infrastructure optimization

---

**China Faye Carbonero**
Quality Assurance and Project Manager responsible for:

* Coordinating development timelines
* Managing cloud resources and deployment planning
* Monitoring operational costs
* Securing development resources (e.g., GitHub Student Pack)

---

**Trisha Polinag**
Infrastructure and Frontend Contributor responsible for:

* Setting up and configuring the Ubuntu VPS environment
* Assisting in deployment and server configuration
* Supporting frontend styling and responsiveness

---

**Marielle Murphy Linatoc**
Backend Developer responsible for:

* API routing and request handling
* Middleware integration
* Debugging backend-related logic (planned / future backend layer)

---

**Sofia Aimarie Enmasino**
Backend Developer responsible for:

* Database configuration and structure
* Implementing storage quota logic
* Optimizing database queries and performance (planned backend integration)

---

**Shanelle Dela Peña**   
Frontend Developer responsible for:

* Structuring UI components
* Improving user interface and experience (UI/UX)
* Ensuring responsiveness across devices

---

**Marc Oraya**
Quality Assurance and Technical Support responsible for:

* System testing and validation
* Identifying bugs and inconsistencies
* Assisting in deployment troubleshooting

---


---

## 💡 Notes

FTPVault Cloud is a **scalable foundation** for:

* File storage systems
* Admin dashboards
* Cloud-based applications

---
