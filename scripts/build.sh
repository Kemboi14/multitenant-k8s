#!/bin/bash

# MultiTenant SaaS Platform Build Script
# This script builds Podman images, provisions infrastructure, and deploys services

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="multitenant"
REGISTRY="localhost:5000"
BUILD_CONTEXT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Functions
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

check_dependencies() {
    log_info "Checking dependencies..."
    
    # Check for Podman
    if ! command -v podman &> /dev/null; then
        log_error "Podman is not installed. Please install Podman first."
        exit 1
    fi
    
    # Check for Terraform
    if ! command -v terraform &> /dev/null; then
        log_error "Terraform is not installed. Please install Terraform first."
        exit 1
    fi
    
    # Check for kubectl
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl is not installed. Please install kubectl first."
        exit 1
    fi
    
    # Check for Node.js (for frontend)
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    log_success "All dependencies found"
}

build_images() {
    log_info "Building Podman images..."
    
    # Build auth service image
    log_info "Building auth service image..."
    cd "$BUILD_CONTEXT/services/auth"
    podman build -t "${PROJECT_NAME}/auth-service:latest" .
    podman tag "${PROJECT_NAME}/auth-service:latest" "${REGISTRY}/${PROJECT_NAME}/auth-service:latest"
    
    # Build users service image
    log_info "Building users service image..."
    cd "$BUILD_CONTEXT/services/users"
    podman build -t "${PROJECT_NAME}/users-service:latest" .
    podman tag "${PROJECT_NAME}/users-service:latest" "${REGISTRY}/${PROJECT_NAME}/users-service:latest"
    
    # Build frontend image
    log_info "Building frontend image..."
    cd "$BUILD_CONTEXT/services/frontend"
    podman build -t "${PROJECT_NAME}/frontend:latest" .
    podman tag "${PROJECT_NAME}/frontend:latest" "${REGISTRY}/${PROJECT_NAME}/frontend:latest"
    
    log_success "All images built successfully"
}

push_images() {
    log_info "Pushing images to local registry..."
    
    # Start local registry if not running
    if ! podman ps --format "table {{.Names}}" | grep -q "local-registry"; then
        log_info "Starting local registry..."
        podman run -d -p 5000:5000 --name local-registry registry:2
        sleep 5
    fi
    
    # Push images
    podman push "${REGISTRY}/${PROJECT_NAME}/auth-service:latest"
    podman push "${REGISTRY}/${PROJECT_NAME}/users-service:latest"
    podman push "${REGISTRY}/${PROJECT_NAME}/frontend:latest"
    
    log_success "All images pushed to registry"
}

provision_infrastructure() {
    log_info "Provisioning infrastructure with Terraform..."
    
    cd "$BUILD_CONTEXT/terraform"
    
    # Initialize Terraform
    terraform init
    
    # Apply Terraform configuration
    terraform apply -auto-approve
    
    # Get outputs
    CLUSTER_NAME=$(terraform output -raw cluster_name)
    HTTP_PORT=$(terraform output -raw ingress_http_port)
    HTTPS_PORT=$(terraform output -raw ingress_https_port)
    
    log_success "Infrastructure provisioned successfully"
    log_info "Cluster: $CLUSTER_NAME"
    log_info "HTTP port: $HTTP_PORT"
    log_info "HTTPS port: $HTTPS_PORT"
}

deploy_kubernetes() {
    log_info "Deploying Kubernetes manifests..."
    
    cd "$BUILD_CONTEXT/k8s"
    
    # Wait for cluster to be ready
    log_info "Waiting for cluster to be ready..."
    kubectl wait --for=condition=ready nodes --all --timeout=300s
    
    # Apply namespaces
    log_info "Applying namespaces..."
    kubectl apply -f namespaces/
    
    # Apply PostgreSQL
    log_info "Deploying PostgreSQL..."
    kubectl apply -f postgresql/
    
    # Wait for PostgreSQL to be ready
    kubectl wait --for=condition=ready pod -l app=postgres -n multitenant --timeout=300s
    
    # Apply services
    log_info "Deploying services..."
    kubectl apply -f services/
    
    # Wait for services to be ready
    kubectl wait --for=condition=ready pod -l app=auth-service -n multitenant-auth --timeout=300s
    kubectl wait --for=condition=ready pod -l app=users-service -n multitenant-users --timeout=300s
    kubectl wait --for=condition=ready pod -l app=frontend -n multitenant-frontend --timeout=300s
    
    # Apply ingress and network policies
    log_info "Applying ingress and network policies..."
    kubectl apply -f ingress.yaml
    kubectl apply -f network-policies.yaml
    
    log_success "All services deployed successfully"
}

setup_database() {
    log_info "Setting up database..."
    
    # Wait for PostgreSQL to be fully ready
    kubectl wait --for=condition=ready pod -l app=postgres -n multitenant --timeout=300s
    
    # Create database tables (this would be done by the users service automatically)
    log_success "Database setup completed"
}

show_status() {
    log_info "Showing deployment status..."
    
    echo ""
    echo "=== Namespaces ==="
    kubectl get namespaces | grep multitenant
    
    echo ""
    echo "=== Pods ==="
    kubectl get pods -n multitenant,multitenant-auth,multitenant-users,multitenant-frontend
    
    echo ""
    echo "=== Services ==="
    kubectl get services -n multitenant,multitenant-auth,multitenant-users,multitenant-frontend
    
    echo ""
    echo "=== Ingress ==="
    kubectl get ingress -n multitenant-frontend
    
    echo ""
    echo "=== Access URLs ==="
    HTTP_PORT=$(terraform -C "$BUILD_CONTEXT/terraform" output -raw ingress_http_port 2>/dev/null || echo "30080")
    HTTPS_PORT=$(terraform -C "$BUILD_CONTEXT/terraform" output -raw ingress_https_port 2>/dev/null || echo "30443")
    
    echo "Frontend: http://localhost:$HTTP_PORT"
    echo "Frontend (HTTPS): https://localhost:$HTTPS_PORT"
    echo "Auth API: http://localhost:$HTTP_PORT/api/auth"
    echo "Users API: http://localhost:$HTTP_PORT/api/users"
}

cleanup() {
    log_warning "Cleaning up..."
    
    # Stop and remove local registry
    if podman ps --format "table {{.Names}}" | grep -q "local-registry"; then
        podman stop local-registry
        podman rm local-registry
    fi
    
    # Remove images
    podman rmi "${PROJECT_NAME}/auth-service:latest" "${PROJECT_NAME}/users-service:latest" "${PROJECT_NAME}/frontend:latest" 2>/dev/null || true
    
    log_success "Cleanup completed"
}

# Main execution
main() {
    case "${1:-build}" in
        "build")
            check_dependencies
            build_images
            ;;
        "push")
            check_dependencies
            push_images
            ;;
        "deploy")
            check_dependencies
            provision_infrastructure
            deploy_kubernetes
            setup_database
            show_status
            ;;
        "full")
            check_dependencies
            build_images
            push_images
            provision_infrastructure
            deploy_kubernetes
            setup_database
            show_status
            ;;
        "status")
            show_status
            ;;
        "cleanup")
            cleanup
            ;;
        "help"|"-h"|"--help")
            echo "MultiTenant SaaS Platform Build Script"
            echo ""
            echo "Usage: $0 [COMMAND]"
            echo ""
            echo "Commands:"
            echo "  build    - Build Podman images"
            echo "  push     - Push images to local registry"
            echo "  deploy   - Deploy to Kubernetes"
            echo "  full     - Build, push, and deploy (default)"
            echo "  status   - Show deployment status"
            echo "  cleanup  - Clean up resources"
            echo "  help     - Show this help message"
            echo ""
            exit 0
            ;;
        *)
            log_error "Unknown command: $1"
            echo "Use '$0 help' for usage information"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
