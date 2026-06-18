"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Plus, MapPin } from "lucide-react";
import { toast } from "sonner";

import { AddressService, type Address } from "@/services/address.service";
import { AddressCard } from "@/components/address-card";
import { AddressFormDialog, type AddressFormValues } from "@/components/address-form-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function MyAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchAddresses = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await AddressService.getAddresses();
      setAddresses(data);
    } catch {
      toast.error("Failed to load addresses");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      await fetchAddresses();
    };
    load();
  }, [fetchAddresses]);

  const handleCreateOrUpdate = async (data: AddressFormValues) => {
    try {
      setIsSaving(true);
      if (editingAddress) {
        await AddressService.updateAddress(editingAddress.id, data);
        toast.success("Address updated successfully");
      } else {
        await AddressService.createAddress(data);
        toast.success("Address added successfully");
      }
      setDialogOpen(false);
      setEditingAddress(null);
      await fetchAddresses();
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { message?: string } } };
      toast.error(apiError?.response?.data?.message || "Failed to save address");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (address: Address) => {
    try {
      await AddressService.deleteAddress(address.id);
      toast.success("Address removed");
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
      toast.error("Failed to update default address");
    }
  };

  const openEditDialog = (address: Address) => {
    setEditingAddress(address);
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingAddress(null);
    setDialogOpen(true);
  };

  return (
    <Card className="border-zinc-200/60 shadow-sm rounded-xl overflow-hidden bg-white dark:bg-zinc-900 min-h-[500px]">
      <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-row justify-between items-center">
        <div>
          <CardTitle className="text-xl">Saved Addresses</CardTitle>
          <CardDescription>Manage your delivery addresses</CardDescription>
        </div>
        <Button onClick={openCreateDialog} size="sm" className="gap-1.5">
          <Plus className="w-4 h-4" />
          Add New
        </Button>
      </CardHeader>
      
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-lg bg-muted/10">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-1">No addresses saved</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              You haven&apos;t added any delivery addresses yet. Add one to make checkout faster.
            </p>
            <Button onClick={openCreateDialog}>
              Add Address
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <AddressCard
                key={addr.id}
                address={addr}
                selectable={false}
                onEdit={openEditDialog}
                onDelete={handleDelete}
                onSetDefault={handleSetDefault}
              />
            ))}
          </div>
        )}
      </CardContent>

      <AddressFormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingAddress(null);
        }}
        onSubmit={handleCreateOrUpdate}
        editingAddress={editingAddress}
        isLoading={isSaving}
      />
    </Card>
  );
}
