from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from starlette.middleware.sessions import SessionMiddleware
from config import get_settings
from routers import auth, user
import uvicorn

settings = get_settings()

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)

# Create FastAPI app
app = FastAPI(
    title="Enterprise AI SaaS API",
    description="Production-ready authentication API with FastAPI and Supabase",
    version="1.0.0"
)

# Add rate limiter to app state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Add session middleware for OAuth
app.add_middleware(
    SessionMiddleware,
    secret_key=settings.jwt_secret
)

# ✅ CORS middleware — only deployed frontend URL
frontend_url = "https://unique-freedom-production-db37.up.railway.app"

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(user.router)

# Health check endpoint
@app.get("/health")
async def health_check():
    return JSONResponse(
        content={
            "status": "ok",
            "environment": settings.environment,
            "version": "1.0.0"
        }
    )

# Root endpoint
@app.get("/")
async def root():
    return JSONResponse(
        content={
            "message": "Enterprise AI SaaS API",
            "version": "1.0.0",
            "docs": "/docs",
            "health": "/health"
        }
    )

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.port,
        reload=settings.environment == "development"
    )