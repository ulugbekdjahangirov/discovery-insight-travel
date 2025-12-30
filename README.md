# Discovery Insight Travel

A modern, multilingual tourism website built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Multilingual Support**: German (DE), English (EN), Russian (RU)
- **Modern UI/UX**: Responsive design inspired by world-insight.de and caj.uz
- **Tour Packages**: Browse and filter tours by destination, type, and price
- **Booking System**: Complete booking flow with form validation
- **Blog**: Travel blog with categories
- **Admin Panel**: Dashboard for managing tours, bookings, and content
- **API Routes**: RESTful API for tours, bookings, contact, and newsletter

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Internationalization**: next-intl
- **Icons**: Lucide React
- **Form Handling**: React Hook Form + Zod
- **State Management**: Zustand

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd discovery-insight-travel
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
discovery-insight-travel/
├── src/
│   ├── app/
│   │   ├── [locale]/           # Localized pages
│   │   │   ├── page.tsx        # Home page
│   │   │   ├── tours/          # Tours pages
│   │   │   ├── booking/        # Booking page
│   │   │   ├── blog/           # Blog pages
│   │   │   ├── about/          # About page
│   │   │   └── contact/        # Contact page
│   │   ├── admin/              # Admin panel
│   │   ├── api/                # API routes
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── home/               # Home page components
│   │   ├── layout/             # Header, Footer
│   │   └── tours/              # Tour components
│   ├── lib/                    # Utilities and API client
│   ├── locales/                # Translation files
│   ├── types/                  # TypeScript types
│   ├── i18n.ts                 # i18n configuration
│   └── middleware.ts           # Locale middleware
├── public/                     # Static assets
├── tailwind.config.ts          # Tailwind configuration
└── package.json
```

## Color Scheme

- **Primary**: Orange (#e57236) - from world-insight.de
- **Secondary**: Gray (#7e7e7e)
- **Background**: Light gray (#f8f8f8)

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home page with hero, featured tours, destinations |
| `/tours` | All tours with filters and sorting |
| `/tours/[slug]` | Tour detail page |
| `/booking` | Booking form |
| `/blog` | Blog listing |
| `/about` | About us page |
| `/contact` | Contact form |
| `/admin` | Admin dashboard |
| `/admin/tours` | Manage tours |
| `/admin/bookings` | Manage bookings |

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/tours` | GET | Get all tours |
| `/api/tours` | POST | Create tour |
| `/api/bookings` | GET | Get bookings |
| `/api/bookings` | POST | Create booking |
| `/api/contact` | POST | Send contact message |
| `/api/newsletter` | POST | Subscribe to newsletter |

## Future Enhancements

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User authentication
- [ ] Payment integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] Image upload and management
- [ ] Review and rating system
- [ ] Wishlist functionality
- [ ] Advanced search with Elasticsearch

## License

MIT License
