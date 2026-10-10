# University Information System Frontend

This is the frontend application for the University Information System, designed to work alongside a Spring Boot backend API and provide a modern, responsive admin dashboard for university operations.

Built as a clean React + TypeScript interface, this app connects to the backend services to manage academic information such as students, courses, and university administration workflows.

## Overview

The University Information System frontend is the presentation layer for the backend API, handling:

- Student management views
- Dashboard summaries and overview panels
- Navigation and administration workflows
- API-driven data visualization and interaction
- A modern, scalable UI built with React

This project is intentionally structured as a frontend companion to a Spring Boot university backend, making it easy to separate concerns between the application logic and the user interface.

## Tech Stack

This project is powered by a modern frontend stack:

- React 19
- TypeScript
- Vite
- React Router
- Redux Toolkit
- Bootstrap 5
- Axios for HTTP requests
- Lucide React for icons
- ESLint for code quality

## Key Features

- Responsive admin dashboard
- Student management page
- Route-based navigation
- Reusable UI layout components
- Global state management with Redux Toolkit
- Clean, component-driven architecture
- Ready for API integration with the Spring Boot backend

## Project Structure

```text
src/
├── components/
│   ├── AppLayout.tsx
│   └── Sidebar.tsx
├── pages/
│   ├── DashboardPage.tsx
│   └── StudentsPage.tsx
├── App.tsx
├── main.tsx
├── index.css
└── App.css
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

The app will run locally in development mode via Vite.

## Backend Integration

This frontend is designed to consume a Spring Boot University Information System API. The backend provides the business logic and data layer, while this frontend focuses on:

- presenting university data cleanly
- managing user interactions
- calling API endpoints with Axios
- keeping the interface responsive and intuitive

## Notes

This project is a polished frontend foundation for a university management platform, with the dashboard and student-management views clearly aligned with a larger Spring Boot ecosystem.

## License

This project is currently developed as a personal portfolio and interview preparation project.

License information will be added if the project is released for public reuse.
