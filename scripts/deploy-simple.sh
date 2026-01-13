#!/bin/bash

# Simple deployment script for MultiTenant SaaS Platform

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Set KUBECONFIG and use sudo for k3s
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
KUBECTL_CMD="sudo k3s kubectl"

# Check if k3s is running
if ! $KUBECTL_CMD get nodes &>/dev/null; then
    log_error "k3s cluster is not accessible"
    exit 1
fi

log_info "Deploying to k3s cluster..."

# Apply namespaces
log_info "Creating namespaces..."
$KUBECTL_CMD apply -f k8s/namespaces/

# Apply PostgreSQL
log_info "Deploying PostgreSQL..."
$KUBECTL_CMD apply -f k8s/postgresql/

# Wait for PostgreSQL to be ready
log_info "Waiting for PostgreSQL to be ready..."
$KUBECTL_CMD wait --for=condition=ready pod -l app=postgres -n multitenant --timeout=300s

# Apply services
log_info "Deploying services..."
$KUBECTL_CMD apply -f k8s/services/

# Wait for services to be ready
log_info "Waiting for services to be ready..."
$KUBECTL_CMD wait --for=condition=ready pod -l app=auth-service -n multitenant-auth --timeout=300s
$KUBECTL_CMD wait --for=condition=ready pod -l app=users-service -n multitenant-users --timeout=300s
$KUBECTL_CMD wait --for=condition=ready pod -l app=frontend -n multitenant-frontend --timeout=300s

# Apply ingress
log_info "Setting up ingress..."
$KUBECTL_CMD apply -f k8s/ingress.yaml

# Apply network policies
log_info "Applying network policies..."
$KUBECTL_CMD apply -f k8s/network-policies.yaml

log_success "Deployment completed!"

# Show status
echo ""
echo "=== Deployment Status ==="
$KUBECTL_CMD get pods -n multitenant,multitenant-auth,multitenant-users,multitenant-frontend
echo ""
echo "=== Services ==="
$KUBECTL_CMD get services -n multitenant,multitenant-auth,multitenant-users,multitenant-frontend
echo ""
echo "=== Access URLs ==="
echo "Frontend: http://localhost:31080"
echo "Auth API: http://localhost:31080/api/auth"
echo "Users API: http://localhost:31080/api/users"
