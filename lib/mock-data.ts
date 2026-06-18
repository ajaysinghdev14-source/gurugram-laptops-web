export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  title: string;
  category: "Laptops" | "Peripherals" | "Converters";
  subcategory: string;
  brand: string;
  image: string;
  rating: number; // 0 for no rating
  tags: string[];
  isRefurbished: boolean;
  basePrice: number;
  originalBasePrice: number;
  inStock: boolean;
  attributes: Record<string, string>; // Dynamic JSONB equivalent
  variants: ProductVariant[];
}

export const MOCK_PRODUCTS: Product[] = [
  // Laptops
  {
    id: "1",
    title: "MacBook Pro 16-inch (M2 Max)",
    category: "Laptops",
    subcategory: "Ultrabook",
    brand: "Apple",
    image: "/images/laptop_macbook_pro_1780075765976.png",
    rating: 4.8,
    tags: ["Premium Experience", "Video Editing", "Power User"],
    isRefurbished: true,
    basePrice: 189999,
    originalBasePrice: 249900,
    inStock: true,
    attributes: { processor: "Apple M2 Max", ram: "16GB", storage: "512GB SSD", screenSize: "16 inch", os: "macOS", condition: "Superb" },
    variants: [
      { id: "v10", name: "16 GB / 512 GB SSD", price: 189999, originalPrice: 249900, inStock: true },
      { id: "v11", name: "32 GB / 1 TB SSD", price: 239999, originalPrice: 299900, inStock: true },
      { id: "v12", name: "64 GB / 2 TB SSD", price: 319999, originalPrice: 389900, inStock: true },
    ]
  },
  {
    id: "2",
    title: "Alienware m15 R7 Gaming Laptop",
    category: "Laptops",
    subcategory: "Gaming Laptop",
    brand: "Dell",
    image: "/images/laptop_gaming_1780075804675.png",
    rating: 4.5,
    tags: ["Gaming", "Power User"],
    isRefurbished: true,
    basePrice: 125000,
    originalBasePrice: 180000,
    inStock: true,
    attributes: { processor: "AMD Ryzen 7", ram: "16GB", storage: "1TB NVMe", screenSize: "15.6 inch", os: "Windows 11 Home", condition: "Good" },
    variants: [
      { id: "v13", name: "16 GB / 512 GB SSD", price: 125000, originalPrice: 180000, inStock: true },
      { id: "v14", name: "16 GB / 1 TB SSD", price: 135000, originalPrice: 195000, inStock: true },
    ]
  },
  
  // Peripherals - Casings
  {
    id: "3",
    title: "Hardisk Casing 2.0",
    category: "Peripherals",
    subcategory: "Casings",
    brand: "Generic",
    image: "/images/laptop_thinkpad_1780075781346.png", // Using placeholder image for now
    rating: 3.9,
    tags: ["Storage", "Accessories"],
    isRefurbished: false,
    basePrice: 120,
    originalBasePrice: 150,
    inStock: true,
    attributes: { material: "Plastic", interface: "USB 2.0" },
    variants: [
      { id: "v1", name: "Normal", price: 120, originalPrice: 150, inStock: true },
      { id: "v2", name: "Adnet", price: 150, originalPrice: 200, inStock: true }
    ]
  },
  {
    id: "4",
    title: "Hardisk Casing 3.0",
    category: "Peripherals",
    subcategory: "Casings",
    brand: "Generic",
    image: "/images/laptop_thinkpad_1780075781346.png", // Using placeholder image for now
    rating: 4.6,
    tags: ["Storage", "High Speed"],
    isRefurbished: false,
    basePrice: 180,
    originalBasePrice: 250,
    inStock: true,
    attributes: { material: "Aluminum", interface: "USB 3.0" },
    variants: [
      { id: "v3", name: "Normal", price: 180, originalPrice: 250, inStock: true },
      { id: "v4", name: "Adnet", price: 200, originalPrice: 300, inStock: true }
    ]
  },
  {
    id: "5",
    title: "Hardisk Casing Desktop",
    category: "Peripherals",
    subcategory: "Casings",
    brand: "Adnet",
    image: "/images/laptop_gaming_1780075804675.png",
    rating: 0,
    tags: ["Storage", "Desktop"],
    isRefurbished: false,
    basePrice: 500,
    originalBasePrice: 700,
    inStock: true,
    attributes: { material: "Steel", size: "3.5 inch" },
    variants: []
  },

  // Peripherals - Mouse Pads
  {
    id: "6",
    title: "Premium Gaming Mouse Pad",
    category: "Peripherals",
    subcategory: "Mouse Pads",
    brand: "Razer",
    image: "/images/laptop_macbook_pro_1780075765976.png",
    rating: 4.9,
    tags: ["Gaming", "Accessories"],
    isRefurbished: false,
    basePrice: 500,
    originalBasePrice: 999,
    inStock: true,
    attributes: { material: "Cloth/Rubber", thickness: "4mm" },
    variants: [
      { id: "v5", name: "Medium (300x250)", price: 500, originalPrice: 999, inStock: true },
      { id: "v6", name: "Large (450x400)", price: 800, originalPrice: 1499, inStock: true },
      { id: "v7", name: "Extended (900x400)", price: 1500, originalPrice: 2499, inStock: true }
    ]
  }
];
