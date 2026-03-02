from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from auth import get_current_user
from database import get_supabase

router = APIRouter(prefix="/api/user", tags=["User"])


class UpdateRoleRequest(BaseModel):
    role: str


@router.patch("/update-role")
async def update_user_role(
    role_data: UpdateRoleRequest,
    current_user: dict = Depends(get_current_user)
):
    """Update user role"""
    try:
        supabase = get_supabase()
        
        # Update user role in database
        response = supabase.table('users').update({
            'role': role_data.role
        }).eq('id', current_user['id']).execute()
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to update role"
            )
        
        return {
            "message": "Role updated successfully",
            "role": role_data.role
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update role: {str(e)}"
        )
