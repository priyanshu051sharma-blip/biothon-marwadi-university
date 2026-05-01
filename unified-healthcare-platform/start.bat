@echo off
echo ========================================
echo   HealthAI Pro - Starting Platform
echo ========================================
echo.

echo Checking Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed or not running
    echo Please install Docker Desktop from https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo Docker found!
echo.

echo Starting all services with Docker Compose...
echo This may take a few minutes on first run...
echo.

docker-compose up -d

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   SUCCESS! Platform is starting...
    echo ========================================
    echo.
    echo Services are initializing. Please wait 30 seconds...
    timeout /t 30 /nobreak >nul
    echo.
    echo Platform is ready!
    echo.
    echo Access the application at:
    echo   Frontend: http://localhost:3000
    echo   Backend API: http://localhost:8000
    echo   API Docs: http://localhost:8000/docs
    echo.
    echo Default Login:
    echo   Email: admin@healthai.com
    echo   Password: admin123
    echo.
    echo To view logs: docker-compose logs -f
    echo To stop: docker-compose down
    echo.
    echo Opening browser...
    start http://localhost:3000
) else (
    echo.
    echo ERROR: Failed to start services
    echo Please check Docker Desktop is running
    echo.
)

pause
