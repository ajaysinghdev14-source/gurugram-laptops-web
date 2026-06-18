"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ShoppingCart,
  Filter,
  Star,
  CheckCircle2,
  ChevronRight,
  Plus,
  Minus
} from "lucide-react";
import { ProductService } from "@/services/product.service";
import { useCartStore } from "@/store/cart.store";

export interface ShopProduct {
  id: string;
  title: string;
  brand: string;
  category: string;
  subcategory: string;
  images: string[];
  basePrice: number;
  originalBasePrice: number;
  inStock: boolean;
  isRefurbished: boolean;
  rating?: number;
  tags?: string[];
  enableVariants: boolean;
  attributes: Record<string, string>;
  variants?: { id?: string; name: string; price: number; originalPrice?: number; inStock?: boolean; }[];
}

// Extracted unique filter options based on the active category
const CATEGORIES = ["All", "Laptops", "Peripherals", "Converters"];

const formatInr = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [priceRange, setPriceRange] = useState<number[]>([100, 200000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const { addItem, setIsOpen, items, updateQuantity } = useCartStore();

  const handleAddToCart = async (product: ShopProduct) => {
    await addItem({
      productId: product.id,
      quantity: 1,
      variantName: product.variants?.[0]?.name,
      product: product
    });
    setIsOpen(true);
  };
  
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await ProductService.getAllProducts();
        
        // Map DB attributes [{key: "RAM", value: "16GB"}] to { ram: "16GB" }
        const mappedProducts = (response.data as (ShopProduct & { attributes: { key: string; value: string }[] })[]).map(p => {
          const attrObj: Record<string, string> = {};
          if (Array.isArray(p.attributes)) {
            p.attributes.forEach((attr) => {
              if (attr.key) attrObj[attr.key.toLowerCase()] = attr.value;
            });
          }
          return { ...p, attributes: attrObj } as ShopProduct;
        });
        
        setProducts(mappedProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Dynamic JSONB attributes filters
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSubcats, setSelectedSubcats] = useState<string[]>([]);
  const [selectedRam, setSelectedRam] = useState<string[]>([]);

  const toggleArrayItem = (
    arr: string[],
    item: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setter(arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Base filters
      if (activeCategory !== "All" && product.category !== activeCategory)
        return false;
      if (
        product.basePrice < priceRange[0] ||
        product.basePrice > priceRange[1]
      )
        return false;
      if (inStockOnly && !product.inStock) return false;

      // Dynamic filters
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand))
        return false;
      if (
        selectedSubcats.length > 0 &&
        !selectedSubcats.includes(product.subcategory)
      )
        return false;

      // JSONB attribute filters (e.g., RAM only applies if product has RAM)
      if (
        selectedRam.length > 0 &&
        (!product.attributes.ram ||
          !selectedRam.includes(product.attributes.ram))
      )
        return false;

      return true;
    });
  }, [
    activeCategory,
    priceRange,
    inStockOnly,
    selectedBrands,
    selectedSubcats,
    selectedRam,
    products,
  ]);

  // Dynamically calculate what filter options to show based on the current active Category!
  const availableBrands = Array.from(
    new Set(
      products.filter(
        (p) => activeCategory === "All" || p.category === activeCategory,
      ).map((p) => p.brand),
    ),
  );
  const availableSubcats = Array.from(
    new Set(
      products.filter(
        (p) => activeCategory === "All" || p.category === activeCategory,
      ).map((p) => p.subcategory),
    ),
  );

  // Only calculate RAM options if we are looking at Laptops (or All)
  const availableRam = Array.from(
    new Set(
      products.filter(
        (p) =>
          (activeCategory === "All" || p.category === "Laptops") &&
          p.attributes.ram,
      ).map((p) => p.attributes.ram),
    ),
  );

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 shrink-0 space-y-8">
          {/* CATEGORY SELECTOR (The Master Switch) */}
          <div className="space-y-3 bg-muted/50 p-4 rounded-xl border">
            <h3 className="font-semibold text-lg uppercase tracking-wide">
              Category
            </h3>
            <div className="flex flex-col gap-2">
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? "default" : "ghost"}
                  className="justify-start w-full"
                  onClick={() => {
                    setActiveCategory(cat);
                    // Reset sub-filters when changing master category
                    setSelectedSubcats([]);
                    setSelectedBrands([]);
                    setSelectedRam([]);
                  }}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4 px-2">
            <h3 className="font-semibold text-sm uppercase text-muted-foreground">
              Availability
            </h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="instock"
                checked={inStockOnly}
                onCheckedChange={(val) => setInStockOnly(!!val)}
              />
              <label
                htmlFor="instock"
                className="text-sm font-medium leading-none"
              >
                In Stock Only
              </label>
            </div>
          </div>

          <div className="space-y-4 px-2">
            <h3 className="font-semibold text-sm uppercase text-muted-foreground">
              Price Range
            </h3>
            <Slider
              value={priceRange}
              onValueChange={(val) => setPriceRange(val as number[])}
              max={250000}
              min={100}
              step={100}
              className="mt-6"
            />
            <div className="flex justify-between text-sm font-medium mt-2">
              <span>{formatInr(priceRange[0])}</span>
              <span>{formatInr(priceRange[1])}</span>
            </div>
          </div>

          {/* DYNAMIC FILTER BLOCKS */}
          <div className="px-2 space-y-8">
            {availableSubcats.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-sm uppercase text-muted-foreground">
                  Product Type
                </h3>
                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2 no-scrollbar">
                  {availableSubcats.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`filter-subcat-${option}`}
                        checked={selectedSubcats.includes(option)}
                        onCheckedChange={() =>
                          toggleArrayItem(
                            selectedSubcats,
                            option,
                            setSelectedSubcats,
                          )
                        }
                      />
                      <label
                        htmlFor={`filter-subcat-${option}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {availableBrands.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-sm uppercase text-muted-foreground">
                  Brand
                </h3>
                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2 no-scrollbar">
                  {availableBrands.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`filter-brand-${option}`}
                        checked={selectedBrands.includes(option)}
                        onCheckedChange={() =>
                          toggleArrayItem(
                            selectedBrands,
                            option,
                            setSelectedBrands,
                          )
                        }
                      />
                      <label
                        htmlFor={`filter-brand-${option}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* This filter ONLY shows up if there are laptops in the current view! */}
            {availableRam.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-sm uppercase text-muted-foreground">
                  RAM (Laptops Only)
                </h3>
                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2 no-scrollbar">
                  {availableRam.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`filter-ram-${option}`}
                        checked={selectedRam.includes(option)}
                        onCheckedChange={() =>
                          toggleArrayItem(selectedRam, option, setSelectedRam)
                        }
                      />
                      <label
                        htmlFor={`filter-ram-${option}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Product Grid */}
        <main className="flex-1">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {activeCategory === "All" ? "All Products" : activeCategory}
              </h1>
              <p className="text-muted-foreground mt-1">
                Discover premium tech gear and accessories.
              </p>
            </div>
            <Badge variant="secondary" className="px-4 py-1.5 text-sm w-fit">
              {filteredProducts.length} Products Found
            </Badge>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 text-center border rounded-lg bg-muted/20">
              <h3 className="text-xl font-semibold mb-2">Loading products...</h3>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center border rounded-lg bg-muted/20">
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters to find what you re looking for.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const savings = product.originalBasePrice - product.basePrice;
                const discountPercent = Math.round(
                  (savings / product.originalBasePrice) * 100,
                );
                const hasVariants = product.enableVariants && Array.isArray(product.variants) && product.variants.length > 0;
                const cartItem = items.find(i => i.productId === product.id && i.variantName === product.variants?.[0]?.name);

                return (
                  <Card
                    key={product.id}
                    className="overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 group border-muted"
                  >
                    <Link href={`/shop/${product.id}`} className="block aspect-[4/3] relative bg-gradient-to-b from-muted/50 to-muted p-6 cursor-pointer">
                      <Image
                        src={product.images?.[0] || '/images/placeholder.png'}
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-contain p-4 mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Top Left: Condition Badge */}
                      {product.isRefurbished && (
                        <Badge
                          className="absolute top-3 left-3 shadow-sm bg-background/90 backdrop-blur-md text-foreground border-border"
                          variant="outline"
                        >
                          <CheckCircle2 className="w-3 h-3 mr-1 text-green-500" />
                          Refurbished
                        </Badge>
                      )}

                      {/* Top Right: Rating */}
                      {(product.rating || 0) > 0 && (
                        <Badge className="absolute top-3 right-3 shadow-sm bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">
                          <Star className="w-3 h-3 mr-1 fill-amber-500 text-amber-500" />
                          {product.rating}
                        </Badge>
                      )}

                      {/* Bottom Left: Discount Tag */}
                      {discountPercent > 0 && (
                        <div className="absolute bottom-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                          {discountPercent}% OFF
                        </div>
                      )}
                    </Link>

                    <CardHeader className="p-4 flex-1">
                      <div className="mb-2">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {product.brand}
                        </span>
                        <Link href={`/shop/${product.id}`}>
                          <CardTitle className="line-clamp-2 text-lg mt-1 leading-tight group-hover:text-primary transition-colors cursor-pointer hover:underline">
                            {product.title}
                          </CardTitle>
                        </Link>
                      </div>

                      {/* DYNAMIC ATTRIBUTES (JSONB visualization) */}
                      <CardDescription className="flex items-center gap-1.5 flex-wrap text-xs mt-2">
                        {Object.entries(product.attributes)
                          .slice(0, 3)
                          .map(([key, value]) => (
                            <span
                              key={key}
                              className="bg-muted/50 border px-2 py-0.5 rounded-sm"
                            >
                              <span className="text-muted-foreground capitalize mr-1">
                                {key}:
                              </span>
                              {value}
                            </span>
                          ))}
                      </CardDescription>

                      {/* Tags */}
                      {product.tags && product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {product.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0 font-normal"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardHeader>

                    <CardFooter className="p-4 pt-0 flex flex-col gap-3">
                      <div className="flex items-end justify-between w-full">
                        <div className="flex flex-col">
                          {hasVariants && (
                            <span className="text-xs text-muted-foreground mb-1">
                              Starts at
                            </span>
                          )}
                          <span className="text-2xl font-bold leading-none">
                            {formatInr(product.basePrice)}
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground line-through">
                              {formatInr(product.originalBasePrice)}
                            </span>
                            <span className="text-xs text-green-600 font-medium">
                              Save {formatInr(savings)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Variant Handling Button */}
                      {hasVariants ? (
                        <Button
                          className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          disabled={!product.inStock} render={<Link href={`/shop/${product.id}`} />}
                        >
                          <Filter className="w-4 h-4 mr-2" />
                          Choose Options
                        </Button>
                      ) : (
                        cartItem ? (
                          <div className="flex items-center justify-between border rounded-md h-10 w-full">
                            <Button variant="ghost" size="icon" className="h-full w-10 rounded-none" onClick={() => updateQuantity(cartItem.id!, cartItem.quantity - 1)}>
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-10 text-center font-medium">{cartItem.quantity}</span>
                            <Button variant="ghost" size="icon" className="h-full w-10 rounded-none" onClick={() => updateQuantity(cartItem.id!, cartItem.quantity + 1)}>
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            className="w-full" 
                            disabled={!product.inStock}
                            onClick={() => handleAddToCart(product)}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            {product.inStock ? "Add to Cart" : "Out of Stock"}
                          </Button>
                        )
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
