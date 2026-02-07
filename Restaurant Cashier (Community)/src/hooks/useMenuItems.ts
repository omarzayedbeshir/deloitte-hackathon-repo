import { useState, useEffect } from 'react';
import { inventoryAPI, InventoryItem } from '@/lib/api';
import { MenuItem } from '@/data/menuData';

export interface MenuHookReturn {
  menuItems: MenuItem[];
  categories: string[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Convert backend inventory item to MenuItem
const convertInventoryToMenuItem = (item: InventoryItem): MenuItem => {
  return {
    id: item.id.toString(),
    name: item.name,
    price: item.price,
    image: `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop`, // Default image
    category: item.category,
    subcategory: item.category.toLowerCase().includes('minuman') ? 'minuman' : 'makanan',
    description: item.description || item.name,
  };
};

export const useMenuItems = (): MenuHookReturn => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const items = await inventoryAPI.getAll();
      
      // Convert inventory items to menu items
      const convertedItems = items.map(convertInventoryToMenuItem);
      setMenuItems(convertedItems);
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(items.map(item => item.category))
      );
      setCategories(uniqueCategories);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch menu items';
      setError(errorMessage);
      console.error('Error fetching menu items:', err);
      // Optionally fall back to mock data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  return { menuItems, categories, loading, error, refetch: fetchMenuItems };
};

export const useCreateTransaction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTransaction = async (itemName: string, quantity: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await inventoryAPI.create({
        name: itemName,
        quantity,
        category: 'Unknown', // This should come from inventory
        price: 0, // This should come from inventory
      });

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create transaction';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createTransaction, loading, error };
};
