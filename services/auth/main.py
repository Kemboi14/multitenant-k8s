from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os
from typing import Optional, Dict, Any
import uuid

app = FastAPI(title="Auth Service", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:31080"],  # React dev server and Kubernetes
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# In-memory storage for demo (replace with database in production)
users_db: Dict[str, Dict[str, Any]] = {}
tenants_db: Dict[str, Dict[str, Any]] = {}

class UserCreate(BaseModel):
    email: str
    password: str
    tenant_id: str
    role: str = "user"

class UserLogin(BaseModel):
    email: str
    password: str
    tenant_id: str

class Token(BaseModel):
    access_token: str
    token_type: str
    tenant_id: str
    user_id: str
    role: str

class TenantCreate(BaseModel):
    name: str
    domain: Optional[str] = None

class TenantResponse(BaseModel):
    tenant_id: str
    name: str
    domain: Optional[str] = None
    created_at: datetime

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        tenant_id: str = payload.get("tenant_id")
        user_id: str = payload.get("user_id")
        role: str = payload.get("role")
        if email is None or tenant_id is None or user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return {
            "email": email,
            "tenant_id": tenant_id,
            "user_id": user_id,
            "role": role
        }
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

@app.post("/register", response_model=Token)
async def register(user: UserCreate):
    # Check if user already exists
    user_key = f"{user.tenant_id}:{user.email}"
    if user_key in users_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already registered"
        )
    
    # Verify tenant exists
    if user.tenant_id not in tenants_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tenant does not exist"
        )
    
    # Create user
    hashed_password = get_password_hash(user.password)
    user_id = str(uuid.uuid4())
    
    users_db[user_key] = {
        "user_id": user_id,
        "email": user.email,
        "password": hashed_password,
        "tenant_id": user.tenant_id,
        "role": user.role,
        "created_at": datetime.utcnow()
    }
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={
            "sub": user.email,
            "tenant_id": user.tenant_id,
            "user_id": user_id,
            "role": user.role
        },
        expires_delta=access_token_expires
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        tenant_id=user.tenant_id,
        user_id=user_id,
        role=user.role
    )

@app.post("/login", response_model=Token)
async def login(user: UserLogin):
    user_key = f"{user.tenant_id}:{user.email}"
    
    if user_key not in users_db:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    stored_user = users_db[user_key]
    if not verify_password(user.password, stored_user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={
            "sub": stored_user["email"],
            "tenant_id": stored_user["tenant_id"],
            "user_id": stored_user["user_id"],
            "role": stored_user["role"]
        },
        expires_delta=access_token_expires
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        tenant_id=stored_user["tenant_id"],
        user_id=stored_user["user_id"],
        role=stored_user["role"]
    )

@app.post("/tenants", response_model=TenantResponse)
async def create_tenant(tenant: TenantCreate):
    tenant_id = str(uuid.uuid4())
    
    tenants_db[tenant_id] = {
        "tenant_id": tenant_id,
        "name": tenant.name,
        "domain": tenant.domain,
        "created_at": datetime.utcnow()
    }
    
    return TenantResponse(
        tenant_id=tenant_id,
        name=tenant.name,
        domain=tenant.domain,
        created_at=tenants_db[tenant_id]["created_at"]
    )

@app.get("/verify")
async def verify_token_endpoint(current_user: dict = Depends(verify_token)):
    return {
        "valid": True,
        "user": current_user
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "auth"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
