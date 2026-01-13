#!/usr/bin/env python3
"""
Quick script to create tenant and user for testing
"""

import requests
import json

def create_tenant_and_user():
    # Create tenant
    tenant_data = {
        "name": "Demo Company",
        "domain": "demo.com"
    }
    
    try:
        response = requests.post("http://localhost:8001/tenants", json=tenant_data)
        if response.status_code == 200:
            tenant = response.json()
            tenant_id = tenant['tenant_id']
            
            print("✅ Tenant Created Successfully!")
            print(f"Tenant ID: {tenant_id}")
            print(f"Name: {tenant['name']}")
            print(f"Domain: {tenant['domain']}")
            print()
            
            # Create user
            user_data = {
                "email": "admin@demo.com",
                "password": "admin123",
                "tenant_id": tenant_id,
                "role": "admin"
            }
            
            response = requests.post("http://localhost:8001/register", json=user_data)
            if response.status_code == 200:
                print("✅ User Created Successfully!")
                print()
                print("🔑 LOGIN CREDENTIALS:")
                print("==================")
                print(f"Tenant ID: {tenant_id}")
                print(f"Email: admin@demo.com")
                print(f"Password: admin123")
                print("==================")
                print()
                print("🌐 Access: http://localhost:3000")
                return tenant_id
            else:
                print(f"❌ Error creating user: {response.text}")
        else:
            print(f"❌ Error creating tenant: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")
        print("Make sure auth service is running on http://localhost:8001")
    
    return None

if __name__ == "__main__":
    create_tenant_and_user()
