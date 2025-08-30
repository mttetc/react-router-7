# Companies Page Implementation

## Overview

This implementation creates a comprehensive companies directory page with filtering, search, and infinite scroll functionality using React Router v7, TanStack Query, and Chakra UI.

## Features Implemented

### ✅ Core Features

- **Companies API Route**: `/api/companies` endpoint with full filtering support
- **Infinite Scroll**: Automatic pagination using TanStack Query's `useInfiniteQuery`
- **Responsive Layout**: Header, sidebar filters, and grid layout
- **Company Cards**: Display company info with logos from Specter API

### ✅ Advanced Filtering

- **Smart Search**: Debounced search across company name, domain, and description
- **Growth Stage Filter**: seed, early, growing, late, exit
- **Customer Focus Filter**: B2B, B2C, B2B & B2C, B2C & B2B
- **Rank Range Filter**: Min/max numeric filtering
- **Funding Type Filter**: Angel, Convertible Note, Series A-D, IPO
- **Funding Amount Filter**: Min/max USD amount filtering

### ✅ User Experience

- **Debounced Search**: 300ms delay to prevent excessive API calls
- **Active Filter Display**: Visual badges showing applied filters
- **Clear Filters**: One-click filter reset
- **Sticky Sidebar**: Filters remain visible while scrolling
- **Loading States**: Proper loading indicators for infinite scroll
- **Error Handling**: Graceful error states with user-friendly messages

## Technical Architecture

### Components Structure

```
app/
├── components/company/
│   ├── company-card.tsx       # Individual company display
│   ├── companies-grid.tsx     # Grid with infinite scroll
│   ├── company-search.tsx     # Filter sidebar
│   ├── companies-loading.tsx  # Loading state
│   └── companies-error.tsx    # Error state
├── routes/
│   ├── companies.tsx          # Main page component
│   └── api.companies.tsx      # API endpoint
└── utils/
    └── companies.ts           # Database queries & types
```

### Key Technologies

- **React Router v7**: File-based routing with loaders
- **TanStack Query**: Data fetching, caching, and infinite queries
- **Chakra UI**: Component library and styling
- **Prisma**: Database ORM for PostgreSQL
- **TypeScript**: Full type safety

### Performance Optimizations

- **Infinite Query**: Loads data on-demand as user scrolls
- **Debounced Search**: Reduces API calls during typing
- **Sticky Positioning**: Efficient filter sidebar positioning
- **Query Caching**: TanStack Query handles intelligent caching
- **Intersection Observer**: Efficient scroll detection for infinite loading

## API Design

### GET /api/companies

Query parameters:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 12)
- `search`: Text search across name, domain, description
- `growth_stage`: Filter by growth stage
- `customer_focus`: Filter by customer focus
- `last_funding_type`: Filter by funding type
- `min_rank`, `max_rank`: Rank range filtering
- `min_funding`, `max_funding`: Funding amount range filtering

Response format:

```json
{
  "data": [...companies],
  "total": 1000,
  "page": 1,
  "limit": 12,
  "totalPages": 84
}
```

## Production Considerations

### Scalability Improvements

1. **Database Indexing**: Add indexes on frequently filtered columns
2. **Search Engine**: Implement Elasticsearch for advanced search
3. **CDN**: Cache company logos and static assets
4. **Rate Limiting**: Implement API rate limiting
5. **Pagination Cursor**: Use cursor-based pagination for large datasets

### Code Quality

1. **Error Boundaries**: Comprehensive error handling
2. **Loading States**: Skeleton loading for better UX
3. **Accessibility**: ARIA labels and keyboard navigation
4. **Testing**: Unit tests for components and API endpoints
5. **Monitoring**: Error tracking and performance monitoring

### Security

1. **Input Validation**: Sanitize all user inputs
2. **SQL Injection**: Prisma provides built-in protection
3. **CORS**: Configure appropriate CORS policies
4. **Authentication**: Add user authentication if needed

## Usage

1. Navigate to `/companies`
2. Use the left sidebar to apply filters
3. Scroll down to automatically load more companies
4. Click filter badges to remove individual filters
5. Use "Clear all" to reset all filters

The implementation provides a smooth, responsive experience with efficient data loading and comprehensive filtering capabilities.
