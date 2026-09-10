# Quick Setup Guide

## 🚀 Get Started in 2 Minutes

### Step 1: Backend Setup
```bash
cd backend
python setup.py
# Choose 'development' when prompted
pip install -r requirements.txt
python app.py
```

### Step 2: Frontend Setup (New Terminal)
```bash
cd frontend
node setup.js
# Choose 'development' when prompted
npm install
npm run dev
```

### Step 3: Test the Connection
- Backend: http://127.0.0.1:5000/api/test
- Frontend: http://localhost:5173
- API Integration: Browse Library section

## 🔧 Manual Setup (Alternative)

### Backend
```bash
cd backend
cp env.development .env
pip install -r requirements.txt
python app.py
```

### Frontend
```bash
cd frontend
cp env.development .env
npm install
npm run dev
```

## 📋 What Was Created

### Backend Environment Files:
- `env.example` - Template
- `env.development` - Dev config
- `env.production` - Prod config
- `setup.py` - Setup script

### Frontend Environment Files:
- `env.example` - Template  
- `env.development` - Dev config
- `env.production` - Prod config
- `setup.js` - Setup script

## 🌐 URLs After Setup

- **Backend API**: http://127.0.0.1:5000
- **Frontend**: http://localhost:5173
- **API Test**: http://127.0.0.1:5000/api/test
- **Books API**: http://127.0.0.1:5000/api/books

## ⚠️ Important Notes

1. **Port Configuration**: 
   - Backend: 5000 (Flask)
   - Frontend: 5173 (Vite configured)

2. **CORS**: Configured for localhost:5173 (plus legacy localhost:8080)

3. **Environment Variables**: 
   - Backend uses `python-dotenv`
   - Frontend uses Vite's built-in env support

4. **API Integration**: 
   - Frontend automatically detects backend URL
   - Debug logging enabled in development

## 🐛 Troubleshooting

**CORS Issues**: Check backend console for allowed origins
**API Connection**: Verify both servers are running
**Environment**: Restart servers after changing .env files

For detailed setup: See `ENVIRONMENT_SETUP.md` 