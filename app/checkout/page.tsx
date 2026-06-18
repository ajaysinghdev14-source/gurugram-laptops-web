"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import {
  CheckCircle2,
  Truck,
  CreditCard,
  ShieldCheck,
  Loader2,
  Plus,
  MapPin,
} from "lucide-react";

import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { OrderService } from "@/services/order.service";
import { AddressService, type Address } from "@/services/address.service";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

import { AddressCard } from "@/components/address-card";
import {
  AddressFormDialog,
  type AddressFormValues,
} from "@/components/address-form-dialog";

const formatInr = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isInitialized, isAuthenticated } = useAuthStore();
  const { items, getCartTotal, clearCart } = useCartStore();

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Address state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  const fetchAddresses = useCallback(async () => {
    try {
      setIsLoadingAddresses(true);
      const data = await AddressService.getAddresses();
      setAddresses(data);
      const defaultAddr = data.find((a) => a.isDefault);
      setSelectedAddressId(defaultAddr?.id ?? data[0]?.id ?? null);
    } catch {
      toast.error("Failed to load addresses");
    } finally {
      setIsLoadingAddresses(false);
    }
  }, []);

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      const load = async () => {
        await fetchAddresses();
      };
      load();
    }
  }, [isInitialized, isAuthenticated, fetchAddresses]);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      toast.error("Please log in to checkout");
      router.push("/login?redirect=/checkout");
    }
  }, [isInitialized, isAuthenticated, router]);

  // --- Address handlers ---
  const handleCreateOrUpdateAddress = async (data: AddressFormValues) => {
    try {
      setIsSavingAddress(true);
      if (editingAddress) {
        await AddressService.updateAddress(editingAddress.id, data);
        toast.success("Address updated");
      } else {
        await AddressService.createAddress(data);
        toast.success("Address added");
      }
      setDialogOpen(false);
      setEditingAddress(null);
      await fetchAddresses();
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { message?: string } } };
      const errorMessage = apiError?.response?.data?.message || "Failed to save address";
      toast.error(errorMessage);
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setDialogOpen(true);
  };

  const handleDeleteAddress = async (address: Address) => {
    try {
      await AddressService.deleteAddress(address.id);
      toast.success("Address deleted");
      await fetchAddresses();
    } catch {
      toast.error("Failed to delete address");
    }
  };

  const handleSetDefault = async (address: Address) => {
    try {
      await AddressService.setDefault(address.id);
      toast.success("Default address updated");
      await fetchAddresses();
    } catch {
      toast.error("Failed to update default");
    }
  };

  // --- Order placement ---
  const onPlaceOrder = async () => {
    const selectedAddress = addresses.find((a) => a.id === selectedAddressId);
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    try {
      setIsPlacingOrder(true);
      const shippingAddress = {
        fullName: selectedAddress.fullName,
        address: selectedAddress.address,
        city: selectedAddress.city,
        state: selectedAddress.state,
        zipCode: selectedAddress.zipCode,
        phone: selectedAddress.phone,
      };
      const order = await OrderService.createOrder(shippingAddress);
      clearCart();
      setOrderSuccess(true);
      toast.success(order.message || "Order placed successfully!");
      setTimeout(() => {
        router.push("/shop");
      }, 3000);
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { message?: string } } };
      toast.error(apiError.response?.data?.message || "Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // --- Guards ---
  if (!isInitialized || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <div className="bg-muted w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <Truck className="w-12 h-12 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">
          You have no items in your cart to checkout. Let&apos;s go find some
          great products!
        </p>
        <Button
          size="lg"
          className="w-full"
          onClick={() => router.push("/shop")}
        >
          Continue Shopping
        </Button>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-lg min-h-[60vh] flex flex-col items-center justify-center">
        <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Thank you for your purchase. Your order is being processed and will be
          shipped soon.
        </p>
        <Button size="lg" onClick={() => router.push("/shop")}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  return (
    <div className="bg-muted/30 min-h-screen pb-20">
      {/* Checkout Header */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-primary" />
            Secure Checkout
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Address + Payment */}
          <div className="lg:col-span-7 space-y-6">
            {/* ─── Section 1: Delivery Address ─── */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center text-primary text-sm font-bold">
                        1
                      </div>
                      Delivery Address
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Select where you want your order delivered
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => {
                      setEditingAddress(null);
                      setDialogOpen(true);
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Add New
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {isLoadingAddresses ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPin className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">
                      No Saved Addresses
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add your first delivery address to proceed.
                    </p>
                    <Button
                      onClick={() => {
                        setEditingAddress(null);
                        setDialogOpen(true);
                      }}
                      className="gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      Add Address
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {addresses.map((addr) => (
                      <AddressCard
                        key={addr.id}
                        address={addr}
                        isSelected={selectedAddressId === addr.id}
                        onSelect={(a) => setSelectedAddressId(a.id)}
                        onEdit={handleEditAddress}
                        onDelete={handleDeleteAddress}
                        onSetDefault={handleSetDefault}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ─── Section 2: Payment Method ─── */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="bg-muted/30 pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center text-primary text-sm font-bold">
                    2
                  </div>
                  Payment Method
                </CardTitle>
                <CardDescription>Choose how you want to pay</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <RadioGroup defaultValue="cod" className="grid gap-4">
                  <div>
                    <Label
                      htmlFor="cod"
                      className="flex items-center justify-between p-4 border rounded-lg cursor-pointer bg-background hover:bg-muted/50 border-primary ring-1 ring-primary/20"
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="cod" id="cod" />
                        <div>
                          <p className="font-semibold text-base">
                            Cash on Delivery (COD)
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Pay when your order arrives.
                          </p>
                        </div>
                      </div>
                      <Truck className="w-6 h-6 text-muted-foreground" />
                    </Label>
                  </div>

                  <div>
                    <Label
                      htmlFor="card"
                      className="flex items-center justify-between p-4 border rounded-lg opacity-50 cursor-not-allowed"
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="card" id="card" disabled />
                        <div>
                          <p className="font-semibold text-base">
                            Credit / Debit Card
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Coming soon...
                          </p>
                        </div>
                      </div>
                      <CreditCard className="w-6 h-6 text-muted-foreground" />
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-24">
              <Card className="border-border/50 shadow-lg shadow-primary/5">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="h-16 w-16 rounded-md bg-muted flex-shrink-0 overflow-hidden relative border">
                          {item.product?.images?.[0] ? (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.title}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                              No img
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col flex-1 min-w-0 justify-center">
                          <h4 className="text-sm font-medium line-clamp-1">
                            {item.product?.title}
                          </h4>
                          <div className="text-xs text-muted-foreground mt-1 flex justify-between items-center">
                            <span>
                              {item.variantName || "Standard"} x{" "}
                              {item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{formatInr(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">
                        {shipping === 0 ? "Free" : formatInr(shipping)}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-end">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatInr(total)}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-4 bg-muted/20 pt-6">
                  <Button
                    size="lg"
                    className="w-full h-14 text-lg font-semibold shadow-md"
                    disabled={isPlacingOrder || !selectedAddressId}
                    onClick={onPlaceOrder}
                  >
                    {isPlacingOrder ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Place Order"
                    )}
                  </Button>
                  {!selectedAddressId && addresses.length > 0 && (
                    <p className="text-xs text-destructive text-center">
                      Please select a delivery address
                    </p>
                  )}
                  <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Secure encrypted checkout
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Address Form Dialog */}
      <AddressFormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingAddress(null);
        }}
        onSubmit={handleCreateOrUpdateAddress}
        editingAddress={editingAddress}
        isLoading={isSavingAddress}
      />
    </div>
  );
}
