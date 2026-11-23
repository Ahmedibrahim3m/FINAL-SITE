@echo off
setlocal
cd /d "%~dp0"
title ChemistryPro - Local Server

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js is not installed.
  echo Install Node.js 22.5 or newer from https://nodejs.org/ then run START.bat again.
  pause
  exit /b 1
)

for /f "tokens=1,2,3 delims=.v " %%a in ('node -v') do (
  set NODE_MAJOR=%%a
  set NODE_MINOR=%%b
  set NODE_PATCH=%%c
)
if %NODE_MAJOR% LSS 22 (
  echo [ERROR] ChemistryPro requires Node.js 22.5 or newer. Current version:
  node -v
  pause
  exit /b 1
)
if %NODE_MAJOR% EQU 22 if %NODE_MINOR% LSS 5 (
  echo [ERROR] ChemistryPro requires Node.js 22.5 or newer. Current version:
  node -v
  pause
  exit /b 1
)

if not exist .env.local (
  if exist .env.example (
    copy /y .env.example .env.local >nul
    echo [OK] Created .env.local from .env.example
  ) else (
    echo [ERROR] .env.example is missing.
    pause
    exit /b 1
  )
)

if not exist node_modules\next\package.json (
  echo [INFO] Installing project dependencies for the first run...
  call npm install
  if errorlevel 1 (
    echo [ERROR] Dependency installation failed. Check your internet connection and try again.
    pause
    exit /b 1
  )
)

echo.
echo [INFO] Starting ChemistryPro...
echo [INFO] Your browser will open automatically at http://localhost:3000
echo [INFO] Keep this window open while using the website.
echo.

start "ChemistryPro Browser Launcher" /min powershell -NoProfile -ExecutionPolicy Bypass -Command "$url='http://localhost:3000'; for($i=0; $i -lt 90; $i++){ try { $r=Invoke-WebRequest -UseBasicParsing -Uri $url -TimeoutSec 2; if($r.StatusCode -ge 200){ Start-Process $url; exit 0 } } catch {}; Start-Sleep -Seconds 1 }; Write-Host 'ChemistryPro did not respond on port 3000. Check the server window for errors.'"

call npm run dev -- --hostname 127.0.0.1 --port 3000
set SERVER_EXIT=%ERRORLEVEL%
echo.
if not "%SERVER_EXIT%"=="0" echo [ERROR] ChemistryPro stopped with exit code %SERVER_EXIT%. Review the messages above.
pause
exit /b %SERVER_EXIT%
