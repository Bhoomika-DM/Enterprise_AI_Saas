from typing import Optional, Dict
from datetime import datetime
from database import get_supabase, get_supabase_admin
from auth import hash_password, verify_password, create_access_token
from models import UserSignUp, UserSignIn, UserResponse, TokenResponse
from fastapi import HTTPException, status


class UserService:
    
    @staticmethod
    async def create_user(user_data: UserSignUp) -> TokenResponse:
        """Create a new user with email/password"""
        supabase = get_supabase()
        
        # Check if user already exists
        existing = supabase.table("users").select("*").eq("email", user_data.email).execute()
        if existing.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Hash password
        hashed_password = hash_password(user_data.password)
        
        # Create user in Supabase
        user_record = {
            "email": user_data.email,
            "password_hash": hashed_password,
            "first_name": user_data.first_name,
            "last_name": user_data.last_name,
            "role": user_data.role,
            "auth_provider": "local",
            "email_verified": False,
            "created_at": datetime.utcnow().isoformat()
        }
        
        response = supabase.table("users").insert(user_record).execute()
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create user"
            )
        
        user = response.data[0]
        
        # Create access token
        access_token = create_access_token(data={"sub": user["id"]})
        
        # Return token and user data
        user_response = UserResponse(**user)
        return TokenResponse(access_token=access_token, user=user_response)
    
    @staticmethod
    async def authenticate_user(credentials: UserSignIn) -> TokenResponse:
        """Authenticate user with email/password"""
        supabase = get_supabase()
        
        # Find user by email
        response = supabase.table("users").select("*").eq("email", credentials.email).execute()
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        user = response.data[0]
        
        # Verify password
        if not user.get("password_hash"):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Please sign in with your OAuth provider"
            )
        
        if not verify_password(credentials.password, user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Create access token
        access_token = create_access_token(data={"sub": user["id"]})
        
        # Return token and user data
        user_response = UserResponse(**user)
        return TokenResponse(access_token=access_token, user=user_response)
    
    @staticmethod
    async def get_or_create_oauth_user(
        email: str,
        provider: str,
        provider_id: str,
        first_name: str,
        last_name: str,
        profile_image: Optional[str] = None
    ) -> TokenResponse:
        """Get or create user from OAuth provider"""
        supabase = get_supabase()
        
        # Check if user exists
        response = supabase.table("users").select("*").eq("email", email).execute()
        
        if response.data:
            user = response.data[0]
            
            # Update provider ID if not set
            if provider == "google" and not user.get("google_id"):
                supabase.table("users").update({"google_id": provider_id}).eq("id", user["id"]).execute()
            elif provider == "twitter" and not user.get("twitter_id"):
                supabase.table("users").update({"twitter_id": provider_id}).eq("id", user["id"]).execute()
        else:
            # Create new user
            user_record = {
                "email": email,
                "first_name": first_name,
                "last_name": last_name,
                "auth_provider": provider,
                "email_verified": True,
                "profile_image": profile_image,
                "created_at": datetime.utcnow().isoformat()
            }
            
            if provider == "google":
                user_record["google_id"] = provider_id
            elif provider == "twitter":
                user_record["twitter_id"] = provider_id
            
            response = supabase.table("users").insert(user_record).execute()
            
            if not response.data:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to create user"
                )
            
            user = response.data[0]
        
        # Create access token
        access_token = create_access_token(data={"sub": user["id"]})
        
        # Return token and user data
        user_response = UserResponse(**user)
        return TokenResponse(access_token=access_token, user=user_response)
    
    @staticmethod
    async def get_user_by_id(user_id: str) -> Optional[Dict]:
        """Get user by ID"""
        supabase = get_supabase()
        response = supabase.table("users").select("*").eq("id", user_id).execute()
        
        if response.data:
            return response.data[0]
        return None
