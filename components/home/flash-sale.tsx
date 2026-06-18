"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Zap, ArrowRight, Star, CheckCircle2 } from "lucide-react";
import { Card, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const flashProducts = [
  {
    id: "flash-1",
    title: "HP Pavilion 15",
    brand: "HP",
    image: "/images/banners/banner-1.jpg",
    originalPrice: 58000,
    salePrice: 32999,
    discount: 43,
    rating: 4.5,
    specs: "i5 12th Gen / 8GB / 512GB",
  },
  {
    id: "flash-2",
    title: "Dell Inspiron 14",
    brand: "DELL",
    image: "/images/banners/banner-2.jpg",
    originalPrice: 52000,
    salePrice: 28999,
    discount: 44,
    rating: 4.3,
    specs: "i5 11th Gen / 8GB / 256GB",
  },
  {
    id: "flash-3",
    title: "Lenovo IdeaPad 3",
    brand: "LENOVO",
    image: "/images/banners/banner-3.jpg",
    originalPrice: 45000,
    salePrice: 24999,
    discount: 44,
    rating: 4.4,
    specs: "Ryzen 5 / 8GB / 512GB",
  },
  {
    id: "flash-4",
    title: "ASUS VivoBook 15",
    brand: "ASUS",
    image: "/images/banners/banner-4.jpg",
    originalPrice: 48000,
    salePrice: 26999,
    discount: 44,
    rating: 4.2,
    specs: "i5 11th Gen / 8GB / 512GB",
  },
  {
    id: "flash-5",
    title: "Acer Aspire 5",
    brand: "ACER",
    image: "/images/banners/banner-1.jpg",
    originalPrice: 42000,
    salePrice: 22999,
    discount: 45,
    rating: 4.1,
    specs: "i3 12th Gen / 8GB / 256GB",
  },
];

function useCountdown(endTime: Date) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const now = new Date().getTime();
      const diff = endTime.getTime() - now;
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  return timeLeft;
}

const formatInr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export function FlashSale() {
  // End time: 12 hours from now (resets on page load)
  const [endTime] = useState(() => new Date(Date.now() + 12 * 60 * 60 * 1000));
  const { hours, minutes, seconds } = useCountdown(endTime);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <section className="py-12 md:py-16" id="flash-sale">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Live</span>
            </div>
            <Zap className="h-5 w-5 text-amber-500 fill-amber-500" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Flash Sale</h2>
          <p className="text-gray-500 mt-1">Grab these deals before time runs out.</p>
        </div>

        {/* Countdown */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 font-medium mr-1">Ends in</span>
          {[
            { label: "Hrs", value: pad(hours) },
            { label: "Min", value: pad(minutes) },
            { label: "Sec", value: pad(seconds) },
          ].map((unit, i) => (
            <div key={unit.label} className="flex items-center gap-2">
              <div className="flex flex-col items-center">
                <span className="text-lg md:text-xl font-mono font-extrabold text-white bg-gray-900 rounded-lg px-3 py-1.5 min-w-[48px] text-center shadow-lg">
                  {unit.value}
                </span>
                <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">{unit.label}</span>
              </div>
              {i < 2 && <span className="text-xl font-bold text-gray-300 -mt-4">:</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Scrollable Cards styled like the shop page, but slightly smaller width */}
      <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
        {flashProducts.map((product) => {
          const savings = product.originalPrice - product.salePrice;
          
          return (
            <Card
              key={product.id}
              className="flex-shrink-0 w-[240px] md:w-[260px] snap-start overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 group border-muted"
            >
              <Link href="/shop" className="block aspect-[4/3] relative bg-gradient-to-b from-muted/50 to-muted p-4 cursor-pointer">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="260px"
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
                  {product.discount}% OFF
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
      <div className="flex justify-center mt-6">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors group"
        >
          View all deals
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
