# GameVault Frontend

This is the Angular 19 frontend for GameVault, featuring a modern, dark-themed premium UI built entirely with vanilla CSS.

## Features Built
- **Standalone Components**: Uses the modern Angular architecture.
- **Signals**: Reactively manages authentication and product state.
- **Responsive CSS Grid**: A carefully crafted grid layout that works beautifully on desktop and mobile.
- **Routing & Guards**: Secure `authGuard` ensuring unauthenticated users cannot access the store.
- **HTTP Interceptors**: Automatically appends the JWT bearer token to API requests.

## Setup Instructions

> Note: Due to lack of local npm environment, these files were generated directly. To run this project, make sure Node.js is installed.

1. **Open this directory** (`gamevault-frontend`) in your terminal.
2. **Install Angular CLI globally** (if you haven't yet):
   ```bash
   npm install -g @angular/cli
   ```
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Run the Development Server**:
   ```bash
   ng serve
   ```
5. Navigate to `http://localhost:4200/`.

**Important**: Make sure the backend API (`uvicorn main:app`) is running on `http://127.0.0.1:8000` simultaneously.
