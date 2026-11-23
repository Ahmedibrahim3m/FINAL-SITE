@echo off
setlocal
cd /d "%~dp0"
title ChemistryPro - Project Checks

where node >nul 2>nul
if errorlevel 1 (echo [ERROR] Node.js is missing.& pause & exit /b 1)
if not exist node_modules\next\package.json (
  echo [INFO] Dependencies are not installed. Running npm install...
  call npm install
  if errorlevel 1 (echo [ERROR] npm install failed.& pause & exit /b 1)
)

echo.
echo ================================
echo ChemistryPro - Automated Checks
echo ================================
echo.

echo [1/4] TypeScript type check...
call npx tsc --noEmit
if errorlevel 1 goto failed

echo.
echo [2/4] Production build...
call npm run build
if errorlevel 1 goto failed

echo.
echo [3/4] Checking required project files...
for %%F in ("src\app\page.tsx" "src\app\login\page.tsx" "src\app\dashboard\page.tsx" "src\app\admin\page.tsx" "src\app\api\auth\login\route.ts" "src\app\api\auth\register\route.ts" "src\app\api\auth\me\route.ts" "src\lib\db.ts" "START.bat" ".env.example") do (
  if not exist %%F (echo [ERROR] Missing %%~F & goto failed)
  echo [OK] %%~F
)

echo.
echo [4/4] Basic SQLite runtime check...
node -e "const {DatabaseSync}=require('node:sqlite');const d=new DatabaseSync(':memory:');d.exec('CREATE TABLE smoke(id INTEGER PRIMARY KEY, value TEXT NOT NULL); INSERT INTO smoke(value) VALUES (char(111,107))');if(d.prepare('SELECT value FROM smoke').get().value!=='ok')process.exit(1);d.close();console.log('[OK] SQLite works in this Node.js version.')"
if errorlevel 1 goto failed

echo.
echo [SUCCESS] All automated checks passed.
echo Note: Browser testing of registration, login, video playback and role permissions should still be done manually.
pause
exit /b 0

:failed
echo.
echo [FAILED] A check failed. Review the error output above, fix it, then run TEST.bat again.
pause
exit /b 1
