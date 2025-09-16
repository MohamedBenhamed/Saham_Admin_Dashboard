# Saham Admin Dashboard

A modern, responsive admin dashboard for the Saham Real Estate Platform built with React, TypeScript, and Tailwind CSS.

## Features

- **Modern UI/UX**: Clean, professional design with responsive layout
- **Comprehensive Dashboard**: Overview of platform metrics and activities
- **User Management**: Complete user administration with search and filtering
- **Investment Management**: Manage investment properties and opportunities
- **Real-time Data**: Live updates and notifications
- **Mobile Responsive**: Optimized for all device sizes
- **Dark Mode Support**: Toggle between light and dark themes
- **Accessibility**: WCAG compliant with keyboard navigation support

## Technology Stack

- **Frontend Framework**: React 18.3.1 with TypeScript
- **Styling**: Tailwind CSS 3.4.11 with custom design system
- **UI Components**: Radix UI primitives with custom styling
- **Routing**: React Router DOM 6.30.1
- **Icons**: Lucide React
- **Build Tool**: Vite 7.1.5
- **Font**: Cairo (Arabic-optimized font family)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Saham_Admin_Dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Card, Input, etc.)
│   └── layout/         # Layout components (Sidebar, Header, AdminLayout)
├── pages/              # Page components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── types/              # TypeScript type definitions
├── services/           # API services
└── main.tsx           # Application entry point
```

## Design System

The admin dashboard follows the Saham design system with:

- **Color Palette**: Primary blue (#2563eb), success green, warning orange, error red
- **Typography**: Cairo font family with responsive sizing
- **Spacing**: Consistent spacing system with responsive breakpoints
- **Components**: Reusable components with consistent styling
- **Accessibility**: WCAG AA compliant with proper contrast ratios

## Features Overview

### Dashboard
- Platform overview with key metrics
- Recent activity feed
- Quick action buttons
- Top performing investments

### User Management
- User listing with search and filtering
- User status management (active, pending, inactive)
- Role-based access control
- User activity tracking

### Investment Management
- Investment property listings
- Status tracking (active, funding, completed)
- ROI and performance metrics
- Investor management

### Additional Pages
- Wallet management
- Transaction history
- Analytics and reporting
- Notification center
- Settings and configuration

## Customization

### Adding New Pages

1. Create a new component in `src/pages/`
2. Add the route to `src/App.tsx`
3. Update the sidebar navigation in `src/components/layout/Sidebar.tsx`

### Styling

The project uses Tailwind CSS with custom utilities. Key files:
- `tailwind.config.ts` - Tailwind configuration
- `src/index.css` - Global styles and custom utilities
- `src/lib/utils.ts` - Utility functions including `cn()` for class merging

### Components

All UI components are built using Radix UI primitives with custom styling. Components are located in `src/components/ui/` and follow a consistent API pattern.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
