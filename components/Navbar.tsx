"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { User, LogOut, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { CartDrawer } from '@/components/cart-drawer';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export function Navbar() {
  const { user, isInitialized, logout } = useAuthStore();
  const { setIsOpen, items } = useCartStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    toast.success("Successfully logged out");
    router.push("/login");
  };

  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* Left Side: Logo & Main Navigation */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold tracking-tight">
            TechReborn
          </Link>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink render={<Link href="/" />} className={navigationMenuTriggerStyle()}>
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink render={<Link href="/shop" />} className={navigationMenuTriggerStyle()}>
                  Shop Laptops
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink render={<Link href="/about" />} className={navigationMenuTriggerStyle()}>
                  About Us
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink render={<Link href="/contact" />} className={navigationMenuTriggerStyle()}>
                  Contact
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right Side: Auth State & Cart */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative rounded-full" onClick={() => setIsOpen(true)}>
            <ShoppingCart className="h-5 w-5" />
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {items.length}
              </span>
            )}
          </Button>

          {!isInitialized ? (
            <div className="h-9 w-24 animate-pulse bg-muted rounded-full"></div>
          ) : user ? (
            <div className="flex items-center gap-4">
              {user.role === 'ADMIN' && (
                <Link href="/admin">
                  <Button variant="outline" className="gap-2 rounded-full border-primary/20 hover:bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider">
                    Admin Portal
                  </Button>
                </Link>
              )}
              <Link href="/profile">
                <Button variant="ghost" className="gap-2 rounded-full font-medium">
                  <User className="h-4 w-4" />
                  My Account
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout" className="hover:bg-red-50 hover:text-red-600 rounded-full">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Sign In
              </Link>
              <Link href="/signup">
                <Button className="rounded-full px-6 shadow-sm">Get Started</Button>
              </Link>
            </div>
          )}
        </div>

      </div>
      <CartDrawer />
    </nav>
  );
}
