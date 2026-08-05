# 🛵 ServiceSetu — Doorstep Two-Wheeler Servicing & Service Proof Platform

**ServiceSetu** is a doorstep two-wheeler servicing platform. Customers book a vehicle service online, a verified mechanic visits their preferred location (home/office), performs on-site servicing, and provides a digital **Service Proof Report** with verified barcode scanning to guarantee genuine engine oil and spare parts.

---

## 🌟 Key Features & Core USP

- 👤 **Category-Wise Role Portal (`LoginPage.jsx`)**: Auto-redirection for Customers, Verified Mechanics, and Platform SuperAdmins.
- 📸 **Live Camera Barcode Scanner (`html5-qrcode`)**: Mechanics scan physical EAN/QR barcodes on oil cans and spare parts using their device camera with audio beep feedback.
- 🛡️ **Duplicate Barcode Security Engine**: Automated system flagging duplicate barcode reuses across multiple bookings to prevent product fraud.
- 🗄️ **Persistent SQL Database Engine (`better-sqlite3`)**: High-performance SQLite database (`servicesetu.db`) tracking bookings, verified barcodes, and security audit logs.
- 💳 **Official Razorpay Payment Gateway Integration**: Native Razorpay Node.js SDK order creation & HMAC SHA256 signature verification.
- 📍 **Real Device GPS Geolocation Tracking**: Live mechanic location broadcasting via HTML5 Browser Geolocation API (`navigator.geolocation.watchPosition`).
- 🔧 **Expanded Vehicle Health Inspection**: Logs odometer reading, fuel level, battery voltage, tyre pressures, brake pad life %, and pre-service body scratch notes.
- 📊 **4-Way Revenue Stream Capture**: Admin dashboard splitting booking fees, product margins, accessory sales, and AMC subscriptions.
- 📦 **Digital Garage & AMC Plans**: Customer portal tracking vehicle health scores, service history, and annual maintenance packages.

---

## 🏗️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, `html5-qrcode`
- **Backend**: Node.js, Express.js, `better-sqlite3`, `razorpay`, `crypto`
- **Database**: SQLite Relational Engine (`servicesetu.db`)
- **Payments**: Razorpay Node SDK Integration
- **Deployment**: Vercel Ready (`vercel.json`)

---

## ⚡ Quick Start (Local Run)

### 1. Start Backend API Server
```bash
cd server
npm install
node src/app.js
```
*Backend runs on `http://localhost:5000`*

### 2. Start Frontend React Application
```bash
cd client
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`*

---

## 🌐 Production Deployment

Configured for 1-click deployment on **Vercel**:
```bash
npx vercel
```
*Uses pre-configured `vercel.json` routing for static bundle & serverless Express API.*

---

## 📄 License
MIT License. Created for ServiceSetu Doorstep Vehicle Servicing.
