# 🚀 Vercel Deployment Setup - MagangHub

## ⚠️ **CRITICAL: Environment Variable Setup**

Untuk mengatasi Mixed Content error, **WAJIB** set environment variable di Vercel:

### **Step 1: Login ke Vercel Dashboard**
1. Go to: https://vercel.com/dashboard
2. Select your project: `maganghub-ta`
3. Go to **Settings** → **Environment Variables**

### **Step 2: Add Environment Variable**
```bash
Name:  NEXT_PUBLIC_API_BASE_URL
Value: /api/proxy
```

### **Step 3: Redeploy**
1. Go to **Deployments** tab
2. Click **"Redeploy"** pada deployment terakhir
3. **ATAU** push any commit untuk trigger deployment

## 🔧 **How It Works**

### **Without Environment Variable (ERROR):**
```javascript
// Akan tetap pakai HTTP direct
baseURL: "http://sispkl.gedanggoreng.com:8000" ❌
↓
Mixed Content Error!
```

### **With Environment Variable (SUCCESS):**
```javascript
// Akan pakai proxy route
baseURL: "/api/proxy" ✅
↓
POST /api/proxy/auth/login ✅
↓ (server-side)
POST http://sispkl.gedanggoreng.com:8000/auth/login ✅
```

## 📝 **Verification Steps**

### **1. Check Vercel Logs**
- Go to **Functions** tab in Vercel
- Look for proxy route logs: `🔄 Proxying POST /api/proxy/auth/login`

### **2. Check Browser Network Tab**
- Request URL should be: `https://maganghub-ta.vercel.app/api/proxy/auth/login`
- NOT: `http://sispkl.gedanggoreng.com:8000/auth/login`

### **3. Check Console Logs**
- Should see: `🚀 Axios request to: /api/proxy/auth/login`
- Should see: `🔄 Using proxy route for production: /api/proxy`

## 🐛 **If Still Not Working**

### **Option 1: Manual Environment Check**
Add this to your Vercel environment variables:
```bash
NEXT_PUBLIC_DEBUG_MODE=true
```

### **Option 2: Force Proxy Mode**
```bash
NEXT_PUBLIC_API_BASE_URL=/api/proxy
NEXT_PUBLIC_FORCE_PROXY=true
```

### **Option 3: Alternative Proxy Service**
```bash
NEXT_PUBLIC_API_BASE_URL=https://cors-anywhere.herokuapp.com/http://sispkl.gedanggoreng.com:8000
```

## ✅ **Expected Results After Setup**

1. **No Mixed Content errors** ✅
2. **Login functionality works** ✅
3. **Console shows proxy usage** ✅
4. **Vercel function logs show API calls** ✅

## 🔄 **Environment Variables Summary**

```bash
# REQUIRED - Set ini untuk fix Mixed Content
NEXT_PUBLIC_API_BASE_URL=/api/proxy

# OPTIONAL - For encryption
NEXT_PUBLIC_ENCRYPTION_KEY=your-secure-key-here

# OPTIONAL - For debugging
NEXT_PUBLIC_DEBUG_MODE=true
```

## 📞 **Support**

If masih error setelah setup environment variable:
1. Check Vercel deployment logs
2. Check browser console untuk log messages
3. Verify environment variable sudah ter-set dengan benar
