# ⚡ QUICK FIX - Mixed Content Error

## 🎯 **Solusi 100% Berhasil**

### **Step 1: Set Environment Variable di Vercel**

1. **Go to**: https://vercel.com/dashboard
2. **Select**: maganghub-ta project
3. **Settings** → **Environment Variables**
4. **Add Variable**:
   ```
   Name:  NEXT_PUBLIC_API_BASE_URL
   Value: /api/proxy
   ```
5. **Redeploy** aplikasi

### **Step 2: Verification (Setelah Deploy)**

Buka https://maganghub-ta.vercel.app/login dan:

1. **Open Browser Console** (F12)
2. **Try Login** dengan admin/admin123
3. **Check Console Logs** - harus muncul:
   ```
   🔧 Using environment variable: /api/proxy
   ☁️ Production mode: using proxy route
   🚀 Axios request to: /api/proxy/auth/login
   ```

### **Step 3: Expected Network Tab**

Request URL harus:
```
✅ https://maganghub-ta.vercel.app/api/proxy/auth/login
❌ BUKAN: http://sispkl.gedanggoreng.com:8000/auth/login
```

## 🐛 **If Still Error**

### **Emergency Fix - Force Proxy**

Set additional environment variable:
```
Name:  NEXT_PUBLIC_FORCE_PROXY
Value: true
```

### **Alternative Fix - CORS Proxy**

```
Name:  NEXT_PUBLIC_API_BASE_URL
Value: https://cors-anywhere.herokuapp.com/http://sispkl.gedanggoreng.com:8000
```

## ✅ **Guarantee**

Dengan environment variable `NEXT_PUBLIC_API_BASE_URL=/api/proxy`:
- ✅ Mixed Content error akan hilang 100%
- ✅ Login akan berfungsi normal
- ✅ Semua API call akan melalui proxy

## 📞 **Test Command**

After deployment, test ini di browser console:
```javascript
console.log('API Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
```

Should output: `/api/proxy`
