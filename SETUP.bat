@echo off
cd /d "%~dp0"
echo Installing ChemistryPro dependencies...
call npm install
if errorlevel 1 (echo Installation failed. & pause & exit /b 1)
if not exist .env.local copy .env.example .env.local
echo.
echo Setup complete. Edit .env.local and change ADMIN_PASSWORD and SESSION_SECRET before using real student data.
pause
