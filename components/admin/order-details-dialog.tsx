"use client";

import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { toast } from "sonner";
import { Loader2, MapPin, Package, Phone, User, Calendar, CreditCard, CheckCircle2, Circle, XCircle } from "lucide-react";

import type { Order } from "@/services/order.service";
import { OrderService } from "@/services/order.service";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface OrderDetailsDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusUpdated?: () => void;
  readOnly?: boolean;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  PROCESSING: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  SHIPPED: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  DELIVERED: "bg-green-500/10 text-green-600 border-green-500/20",
  CANCELLED: "bg-red-500/10 text-red-600 border-red-500/20",
};

const formatInr = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const ORDER_STAGES = [
  { id: "PENDING", label: "Order Placed" },
  { id: "PROCESSING", label: "Packing" },
  { id: "SHIPPED", label: "On the Way" },
  { id: "DELIVERED", label: "Delivered" },
];

export function OrderDetailsDialog({
  order,
  open,
  onOpenChange,
  onStatusUpdated,
  readOnly = false,
}: OrderDetailsDialogProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!order) return null;

  const handleStatusChange = async (newStatus: string | null) => {
    if (!newStatus) return;
    try {
      setIsUpdating(true);
      await OrderService.updateOrderStatus(order.id, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      onStatusUpdated?.();
    } catch {
      toast.error("Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl flex items-center gap-2">
                Order Details
                <Badge variant="outline" className={statusColors[order.status] || ""}>
                  {order.status}
                </Badge>
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                ID: {order.id}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Order Tracker Timeline */}
        <div className="my-6">
          {order.status === "CANCELLED" ? (
            <div className="bg-red-500/10 border border-red-500/20 text-red-600 rounded-lg p-4 flex items-center gap-3">
              <XCircle className="w-5 h-5" />
              <div>
                <p className="font-semibold">Order Cancelled</p>
                <p className="text-sm opacity-90">This order has been cancelled and will not be delivered.</p>
              </div>
            </div>
          ) : (() => {
            const currentStageIndex = ORDER_STAGES.findIndex((s) => s.id === order.status);
            const progressPercentage = Math.max(0, (currentStageIndex / (ORDER_STAGES.length - 1)) * 100);

            return (
              <div className="relative flex justify-between items-center max-w-2xl mx-auto px-4 sm:px-10">
                {/* Connecting Background Line - Gray */}
                <div className="absolute left-[10%] right-[10%] top-4 h-[3px] bg-zinc-200 dark:bg-zinc-800 rounded-full z-0"></div>
                {/* Connecting Background Line - Active Green */}
                <div 
                  className="absolute left-[10%] top-4 h-[3px] bg-emerald-500 rounded-full z-0 transition-all duration-1000 ease-in-out" 
                  style={{ width: `calc(${progressPercentage}% * 0.8)` }}
                ></div>
                
                {ORDER_STAGES.map((stage, index) => {
                  const isCompleted = index < currentStageIndex;
                  const isCurrent = index === currentStageIndex;
                  
                  return (
                    <div key={stage.id} className="relative z-10 flex flex-col items-center gap-2">
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                          isCompleted ? "bg-emerald-500 text-white shadow-md border-2 border-emerald-500" :
                          isCurrent ? "bg-white dark:bg-zinc-950 text-emerald-500 border-[3px] border-emerald-500 ring-4 ring-emerald-500/20 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" :
                          "bg-white dark:bg-zinc-950 text-zinc-300 dark:text-zinc-600 border-2 border-zinc-200 dark:border-zinc-800"
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-3 h-3 fill-current" />}
                      </div>
                      <span className={`text-xs font-semibold text-center absolute top-10 whitespace-nowrap transition-colors duration-500 ${isCurrent ? "text-emerald-600 dark:text-emerald-500" : isCompleted ? "text-zinc-800 dark:text-zinc-200" : "text-zinc-400 dark:text-zinc-500"}`}>
                        {stage.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          {/* Left Column: Customer & Shipping */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-primary" />
                Customer Info
              </h3>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                <p><span className="text-muted-foreground">Name:</span> {order.user?.name || order.shippingAddress.fullName}</p>
                <p><span className="text-muted-foreground">Email:</span> {order.user?.email || "N/A"}</p>
                <p><span className="text-muted-foreground">Phone:</span> {order.shippingAddress.phone}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-primary" />
                Shipping Address
              </h3>
              <div className="bg-muted/50 rounded-lg p-4 space-y-1 text-sm">
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p className="text-muted-foreground">{order.shippingAddress.address}</p>
                <p className="text-muted-foreground">
                  {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.zipCode}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-primary" />
                  Order Date
                </h3>
                <div className="bg-muted/50 rounded-lg p-4 text-sm">
                  {format(new Date(order.createdAt), "PPp")}
                </div>
              </div>
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <CreditCard className="w-4 h-4 text-primary" />
                  Payment
                </h3>
                <div className="bg-muted/50 rounded-lg p-4 text-sm font-medium uppercase">
                  {order.paymentMethod}
                </div>
              </div>
            </div>

            {!readOnly && (
              <div>
                <h3 className="font-semibold mb-3">Update Status</h3>
                <div className="flex gap-2">
                  <Select
                    disabled={isUpdating}
                    value={order.status}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="PROCESSING">Processing</SelectItem>
                      <SelectItem value="SHIPPED">Shipped</SelectItem>
                      <SelectItem value="DELIVERED">Delivered</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  {isUpdating && <Loader2 className="w-8 h-8 p-1.5 animate-spin text-muted-foreground" />}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Items */}
          <div>
            <h3 className="font-semibold flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-primary" />
              Order Items
            </h3>
            <div className="bg-muted/30 border rounded-lg overflow-hidden">
              <div className="max-h-[350px] overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="h-20 w-20 rounded-md bg-muted flex-shrink-0 overflow-hidden relative border shadow-sm">
                      {item.product?.images?.[0] ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.title || "Product"}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                          No img
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 min-w-0 justify-center">
                      <h4 className="text-sm font-medium line-clamp-1">
                        {item.product?.title || "Unknown Product"}
                      </h4>
                      <div className="text-xs text-muted-foreground mt-1 flex justify-between items-center">
                        <span>
                          {item.variantName || "Standard"} x {item.quantity}
                        </span>
                        <span className="font-medium text-foreground">
                          {formatInr(Number(item.price))}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="p-4 bg-muted/50 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatInr(Number(order.totalAmount))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Free</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{formatInr(Number(order.totalAmount))}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
