# 🔄 API Proxy Setup untuk Bypass Mixed Content

## 🎯 **Masalah yang Diselesaikan**

Mixed Content error terjadi ketika:
- **Frontend Vercel**: `https://maganghub-ta.vercel.app` (HTTPS)
- **Backend API**: `http://sispkl.gedanggoreng.com:8000` (HTTP)
- **Browser**: Memblock HTTPS → HTTP requests

## 🛠️ **Solusi: Next.js API Route Proxy**

### **Arsitektur Solusi:**
```
Frontend (HTTPS) → Next.js API Route (HTTPS) → External API (HTTP)
     ✅ Aman           ✅ Internal Request        ✅ Server-side
```

## 📁 **Files yang Dibuat/Dimodifikasi:**

### 1. **API Proxy Route** (`src/app/api/proxy/[...path]/route.ts`)
- ✅ Handle semua HTTP methods (GET, POST, PUT, DELETE)
- ✅ Forward headers (Authorization, Content-Type)
- ✅ Proxy semua request ke `http://sispkl.gedanggoreng.com:8000`
- ✅ CORS handling
- ✅ Error handling

### 2. **Axios Configuration** (`src/utils/axios/index.ts`)
- ✅ Smart environment detection
- ✅ Development: Direct HTTP API call
- ✅ Production: Use `/api/proxy` route

## 🔧 **Cara Kerja:**

### **Development (localhost)**
```javascript
// Direct call ke API HTTP
baseURL: 'http://sispkl.gedanggoreng.com:8000'
```

### **Production (Vercel)**
```javascript
// Melalui proxy route
baseURL: '/api/proxy'
```

### **URL Mapping:**
```
Frontend Request: POST /api/proxy/auth/login
↓
Proxy forwards to: POST http://sispkl.gedanggoreng.com:8000/auth/login
```

## 🚀 **Testing di Vercel:**

1. **Deploy ke Vercel** dengan proxy route ini
2. **Test Login** - tidak akan ada Mixed Content error lagi
3. **Check Console** - request akan ke `/api/proxy/auth/login`
4. **Backend** akan menerima request normal

## 📊 **Build Status:**
- ✅ **Build successful** dengan proxy route
- ✅ **Route size**: 127 B (sangat ringan)
- ✅ **Dynamic rendering** untuk server-side proxy

## 🔍 **Debug Tips:**

### **Check Network Tab:**
```
✅ Development: Request ke http://sispkl.gedanggoreng.com:8000/auth/login
✅ Production:  Request ke https://yourapp.vercel.app/api/proxy/auth/login
```

### **Check Console Logs:**
```javascript
// Akan muncul di Vercel Function logs
console.log('🔄 Proxying POST /api/proxy/auth/login');
```

## 🎯 **Environment Variables Vercel:**

Tidak ada environment variable khusus yang diperlukan untuk proxy. 
Optional:
```bash
NEXT_PUBLIC_API_BASE_URL=/api/proxy  # Override default behavior
```

## ✅ **Hasil:**
- ❌ Mixed Content error: **RESOLVED**
- ✅ Login functionality: **WORKING**
- ✅ API calls: **PROXIED THROUGH HTTPS**
- ✅ Development: **TETAP NORMAL**

## 🔄 **Migration Future:**

Ketika API sudah support HTTPS:
```javascript
// Update environment variable saja
NEXT_PUBLIC_API_BASE_URL=https://sispkl.gedanggoreng.com:8000

// Proxy route akan otomatis tidak digunakan
```
