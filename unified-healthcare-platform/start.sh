#!/bin/bash

echo "========================================"
echo "  HealthAI Pro - Starting Platform"
echo "========================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed"
    echo "Please install Docker from https://www.docker.com/products/docker-desktop"
    exit 1
fi

echo "Docker found!"
echo ""

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "ERROR: Docker is not running"
    echo "Please start Docker Desktop"
    exit 1
fi

echo "Starting all services with Docker Compose..."
echo "This may take a few minutes on first run..."
echo ""

docker-compose up -d

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "  SUCCESS! Platform is starting..."
    echo "========================================"
    echo ""
    echo "Services are initializing. Please wait 30 seconds..."
    sleep 30
    echo ""
    echo "Platform is ready!"
    echo ""
    echo "Access the application at:"
    echo "  Frontend: http://localhost:3000"
    echo "  Backend API: http://localhost:8000"
    echo "  API Docs: http://localhost:8000/docs"
    echo ""
    echo "Default Login:"
    echo "  Email: admin@healthai.com"
    echo "  Password: admin123"
    echo ""
    echo "To view logs: docker-compose logs -f"
    echo "To stop: docker-compose down"
    echo ""
    
    # Try to open browser (works on macOS and Linux with xdg-open)
    if command -v open &> /dev/null; then
        open http://localhost:3000
    elif command -v xdg-open &> /dev/null; then
        xdg-open http://localhost:3000
    fi
else
    echo ""
    echo "ERROR: Failed to start services"
    echo "Please check Docker Desktop is running"
    echo ""
fi
