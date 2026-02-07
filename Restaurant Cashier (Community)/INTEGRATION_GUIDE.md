# Restaurant Cashier - Backend Integration Guide

## Overview

The Restaurant Cashier frontend has been successfully integrated with the Deloitte Hackathon backend API. This guide explains the integration and how to use it.

## Architecture

### API Endpoints Used

1. **Authentication** (`/api/auth/`)
   - `POST /api/auth/register` - Register new user
   - `POST /api/auth/login` - Login and get JWT token
   - `GET /api/auth/me` - Get current user info

2. **Inventory** (`/api/inventory`)
   - `GET /api/inventory` - Fetch all inventory items (menu items)
   - `POST /api/inventory` - Create/update inventory (protected)
   - `PUT /api/inventory/<id>` - Update inventory item (protected)
   - `DELETE /api/inventory/<id>` - Delete inventory item (protected)

3. **Transactions** (`/api/transactions`)
   - `POST /api/transactions` - Create transaction/sale (protected)
   - `GET /api/transactions` - Get all transactions (protected)

4. **Categories** (`/api/categories`)
   - `GET /api/categories` - Get all categories

## Files Added/Modified

### New Files

1. **`src/lib/api.ts`** - API service layer with all endpoint wrappers
   - `authAPI` - Authentication functions
   - `inventoryAPI` - Inventory management functions
   - `transactionsAPI` - Transaction creation and retrieval
   - `categoriesAPI` - Category management

2. **`src/hooks/useMenuItems.ts`** - React hook for fetching menu items from backend
   - Converts backend inventory items to frontend MenuItem format
   - Handles loading and error states

3. **`src/app/login/page.tsx`** - Authentication page
   - Login/Register form
   - JWT token storage in localStorage
   - Redirect to home on successful login

4. **`.env.local`** - Environment configuration
   - `NEXT_PUBLIC_API_BASE_URL` - Backend API URL (default: http://localhost:5000)

### Modified Files

1. **`src/app/page.tsx`** - Main dashboard
   - Integrated `useMenuItems` hook for dynamic menu loading
   - Added authentication check with redirect to login
   - Integrated transaction API calls for payment processing
   - Added logout functionality
   - Added loading and error states

2. **`src/components/PaymentModal.tsx`** - Enhanced payment modal
   - Added loading state during transaction processing
   - Added error message display
   - Shows processing indicator

## Setup Instructions

### 1. Backend Setup

First, ensure the backend is running:

```bash
cd backend
pip install -r requirements.txt
python app.py
```

The backend should be running on `http://localhost:5000`

### 2. Environment Configuration

Create or update `.env.local` in the Restaurant Cashier directory:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

### 3. Start Frontend

```bash
npm install  # if not already done
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 4. First Time Setup

1. Create a demo user in the backend database (or use the demo credentials)
2. Navigate to `http://localhost:3000/login`
3. Register a new account or login
4. The app will redirect to the dashboard

## API Flow

### Authentication Flow

```
1. User enters credentials → Login page
2. POST /api/auth/login with credentials
3. Backend returns JWT token
4. Token stored in localStorage
5. Redirect to dashboard
```

### Transaction Flow (Payment)

```
1. User adds items to cart
2. User clicks "Order" → Payment Modal
3. User selects payment method
4. For each item in cart:
   - POST /api/transactions with (name, quantity, "sale")
   - Backend checks inventory and expiry
   - Backend deducts from inventory
5. Show success modal with order number
```

### Menu Loading Flow

```
1. Dashboard loads
2. useMenuItems hook fetches from GET /api/inventory
3. Backend inventory items are converted to MenuItem format
4. Categories extracted from items
5. Menu displayed with items grouped by category
```

## Key Features

### 1. JWT Authentication
- Secure token-based authentication
- Token persisted in localStorage
- Automatic redirect for unauthenticated users
- Logout functionality available

### 2. Real-time Inventory
- Menu items dynamically fetched from backend
- Supports filtering by category
- Search functionality works with backend data

### 3. Transaction Processing
- Creates sales transactions for each item
- Automatic inventory deduction
- Expiry date validation
- Stock availability checking
- Error handling with user feedback

### 4. Responsive Design
- Works on desktop, tablet, and mobile
- Mobile-friendly authentication
- Touch-friendly payment interface

## Error Handling

### Common Issues

1. **404 Not Found - Backend not running**
   ```
   Solution: Ensure backend is running on http://localhost:5000
   ```

2. **Authentication Failed**
   ```
   Solution: Check credentials and ensure user exists in backend database
   ```

3. **Transaction Failed - Insufficient Stock**
   ```
   Solution: Add more inventory through the backend dashboard
   ```

4. **Transaction Failed - Item Expired**
   ```
   Solution: Inventory endpoint checks expiry dates. Update expiry or add new items.
   ```

5. **CORS Errors**
   ```
   Solution: Check backend CORS configuration in config.py
   - Ensure frontend URL is in CORS_ORIGINS
   ```

## Configuration

### Backend Integration

The backend is configured in `src/lib/api.ts`. Key configurations:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
```

### JWT Token Management

```typescript
// Get token
const token = getAuthToken(); // from localStorage

// Set token (after login)
setAuthToken(response.access_token);

// Clear token (on logout)
clearAuthToken();
```

## Testing

### Test Scenarios

1. **Login Flow**
   - Register new account
   - Login with credentials
   - Verify redirect to dashboard

2. **Menu Loading**
   - Check menu items appear
   - Verify categories load correctly
   - Test search functionality

3. **Order Placement**
   - Add items to cart
   - Proceed to checkout
   - Complete payment
   - Verify transaction created in backend

4. **Error Scenarios**
   - Try to add out-of-stock item
   - Try to sell expired item
   - Test network errors

## Demo Credentials

For testing, use these credentials (if set up in backend):

```
Username: demo
Password: demo123
```

## Backend API Reference

For detailed API documentation, see the image provided in the issue which shows:

- **Inventory API**: POST /inventory (Add/Update inventory)
  - Required: name, quantity, category, price
  - Auth: Bearer token required

- **Transactions API**: POST /transactions (Create transaction)
  - Request: { "name": "Milk", "quantity": 2 }
  - Auth: Bearer token required
  - Behavior: Deducts inventory, checks expiry/stock

## Troubleshooting

### Menu not loading

1. Check backend is running
2. Verify CORS settings in backend
3. Check browser console for errors
4. Verify database connection

### Transactions failing

1. Ensure item exists in inventory
2. Check item quantity is sufficient
3. Verify item hasn't expired
4. Check JWT token is valid

### Login issues

1. Ensure user is registered
2. Check username/password
3. Verify backend auth endpoints working
4. Clear localStorage and try again

## Future Enhancements

Potential improvements:
- Cart persistence to backend
- Order history from backend transactions
- Real-time inventory updates
- Receipt printing with transaction details
- Receipt email functionality
- User preference storage
- Admin dashboard for inventory management
