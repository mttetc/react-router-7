# 🚀 React Router v7 - Company Management App

A modern, full-stack company management application built with React Router v7, featuring advanced filtering, search capabilities, and responsive design.

## 🏗️ Architecture & Tech Stack

### **Frontend Framework**

- **React Router v7** - Latest version with SSR support
- **React 19** - Latest React with concurrent features
- **TypeScript** - Full type safety
- **Vite** - Fast build tool and dev server

### **UI & Styling**

- **Chakra UI v3** - Modern component library
- **Emotion** - CSS-in-JS styling
- **Framer Motion** - Smooth animations
- **React Icons** - Comprehensive icon set

### **State Management**

- **TanStack Query v5** - Server state management
- **Zustand** - Lightweight client state
- **nuqs** - URL state synchronization

### **Backend & Database**

- **Prisma** - Type-safe database ORM
- **Node.js** - Server runtime
- **React Router Server** - SSR capabilities

### **Development Tools**

- **Vitest** - Fast unit testing
- **Testing Library** - Component testing
- **ESLint** - Code linting
- **TypeScript** - Type checking

## 📦 Key Dependencies

```json
{
  "dependencies": {
    "@chakra-ui/react": "^3.26.0",
    "@react-router/node": "^7.5.3",
    "@react-router/serve": "^7.5.3",
    "@tanstack/react-query": "^5.85.5",
    "framer-motion": "^12.10.4",
    "nuqs": "^2.6.0",
    "react": "^19.1.0",
    "react-router": "^7.5.3",
    "zod": "^4.1.5",
    "zustand": "^5.0.8"
  }
}
```

## 🏛️ Project Architecture

### **Feature-Based Structure**

```
app/
├── components/ui/              # Reusable UI components
│   ├── client-only.tsx        # Client-side only wrapper
│   ├── currency-selector.tsx  # Currency selection
│   ├── error-boundary.tsx     # Error handling
│   └── ...
│
├── features/companies/         # Companies feature module
│   ├── api/                   # API layer
│   │   ├── companies-client.ts
│   │   └── companies-server.ts
│   ├── components/            # Feature-specific components
│   │   ├── company-table.tsx
│   │   ├── filter-field.tsx
│   │   ├── pagination.tsx
│   │   └── ...
│   ├── forms/                 # Form components
│   │   ├── filter-form.tsx
│   │   ├── smart-search.tsx
│   │   └── mobile/            # Mobile-specific forms
│   ├── hooks/                 # Custom hooks
│   │   └── use-companies-data.ts
│   ├── types/                 # Type definitions
│   │   ├── schemas.ts         # Zod schemas
│   │   └── forms.ts           # Form types
│   └── utils/                 # Utility functions
│       ├── filter-utils.ts
│       ├── table-utils.tsx
│       └── ...
│
├── lib/                       # Shared libraries
│   ├── prisma-server.ts       # Database connection
│   ├── query-client.ts        # React Query setup
│   └── search-params.ts       # URL params handling
│
├── routes/                    # React Router routes
│   ├── api.companies.ts       # API routes
│   ├── companies.tsx          # Companies page
│   └── home.tsx               # Home page
│
└── stores/                    # Global state
    ├── currency.store.ts      # Currency state
    └── currency-utils.ts      # Currency helpers
```

### **Key Features**

#### 🔍 **Advanced Search & Filtering**

- **Smart Search** - Intelligent company search
- **Multi-criteria Filters** - Industry, funding, location
- **URL State Sync** - Filters persist in URL
- **Mobile-optimized** - Touch-friendly interface

#### 📊 **Data Management**

- **Server-side Rendering** - Fast initial load
- **Client-side Hydration** - Interactive after load
- **Optimistic Updates** - Smooth UX
- **Error Boundaries** - Graceful error handling

#### 📱 **Responsive Design**

- **Mobile-first** - Optimized for mobile
- **Progressive Enhancement** - Works without JS
- **Touch Gestures** - Native mobile feel
- **Adaptive Layouts** - Desktop and mobile variants

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd reactrouter
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run tests
npm run test:ui      # Run tests with UI
npm run lint         # Lint code
npm run typecheck    # Type check
```

## 🧪 Testing

### Test Structure

```
__tests__/
├── accessibility/    # A11y tests
├── behavior/        # User behavior tests
├── components/      # Component tests
└── utils/          # Test utilities
```

### Running Tests

```bash
npm run test         # Run all tests
npm run test:ui      # Interactive test UI
npm run test:run     # Run tests once
```

## 🚀 Deployment

### Vercel (Recommended)

#### Method 1: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

#### Method 2: Web Interface

1. Go to [vercel.com](https://vercel.com)
2. Connect your GitHub account
3. Import your repository
4. Click "Deploy"

### Configuration

- **Build Command**: `npm run build`
- **Output Directory**: `build/client`
- **Install Command**: `npm install`

### Environment Variables

Add your environment variables in:

- Vercel Dashboard > Settings > Environment Variables
- Or via CLI: `vercel env add`

## 🔧 Configuration

### React Router Config

```typescript
// react-router.config.ts
export default {
  ssr: true, // Server-side rendering enabled
} satisfies Config;
```

### Vercel Config

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build/client",
  "framework": null,
  "functions": {
    "build/server/index.js": {
      "runtime": "nodejs20.x"
    }
  }
}
```

## 📊 Performance Features

- **Server-Side Rendering** - Fast initial page load
- **Code Splitting** - Lazy loading of components
- **Image Optimization** - WebP format with lazy loading
- **Bundle Optimization** - Tree shaking and minification
- **CDN Distribution** - Global content delivery
- **Edge Functions** - Serverless API routes

## 🎨 Design System

### Color Palette

- **Primary**: Chakra UI default theme
- **Custom**: Purple accent for funding sliders
- **Semantic**: Success, warning, error states

### Typography

- **Font**: System fonts for performance
- **Scale**: Consistent sizing with Chakra UI
- **Responsive**: Mobile-optimized text sizes

### Components

- **Reusable**: UI components in `/components/ui`
- **Feature-specific**: Business logic in `/features`
- **Mobile variants**: Separate mobile components
- **Accessible**: ARIA labels and keyboard navigation

## 🔒 Security

- **Type Safety** - Full TypeScript coverage
- **Input Validation** - Zod schema validation
- **XSS Protection** - React's built-in protection
- **CSRF Protection** - Server-side validation
- **Environment Variables** - Secure configuration

## 📈 Monitoring & Analytics

- **Error Tracking** - Error boundaries and logging
- **Performance Monitoring** - Core Web Vitals
- **User Analytics** - Optional integration ready
- **Build Monitoring** - Vercel deployment insights

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style

- Use TypeScript for all code
- Follow ESLint configuration
- Write meaningful commit messages
- Add JSDoc comments for complex functions

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the code examples

---

**Built with ❤️ using React Router v7**
