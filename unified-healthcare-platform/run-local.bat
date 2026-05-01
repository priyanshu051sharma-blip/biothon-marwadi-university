@echo off
echo ========================================
echo   HealthAI Pro - Local Development
echo ========================================
echo.

echo Step 1: Starting databases with Docker...
start /B docker-compose up

timeout /t 10 /nobreak >nul

echo.
echo Step 2: Installing frontend dependencies...
cd frontend
if not exist node_modules (
    call npm install
)

echo.
echo Step 3: Starting frontend...
start cmd /k "cd /d %CD% && npm run dev"

cd ..

echo.
echo ========================================
echo   Platform Starting!
echo ========================================
echo.
echo Frontend will be available at:
echo   http://localhost:3000
echo.
echo Note: Backend needs to be started separately
echo See instructions in START_HERE.md
echo.
pause
