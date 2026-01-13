# MultiTenant SaaS Platform

[![GitHub stars](https://img.shields.io/github/stars/Kemboi14/multitenant-k8s.svg?style=social&label=Star)](https://github.com/Kemboi14/multitenant-k8s)
[![GitHub forks](https://img.shields.io/github/forks/Kemboi14/multitenant-k8s.svg?style=social&label=Fork)](https://github.com/Kemboi14/multitenant-k8s/fork)
[![GitHub issues](https://img.shields.io/github/issues/Kemboi14/multitenant-k8s.svg)](https://github.com/Kemboi14/multitenant-k8s/issues)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A **cloud-native multi-tenant SaaS platform** demonstrating **Podman containers, Kubernetes orchestration, and Terraform-based infrastructure** with a secure, scalable, real-world architecture.

## 🎯 Project Overview

MultiTenant is a complete, production-ready SaaS platform that showcases:
- **Multi-tenant architecture** with data segregation
- **JWT-based authentication** with tenant awareness
- **Microservices design** with FastAPI
- **Containerization** with Podman (rootless)
- **Kubernetes orchestration** with k3s
- **Infrastructure as Code** with Terraform
- **Security best practices** (NetworkPolicies, Secrets, RBAC)

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React SPA     │    │  Auth Service   │    │  Users Service  │
│   (Frontend)    │    │   (FastAPI)     │    │   (FastAPI)     │
│   Port: 80      │    │   Port: 8001    │    │   Port: 8002    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │   Port: 5432    │
                    └─────────────────┘
```

### Multi-Tenant Data Flow
1. **Authentication**: JWT tokens contain tenant ID for access control
2. **Data Isolation**: Each service enforces tenant-specific queries
3. **Network Security**: Kubernetes NetworkPolicies isolate services
4. **Storage**: Persistent volumes per tenant with proper segregation

## 🚀 Quick Start

### 🌟 Try it Now with GitHub Codespaces

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Kemboi14/multitenant-k8s)

Click the button above to open this project in GitHub Codespaces with all dependencies pre-installed.

### Prerequisites

Install the following tools:

```bash
# Podman (rootless containers)
curl -L https://github.com/containers/podman/releases/latest/download/podman-static-linux-amd64.tar.gz | tar xz
sudo mv podman-static-linux-amd64/podman-static-linux-amd64 /usr/local/bin/podman

# Terraform
curl -LO "https://developer.hashicorp.com/terraform/downloads/terraform-$(uname -s)-$(uname -m)"
chmod +x terraform
sudo mv terraform /usr/local/bin/

# kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/

# Node.js (for frontend)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### One-Command Deployment

```bash
# Clone and deploy
git clone https://github.com/Kemboi14/multitenant-k8s.git
cd multitenant-k8s
./scripts/build.sh full
```

This will:
1. Build all Podman images
2. Provision k3s cluster with Terraform
3. Deploy all services to Kubernetes
4. Set up networking and ingress
5. Display access URLs

### Manual Deployment

```bash
# 1. Build images
./scripts/build.sh build

# 2. Push to local registry
./scripts/build.sh push

# 3. Provision infrastructure
./scripts/build.sh deploy

# 4. Check status
./scripts/build.sh status
```

## 📁 Project Structure

```
multitenant/
├── services/
│   ├── auth/                 # Authentication microservice
│   │   ├── main.py
│   │   └── Dockerfile
│   ├── users/                # User management microservice
│   │   ├── main.py
│   │   ├── database.py
│   │   └── Dockerfile
│   └── frontend/             # React SPA
│       ├── src/
│       ├── public/
│       ├── package.json
│       └── Dockerfile
├── k8s/                      # Kubernetes manifests
│   ├── namespaces/
│   ├── postgresql/
│   ├── services/
│   ├── ingress.yaml
│   └── network-policies.yaml
├── terraform/                # Infrastructure as Code
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── versions.tf
├── scripts/
│   └── build.sh            # Automation script
├── requirements.txt         # Python dependencies
└── README.md
```

## 🔧 Services

### Authentication Service (`/api/auth`)
- **Port**: 8001
- **Endpoints**:
  - `POST /login` - User login with tenant ID
  - `POST /register` - User registration
  - `POST /tenants` - Create new tenant
  - `GET /verify` - Verify JWT token
  - `GET /health` - Health check

### Users Service (`/api/users`)
- **Port**: 8002
- **Endpoints**:
  - `GET /users` - List users (tenant-scoped)
  - `GET /users/{id}` - Get user details
  - `POST /users` - Create user
  - `PUT /users/{id}` - Update user
  - `DELETE /users/{id}` - Delete user
  - `GET /me` - Current user profile
  - `GET /health` - Health check

### Frontend
- **Port**: 80
- **Features**:
  - Tenant-aware login
  - User management dashboard
  - Role-based access control
  - Responsive design

## �� Security Features

### Authentication & Authorization
- **JWT tokens** with tenant ID and role information
- **Password hashing** with bcrypt
- **Token validation** in all services
- **Role-based access** (admin, user)

### Container Security
- **Rootless Podman** containers
- **Non-root users** in containers
- **Read-only filesystems** where possible
- **Minimal base images**

### Kubernetes Security
- **NetworkPolicies** for service isolation
- **Kubernetes Secrets** for sensitive data
- **Pod Security Contexts**
- **Resource limits** and requests
- **Health checks** and liveness probes

### Data Security
- **Tenant data segregation** in database
- **Multi-tenant queries** enforced at service level
- **Secure database connections**
- **Environment-based configuration**

## 🌐 Access URLs

After deployment, access the platform at:

- **Frontend**: `http://localhost:30080`
- **Frontend (HTTPS)**: `https://localhost:30443`
- **Auth API**: `http://localhost:30080/api/auth`
- **Users API**: `http://localhost:30080/api/users`

## 🧪 Testing the Platform

### 1. Create a Tenant
```bash
curl -X POST http://localhost:30080/api/auth/tenants \
  -H "Content-Type: application/json" \
  -d '{"name": "Acme Corp", "domain": "acme.com"}'
```

### 2. Register a User
```bash
curl -X POST http://localhost:30080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@acme.com",
    "password": "password123",
    "tenant_id": "<tenant-id-from-step-1>",
    "role": "admin"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:30080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@acme.com",
    "password": "password123",
    "tenant_id": "<tenant-id>"
  }'
```

### 4. Access Users API
```bash
curl -X GET http://localhost:30080/api/users/users \
  -H "Authorization: Bearer <jwt-token>"
```

## 📊 Monitoring & Observability

### Health Checks
All services expose `/health` endpoints:
```bash
# Auth service
curl http://localhost:30080/api/auth/health

# Users service
curl http://localhost:30080/api/users/health
```

### Logs
View service logs with kubectl:
```bash
# Auth service logs
kubectl logs -n multitenant-auth -l app=auth-service

# Users service logs
kubectl logs -n multitenant-users -l app=users-service

# Frontend logs
kubectl logs -n multitenant-frontend -l app=frontend

# PostgreSQL logs
kubectl logs -n multitenant -l app=postgres
```

### Metrics (Optional)
Add Prometheus/Grafana for monitoring:
```bash
# Install Prometheus
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack
```

## 🔧 Development

### Local Development

#### Backend Services
```bash
# Install dependencies
pip install -r requirements.txt

# Run auth service
cd services/auth
python main.py

# Run users service
cd services/users
python main.py
```

#### Frontend
```bash
cd services/frontend
npm install
npm start
```

### Environment Variables

#### Auth Service
- `JWT_SECRET_KEY`: Secret for JWT signing
- `DATABASE_URL`: PostgreSQL connection string

#### Users Service
- `JWT_SECRET_KEY`: Must match auth service
- `DATABASE_URL`: PostgreSQL connection string

#### Frontend
- `REACT_APP_API_URL`: Backend API URL

## 🚀 Scaling & Production

### Horizontal Scaling
```bash
# Scale auth service
kubectl scale deployment auth-service --replicas=3 -n multitenant-auth

# Scale users service
kubectl scale deployment users-service --replicas=3 -n multitenant-users

# Scale frontend
kubectl scale deployment frontend --replicas=3 -n multitenant-frontend
```

### Cloud Deployment
Modify Terraform configuration for cloud providers:

#### AWS EKS
```hcl
provider "kubernetes" {
  host                   = module.eks.cluster_endpoint
  cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
  
  exec {
    api_version = "client.authentication.k8s.io/v1beta1"
    command     = "aws"
    args        = ["eks", "get-token", "--cluster-name", module.eks.cluster_name]
  }
}
```

#### Google GKE
```hcl
provider "kubernetes" {
  host  = "https://container.googleapis.com/v1/projects/${var.project_id}/locations/${var.region}/clusters/${var.cluster_name}"
  token = data.google_client_config.default.access_token
  cluster_ca_certificate = base64decode(google_container_cluster.primary.master_auth[0].cluster_ca_certificate)
}
```

## 🛠️ Troubleshooting

### Common Issues

#### Podman Build Fails
```bash
# Check Podman version
podman version

# Enable rootless mode
echo 'export PODMAN_ROOTLESS=1' >> ~/.bashrc
```

#### Terraform Fails
```bash
# Check Terraform version
terraform version

# Re-initialize
terraform init -reconfigure
```

#### Kubernetes Issues
```bash
# Check cluster status
kubectl get nodes
kubectl get pods --all-namespaces

# Check events
kubectl get events --sort-by=.metadata.creationTimestamp
```

#### Service Connectivity
```bash
# Test service connectivity
kubectl port-forward svc/auth-service 8001:8001 -n multitenant-auth
kubectl port-forward svc/users-service 8002:8002 -n multitenant-users
```

### Cleanup
```bash
# Remove all resources
./scripts/build.sh cleanup

# Destroy Terraform infrastructure
cd terraform
terraform destroy -auto-approve

# Remove Kubernetes cluster
k3s-uninstall.sh
```

## 📚 Learning Resources

This project demonstrates:
- **Multi-tenant SaaS architecture**
- **Microservices with FastAPI**
- **Containerization with Podman**
- **Kubernetes orchestration**
- **Infrastructure as Code with Terraform**
- **Security best practices**
- **CI/CD automation**

Perfect for:
- **Portfolio projects**
- **Interview preparation**
- **Learning cloud-native development**
- **SaaS platform development**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- FastAPI for the excellent web framework
- Podman for rootless containerization
- Kubernetes for orchestration
- Terraform for infrastructure as code
- React for the frontend framework

---

**Built with ❤️ for the cloud-native community**
