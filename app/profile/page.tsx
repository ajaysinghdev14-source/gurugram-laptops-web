"use client";

import { useState } from "react";
import { UserCircle, Package, MapPin, ChevronRight, LogOut, Shield } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { AccountDetails } from "@/components/profile/account-details";
import { MyOrders } from "@/components/profile/my-orders";
import { MyAddresses } from "@/components/profile/my-addresses";
import { Button } from "@/components/ui/button";

type Tab = "orders" | "addresses" | "account";

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>("orders");

  const tabs = [
    { id: "orders", label: "My Orders", icon: Package, description: "Track & manage purchases" },
    { id: "addresses", label: "Saved Addresses", icon: MapPin, description: "Manage delivery locations" },
    { id: "account", label: "Account Details", icon: UserCircle, description: "Personal information" },
  ] as const;

  return (
    <div className="bg-[#f8f9fa] dark:bg-zinc-950 min-h-screen pb-20">
      {/* Top Banner Area */}
      <div className="bg-white dark:bg-zinc-900 border-b">
        <div className="container mx-auto px-4 max-w-6xl py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center border border-primary/20 shadow-sm">
                <span className="text-2xl font-semibold tracking-tight">
                  {user?.fullName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  Welcome, {user?.fullName?.split(' ')[0] || "User"}!
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1 flex items-center gap-2">
                  {user?.email}
                  {user?.role === "ADMIN" && (
                    <span className="inline-flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs px-2 py-0.5 rounded-full font-medium">
                      <Shield className="w-3 h-3" /> Admin
                    </span>
                  )}
                </p>
              </div>
            </div>
            
            <Button variant="outline" className="gap-2 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors shadow-sm" onClick={() => logout()}>
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="container mx-auto px-4 max-w-6xl mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          
          {/* Sidebar Navigation */}
          <aside className="flex flex-col gap-2">
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200/60 dark:border-zinc-800 p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200 group ${
                      isActive 
                        ? "bg-primary/5 text-primary" 
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-md transition-colors ${isActive ? "bg-primary/10 text-primary" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100"}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className={`font-medium ${isActive ? "text-primary font-semibold" : ""}`}>
                          {tab.label}
                        </div>
                        <div className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 hidden sm:block">
                          {tab.description}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? "text-primary translate-x-0.5" : "text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5"}`} />
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Tab Content */}
          <main className="min-w-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {activeTab === "orders" && <MyOrders />}
            {activeTab === "addresses" && <MyAddresses />}
            {activeTab === "account" && <AccountDetails />}
          </main>
          
        </div>
      </div>
    </div>
  );
}
