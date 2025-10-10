import { Suspense } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Server,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
} from "lucide-react";

// Mark this page as dynamic (not static)
export const dynamic = "force-dynamic";

async function getResources() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/resources`, { cache: "no-store" });
    if (!res.ok) {
      throw new Error("Failed to fetch resources");
    }
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching resources:", error);
    return [];
  }
}

async function getBookings() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/resources/bookings`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch bookings");
    }
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
}

function ResourceCard({
  resource,
}: {
  resource: {
    id: string;
    name: string;
    type: string;
    description: string;
    location?: string;
    status: string;
    isBookable: boolean;
    capacity?: number;
    specifications?: string;
  };
}) {
  const statusColors = {
    AVAILABLE: "bg-green-500",
    IN_USE: "bg-blue-500",
    MAINTENANCE: "bg-yellow-500",
    UNAVAILABLE: "bg-red-500",
  };

  const typeIcons = {
    COMPUTE: "💻",
    EQUIPMENT: "🔬",
    ROOM: "🏢",
    SOFTWARE: "⚙️",
    DATASET: "📊",
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">
                {typeIcons[resource.type as keyof typeof typeIcons] || "📦"}
              </span>
              <Badge
                variant="outline"
                className={`${
                  statusColors[resource.status as keyof typeof statusColors] ||
                  "bg-gray-500"
                } text-white border-none`}
              >
                {resource.status}
              </Badge>
              {resource.isBookable && <Badge variant="outline">Bookable</Badge>}
            </div>
            <CardTitle className="text-lg leading-tight">
              {resource.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {resource.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/admin/resources/${resource.id}/edit`}>
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
        <div className="space-y-2 text-sm">
          {resource.location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{resource.location}</span>
            </div>
          )}
          {resource.capacity && (
            <div className="text-muted-foreground">
              Capacity: {resource.capacity}{" "}
              {resource.type === "ROOM" ? "people" : "units"}
            </div>
          )}
          {resource.specifications && (
            <div className="text-muted-foreground text-xs mt-2 line-clamp-2">
              {resource.specifications}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function BookingCard({
  booking,
}: {
  booking: {
    id: string;
    startTime: string;
    endTime: string;
    purpose: string;
    status: string;
    user: { profile: { fullName: string } };
    resource: { name: string; type: string };
    createdAt: string;
  };
}) {
  const statusColors = {
    PENDING: "bg-yellow-500",
    APPROVED: "bg-green-500",
    REJECTED: "bg-red-500",
    CANCELLED: "bg-gray-500",
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="outline"
                className={`${
                  statusColors[booking.status as keyof typeof statusColors] ||
                  "bg-gray-500"
                } text-white border-none`}
              >
                {booking.status}
              </Badge>
            </div>
            <h3 className="font-semibold">{booking.resource.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Requested by {booking.user.profile.fullName}
            </p>
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>
                  {new Date(booking.startTime).toLocaleDateString()} -{" "}
                  {new Date(booking.endTime).toLocaleDateString()}
                </span>
              </div>
            </div>
            <p className="text-sm mt-2 line-clamp-2">{booking.purpose}</p>
          </div>
          {booking.status === "PENDING" && (
            <div className="flex items-center gap-2">
              <Button size="sm" variant="default">
                <CheckCircle className="w-4 h-4 mr-1" />
                Approve
              </Button>
              <Button size="sm" variant="destructive">
                <XCircle className="w-4 h-4 mr-1" />
                Reject
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

async function ResourcesList() {
  const resources = await getResources();

  return (
    <div className="space-y-4">
      {resources.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Server className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No resources yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start by adding lab equipment, rooms, or other resources.
            </p>
            <Link href="/admin/resources/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Resource
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        resources.map(
          (resource: {
            id: string;
            name: string;
            type: string;
            description: string;
            location?: string;
            status: string;
            isBookable: boolean;
            capacity?: number;
            specifications?: string;
          }) => <ResourceCard key={resource.id} resource={resource} />
        )
      )}
    </div>
  );
}

async function BookingsList() {
  const bookings = await getBookings();

  const pendingBookings = bookings.filter(
    (b: { status: string }) => b.status === "PENDING"
  );
  const otherBookings = bookings.filter(
    (b: { status: string }) => b.status !== "PENDING"
  );

  return (
    <div className="space-y-6">
      {pendingBookings.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Pending Approvals</h3>
          <div className="space-y-4">
            {pendingBookings.map(
              (booking: {
                id: string;
                startTime: string;
                endTime: string;
                purpose: string;
                status: string;
                user: { profile: { fullName: string } };
                resource: { name: string; type: string };
                createdAt: string;
              }) => (
                <BookingCard key={booking.id} booking={booking} />
              )
            )}
          </div>
        </div>
      )}

      {otherBookings.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">All Bookings</h3>
          <div className="space-y-4">
            {otherBookings.map(
              (booking: {
                id: string;
                startTime: string;
                endTime: string;
                purpose: string;
                status: string;
                user: { profile: { fullName: string } };
                resource: { name: string; type: string };
                createdAt: string;
              }) => (
                <BookingCard key={booking.id} booking={booking} />
              )
            )}
          </div>
        </div>
      )}

      {bookings.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
            <p className="text-sm text-muted-foreground">
              Bookings will appear here when users request resources.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function AdminResourcesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Resources & Bookings
          </h1>
          <p className="text-muted-foreground">
            Manage lab resources and approve booking requests
          </p>
        </div>
        <Link href="/admin/resources/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Resource
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="resources" className="space-y-6">
        <TabsList>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="resources">
          <Suspense fallback={<div>Loading resources...</div>}>
            <ResourcesList />
          </Suspense>
        </TabsContent>

        <TabsContent value="bookings">
          <Suspense fallback={<div>Loading bookings...</div>}>
            <BookingsList />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
