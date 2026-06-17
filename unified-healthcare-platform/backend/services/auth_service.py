"""
Mock Authentication Service for HealthAI Pro
Implements simple authentication logic for local/demo runs
"""

class AuthService:
    def __init__(self):
        pass

    async def authenticate(self, email: str, password: str) -> dict:
        """Authenticate user against mock credentials"""
        # Return a mock user profile
        role = "doctor"
        if "patient" in email.lower():
            role = "patient"
        elif "admin" in email.lower():
            role = "admin"
            
        return {
            "id": "U001",
            "name": f"Dr. {email.split('@')[0].capitalize()}",
            "email": email,
            "role": role
        }

    def generate_token(self, user: dict) -> str:
        """Generate a mock JWT token"""
        return f"mock_token_{user.get('id')}_{user.get('role')}"
