# Execution Command Log

This file contains a log of the key commands executed to set up, implement, and verify the project.

## 1. Setup & Installation
```bash
# Navigate to frontend and install dependencies
cd "d:\Assesment\For New Job Interview\frontend"
npm install

# Install TailwindCSS PostCSS adapter (Fix for v4 error)
npm install -D @tailwindcss/postcss
```

## 2. Backend Implementation
```bash
# Navigate to backend
cd "d:\Assesment\For New Job Interview\backend"

# Install dependencies (if not already installed)
npm install

# Start Backend Server (Runs on port 5000)
node server.js
```

## 3. Frontend Development
```bash
# Start Frontend Development Server (Runs on port 3000)
cd "d:\Assesment\For New Job Interview\frontend"
npm run dev
```

## 4. Database Verification
A script was created to view registered users in the SQLite database.
```bash
cd "d:\Assesment\For New Job Interview\backend"
node read_users.js
```

## 5. Git Version Control
```bash
# Initialize Git Repository
git init

# Add all files to staging
git add .

# Commit changes
git commit -m "Complete assessment implementation: Frontend + Backend + Auth"
```

## Key Configuration Changes
- **Frontend Port**: Changed to `3000` in `vite.config.js`.
- **Tailwind CSS**: Updated `postcss.config.js` and `index.css` for Tailwind v4 compatibility.
- **Backend API**: Added `PUT /auth/change-password` endpoint.
