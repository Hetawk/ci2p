"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import {
  Users,
  Mail,
  Shield,
  CheckCircle,
  XCircle,
  Loader2,
  Edit,
} from "lucide-react";

type User = {
  id: string;
  email: string;
  role: string;
  active: boolean;
  emailVerified: boolean;
  profile?: {
    fullName: string;
    chineseName?: string;
    phone?: string;
    memberId?: string;
    universityId?: string;
  };
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users", { cache: "no-store" });
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      width: "w-1/4",
      render: (_, user) => (
        <div>
          <div className="font-medium text-gray-900">
            {user.profile?.fullName || "No Name"}
          </div>
          {user.profile?.chineseName && (
            <div className="text-xs text-gray-500">
              {user.profile.chineseName}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
      width: "w-1/4",
      render: (email) => (
        <div className="flex items-center gap-2">
          <Mail className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-sm text-gray-700">{String(email)}</span>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      sortable: true,
      width: "w-32",
      render: (_, user) => (
        <Badge
          variant={
            user.role === "SUPER_ADMIN" || user.role === "ADMIN"
              ? "default"
              : "secondary"
          }
          className="text-xs"
        >
          <Shield className="w-3 h-3 mr-1" />
          {user.role}
        </Badge>
      ),
    },
    {
      key: "memberId",
      label: "Member ID",
      sortable: true,
      width: "w-32",
      render: (_, user) => (
        <span className="text-sm text-gray-700">
          {user.profile?.memberId || "-"}
        </span>
      ),
    },
    {
      key: "universityId",
      label: "University ID",
      sortable: true,
      width: "w-32",
      render: (_, user) => (
        <span className="text-sm text-gray-700">
          {user.profile?.universityId || "-"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      width: "w-24",
      render: (_, user) => (
        <div className="flex flex-col gap-1">
          {user.active ? (
            <Badge
              variant="outline"
              className="text-xs w-fit border-green-500 text-green-700"
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              Active
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="text-xs w-fit border-red-500 text-red-700"
            >
              <XCircle className="w-3 h-3 mr-1" />
              Inactive
            </Badge>
          )}
          {user.emailVerified && (
            <Badge
              variant="outline"
              className="text-xs w-fit border-blue-500 text-blue-700"
            >
              Verified
            </Badge>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6" />
            User Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <Link href="/admin/users/new">
          <Button className="border border-blue-600">Add Team Member</Button>
        </Link>
      </div>

      {/* Stats by Role */}
      <div className="grid grid-cols-5 gap-4">
        {["SUPER_ADMIN", "ADMIN", "RESEARCHER", "STUDENT", "GUEST"].map(
          (role) => {
            const count = users.filter((u) => u.role === role).length;
            const colors: Record<string, string> = {
              SUPER_ADMIN: "text-red-600",
              ADMIN: "text-orange-600",
              RESEARCHER: "text-blue-600",
              STUDENT: "text-green-600",
              GUEST: "text-gray-600",
            };
            return (
              <div key={role} className="bg-white p-4 rounded-lg border">
                <div className="text-xs text-gray-600">
                  {role.replace("_", " ")}
                </div>
                <div className={`text-2xl font-bold ${colors[role]}`}>
                  {count}
                </div>
              </div>
            );
          }
        )}
      </div>

      {/* Data Table */}
      <DataTable
        data={users}
        columns={columns}
        searchPlaceholder="Search users by name, email, ID..."
        emptyMessage="No users found"
        actions={(user) => (
          <Link href={`/admin/users/${user.id}`}>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>
        )}
      />
    </div>
  );
}
