"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { categories, MenuItem, CartItem } from "@/data/menuData";
import { mockOrderHistory } from "@/data/orderHistory";
import { useMenuItems } from "@/hooks/useMenuItems";
import { transactionsAPI, getAuthToken, authAPI } from "@/lib/api";
import { SidebarCategories } from "@/components/SidebarCategories";
import { MenuGrid } from "@/components/MenuGrid";
import { OrderPanel } from "@/components/OrderPanel";
import { PaymentModal } from "@/components/PaymentModal";
import { OrderSummaryModal } from "@/components/OrderSummaryModal";
import { SuccessModal } from "@/components/SuccessModal";
import { HistoryPage } from "@/components/HistoryPage";
import { GlobalSearchResults } from "@/components/GlobalSearchResults";

export default function Home() {
  const { menuItems = [], categories: apiCategories = [], loading: loadingItems, error: itemsError } = useMenuItems();
  const [activeCategory, setActiveCategory] = useState(
    categories[0]?.id || "special-nasi-goreng"
  );
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showMobileOrderPanel, setShowMobileOrderPanel] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionError, setTransactionError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  // Check authentication on mount
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
    setAuthLoading(false);
  }, [router]);

  // Global search results across all items
  const globalSearchResults = useMemo(() => {
    if (!globalSearchQuery.trim()) return [];
    
    const query = globalSearchQuery.toLowerCase();
    return menuItems.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    );
  }, [globalSearchQuery, menuItems]);

  // Handle global search selection
  const handleGlobalSearchSelect = (item: MenuItem) => {
    // Find the category and set it as active
    const itemCategory = categories.find((c) => c.name === item.category);
    if (itemCategory) {
      setActiveCategory(itemCategory.id);
    }
    setGlobalSearchQuery("");
    setShowGlobalSearch(false);
    handleAddToCart(item);
  };

  // Filter menu items by active category
  const filteredByCategory = useMemo(() => {
    const activecat = categories.find((c) => c.id === activeCategory);
    return menuItems.filter((item) => item.category === activecat?.name);
  }, [menuItems, activeCategory]);

  // Handle adding items to cart
  const handleAddToCart = (item: MenuItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);

      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }

      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  // Handle updating quantity
  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    setCartItems((prevItems) =>
      quantity === 0
        ? prevItems.filter((i) => i.id !== itemId)
        : prevItems.map((i) =>
            i.id === itemId ? { ...i, quantity } : i
          )
    );
  };

  // Handle removing item
  const handleRemoveItem = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((i) => i.id !== itemId));
  };

  // Handle checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setShowSummaryModal(true);
  };

  const handleEditOrder = () => {
    setShowSummaryModal(false);
  };

  const handleProceedToPay = () => {
    setShowSummaryModal(false);
    setShowPaymentModal(true);
  };

  const handlePaymentSelect = async (method: "cash" | "card") => {
    try {
      setIsProcessing(true);
      setTransactionError(null);

      // Check if user is authenticated
      const token = getAuthToken();
      if (!token) {
        setTransactionError("Please log in before making a payment");
        setShowPaymentModal(false);
        return;
      }

      // Create transactions for each cart item
      for (const item of cartItems) {
        try {
          await transactionsAPI.create({
            name: item.name,
            quantity: item.quantity,
            transaction_type: "sale",
          });
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : `Failed to process ${item.name}`;
          console.error("Transaction error:", err);
          setTransactionError(errorMsg);
          // Continue with other items, but show error at the end
        }
      }

      // Generate order number and show success
      const newOrderNumber = String(Math.floor(Math.random() * 1000) + 1).padStart(3, "0");
      setOrderNumber(newOrderNumber);

      setShowPaymentModal(false);
      setShowSuccessModal(true);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Payment processing failed";
      setTransactionError(errorMsg);
      console.error("Payment error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleHomeClick = () => {
    setShowSuccessModal(false);
    setCartItems([]);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleShowHistory = () => {
    setShowHistory(true);
  };

  const handleLogout = () => {
    authAPI.logout();
    router.push("/login");
  };

  if (showHistory) {
    return (
      <HistoryPage
        orders={mockOrderHistory}
        onBack={() => setShowHistory(false)}
      />
    );
  }

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <main className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  // Show loading while fetching menu items
  if (loadingItems) {
    return (
      <main className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu items...</p>
        </div>
      </main>
    );
  }

  // Show error if items failed to load
  if (itemsError) {
    return (
      <main className="h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-gray-900 font-bold mb-2">Failed to load menu</p>
          <p className="text-gray-600 mb-4">{itemsError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (showHistory) {
    return (
      <HistoryPage
        orders={mockOrderHistory}
        onBack={() => setShowHistory(false)}
      />
    );
  }

  return (
    <main className="h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header with Icons */}
      <div className="lg:hidden flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3 z-30">
        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setShowMobileSidebar(true)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Title */}
        <h1 className="text-lg font-bold text-gray-900">Menu</h1>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Order Panel Toggle Button */}
          <button
            onClick={() => setShowMobileOrderPanel(true)}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {cartItems.length > 0 && (
              <span className="absolute top-0 right-0 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Logout"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Left Sidebar - Categories (Hidden on mobile/tablet, visible on desktop+) */}
      <div className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col">
        {/* Logout Button */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>

        {/* Categories */}
        <div className="flex-1 overflow-y-auto">
          <SidebarCategories
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
      </div>

      {/* Center - Menu Grid */}
      <div className="flex-1 min-w-0 flex flex-col pb-24 lg:pb-0 relative">
        {/* Global Search Bar (Desktop) */}
        <div className="hidden lg:block p-6 pb-0 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search all products..."
              value={globalSearchQuery}
              onChange={(e) => setGlobalSearchQuery(e.target.value)}
              onFocus={() => setShowGlobalSearch(true)}
              className="w-full px-4 py-3 rounded-full bg-gray-200 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary pr-12"
            />
            {/* Search Icon */}
            <svg
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {/* Clear Button */}
            {globalSearchQuery && (
              <button
                onClick={() => {
                  setGlobalSearchQuery("");
                  setShowGlobalSearch(false);
                }}
                className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                title="Clear search"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Global Search Results */}
        <GlobalSearchResults
          isOpen={showGlobalSearch && globalSearchQuery.trim().length > 0}
          results={globalSearchResults}
          searchQuery={globalSearchQuery}
          categories={categories}
          onSelectResult={handleGlobalSearchSelect}
          onClose={() => setShowGlobalSearch(false)}
        />

        <MenuGrid
          items={filteredByCategory}
          onAddToCart={handleAddToCart}
        />
      </div>

      {/* Right Sidebar - Order Panel (Hidden on mobile/tablet, visible on desktop+) */}
      <div className="hidden lg:flex w-64 lg:w-96 p-4 lg:p-6 bg-gray-50 flex-col border-l border-gray-200 overflow-hidden">
        <OrderPanel
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onCheckout={handleCheckout}
          onHistory={handleShowHistory}
        />
      </div>

      {/* Mobile Sidebar Drawer */}
      {showMobileSidebar && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowMobileSidebar(false)}
          />
          {/* Sidebar */}
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 flex flex-col shadow-lg">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Browse Categories</h2>
              <button
                onClick={() => setShowMobileSidebar(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SidebarCategories
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={(id) => {
                  setActiveCategory(id);
                  setShowMobileSidebar(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Order Panel Drawer */}
      {showMobileOrderPanel && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowMobileOrderPanel(false)}
          />
          {/* Order Panel */}
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-gray-50 border-l border-gray-200 flex flex-col shadow-lg">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
              <h2 className="text-lg font-bold text-gray-900">Your Order</h2>
              <button
                onClick={() => setShowMobileOrderPanel(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <OrderPanel
                cartItems={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onCheckout={() => {
                  setShowMobileOrderPanel(false);
                  handleCheckout();
                }}
                onHistory={() => {
                  setShowMobileOrderPanel(false);
                  handleShowHistory();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Order Summary Modal */}
      <OrderSummaryModal
        isOpen={showSummaryModal}
        cartItems={cartItems}
        onClose={() => setShowSummaryModal(false)}
        onEdit={handleEditOrder}
        onPay={handleProceedToPay}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          if (!isProcessing) {
            setShowPaymentModal(false);
          }
        }}
        onSelectPayment={handlePaymentSelect}
        loading={isProcessing}
        error={transactionError}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        cartItems={cartItems}
        orderNumber={orderNumber}
        onHome={handleHomeClick}
        onPrint={handlePrintReceipt}
      />
    </main>
  );
}
