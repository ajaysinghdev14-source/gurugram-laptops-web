"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const brands = [
  {
    name: "Apple",
    image: "/images/shop-by-company-name/apple.png",
    discount: "Up to 50% Off",
    slug: "apple",
    bgColor: "bg-blue-50",
    accentColor: "from-blue-600 to-blue-400",
  },
  {
    name: "Dell",
    image: "/images/shop-by-company-name/dell.png",
    discount: "Up to 40% Off",
    slug: "dell",
    bgColor: "bg-amber-50",
    accentColor: "from-amber-600 to-amber-400",
  },
  {
    name: "HP",
    image: "/images/shop-by-company-name/hp.png",
    discount: "Up to 45% Off",
    slug: "hp",
    bgColor: "bg-sky-50",
    accentColor: "from-sky-600 to-sky-400",
  },
  {
    name: "ASUS",
    image: "/images/shop-by-company-name/asus.png",
    discount: "Up to 35% Off",
    slug: "asus",
    bgColor: "bg-rose-50",
    accentColor: "from-rose-600 to-rose-400",
  },
];

export function ShopByBrand() {
  return (
    <section className="py-12 md:py-16" id="shop-by-brand">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
          Shop by Brand
        </h2>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          Choose your favorite brand and explore exclusive refurbished deals.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {brands.map((brand) => (
          <Link
            key={brand.name}
            href={`/shop?brand=${brand.slug}`}
            className="group relative block overflow-hidden rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
          >
            {/* Image Container */}
            <div className={`relative aspect-square ${brand.bgColor} overflow-hidden`}>
              <Image
                src={brand.image}
                alt={`Shop ${brand.name} laptops`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 50vw, 25vw"
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
            </div>

            {/* Bottom info bar */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 via-black/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-lg">{brand.name}</h3>
                  <p className="text-white/80 text-xs">{brand.discount}</p>
                </div>
                <div className="h-9 w-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <ArrowRight className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
