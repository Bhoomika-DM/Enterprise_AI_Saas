from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
from starlette.requests import Request
from config import get_settings
from models import UserSignUp, UserSignIn, TokenResponse, MessageResponse, UserResponse
from auth import get_current_user
from datetime import datetime, timedelta
from jose import jwt

settings = get_settings()
router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# Initialize OAuth
oauth = OAuth()

# Google OAuth
oauth.register(
    name='google',
    client_id=settings.google_client_id,
    client_secret=settings.google_client_secret,
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserSignUp):
    """Sign up with email and password - NOT IMPLEMENTED WITHOUT DATABASE"""
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Email signup requires database. Please use Google OAuth."
    )


@router.post("/signin", response_model=TokenResponse)
async def signin(credentials: UserSignIn):
    """Sign in with email and password - NOT IMPLEMENTED WITHOUT DATABASE"""
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Email signin requires database. Please use Google OAuth."
    )


@router.post("/signout", response_model=MessageResponse)
async def signout(current_user: dict = Depends(get_current_user)):
    """Sign out current user"""
    return MessageResponse(message="Successfully signed out")


@router.get("/verify", response_model=UserResponse)
async def verify_token(current_user: dict = Depends(get_current_user)):
    """Verify JWT token and return user data"""
    print(f"✅ Token verified for user: {current_user.get('email')}")
    return UserResponse(**current_user)


# Google OAuth Routes
@router.get("/google")
async def google_login(request: Request):
    """Initiate Google OAuth flow"""
    print("========================================")
    print("🚀 Google OAuth Flow Initiated")
    print(f"📍 Request URL: {request.url}")
    print(f"📍 Redirect URI configured: {settings.google_redirect_uri}")
    print(f"📍 Frontend URL: {settings.frontend_url}")
    print("========================================")
    redirect_uri = settings.google_redirect_uri
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/google/callback")
async def google_callback(request: Request):
    """Handle Google OAuth callback"""
    try:
        print("========================================")
        print("🔍 Google OAuth Callback Started")
        print(f"📍 Request URL: {request.url}")
        print(f"📍 Query params: {dict(request.query_params)}")
        print("========================================")
        
        # Check if we have the required parameters
        if 'code' not in request.query_params:
            print("❌ No 'code' parameter in callback URL")
            error_url = f"{settings.frontend_url}/signin?error=missing_code"
            return RedirectResponse(url=error_url)
        
        token = await oauth.google.authorize_access_token(request)
        print("✅ Token received from Google")
        
        user_info = token.get('userinfo')
        if user_info:
            print(f"✅ User info received:")
            print(f"   Email: {user_info.get('email')}")
            print(f"   Name: {user_info.get('given_name')} {user_info.get('family_name')}")
        
        if not user_info:
            print("❌ No user info from Google")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to get user info from Google"
            )
        
        # Create JWT token directly without database
        user_data = {
            'email': user_info['email'],
            'first_name': user_info.get('given_name', ''),
            'last_name': user_info.get('family_name', ''),
            'profile_image': user_info.get('picture'),
            'provider': 'google',
            'provider_id': user_info['sub']
        }
        
        # Create JWT token
        token_data = {
            **user_data,
            'exp': datetime.utcnow() + timedelta(minutes=settings.jwt_expiration_minutes)
        }
        access_token = jwt.encode(token_data, settings.jwt_secret, algorithm=settings.jwt_algorithm)
        
        print(f"✅ JWT token created for {user_info['email']}")
        print(f"✅ Token preview: {access_token[:30]}...")
        
        # Redirect to frontend with token
        redirect_url = f"{settings.frontend_url}/auth/callback?token={access_token}"
        print(f"✅ Redirecting to: {redirect_url}")
        print("========================================")
        
        return RedirectResponse(url=redirect_url, status_code=302)
        
    except Exception as e:
        print("========================================")
        print(f"❌ ERROR in Google OAuth callback")
        print(f"❌ Error type: {type(e).__name__}")
        print(f"❌ Error message: {str(e)}")
        print("========================================")
        import traceback
        traceback.print_exc()
        print("========================================")
        
        error_url = f"{settings.frontend_url}/signin?error=google_auth_failed"
        print(f"Redirecting to error URL: {error_url}")
        return RedirectResponse(url=error_url, status_code=302)
