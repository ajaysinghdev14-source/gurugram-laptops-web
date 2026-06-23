"use client";

import { useState } from "react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { User, LogOut, ShoppingCart, Menu, X, Laptop } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { CartDrawer } from '@/components/cart-drawer';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop Laptops" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const { user, isInitialized, logout } = useAuthStore();
  const { setIsOpen, items } = useCartStore();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Successfully logged out");
    router.push("/login");
  };

  return (
    <nav className="border-b border-border/50 bg-background/95 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* Left Side: Logo & Desktop Navigation */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
              <Laptop className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-heading font-bold tracking-tight">TechReborn</span>
          </Link>

          {/* Desktop Nav Links (hidden on mobile) */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <NavigationMenuLink render={<Link href={link.href} />} className={navigationMenuTriggerStyle()}>
                    {link.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right Side: Cart + Auth + Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Cart — always visible */}
          <Button variant="ghost" size="icon" className="relative rounded-full" onClick={() => setIsOpen(true)}>
            <ShoppingCart className="h-5 w-5" />
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {items.length}
              </span>
            )}
          </Button>

          {/* Desktop Auth Buttons (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-4">
            {!isInitialized ? (
              <div className="h-9 w-24 animate-pulse bg-muted rounded-full"></div>
            ) : user ? (
              <div className="flex items-center gap-3">
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
                <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout" className="hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Sign In
                </Link>
                <Link href="/signup">
                  <Button className="rounded-full px-6 shadow-sm hover:shadow-md hover:shadow-primary/20 transition-all">Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Menu (visible only on mobile) */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger 
              render={
                <Button variant="ghost" size="icon" className="md:hidden rounded-full" />
              }
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-4 border-b border-border/50">
                  <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                      <Laptop className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span className="text-lg font-heading font-bold tracking-tight">TechReborn</span>
                  </Link>
                </div>

                {/* Mobile Nav Links */}
                <div className="flex-1 overflow-y-auto py-4">
                  <div className="flex flex-col gap-1 px-3">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-accent transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="mx-6 my-4 border-t border-border/50" />

                  {/* Mobile Auth Section */}
                  <div className="flex flex-col gap-1 px-3">
                    {!isInitialized ? (
                      <div className="px-4 py-3">
                        <div className="h-9 w-full animate-pulse bg-muted rounded-lg"></div>
                      </div>
                    ) : user ? (
                      <>
                        {/* User Info */}
                        <div className="px-4 py-3 mb-1">
                          <p className="text-sm font-medium">{user.fullName || 'User'}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                        {user.role === 'ADMIN' && (
                          <Link href="/admin" onClick={() => setMobileOpen(false)}>
                            <div className="flex items-center px-4 py-3 rounded-lg text-sm font-medium text-primary hover:bg-primary/5 transition-colors">
                              Admin Portal
                            </div>
                          </Link>
                        )}
                        <Link href="/profile" onClick={() => setMobileOpen(false)}>
                          <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-accent transition-colors">
                            <User className="h-4 w-4" />
                            My Account
                          </div>
                        </Link>
                        <button
                          onClick={() => { handleLogout(); setMobileOpen(false); }}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full text-left"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col gap-2 px-3">
                        <Link href="/login" onClick={() => setMobileOpen(false)}>
                          <Button variant="outline" className="w-full rounded-lg">Sign In</Button>
                        </Link>
                        <Link href="/signup" onClick={() => setMobileOpen(false)}>
                          <Button className="w-full rounded-lg">Get Started</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
      <CartDrawer />
    </nav>
  );
}
