"use client";

import { useEffect, useState } from "react";
import { AdminService, AdminUser } from "@/services/admin.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Shield, ShieldAlert, Ban, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = useAuthStore((state) => state.user);

  const fetchUsers = async () => {
    try {
      const data = await AdminService.getAllUsers();
      setUsers(data);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    AdminService.getAllUsers()
      .then((data) => {
        if (isMounted) {
          setUsers(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          toast.error("Failed to fetch users");
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRoleChange = async (userId: string, newRole: "USER" | "ADMIN") => {
    if (userId === currentUser?.userId) {
      return toast.error("You cannot change your own role!");
    }
    try {
      await AdminService.updateUserRole(userId, newRole);
      toast.success("User role updated successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user role");
    }
  };

  const handleStatusChange = async (userId: string, newStatus: "ACTIVE" | "BANNED") => {
    if (userId === currentUser?.userId) {
      return toast.error("You cannot ban yourself!");
    }
    try {
      await AdminService.updateUserStatus(userId, newStatus);
      toast.success("User status updated successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user status");
    }
  };

  if (isLoading) {
    return <div className="p-8 text-muted-foreground animate-pulse">Loading users...</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          View, manage, and moderate all registered users on the platform.
        </p>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email Status</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Account Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="font-medium">{user.fullName || "Unnamed User"}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </TableCell>
                <TableCell>
                  {user.isEmailVerified ? (
                    <Badge variant="outline" className="text-green-500 border-green-500/20 bg-green-500/10 gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1">
                      Unverified
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={user.role === "ADMIN" ? "default" : "outline"} className="gap-1">
                    {user.role === "ADMIN" && <Shield className="w-3 h-3" />}
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.status === "BANNED" ? "destructive" : "secondary"}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground outline-none">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      </DropdownMenuGroup>
                      
                      {/* ROLE TOGGLE */}
                      {user.role === "USER" ? (
                        <DropdownMenuItem onClick={() => handleRoleChange(user.id, "ADMIN")}>
                          <ShieldAlert className="mr-2 h-4 w-4" />
                          Promote to Admin
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleRoleChange(user.id, "USER")}>
                          <Shield className="mr-2 h-4 w-4" />
                          Demote to User
                        </DropdownMenuItem>
                      )}

                      {/* STATUS TOGGLE */}
                      {user.status === "ACTIVE" ? (
                        <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={() => handleStatusChange(user.id, "BANNED")}>
                          <Ban className="mr-2 h-4 w-4" />
                          Ban User
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem className="text-green-500 focus:text-green-500" onClick={() => handleStatusChange(user.id, "ACTIVE")}>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Unban User
                        </DropdownMenuItem>
                      )}

                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
