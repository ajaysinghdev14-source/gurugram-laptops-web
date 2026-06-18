"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { ChevronRight, Star, ShoppingCart, Truck, ShieldCheck, CheckCircle2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductService } from "@/services/product.service";
import { useCartStore } from "@/store/cart.store";
import type { ShopProduct } from "../page";

const formatInr = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<ShopProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<Record<string, unknown> | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  
  const { addItem, setIsOpen, items, updateQuantity } = useCartStore();

  const handleAddToCart = async () => {
    if (!product) return;
    await addItem({
      productId: product.id,
      quantity: 1,
      variantName: selectedVariant?.name as string,
      product: product // pass populated product for local cart calculating total
    });
    setIsOpen(true);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await ProductService.getProductById(productId);
        
        // Map DB attributes [{key: "RAM", value: "16GB"}] to { ram: "16GB" }
        const raw = response.data as ShopProduct & { attributes: { key: string; value: string }[] };
        const attrObj: Record<string, string> = {};
        if (Array.isArray(raw.attributes)) {
          raw.attributes.forEach((attr) => {
            if (attr.key) attrObj[attr.key.toLowerCase()] = attr.value;
          });
        }

        const p: ShopProduct = { ...raw, attributes: attrObj };
        setProduct(p);
        if (Array.isArray(p.variants) && p.variants.length > 0) {
          setSelectedVariant(p.variants[0]);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-24 text-center">
        <h1 className="text-2xl font-semibold mb-4">Loading Product...</h1>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-24 text-center">
        <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">The product you are looking for does not exist or has been removed.</p>
        <Button render={<Link href="/shop" />}>
          Back to Shop
        </Button>
      </div>
    );
  }

  const activePrice = selectedVariant ? (selectedVariant.price as number) : product.basePrice;
  const activeOriginalPrice = selectedVariant ? (selectedVariant.originalPrice as number) : product.originalBasePrice;
  const savings = activeOriginalPrice - activePrice;
  const discountPercent = Math.round((savings / activeOriginalPrice) * 100);
  
  const mainImage = activeImage || product.images?.[0] || '/images/placeholder.png';

  // Merge variant-specific RAM & Storage into the base attributes for live spec display
  const activeAttributes: Record<string, string> = {
    ...product.attributes,
    ...(selectedVariant?.ram ? { ram: selectedVariant.ram as string } : {}),
    ...(selectedVariant?.storage ? { storage: selectedVariant.storage as string } : {}),
  };

  return (
    <div className="container mx-auto py-8">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-foreground font-medium">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square relative bg-gradient-to-b from-muted/50 to-muted rounded-2xl overflow-hidden border">
            <Image
              src={mainImage}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-8 mix-blend-multiply dark:mix-blend-normal"
              priority
            />
            {product.isRefurbished && (
              <Badge className="absolute top-4 left-4 shadow-sm bg-background/90 backdrop-blur-md text-foreground text-sm py-1 px-3 border-green-500/30" variant="outline">
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-green-500" />
                Refurbished {product.attributes.condition ? `— ${product.attributes.condition}` : 'Certified'}
              </Badge>
            )}
          </div>
          
          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {product.images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(img)}
                  className={`relative aspect-square w-24 rounded-lg overflow-hidden border-2 transition-all ${
                    (activeImage === img || (!activeImage && i === 0)) 
                      ? 'border-primary ring-2 ring-primary/20' 
                      : 'border-muted hover:border-primary/50'
                  }`}
                >
                  <div className="absolute inset-0 bg-muted" />
                  <Image
                    src={img}
                    alt={`${product.title} view ${i + 1}`}
                    fill
                    sizes="96px"
                    className="object-contain p-2 mix-blend-multiply dark:mix-blend-normal"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info & Actions */}
        <div className="flex flex-col">
          
          <div className="mb-2">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">{product.brand}</span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-1 mb-3">{product.title}</h1>
            
            <div className="flex items-center gap-4">
              {(product.rating || 0) > 0 && (
                <div className="flex items-center gap-1.5">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? "fill-amber-500 text-amber-500" : "fill-muted text-muted"}`} />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{product.rating} Rating</span>
                  <span className="text-muted-foreground text-sm">(128 Reviews)</span>
                </div>
              )}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Pricing Block */}
          <div className="mb-8">
            <div className="flex items-end gap-3 mb-1">
              <span className="text-4xl font-extrabold tracking-tight">{formatInr(activePrice)}</span>
              {discountPercent > 0 && (
                <span className="text-xl text-muted-foreground line-through mb-1">{formatInr(activeOriginalPrice)}</span>
              )}
            </div>
            {discountPercent > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none px-2 py-0.5 rounded-sm">
                  Save {formatInr(savings)}
                </Badge>
                <span className="text-sm text-green-600 font-semibold">{discountPercent}% OFF</span>
              </div>
            )}
            <p className="text-sm text-muted-foreground mt-2">Inclusive of all taxes</p>
          </div>

          {/* Variant Selector */}
          {(product.variants?.length ?? 0) > 0 && (
            <div className="mb-8 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Select Option</h3>
                <span className="text-sm font-medium text-primary">{selectedVariant?.name as string}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {product.variants?.map((variant) => (
                  <button
                    key={variant.id as string}
                    onClick={() => setSelectedVariant(variant)}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                      selectedVariant?.id === variant.id 
                        ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-sm' 
                        : 'border-muted hover:border-primary/30 hover:bg-muted/30'
                    }`}
                  >
                    <div className="font-medium mb-1">{variant.name as string}</div>
                    <div className="text-sm text-muted-foreground">{formatInr(variant.price as number)}</div>
                    {selectedVariant?.id === variant.id && (
                      <CheckCircle2 className="absolute top-4 right-4 w-5 h-5 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dynamic JSONB Key Features Snippet */}
          <div className="mb-8 space-y-3">
            <h3 className="font-semibold">Key Specifications</h3>
            <div className="grid grid-cols-2 gap-y-3 gap-x-6">
              {Object.entries(activeAttributes).slice(0, 4).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <span className="text-xs text-muted-foreground capitalize">{key}</span>
                  <span className="text-sm font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator className="mb-8" />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {(() => {
              const cartItem = items.find(i => i.productId === product?.id && i.variantName === (selectedVariant?.name as string | undefined));
              if (cartItem) {
                return (
                  <div className="flex-1 flex items-center justify-between border-2 rounded-md h-14">
                    <Button variant="ghost" className="h-full w-14 rounded-none hover:bg-muted" onClick={() => updateQuantity(cartItem.id!, cartItem.quantity - 1)}>
                      <Minus className="h-5 w-5" />
                    </Button>
                    <span className="text-xl font-semibold w-14 text-center">{cartItem.quantity}</span>
                    <Button variant="ghost" className="h-full w-14 rounded-none hover:bg-muted" onClick={() => updateQuantity(cartItem.id!, cartItem.quantity + 1)}>
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                );
              }
              return (
                <Button size="lg" className="flex-1 text-base h-14" disabled={!product?.inStock} onClick={handleAddToCart}>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
              );
            })()}
            <Button size="lg" variant="secondary" className="flex-1 text-base h-14" disabled={!product?.inStock}>
              Buy Now
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full text-primary">
                <Truck className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Free Delivery</span>
                <span className="text-xs text-muted-foreground">Within 2-4 Days</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full text-primary">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">1 Year Warranty</span>
                <span className="text-xs text-muted-foreground">Brand Authorized</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Tabs Section for Deep Details */}
      <Tabs defaultValue="specs" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-8 overflow-x-auto no-scrollbar">
          <TabsTrigger value="specs" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-8 py-3 font-medium">Full Specifications</TabsTrigger>
          <TabsTrigger value="desc" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-8 py-3 font-medium">Description</TabsTrigger>
          <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-8 py-3 font-medium">Reviews (128)</TabsTrigger>
        </TabsList>
        
        <TabsContent value="specs" className="animate-in fade-in-50 duration-500">
          <div className="max-w-3xl">
            <h3 className="text-xl font-bold mb-6">Technical Specifications</h3>
            <div className="rounded-xl border overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(activeAttributes).map(([key, value], index) => (
                    <tr key={key} className={`${index % 2 === 0 ? 'bg-muted/30' : 'bg-background'} border-b last:border-0`}>
                      <td className="py-4 px-6 font-medium text-muted-foreground w-1/3 capitalize">{key}</td>
                      <td className="py-4 px-6 font-semibold">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="desc" className="animate-in fade-in-50 duration-500">
          <div className="prose prose-sm dark:prose-invert max-w-3xl">
            <p className="text-lg leading-relaxed text-muted-foreground">
              Experience unparalleled performance and reliability with the {product.title}. 
              Whether you are a power user, a creative professional, or someone who needs seamless multitasking, 
              this device is engineered to exceed expectations.
            </p>
            {product.isRefurbished && (
              <div className="mt-8 p-6 bg-muted rounded-xl">
                <h4 className="font-semibold mb-2 flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-500" />
                  Why buy Refurbished?
                </h4>
                <p className="text-sm text-muted-foreground">
                  Our rigorous refurbishment process ensures every device meets strictly defined quality standards before it leaves our facility. 
                  You get the same premium experience as a new device, complete with warranty, but at a fraction of the cost.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="animate-in fade-in-50 duration-500">
          <div className="flex items-center justify-center py-24 border rounded-xl bg-muted/10">
            <p className="text-muted-foreground">Reviews integration coming soon in Phase 3!</p>
          </div>
        </TabsContent>
      </Tabs>

    </div>
  );
}
