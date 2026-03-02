# Enterprise AI SaaS Platform - Setup Guide

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- MongoDB (optional, for OAuth)

### 1. Backend Setup (FastAPI)

```bash
cd backend-fastapi
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your Supabase credentials
python main.py
```

Backend runs on: http://localhost:5000

### 2. Frontend Setup (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:5173

## Environment Configuration

### Backend (.env)
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
JWT_SECRET=your-random-secret-32-chars
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

## Features

- Email/password authentication
- Google & Twitter OAuth
- JWT token management
- Data scientist IDE with Python execution
- File explorer and code editor
- Terminal integration
- Real-time analytics dashboard

## API Documentation

Once backend is running:
- Swagger UI: http://localhost:5000/docs
- ReDoc: http://localhost:5000/redoc

## Project Structure

```
├── backend-fastapi/     # FastAPI backend
├── frontend/            # React frontend
└── README/              # Documentation
```

## Troubleshooting

**Backend won't start:**
- Check Python version: `python --version`
- Verify dependencies: `pip install -r requirements.txt`
- Check .env file exists and has valid credentials

**Frontend won't start:**
- Check Node version: `node --version`
- Clear cache: `rm -rf node_modules package-lock.json && npm install`
- Verify backend is running on port 5000

**OAuth not working:**
- Verify OAuth credentials in backend .env
- Check callback URLs match your OAuth provider settings
- Ensure MongoDB is running (if using OAuth)

## Development

Start both servers:
```bash
# Terminal 1 - Backend
cd backend-fastapi && python main.py

# Terminal 2 - Frontend
cd frontend && npm run dev
```

## Production Build

```bash
cd frontend
npm run build
```

Build output in `frontend/dist/`
