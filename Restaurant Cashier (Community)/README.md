# Restaurant Ordering Web App - ONEWAY 7

A responsive restaurant ordering web application built with Next.js, React, and Tailwind CSS.

## Features

- **3-Column Layout**
  - Left Sidebar: Category navigation with logo
  - Center: Menu grid with search functionality
  - Right Sidebar: Order panel with cart management

- **Interactive Menu System**
  - Search functionality to filter menu items
  - Category-based filtering (Makanan/Minuman)
  - Click to add items to cart

- **Cart Management**
  - Add/remove items from order
  - Adjust quantities with +/- buttons
  - Real-time total price calculation
  - Item count tracking

- **Responsive Design**
  - Desktop: Full 3-column layout
  - Tablet: Sidebar menu with grid and cart
  - Mobile: Vertical layout with sticky cart summary

- **Modern UI**
  - Orange accent color (#FF8C42)
  - Rounded cards with subtle shadows
  - Smooth transitions and hover effects
  - Clean, professional design

## Tech Stack

- **Next.js 14** (App Router)
- **React 18** (Functional Components)
- **Tailwind CSS 3** (Utility-first styling)
- **TypeScript** (Type safety)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page (Home)
│   └── globals.css         # Global styles
├── components/
│   ├── SidebarCategories.tsx  # Category sidebar
│   ├── CategoryItem.tsx        # Category item
│   ├── SearchBar.tsx           # Search input
│   ├── MenuGrid.tsx            # Menu grid container
│   ├── MenuCard.tsx            # Menu item card
│   ├── OrderPanel.tsx          # Order/cart panel
│   ├── OrderItem.tsx           # Cart item
│   └── QuantityButton.tsx      # Quantity controls
└── data/
    └── menuData.ts         # Mock menu items & categories
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Navigate to the project directory:
```bash
cd "Restaurant Cashier (Community)"
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Components Overview

### SidebarCategories
- Displays restaurant logo and date
- Lists food categories (Makanan, Minuman)
- Highlights active category
- Scrollable for mobile

### MenuGrid
- Search bar for filtering items
- Responsive grid (2-4 columns)
- Displays menu items as cards
- Shows filtered results

### MenuCard
- Item image with hover zoom
- Item name and description
- Price in Indonesian Rupiah
- Click to add to cart

### OrderPanel
- Shows selected items
- Quantity controls (+/-)
- Item thumbnails and prices
- Total items and price
- Checkout button

### QuantityButton
- Plus/minus buttons
- Current quantity display
- Updates cart in real-time

## State Management

The app uses React `useState` hooks to manage:
- Active category selection
- Search query
- Cart items with quantities
- Real-time price calculations

## Styling

- **Colors**: Orange (#FF8C42), Gray palette
- **Spacing**: Consistent padding/margins
- **Shadows**: Subtle shadows for depth
- **Transitions**: Smooth animations on interactions
- **Typography**: Clear font hierarchy

## Features Implemented

✅ 3-column responsive layout
✅ Category filtering
✅ Search functionality
✅ Add items to cart
✅ Adjust quantities
✅ Remove items
✅ Real-time total calculations
✅ Mobile responsive design
✅ Clean component architecture
✅ Mock data with 15+ menu items
✅ Responsive grid layout
✅ Smooth interactions

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Future Enhancements

- Order notes/special requests per item
- Multiple order management
- Order history
- Payment integration
- Receipt printing
- Kitchen display system
