# Task Manager Frontend

React TypeScript frontend for the Task Manager API built with Vite.

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will open at `http://localhost:5173`

### Build

```bash
npm run build
```

## Features

- **Authentication**: Login and register with JWT tokens
- **Task Management**: Create, read, update, and delete tasks
- **Filtering**: Filter tasks by status (To Do, In Progress, Done)
- **Protected Routes**: Automatic redirect to login if not authenticated
- **Auto Token Injection**: Axios interceptor automatically includes JWT token in requests
- **401 Handling**: Automatic redirect to login on 401 responses

## Project Structure

```
src/
├── api/
│   ├── axiosInstance.ts       # Axios configuration with JWT interceptor
│   └── taskApi.ts             # API call methods
├── components/
│   ├── ProtectedRoute.tsx      # Route guard component
│   ├── TaskCard.tsx            # Task display card
│   └── TaskForm.tsx            # Task creation modal
├── pages/
│   ├── LoginPage.tsx           # Login page
│   ├── RegisterPage.tsx        # Registration page
│   └── TasksPage.tsx           # Main tasks management page
├── styles/
│   ├── App.css                 # Global styles
│   ├── Auth.css                # Auth pages styling
│   ├── TasksPage.css           # Tasks page styling
│   ├── TaskCard.css            # Task card styling
│   └── TaskForm.css            # Task form styling
├── App.tsx                     # Main app component
└── main.tsx                    # Entry point
```

## API Configuration

The frontend connects to the backend API at `http://localhost:8081/api`.

### Authentication Flow

1. User logs in or registers
2. JWT token is stored in localStorage
3. Token is automatically included in all API requests via `Authorization: Bearer <token>` header
4. On 401 response, user is redirected to login page

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Technology Stack

- React 18
- TypeScript
- Vite
- React Router v6
- Axios
- CSS3 (no external UI library)
