"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Loader2, Package, ChevronRight } from "lucide-react";
import { toast } from "sonner";

import { OrderService, type Order } from "@/services/order.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrderDetailsDialog } from "@/components/admin/order-details-dialog";

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

export function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await OrderService.getMyOrders();
      setOrders(data);
    } catch {
      toast.error("Failed to load your orders");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      await fetchOrders();
    };
    load();
  }, [fetchOrders]);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  return (
    <Card className="border-zinc-200/60 shadow-sm rounded-xl overflow-hidden bg-white dark:bg-zinc-900 min-h-[500px]">
      <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <CardTitle className="text-xl">My Orders</CardTitle>
        <CardDescription>View and track your recent purchases</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-lg bg-muted/10">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-1">No orders yet</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              You haven&apos;t placed any orders yet. Start exploring our products!
            </p>
            <Link href="/shop">
              <Button>Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className="border border-zinc-200/60 dark:border-zinc-800 rounded-lg p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-primary/40 hover:shadow-sm transition-all bg-white dark:bg-zinc-900/50"
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold">
                      Order #{order.id.split("-")[0].toUpperCase()}
                    </span>
                    <Badge variant="outline" className={statusColors[order.status] || ""}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Placed on {format(new Date(order.createdAt), "MMM d, yyyy")}
                  </div>
                </div>
                
                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-left sm:text-right">
                    <div className="text-sm text-muted-foreground">Total Amount</div>
                    <div className="font-semibold text-lg">{formatInr(Number(order.totalAmount))}</div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="gap-1"
                    onClick={() => handleViewOrder(order)}
                  >
                    View Details
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <OrderDetailsDialog
        order={selectedOrder}
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setSelectedOrder(null);
        }}
        readOnly={true}
      />
    </Card>
  );
}
