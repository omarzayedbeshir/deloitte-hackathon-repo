// Mock data for menu items
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  subcategory?: string;
  description: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
  section: "makanan" | "minuman";
  icon?: string;
}

export const menuItems: MenuItem[] = [
  // Special Nasi Goreng items
  {
    id: "1",
    name: "Nasgor Biasa",
    price: 10000,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
    category: "Special Nasi Goreng",
    subcategory: "makanan",
    description: "Nasi goreng dengan bumbu standar yang lezat",
  },
  {
    id: "2",
    name: "Nasgor Ati",
    price: 13000,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561e1f?w=400&h=300&fit=crop",
    category: "Special Nasi Goreng",
    subcategory: "makanan",
    description: "Nasi goreng dengan ati ayam empuk",
  },
  {
    id: "3",
    name: "Nasgor Ayam",
    price: 13000,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
    category: "Special Nasi Goreng",
    subcategory: "makanan",
    description: "Nasi goreng dengan potongan daging ayam",
  },
  {
    id: "4",
    name: "Nasgor Sosis",
    price: 12000,
    image: "https://images.unsplash.com/photo-1554080221-cbf573c5bfbe?w=400&h=300&fit=crop",
    category: "Special Nasi Goreng",
    subcategory: "makanan",
    description: "Nasi goreng dengan sosis premium",
  },
  {
    id: "5",
    name: "Nasgor Bakso",
    price: 13000,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
    category: "Special Nasi Goreng",
    subcategory: "makanan",
    description: "Nasi goreng dengan bakso daging sapi",
  },
  // Special Magelangan items
  {
    id: "6",
    name: "Nasgor Spesial",
    price: 16000,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561e1f?w=400&h=300&fit=crop",
    category: "Special Magelangan",
    subcategory: "makanan",
    description: "Nasi goreng premium dengan telur, ayam, dan udang",
  },
  {
    id: "7",
    name: "Nasgor Setan",
    price: 17000,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
    category: "Special Magelangan",
    subcategory: "makanan",
    description: "Nasi goreng super pedas dengan berbagai topping",
  },
  // Special Orak Arik items
  {
    id: "8",
    name: "Kwetiau Goreng",
    price: 10000,
    image: "https://images.unsplash.com/photo-1609501676725-7186f017a4b0?w=400&h=300&fit=crop",
    category: "Special Orak Arik",
    subcategory: "makanan",
    description: "Kwetiau goreng dengan cita rasa gurih",
  },
  {
    id: "9",
    name: "Mie Goreng",
    price: 9000,
    image: "https://images.unsplash.com/photo-1586190203849-168c5ce0f59a?w=400&h=300&fit=crop",
    category: "Special Omlet",
    subcategory: "makanan",
    description: "Mie goreng dengan telur dan sayuran",
  },
  // Soda items
  {
    id: "10",
    name: "Soda",
    price: 5000,
    image: "https://images.unsplash.com/photo-1554760294-cfb98c31f74b?w=400&h=300&fit=crop",
    category: "Soda",
    subcategory: "minuman",
    description: "Minuman soda dingin segar",
  },
  // Susu items
  {
    id: "11",
    name: "Susu Sirup",
    price: 10000,
    image: "https://images.unsplash.com/photo-1535638066928-ab7c9ab60908?w=400&h=300&fit=crop",
    category: "Susu",
    subcategory: "minuman",
    description: "Susu dengan sirup pilihan rasa",
  },
  {
    id: "11b",
    name: "Dancow Keju",
    price: 13000,
    image: "https://images.unsplash.com/photo-1535638066928-ab7c9ab60908?w=400&h=300&fit=crop",
    category: "Susu",
    subcategory: "minuman",
    description: "Susu Dancow rasa keju",
  },
  {
    id: "11c",
    name: "Dancow Putih",
    price: 13000,
    image: "https://images.unsplash.com/photo-1535638066928-ab7c9ab60908?w=400&h=300&fit=crop",
    category: "Susu",
    subcategory: "minuman",
    description: "Susu Dancow putih murni",
  },
  {
    id: "11d",
    name: "STMJ",
    price: 13000,
    image: "https://images.unsplash.com/photo-1535638066928-ab7c9ab60908?w=400&h=300&fit=crop",
    category: "Susu",
    subcategory: "minuman",
    description: "Susu STMJ premium",
  },
  {
    id: "11e",
    name: "Susu Jahe",
    price: 17000,
    image: "https://images.unsplash.com/photo-1535638066928-ab7c9ab60908?w=400&h=300&fit=crop",
    category: "Susu",
    subcategory: "minuman",
    description: "Susu hangat dengan jahe",
  },
  {
    id: "11f",
    name: "Susu Putih",
    price: 17000,
    image: "https://images.unsplash.com/photo-1535638066928-ab7c9ab60908?w=400&h=300&fit=crop",
    category: "Susu",
    subcategory: "minuman",
    description: "Susu putih segar",
  },
  {
    id: "11g",
    name: "Susu Coklat",
    price: 17000,
    image: "https://images.unsplash.com/photo-1535638066928-ab7c9ab60908?w=400&h=300&fit=crop",
    category: "Susu",
    subcategory: "minuman",
    description: "Susu coklat nikmat",
  },
  // Sirup items
  {
    id: "12",
    name: "Sirup",
    price: 4000,
    image: "https://images.unsplash.com/photo-1590080877613-bb5e10c5b3f6?w=400&h=300&fit=crop",
    category: "Sirup",
    subcategory: "minuman",
    description: "Minuman sirup beragam rasa",
  },
  // Kopi items
  {
    id: "13",
    name: "Kopi",
    price: 6000,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b3f3?w=400&h=300&fit=crop",
    category: "Kopi",
    subcategory: "minuman",
    description: "Kopi panas nikmat",
  },
  // Es Teh items
  {
    id: "14",
    name: "Es Teh",
    price: 6000,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    category: "Es Teh",
    subcategory: "minuman",
    description: "Es teh manis segar",
  },
  // More drinks
  {
    id: "15",
    name: "Milo",
    price: 16000,
    image: "https://images.unsplash.com/photo-1554760294-cfb98c31f74b?w=400&h=300&fit=crop",
    category: "Susu",
    subcategory: "minuman",
    description: "Milo coklat hangat",
  },
  {
    id: "16",
    name: "Hilo",
    price: 17000,
    image: "https://images.unsplash.com/photo-1554760294-cfb98c31f74b?w=400&h=300&fit=crop",
    category: "Susu",
    subcategory: "minuman",
    description: "Hilo nutrisi lengkap",
  },
  {
    id: "17",
    name: "Dancow Coklat",
    price: 12000,
    image: "https://images.unsplash.com/photo-1554760294-cfb98c31f74b?w=400&h=300&fit=crop",
    category: "Susu",
    subcategory: "minuman",
    description: "Dancow rasa coklat",
  },
];

export const categories: Category[] = [
  // Makanan section
  {
    id: "special-nasi-goreng",
    name: "Special Nasi Goreng",
    section: "makanan",
    icon: "🍚",
  },
  {
    id: "special-magelangan",
    name: "Special Magelangan",
    section: "makanan",
    icon: "🍜",
  },
  {
    id: "special-orak-arik",
    name: "Special Orak Arik",
    section: "makanan",
    icon: "🥘",
  },
  {
    id: "special-omlet",
    name: "Special Omlet",
    section: "makanan",
    icon: "🥞",
  },
  // Minuman section
  {
    id: "soda",
    name: "Soda",
    section: "minuman",
    icon: "🥤",
  },
  {
    id: "susu",
    name: "Susu",
    section: "minuman",
    icon: "🥛",
  },
  {
    id: "sirup",
    name: "Sirup",
    section: "minuman",
    icon: "🧃",
  },
  {
    id: "kopi",
    name: "Kopi",
    section: "minuman",
    icon: "☕",
  },
  {
    id: "es-teh",
    name: "Es Teh",
    section: "minuman",
    icon: "🧋",
  },
];
