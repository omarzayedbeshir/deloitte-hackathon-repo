# Restaurant Cashier - Backend Integrated Version

This is the Restaurant Cashier application with full backend API integration for the Deloitte Hackathon project.

## 🎯 Key Features

- ✅ **Real-time Menu** - Menu items dynamically loaded from backend inventory
- ✅ **Secure Authentication** - JWT-based user authentication  
- ✅ **Transaction Processing** - Automatic inventory management and sales tracking
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile devices
- ✅ **Error Handling** - User-friendly error messages and validation

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ installed
- Backend API running on `http://localhost:5000`

### Setup

1. **Start the Backend** (in the `backend` folder):
   ```bash
   cd ../backend
   pip install -r requirements.txt
   python app.py
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   The `.env.local` file is already configured for `http://localhost:5000`. Modify if needed.

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

5. **Access the App**:
   - Open `http://localhost:3000`
   - You'll be redirected to login page
   - Register a new account or use demo credentials:
     - **Username**: demo
     - **Password**: demo123

## 📱 User Flow

### 1. **Login/Register**
   - Navigate to login page
   - Create new account or use existing credentials
   - JWT token automatically stored and sent with API requests

### 2. **Browse Menu**
   - Menu items loaded from backend inventory
   - Filter by category
   - Search for items
   - Add items to cart

### 3. **Place Order**
   - View cart summary
   - Click "Order" to checkout
   - Select payment method (Cash/Card)
   - System creates transactions for each item
   - Backend automatically deducts inventory
   - Success confirmation with order number

### 4. **Logout**
   - Click logout button (top-right on desktop, or mobile menu)
   - Returns to login page
   - Session cleared

## 🔌 API Integration

### Connected Endpoints

From the backend `app.py`:

1. **Authentication**
   - `POST /api/auth/login` - User login
   - `POST /api/auth/register` - Create account
   - `GET /api/auth/me` - Get current user

2. **Menu/Inventory**
   - `GET /api/inventory` - Fetch all products
   - Protected: `POST /api/inventory` - Add/update items

3. **Transactions**
   - Protected: `POST /api/transactions` - Create sale transaction
   - Protected: `GET /api/transactions` - View sales history

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main dashboard (API integrated)
│   ├── login/page.tsx    # Authentication page
│   └── ...
├── components/           # UI components (mostly unchanged)
├── hooks/
│   └── useMenuItems.ts   # Hook for fetching menu from backend
├── lib/
│   └── api.ts            # API client and service layer
└── data/
    └── menuData.ts       # Type definitions (interfaces)
```

## 🔐 Authentication

- Uses JWT tokens for secure API calls
- Tokens stored in browser localStorage
- Automatic token refresh not implemented (tokens valid while session active)
- Logout clears token and redirects to login

## 🛒 Payment Processing Flow

```
User clicks "Order"
    ↓
Show Summary Modal
    ↓
User selects Payment Method
    ↓
For each item in cart:
  - Create transaction via POST /api/transactions
  - Backend validates:
    ✓ Item exists in inventory
    ✓ Sufficient quantity available
    ✓ Item not expired
  - Backend deducts from inventory
    ↓
Show Success Modal with Order Number
    ↓
Clear cart and return to menu
```

## 🐛 Troubleshooting

### Menu not loading?
- Verify backend is running: `python app.py`
- Check CORS settings in backend `config.py`
- Look at browser console for error messages

### Can't login?
- Ensure user exists in backend database
- Backend might need database initialization
- Check credentials are correct

### Transaction fails?
- Item might be out of stock (check inventory)
- Item might be expired (check expiry date)
- Authentication token might be invalid (try logout and login again)

### "No auth token found"?
- You've been logged out
- Click logout and login again
- Clear browser cache if issues persist

## 📄 Documentation

- **INTEGRATION_GUIDE.md** - Detailed integration documentation
- **CHANGES.md** - Summary of all changes made

## 🔧 Configuration

Edit `.env.local` to change backend URL:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

## 📦 Dependencies

No additional npm packages required beyond original setup:
- React 18.3.1
- Next.js 14.0.0
- TypeScript 5.3.3
- Tailwind CSS 3.4.0

## 🎓 Building for Production

```bash
npm run build
npm start
```

## 📝 Notes

- The app REQUIRES a running backend to function
- Frontend-only features: category sidebar, mobile UI
- All menu and transaction functionality connects to backend
- Authentication is required for inventory transactions

## 👤 User Roles

Currently, all authenticated users have the same permissions:
- View inventory/menu
- Create transactions (place orders)
- View their own transactions

For role-based access, extend the authentication system.

## 🔄 Real-time Updates

Currently, the app doesn't have real-time updates. To add:
- Implement WebSocket connections
- Add server-sent events (SSE)
- Or use polling for inventory changes

Menu items are fetched once on app load. Refresh to get latest items.

## ❓ FAQ

**Q: How do I add new menu items?**
A: Add items through backend inventory API or Django admin. They'll appear after app refresh.

**Q: Can multiple users checkout simultaneously?**
A: Yes, each user has their own session with JWT token.

**Q: Are orders saved?**
A: Yes, each transaction is saved in backend database as a Transaction record.

**Q: Can I modify orders after checkout?**
A: No, once a transaction is created, it's final. Users must create a new order.

---

**Backend Integrated**: ✅ Yes  
**Status**: Ready for Testing  
**Last Updated**: 2024
