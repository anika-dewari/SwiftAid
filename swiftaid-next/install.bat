@echo off
echo 🚑 SwiftAid Installation Script
echo ==============================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected
echo.

:: Check if package.json exists
if not exist "package.json" (
    echo ❌ package.json not found. Please run this script from the swiftaid-next directory.
    pause
    exit /b 1
)

echo 📦 Installing dependencies...
echo.

:: Install dependencies
where pnpm >nul 2>nul
if %errorlevel% equ 0 (
    echo Using pnpm...
    pnpm install
) else (
    where yarn >nul 2>nul
    if %errorlevel% equ 0 (
        echo Using yarn...
        yarn install
    ) else (
        echo Using npm...
        npm install
    )
)

if %errorlevel% equ 0 (
    echo.
    echo ✅ Dependencies installed successfully!
    echo.
    echo 🚀 To start the development server:
    echo    npm run dev
    echo.
    echo    Then open http://localhost:3000 in your browser
    echo.
    echo 📖 To start the backend (in another terminal):
    echo    cd ../backend
    echo    npm install
    echo    npm start
    echo.
    echo 🎉 SwiftAid is ready to use!
) else (
    echo ❌ Installation failed. Please check the errors above.
)

pause