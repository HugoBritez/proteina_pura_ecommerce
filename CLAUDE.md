# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run Next.js linter

### Environment Setup
- Copy `.env.example` to `.env` and configure Supabase credentials
- Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set

## Architecture Overview

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **Database**: Supabase (PostgreSQL)
- **UI**: Radix UI components with Tailwind CSS
- **State Management**: React hooks with localStorage for cart
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with custom font variables (Anton, Oswald, Roboto)

### Project Structure
```
app/
├── api/admin/          # Admin API routes for CRUD operations
├── admin/              # Admin dashboard page
├── productos/          # Product listing and category pages
├── carrito/            # Shopping cart page
├── contacto/           # Contact page
├── ofertas/            # Offers page
├── login/              # Authentication page
└── page.tsx            # Homepage

components/
├── ui/                 # Reusable UI components (Radix + Tailwind)
├── header.tsx          # Main navigation
├── footer.tsx          # Site footer
├── productcard.tsx     # Product display component
└── ImageUploader.tsx   # Admin image upload component

lib/
├── supabase.ts         # Supabase client configuration
├── supabaseAdmin.ts    # Admin Supabase client
├── products.ts         # Product-related database queries
├── utils/formatCurrency.ts  # Currency formatting utility
└── consts/empresa.data.ts   # Company information constants

types/
└── database.ts         # TypeScript types for Supabase schema

hooks/
└── useCart.ts          # Shopping cart state management
```

### Database Schema
The application uses Supabase with these main tables:
- `productos` - Product information with category and flavor relationships
- `categorias` - Product categories
- `sabores` - Available flavors for products

Key relationships:
- Products belong to one category
- Products can have multiple flavors (many-to-many via array field)

### Key Features
- **E-commerce functionality**: Product catalog, shopping cart, categories
- **Admin panel**: Product CRUD operations, image uploads, inventory management
- **Responsive design**: Mobile-first approach with Tailwind CSS
- **Product management**: Support for multiple flavors, stock tracking, offers
- **Image handling**: Upload system for product images and galleries

### Authentication
- Supabase Auth for admin access
- Admin routes protected with session checks
- Admin API endpoints require Bearer token authentication

### Cart System
- Client-side cart state using localStorage
- Cart persists across sessions
- Supports quantity updates and flavor selection

### Styling Conventions
- Uses custom CSS variables for fonts (--font-anton, --font-oswald, --font-roboto)
- Red color scheme (red-600/700) for branding
- Radix UI components with Tailwind styling
- Responsive grid layouts for product displays

### API Structure
- Admin API routes in `/api/admin/` for protected operations
- RESTful patterns for CRUD operations
- File upload endpoints for image management