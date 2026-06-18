"use client";

import { MapPin, Phone, Edit2, Trash2, Star, Home, Briefcase, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Address } from "@/services/address.service";

interface AddressCardProps {
  address: Address;
  isSelected?: boolean;
  onSelect?: (address: Address) => void;
  onEdit?: (address: Address) => void;
  onDelete?: (address: Address) => void;
  onSetDefault?: (address: Address) => void;
  selectable?: boolean;
}

const labelIcons: Record<string, React.ReactNode> = {
  HOME: <Home className="w-3 h-3" />,
  WORK: <Briefcase className="w-3 h-3" />,
  OTHER: <MoreHorizontal className="w-3 h-3" />,
};

export function AddressCard({
  address,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
  onSetDefault,
  selectable = true,
}: AddressCardProps) {
  return (
    <div
      className={cn(
        "relative border rounded-xl p-5 transition-all duration-200 cursor-pointer group",
        isSelected
          ? "border-primary ring-2 ring-primary/20 bg-primary/[0.03] shadow-sm"
          : "border-border hover:border-primary/40 hover:shadow-sm bg-background",
      )}
      onClick={() => selectable && onSelect?.(address)}
    >
      {/* Top row: Label + Default badge */}
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="secondary" className="text-xs font-medium gap-1 px-2 py-0.5">
          {labelIcons[address.label] || labelIcons.OTHER}
          {address.label}
        </Badge>
        {address.isDefault && (
          <Badge className="text-xs font-medium gap-1 px-2 py-0.5 bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/10">
            <Star className="w-3 h-3 fill-current" />
            Default
          </Badge>
        )}
        {isSelected && (
          <div className="ml-auto w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <svg className="w-3 h-3 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}
      </div>

      {/* Name */}
      <h4 className="font-semibold text-base mb-1">{address.fullName}</h4>

      {/* Address lines */}
      <p className="text-sm text-muted-foreground leading-relaxed">
        {address.address}
        <br />
        {address.city}, {address.state} — {address.zipCode}
      </p>

      {/* Phone */}
      <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
        <Phone className="w-3.5 h-3.5" />
        {address.phone}
      </div>

      {/* Action buttons — shown on hover */}
      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!address.isDefault && onSetDefault && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-amber-600"
            title="Set as default"
            onClick={(e) => { e.stopPropagation(); onSetDefault(address); }}
          >
            <Star className="w-3.5 h-3.5" />
          </Button>
        )}
        {onEdit && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-primary"
            title="Edit"
            onClick={(e) => { e.stopPropagation(); onEdit(address); }}
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            title="Delete"
            onClick={(e) => { e.stopPropagation(); onDelete(address); }}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
