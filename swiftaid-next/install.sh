#!/bin/bash

echo "🚑 SwiftAid Installation Script"
echo "=============================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. You have $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please run this script from the swiftaid-next directory."
    exit 1
fi

echo "📦 Installing dependencies..."
echo ""

# Install dependencies
if command -v pnpm &> /dev/null; then
    echo "Using pnpm..."
    pnpm install
elif command -v yarn &> /dev/null; then
    echo "Using yarn..."
    yarn install
else
    echo "Using npm..."
    npm install
fi

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Dependencies installed successfully!"
    echo ""
    echo "🚀 To start the development server:"
    echo "   npm run dev"
    echo ""
    echo "   Then open http://localhost:3000 in your browser"
    echo ""
    echo "📖 To start the backend (in another terminal):"
    echo "   cd ../backend"
    echo "   npm install"
    echo "   npm start"
    echo ""
    echo "🎉 SwiftAid is ready to use!"
else
    echo "❌ Installation failed. Please check the errors above."
    exit 1
fi