"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Users,
  Edit,
  Mail,
  Phone,
  Star,
  UserCheck,
  Search,
  Loader2,
  Save,
  X,
  Shield,
} from "lucide-react";
import Pagination from "@/components/ui/Pagination";

interface User {
  id: string;
  email: string;
  username: string | null;
  role: string;
  active: boolean;
  emailVerified: boolean;
  profile?: {
    fullName: string;
    chineseName?: string;
    title?: string;
    avatar?: string;
    email?: string;
    phone?: string;
    memberId?: string;
    universityId?: string;
    showInTeam: boolean;
  };
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const itemsPerPage = 10;

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by role
    if (roleFilter !== "ALL") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.profile?.fullName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.profile?.memberId
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, searchQuery, roleFilter]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (
      !confirm(
        `Are you sure you want to change this user's role to ${newRole}?`
      )
    ) {
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update role");
      }

      await fetchUsers();
      setEditingUser(null);
      alert("User role updated successfully!");
    } catch (error) {
      console.error("Error updating role:", error);
      alert(error instanceof Error ? error.message : "Failed to update role");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateIds = async (
    userId: string,
    memberId: string,
    universityId: string
  ) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}/ids`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: memberId || undefined,
          universityId: universityId || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update IDs");
      }

      await fetchUsers();
      setEditingUser(null);
      alert("User IDs updated successfully!");
    } catch (error) {
      console.error("Error updating IDs:", error);
      alert(error instanceof Error ? error.message : "Failed to update IDs");
    } finally {
      setIsUpdating(false);
    }
  };

  const roleColors = {
    SUPER_ADMIN: "bg-red-100 text-red-800 border-red-300",
    ADMIN: "bg-orange-100 text-orange-800 border-orange-300",
    RESEARCHER: "bg-blue-100 text-blue-800 border-blue-300",
    STUDENT: "bg-green-100 text-green-800 border-green-300",
    GUEST: "bg-gray-100 text-gray-800 border-gray-300",
  };

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            User Management
          </h1>
          <p className="text-gray-600">Manage user accounts, roles, and IDs</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by name, email, username, or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Role Filter */}
              <div>
                <Label htmlFor="role">Filter by Role</Label>
                <select
                  id="role"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full h-10 border border-gray-300 rounded-md px-3"
                >
                  <option value="ALL">All Roles</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                  <option value="ADMIN">Admin</option>
                  <option value="RESEARCHER">Researcher</option>
                  <option value="STUDENT">Student</option>
                  <option value="GUEST">Guest</option>
                </select>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-6">
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-800">
                  {users.filter((u) => u.role === "SUPER_ADMIN").length}
                </div>
                <div className="text-xs text-red-600">Super Admin</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-800">
                  {users.filter((u) => u.role === "ADMIN").length}
                </div>
                <div className="text-xs text-orange-600">Admin</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-800">
                  {users.filter((u) => u.role === "RESEARCHER").length}
                </div>
                <div className="text-xs text-blue-600">Researcher</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-800">
                  {users.filter((u) => u.role === "STUDENT").length}
                </div>
                <div className="text-xs text-green-600">Student</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">
                  {users.filter((u) => u.role === "GUEST").length}
                </div>
                <div className="text-xs text-gray-600">Guest</div>
              </div>
              <div className="text-center p-3 bg-gray-100 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {users.length}
                </div>
                <div className="text-xs text-gray-700">Total</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <div className="space-y-4">
          {currentUsers.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No users found</p>
              </CardContent>
            </Card>
          ) : (
            currentUsers.map((user) => (
              <Card key={user.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Avatar */}
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 relative">
                        {user.profile?.avatar ? (
                          <Image
                            src={user.profile.avatar}
                            alt={user.profile.fullName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
                            {user.profile?.fullName?.charAt(0) ||
                              user.username?.charAt(0).toUpperCase() ||
                              "U"}
                          </div>
                        )}
                      </div>

                      {/* User Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {user.profile?.fullName ||
                              user.username ||
                              "No Name"}
                            {user.profile?.chineseName && (
                              <span className="ml-2 text-gray-600">
                                ({user.profile.chineseName})
                              </span>
                            )}
                          </h3>
                          <Badge
                            variant="outline"
                            className={
                              roleColors[user.role as keyof typeof roleColors]
                            }
                          >
                            <Shield className="w-3 h-3 mr-1" />
                            {user.role}
                          </Badge>
                          {user.emailVerified && (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-300"
                            >
                              <UserCheck className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          {user.profile?.showInTeam && (
                            <Badge variant="outline" className="bg-purple-50">
                              <Star className="w-3 h-3 mr-1" />
                              Team
                            </Badge>
                          )}
                          {!user.active && (
                            <Badge variant="destructive">Inactive</Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {user.email}
                          </div>
                          {user.profile?.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              {user.profile.phone}
                            </div>
                          )}
                          {user.profile?.memberId && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Member ID:</span>
                              {user.profile.memberId}
                            </div>
                          )}
                          {user.profile?.universityId && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                University ID:
                              </span>
                              {user.profile.universityId}
                            </div>
                          )}
                        </div>

                        {user.profile?.title && (
                          <p className="text-sm text-gray-600 mt-2">
                            {user.profile.title}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <Button
                      onClick={() => setEditingUser(user)}
                      variant="outline"
                      size="sm"
                      className="ml-4"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        {/* Edit Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="w-6 h-6" />
                  Edit User:{" "}
                  {editingUser.profile?.fullName || editingUser.username}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const selectedRole = formData.get("role") as string;
                    const memberId = formData.get("memberId") as string;
                    const universityId = formData.get("universityId") as string;

                    // Update role if changed
                    if (selectedRole !== editingUser.role) {
                      handleRoleChange(editingUser.id, selectedRole);
                    } else {
                      // Just update IDs
                      handleUpdateIds(editingUser.id, memberId, universityId);
                    }
                  }}
                  className="space-y-4"
                >
                  {/* Role Selection */}
                  <div>
                    <Label htmlFor="role">
                      User Role <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="role"
                      name="role"
                      defaultValue={editingUser.role}
                      className="w-full h-10 border border-gray-300 rounded-md px-3"
                      disabled={isUpdating}
                    >
                      <option value="SUPER_ADMIN">Super Admin</option>
                      <option value="ADMIN">Admin</option>
                      <option value="RESEARCHER">Researcher</option>
                      <option value="STUDENT">Student</option>
                      <option value="GUEST">Guest</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Only SUPER_ADMIN can change roles
                    </p>
                  </div>

                  {/* Member ID */}
                  <div>
                    <Label htmlFor="memberId">Lab Member ID</Label>
                    <Input
                      id="memberId"
                      name="memberId"
                      defaultValue={editingUser.profile?.memberId || ""}
                      placeholder="e.g., CI2PSTD001"
                      disabled={isUpdating}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Format: CI2PSTD### for students, CI2PRES### for
                      researchers
                    </p>
                  </div>

                  {/* University ID */}
                  <div>
                    <Label htmlFor="universityId">University ID</Label>
                    <Input
                      id="universityId"
                      name="universityId"
                      defaultValue={editingUser.profile?.universityId || ""}
                      placeholder="e.g., 202324100003"
                      disabled={isUpdating}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Optional: Can be added later if not yet enrolled
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditingUser(null)}
                      disabled={isUpdating}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
