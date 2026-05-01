@echo off
echo.
echo ========================================
echo   Opening HealthAI Pro Platform
echo ========================================
echo.
echo Opening browser at http://localhost:5173/
echo.
echo IMPORTANT: If you see React errors:
echo 1. Press Ctrl + Shift + R to hard refresh
echo 2. Or press Ctrl + Shift + Delete to clear cache
echo.
echo Starting browser...
timeout /t 2 /nobreak >nul
start http://localhost:5173/
echo.
echo Browser opened! Clear cache if needed.
echo.
pause
