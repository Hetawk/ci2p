import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Edit,
  Trash2,
  Plus,
  Mail,
  Phone,
  MapPin,
  Star,
  UserCheck,
} from "lucide-react";

// Mark this page as dynamic (not static)
export const dynamic = "force-dynamic";

async function getUsers() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/users`, { cache: "no-store" });
    if (!res.ok) {
      throw new Error("Failed to fetch users");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

function UserCard({
  user,
}: {
  user: {
    id: string;
    email: string;
    username: string;
    role: string;
    active: boolean;
    emailVerified: boolean;
    profile?: {
      fullName: string;
      chineseName?: string;
      title?: string;
      avatar?: string;
      bio?: string;
      email?: string;
      phone?: string;
      office?: string;
      showInTeam: boolean;
      teamOrder?: number;
    };
    _count: {
      publications: number;
      projects: number;
    };
  };
}) {
  const roleColors = {
    SUPER_ADMIN: "bg-red-500",
    ADMIN: "bg-orange-500",
    RESEARCHER: "bg-blue-500",
    STUDENT: "bg-green-500",
    GUEST: "bg-gray-500",
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
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
                    user.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge
                  variant="outline"
                  className={`${
                    roleColors[user.role as keyof typeof roleColors] ||
                    "bg-gray-500"
                  } text-white border-none`}
                >
                  {user.role}
                </Badge>
                {user.profile?.showInTeam && (
                  <Badge variant="outline">
                    <Star className="w-3 h-3 mr-1" />
                    Team Member
                  </Badge>
                )}
                {!user.active && <Badge variant="destructive">Inactive</Badge>}
                {user.emailVerified && (
                  <Badge
                    variant="outline"
                    className="border-green-500 text-green-700"
                  >
                    <UserCheck className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg leading-tight">
                {user.profile?.fullName || user.username}
              </CardTitle>
              {user.profile?.chineseName && (
                <p className="text-sm text-muted-foreground">
                  {user.profile.chineseName}
                </p>
              )}
              {user.profile?.title && (
                <p className="text-sm text-muted-foreground mt-1">
                  {user.profile.title}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/admin/users/${user.id}/edit`}>
              <Button size="sm" variant="outline">
                <Edit className="w-4 h-4" />
              </Button>
            </Link>
            <Button size="sm" variant="destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 text-sm mb-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="w-4 h-4" />
            <span className="truncate">{user.email}</span>
          </div>
          {user.profile?.phone && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>{user.profile.phone}</span>
            </div>
          )}
          {user.profile?.office && (
            <div className="flex items-start gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{user.profile.office}</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>{user._count.publications} papers</span>
            <span>{user._count.projects} projects</span>
          </div>
          <Link href={`/team/${user.id}`} target="_blank">
            <Button size="sm" variant="ghost">
              View Profile
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

async function UsersList() {
  const users = await getUsers();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {users.length === 0 ? (
        <Card className="col-span-2">
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No users yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start by adding team members to your lab.
            </p>
            <Link href="/admin/users/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        users.map(
          (user: {
            id: string;
            email: string;
            username: string;
            role: string;
            active: boolean;
            emailVerified: boolean;
            profile?: {
              fullName: string;
              chineseName?: string;
              title?: string;
              avatar?: string;
              bio?: string;
              email?: string;
              phone?: string;
              office?: string;
              showInTeam: boolean;
              teamOrder?: number;
            };
            _count: {
              publications: number;
              projects: number;
            };
          }) => <UserCard key={user.id} user={user} />
        )
      )}
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground">
            Manage lab members, roles, and permissions
          </p>
        </div>
        <Link href="/admin/users/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Team Member
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm">
          All Members
        </Button>
        <Button variant="ghost" size="sm">
          Professors
        </Button>
        <Button variant="ghost" size="sm">
          Researchers
        </Button>
        <Button variant="ghost" size="sm">
          Students
        </Button>
        <Button variant="ghost" size="sm">
          Team Display
        </Button>
      </div>

      <Suspense fallback={<div>Loading users...</div>}>
        <UsersList />
      </Suspense>
    </div>
  );
}
