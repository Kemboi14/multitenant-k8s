#!/usr/bin/env python3
"""
Get actual tenant IDs and user credentials from the running services
"""

import requests
import json

AUTH_BASE_URL = "http://localhost:8001"

def get_tenants():
    """Get all tenants"""
    try:
        response = requests.get(f"{AUTH_BASE_URL}/tenants")
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error getting tenants: {response.text}")
            return []
    except Exception as e:
        print(f"Error connecting to auth service: {e}")
        return []

def main():
    print("🔑 MultiTenant SaaS Platform - Actual Login Credentials")
    print("=" * 60)
    
    # Get tenants
    tenants = get_tenants()
    
    if not tenants:
        print("❌ No tenants found. Run setup script first:")
        print("   python scripts/setup-test-data.py")
        return
    
    print(f"📋 Found {len(tenants)} tenants:")
    print()
    
    for tenant in tenants:
        tenant_id = tenant['tenant_id']
        tenant_name = tenant['name']
        
        print(f"🏢 {tenant_name}")
        print(f"   Tenant ID: {tenant_id}")
        print(f"   Admin Email: admin@{tenant_name.lower().replace(' ', '')}.com")
        print(f"   Admin Password: admin123")
        print(f"   User Email: user@{tenant_name.lower().replace(' ', '')}.com")
        print(f"   User Password: user123")
        print()
    
    print("=" * 60)
    print("🌐 Access URLs:")
    print(f"   Frontend: http://localhost:3000")
    print(f"   Auth API: {AUTH_BASE_URL}")
    print(f"   Users API: http://localhost:8002")
    print()
    print("💡 Use the Tenant ID above when logging in!")

if __name__ == "__main__":
    main()
