"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ArrowRight, CheckCircle2 } from "lucide-react";
import { Card, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const formatInr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

type BudgetTab = "under20k" | "under25k" | "under35k";

const budgetTabs: { key: BudgetTab; label: string; maxPrice: number }[] = [
  { key: "under20k", label: "Under ₹20,000", maxPrice: 20000 },
  { key: "under25k", label: "Under ₹25,000", maxPrice: 25000 },
  { key: "under35k", label: "Under ₹35,000", maxPrice: 35000 },
];

const budgetProducts: Record<BudgetTab, Array<{
  id: string;
  title: string;
  brand: string;
  image: string;
  originalPrice: number;
  salePrice: number;
  rating: number;
  specs: string;
}>> = {
  under20k: [
    { id: "b1", title: "Acer Aspire 3", brand: "Acer", image: "/images/banners/banner-1.jpg", originalPrice: 32000, salePrice: 17999, rating: 4.0, specs: "i3 10th Gen / 4GB / 256GB" },
    { id: "b2", title: "Lenovo V14", brand: "Lenovo", image: "/images/banners/banner-2.jpg", originalPrice: 30000, salePrice: 15999, rating: 3.9, specs: "i3 10th Gen / 4GB / 256GB" },
    { id: "b3", title: "HP 245 G7", brand: "HP", image: "/images/banners/banner-3.jpg", originalPrice: 28000, salePrice: 14999, rating: 4.1, specs: "Ryzen 3 / 4GB / 256GB" },
    { id: "b4", title: "Dell Vostro 14", brand: "Dell", image: "/images/banners/banner-4.jpg", originalPrice: 35000, salePrice: 18999, rating: 4.2, specs: "i3 11th Gen / 4GB / 256GB" },
  ],
  under25k: [
    { id: "b5", title: "HP Pavilion x360", brand: "HP", image: "/images/banners/banner-2.jpg", originalPrice: 45000, salePrice: 23999, rating: 4.3, specs: "i5 11th Gen / 8GB / 256GB" },
    { id: "b6", title: "Lenovo IdeaPad Slim 3", brand: "Lenovo", image: "/images/banners/banner-3.jpg", originalPrice: 40000, salePrice: 21999, rating: 4.4, specs: "Ryzen 5 / 8GB / 512GB" },
    { id: "b7", title: "ASUS VivoBook 14", brand: "ASUS", image: "/images/banners/banner-4.jpg", originalPrice: 42000, salePrice: 22999, rating: 4.2, specs: "i5 10th Gen / 8GB / 256GB" },
    { id: "b8", title: "Acer Swift 3", brand: "Acer", image: "/images/banners/banner-1.jpg", originalPrice: 48000, salePrice: 24999, rating: 4.5, specs: "Ryzen 5 / 8GB / 512GB" },
  ],
  under35k: [
    { id: "b9", title: "Dell Latitude 5420", brand: "Dell", image: "/images/banners/banner-4.jpg", originalPrice: 65000, salePrice: 32999, rating: 4.6, specs: "i5 12th Gen / 16GB / 512GB" },
    { id: "b10", title: "HP EliteBook 840", brand: "HP", image: "/images/banners/banner-1.jpg", originalPrice: 70000, salePrice: 34999, rating: 4.7, specs: "i7 11th Gen / 16GB / 512GB" },
    { id: "b11", title: "Lenovo ThinkPad L14", brand: "Lenovo", image: "/images/banners/banner-2.jpg", originalPrice: 60000, salePrice: 29999, rating: 4.5, specs: "i5 11th Gen / 8GB / 512GB" },
    { id: "b12", title: "ASUS ZenBook 14", brand: "ASUS", image: "/images/banners/banner-3.jpg", originalPrice: 58000, salePrice: 33999, rating: 4.4, specs: "Ryzen 7 / 16GB / 512GB" },
  ],
};

export function BudgetCategories() {
  const [activeTab, setActiveTab] = useState<BudgetTab>("under20k");
  const products = budgetProducts[activeTab];

  return (
    <section className="py-12 md:py-16" id="budget-categories">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
          Laptops by Budget
        </h2>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          Find the perfect laptop that fits your pocket. Quality guaranteed.
        </p>
      </div>

      {/* Tab Pills */}
      <div className="flex justify-center gap-2 md:gap-3 mb-10">
        {budgetTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
              activeTab === tab.key
                ? "bg-gray-900 text-white shadow-lg shadow-gray-900/20 scale-105"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => {
          const savings = product.originalPrice - product.salePrice;
          const discountPercent = Math.round((savings / product.originalPrice) * 100);

          return (
            <Card
              key={product.id}
              className="overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 group border-muted"
            >
              <Link href="/shop" className="block aspect-[4/3] relative bg-gradient-to-b from-muted/50 to-muted p-4 cursor-pointer">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-contain p-4 mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500"
                />

                {/* Top Left: Condition Badge */}
                <Badge
                  className="absolute top-2 left-2 shadow-sm bg-background/90 backdrop-blur-md text-foreground border-border text-[10px] px-1.5 py-0"
                  variant="outline"
                >
                  <CheckCircle2 className="w-3 h-3 mr-1 text-green-500" />
                  Refurbished
                </Badge>

                {/* Top Right: Rating */}
                <Badge className="absolute top-2 right-2 shadow-sm bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100 text-[10px] px-1.5 py-0">
                  <Star className="w-3 h-3 mr-1 fill-amber-500 text-amber-500" />
                  {product.rating}
                </Badge>

                {/* Bottom Left: Discount Tag */}
                <div className="absolute bottom-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                  {discountPercent}% OFF
                </div>
              </Link>

              <CardHeader className="p-3 flex-1">
                <div className="mb-1">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {product.brand}
                  </span>
                  <Link href="/shop">
                    <CardTitle className="line-clamp-2 text-sm mt-0.5 leading-tight group-hover:text-primary transition-colors cursor-pointer hover:underline">
                      {product.title}
                    </CardTitle>
                  </Link>
                </div>

                <CardDescription className="flex items-center gap-1 flex-wrap text-[10px] mt-1">
                  <span className="bg-muted/50 border px-1.5 py-0.5 rounded-sm">
                    {product.specs}
                  </span>
                </CardDescription>
              </CardHeader>

              <CardFooter className="p-3 pt-0 flex flex-col gap-2">
                <div className="flex items-end justify-between w-full">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold leading-none">
                      {formatInr(product.salePrice)}
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] text-muted-foreground line-through">
                        {formatInr(product.originalPrice)}
                      </span>
                      <span className="text-[10px] text-green-600 font-medium">
                        Save {formatInr(savings)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* View All */}
      <div className="flex justify-center mt-8">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white font-semibold text-sm hover:bg-gray-800 hover:shadow-lg transition-all duration-300 group"
        >
          Browse All Laptops
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
