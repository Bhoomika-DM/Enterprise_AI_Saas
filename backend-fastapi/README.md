# FastAPI Backend

Production-ready authentication backend built with FastAPI and Supabase.

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update with your credentials:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
JWT_SECRET=your-random-secret-32-chars
```

### 3. Run the Server

```bash
python main.py
```

Server will start on: http://localhost:5000

## API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:5000/docs
- **ReDoc**: http://localhost:5000/redoc

## Full Documentation

For complete documentation, see:
- **[../documentation/BACKEND_FASTAPI_README.md](../documentation/BACKEND_FASTAPI_README.md)** - Complete backend documentation
- **[../documentation/FASTAPI_SUPABASE_SETUP.md](../documentation/FASTAPI_SUPABASE_SETUP.md)** - Setup guide

## Features

- ✅ FastAPI framework
- ✅ Supabase database
- ✅ JWT authentication
- ✅ Google & Twitter OAuth
- ✅ Automatic API docs
- ✅ Rate limiting
- ✅ CORS configuration

## Project Structure

```
backend-fastapi/
├── main.py              # Application entry point
├── config.py            # Configuration
├── database.py          # Supabase client
├── auth.py              # Auth utilities
├── models.py            # Pydantic models
├── routers/
│   └── auth.py         # Auth routes
├── services/
│   └── user_service.py # Business logic
└── requirements.txt     # Dependencies
```

## API Endpoints

- `POST /api/auth/signup` - Sign up
- `POST /api/auth/signin` - Sign in
- `GET /api/auth/verify` - Verify token
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/twitter` - Twitter OAuth
- `GET /health` - Health check
- `GET /docs` - API documentation

## Need Help?

See the [documentation folder](../documentation/) for detailed guides.
