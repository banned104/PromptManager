@echo off
echo Starting Prompt Manager...
echo.

if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    echo.
)

echo Starting development server...
start "" "http://localhost:3000"
npm run dev

if errorlevel 1 (
    echo.
    echo Startup failed. Check error messages above.
    pause
)
pause