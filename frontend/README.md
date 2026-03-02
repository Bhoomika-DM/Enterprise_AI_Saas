# Frontend - React + Vite + Tailwind

Modern React frontend with authentication and landing page.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

App will start on: http://localhost:5173

## Build for Production

```bash
npm run build
```

## Full Documentation

For complete documentation, see:
- **[../documentation/FRONTEND_README.md](../documentation/FRONTEND_README.md)** - Complete frontend documentation
- **[../documentation/VISUAL_GUIDE.md](../documentation/VISUAL_GUIDE.md)** - Visual design guide
- **[../documentation/IMPLEMENTATION_SUMMARY.md](../documentation/IMPLEMENTATION_SUMMARY.md)** - Implementation details

## Features

- ✅ Modern landing page (9 sections)
- ✅ Sign up / Sign in pages
- ✅ Google OAuth integration
- ✅ Twitter OAuth integration
- ✅ Dark theme
- ✅ Responsive design
- ✅ Framer Motion animations
- ✅ Tailwind CSS styling

## Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Landing.jsx      # Landing page
│   │   ├── SignUp.jsx       # Sign up page
│   │   └── SignIn.jsx       # Sign in page
│   ├── components/
│   │   ├── Header.jsx       # Navigation header
│   │   ├── Hero.jsx         # Hero section
│   │   ├── CoreValues.jsx   # Core values
│   │   └── ...              # Other components
│   ├── contexts/
│   │   └── AuthContext.jsx  # Auth context
│   ├── utils/
│   │   └── validation.js    # Form validation
│   ├── App.jsx              # Main app component
│   └── main.jsx             # Entry point
├── public/
│   └── assets/              # Images and assets
└── package.json             # Dependencies
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Pages

- **/** - Landing page
- **/signup** - Sign up page
- **/signin** - Sign in page
- **/auth/callback** - OAuth callback handler

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Routing

## Need Help?

See the [documentation folder](../documentation/) for detailed guides.
