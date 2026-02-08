# 🐱 CatMatch

A modern cat adoption platform connecting cats in need with loving homes. Built with React, TypeScript, and Supabase.

## Overview

CatMatch is a full-featured web application that helps facilitate cat adoptions by connecting people looking to rehome their cats (rehomers) with potential adopters. The platform provides location-based discovery, real-time messaging, and comprehensive cat profile management.

## Features

### 🔍 Discovery

- Location-based cat search with customizable distance filters
- Advanced filtering (age, gender, neutered status)
- Interactive cat profiles with detailed information
- Swipe-based interface for browsing available cats

### 💬 Messaging

- Real-time chat between adopters and rehomers
- Read receipts and typing indicators
- Conversation management with unread message counts
- Separate inbox experiences for adopters and rehomers

### 👤 User Management

- Email/password authentication
- OAuth integration (Google, Facebook)
- User profiles with customizable information
- Profile picture upload and management

### 🏠 Rehomer Dashboard

- Add and manage cat listings
- Edit existing listings
- Track adoption inquiries
- Upload and manage cat photos

### 🌍 Internationalization

- Multi-language support (English, Spanish)
- Automatic language detection
- Translatable UI elements

### 🎨 Theming

- Light and dark mode support
- System preference detection
- Persistent theme selection

### Image Handling

- Client-side image compression
- Automatic resizing for optimal performance
- Multiple image upload support
- Unique URL generation to prevent caching issues

### Accessibility

- Semantic HTML
- ARIA labels and roles
- Keyboard navigation support

## Tech Stack

### Frontend

- **React 19** - UI framework
- **TypeScript 5.8** - Type safety
- **Vite 7** - Build tool and dev server
- **React Router 7** - Client-side routing
- **TailwindCSS 4** - Utility-first styling
- **DaisyUI 5** - Component library

### State Management

- **Zustand** - Global state management
- **TanStack Query (React Query)** - Server state and caching
- **React Hook Form** - Form state management

### Backend & Services

- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication
  - Storage for images

### Validation & Utilities

- **Zod** - Schema validation
- **Axios** - HTTP client
- **i18next** - Internationalization
- **browser-image-compression** - Image optimization

### Testing

- **Vitest 4** - Unit test framework
- **React Testing Library** - Component testing
- **@testing-library/user-event** - User interaction simulation
- **jsdom** - Browser environment simulation

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project

### Installation

1. Clone the repository:

```bash
git clone https://github.com/jj-int-dev/CatMatch.git
cd CatMatch
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_REDIRECT_URL_ON_AUTH=http://localhost:5173/oauth-callback
VITE_RESET_PASSWORD_URL=http://localhost:5173/reset-password
VITE_GEOAPIFY_API_KEY=your_geoapify_api_key
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Available Scripts

### Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Testing

```bash
npm test             # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:coverage # Run tests with coverage report
npm run test:ui      # Open Vitest UI
```

## Project Structure

```
CatMatch/
├── src/
│   ├── api/                    # API client functions
│   ├── app/                    # Main App component
│   ├── assets/                 # Static assets (images, icons)
│   ├── components/             # Shared components
│   │   ├── loading-screen/
│   │   ├── navigation/
│   │   ├── toasts/
│   │   └── ...
│   ├── config/                 # Configuration files
│   │   └── locales/            # Translation files
│   ├── features/               # Feature-based modules
│   │   ├── discovery/          # Cat browsing and search
│   │   ├── inbox/              # Messaging system
│   │   ├── landing-page/       # Landing page
│   │   ├── log-in/             # Authentication
|   |   |-- not-found/          # Not Found page
|   |   |-- oauth-callback/     # Callback for Oauth login
|   |   |-- privacy-policy/     # Privacy Policy
│   │   ├── registration/       # User registration
│   │   ├── rehomer-dashboard/  # Cat listing management
|   |   |-- reset-password/     # Reset Password
|   |   |-- user-data-deletion/ # Data deletion policy
│   │   └── user-profile/       # User profile management
│   ├── hooks/                  # Custom React hooks
│   ├── stores/                 # Zustand stores
│   ├── test/                   # Test configuration and utilities
│   ├── types/                  # TypeScript type definitions
│   ├── utils/                  # Utility functions
│   ├── validators/             # Zod validators
|   |-- index.css               # Global theme/styling
│   └── main.tsx                # Application entry point
├── vitest.config.ts            # Vitest configuration
├── vite.config.ts              # Vite configuration
├── tailwind.config.ts          # Tailwind configuration
└── tsconfig.json               # TypeScript configuration
```

## Documentation

- [Testing Setup](./TESTING_SETUP.md) - Comprehensive testing documentation
- [Theme Implementation](./THEME_IMPLEMENTATION_SUMMARY.md) - Theme system details
