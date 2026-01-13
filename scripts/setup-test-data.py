#!/usr/bin/env python3
"""
Setup script to create test tenants and users for MultiTenant SaaS Platform
"""

import requests
import json
import time

# Configuration
AUTH_BASE_URL = "http://localhost:8001"
USERS_BASE_URL = "http://localhost:8002"

def create_tenant(name, domain=None):
    """Create a new tenant"""
    try:
        response = requests.post(f"{AUTH_BASE_URL}/tenants", json={
            "name": name,
            "domain": domain
        })
        if response.status_code == 200:
            tenant = response.json()
            print(f"✅ Created tenant: {name} (ID: {tenant['tenant_id']})")
            return tenant
        else:
            print(f"❌ Failed to create tenant {name}: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error creating tenant {name}: {e}")
        return None

def create_user(email, password, tenant_id, role="user", first_name=None, last_name=None):
    """Create a new user"""
    try:
        response = requests.post(f"{AUTH_BASE_URL}/register", json={
            "email": email,
            "password": password,
            "tenant_id": tenant_id,
            "role": role
        })
        if response.status_code == 200:
            user_data = response.json()
            print(f"✅ Created user: {email} (Role: {role})")
            return user_data
        else:
            print(f"❌ Failed to create user {email}: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error creating user {email}: {e}")
        return None

def login_user(email, password, tenant_id):
    """Login user and get token"""
    try:
        response = requests.post(f"{AUTH_BASE_URL}/login", json={
            "email": email,
            "password": password,
            "tenant_id": tenant_id
        })
        if response.status_code == 200:
            login_data = response.json()
            print(f"✅ Logged in: {email}")
            return login_data
        else:
            print(f"❌ Failed to login {email}: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error logging in {email}: {e}")
        return None

def main():
    print("🚀 Setting up test data for MultiTenant SaaS Platform")
    print("=" * 60)
    
    # Wait for services to be ready
    print("⏳ Waiting for services to be ready...")
    time.sleep(3)
    
    # Check if auth service is running
    try:
        response = requests.get(f"{AUTH_BASE_URL}/health")
        if response.status_code != 200:
            print("❌ Auth service is not running!")
            return
    except:
        print("❌ Cannot connect to auth service!")
        return
    
    print("✅ Auth service is ready")
    
    # Create test tenants
    print("\n📋 Creating test tenants...")
    tenants = []
    
    # Tenant 1: Acme Corp
    acme_tenant = create_tenant("Acme Corp", "acme.com")
    if acme_tenant:
        tenants.append(acme_tenant)
    
    # Tenant 2: Tech Startup
    tech_tenant = create_tenant("Tech Startup", "techstartup.io")
    if tech_tenant:
        tenants.append(tech_tenant)
    
    # Tenant 3: Digital Agency
    agency_tenant = create_tenant("Digital Agency", "agency.co")
    if agency_tenant:
        tenants.append(agency_tenant)
    
    if not tenants:
        print("❌ No tenants created. Exiting.")
        return
    
    print(f"\n👥 Creating test users for {len(tenants)} tenants...")
    
    # Test users for each tenant
    test_users = []
    
    for tenant in tenants:
        tenant_id = tenant['tenant_id']
        tenant_name = tenant['name']
        
        print(f"\n📝 Creating users for {tenant_name}:")
        
        # Admin user
        admin_email = f"admin@{tenant_name.lower().replace(' ', '')}.com"
        admin_user = create_user(
            admin_email, 
            "admin123", 
            tenant_id, 
            "admin",
            "Admin", 
            "User"
        )
        if admin_user:
            test_users.append({
                "email": admin_email,
                "password": "admin123",
                "tenant_id": tenant_id,
                "role": "admin",
                "tenant_name": tenant_name
            })
        
        # Regular user
        user_email = f"user@{tenant_name.lower().replace(' ', '')}.com"
        regular_user = create_user(
            user_email,
            "user123",
            tenant_id,
            "user",
            "Regular",
            "User"
        )
        if regular_user:
            test_users.append({
                "email": user_email,
                "password": "user123",
                "tenant_id": tenant_id,
                "role": "user",
                "tenant_name": tenant_name
            })
    
    print("\n" + "=" * 60)
    print("🎉 Test data setup completed!")
    print("\n📋 Login Credentials:")
    print("-" * 40)
    
    for user in test_users:
        print(f"\n🏢 {user['tenant_name']}")
        print(f"   Email: {user['email']}")
        print(f"   Password: {user['password']}")
        print(f"   Role: {user['role']}")
        print(f"   Tenant ID: {user['tenant_id']}")
    
    print("\n" + "=" * 60)
    print("🌐 Access URLs:")
    print(f"   Auth API: {AUTH_BASE_URL}")
    print(f"   Users API: {USERS_BASE_URL}")
    print(f"   Frontend: http://localhost:3000 (if running)")
    print("\n💡 Use these credentials to test the multi-tenant functionality!")

if __name__ == "__main__":
    main()
