"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import {
  Users,
  Edit,
  Mail,
  Shield,
  CheckCircle,
  XCircle,
  Loader2,
  Save,
  X,
} from "lucide-react";

type User = {
  id: string;
  email: string;
  username: string | null;
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

type EditingUser = {
  role: string;
  memberId: string;
  universityId: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditingUser>({
    role: "",
    memberId: "",
    universityId: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user.id);
    setEditForm({
      role: user.role,
      memberId: user.profile?.memberId || "",
      universityId: user.profile?.universityId || "",
    });
  };

  const handleSave = async (userId: string) => {
    setSaving(true);
    try {
      // Update role
      const roleRes = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: editForm.role }),
      });

      // Update IDs
      const idsRes = await fetch(`/api/admin/users/${userId}/ids`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: editForm.memberId || null,
          universityId: editForm.universityId || null,
        }),
      });

      if (roleRes.ok && idsRes.ok) {
        await fetchUsers();
        setEditingUser(null);
      } else {
        alert("Failed to update user");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
    setEditForm({ role: "", memberId: "", universityId: "" });
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
            {user.profile?.fullName || user.username || "No Name"}
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
      render: (_, user) =>
        editingUser === user.id ? (
          <select
            value={editForm.role}
            onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
            className="text-xs border rounded px-2 py-1 w-full"
          >
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="ADMIN">Admin</option>
            <option value="RESEARCHER">Researcher</option>
            <option value="STUDENT">Student</option>
            <option value="GUEST">Guest</option>
          </select>
        ) : (
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
      render: (_, user) =>
        editingUser === user.id ? (
          <Input
            value={editForm.memberId}
            onChange={(e) =>
              setEditForm({ ...editForm, memberId: e.target.value })
            }
            placeholder="CI2P001"
            className="h-7 text-xs"
          />
        ) : (
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
      render: (_, user) =>
        editingUser === user.id ? (
          <Input
            value={editForm.universityId}
            onChange={(e) =>
              setEditForm({ ...editForm, universityId: e.target.value })
            }
            placeholder="202534100001"
            className="h-7 text-xs"
          />
        ) : (
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
          <>
            {editingUser === user.id ? (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                  onClick={() => handleSave(user.id)}
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  <X className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={() => handleEdit(user)}
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}
          </>
        )}
      />
    </div>
  );
}
