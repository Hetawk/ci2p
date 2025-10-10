"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookingModal } from "@/components/resources/BookingModal";
import {
  Server,
  Cpu,
  HardDrive,
  Monitor,
  Database,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";

// Resource type from API
interface Resource {
  id: string;
  name: string;
  type: string;
  description: string | null;
  location: string | null;
  capacity: number | null;
  status: "AVAILABLE" | "UNAVAILABLE" | "MAINTENANCE";
  bookable: boolean;
  specifications: Record<string, string> | null;
  activeBookingsCount?: number;
  nextAvailableTime?: string | null;
}

const resourceTypes = [
  "All",
  "EQUIPMENT",
  "ROOM",
  "SOFTWARE",
  "DATA",
  "COMPUTE",
];

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [bookingModal, setBookingModal] = useState<{
    isOpen: boolean;
    resource: Resource | null;
  }>({ isOpen: false, resource: null });

  // Fetch resources
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedType !== "All") params.append("type", selectedType);
        if (selectedStatus) params.append("status", selectedStatus);
        params.append("bookable", "true"); // Only show bookable resources

        const response = await fetch(`/api/resources?${params.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch resources");

        const data = await response.json();
        setResources(data.resources || []);
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        setResources([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [selectedType, selectedStatus]);

  // Separate function for manual refresh
  const refreshResources = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedType !== "All") params.append("type", selectedType);
      if (selectedStatus) params.append("status", selectedStatus);
      params.append("bookable", "true");

      const response = await fetch(`/api/resources?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch resources");

      const data = await response.json();
      setResources(data.resources || []);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const openBookingModal = (resource: Resource) => {
    setBookingModal({ isOpen: true, resource });
  };

  const closeBookingModal = () => {
    setBookingModal({ isOpen: false, resource: null });
  };

  const handleBookingSuccess = () => {
    // Refresh resources to get updated booking counts
    refreshResources();
  };

  // Count resources by status
  const availableCount = resources.filter(
    (r) => r.status === "AVAILABLE"
  ).length;
  const totalCount = resources.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-slate-900 via-brand-900 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle, rgb(59 130 246 / 0.15) 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="absolute top-20 left-10 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-brand-500/20 rounded-2xl backdrop-blur-sm border border-brand-400/30">
                <Server className="w-8 h-8 text-brand-300" />
              </div>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white">
              Lab <span className="text-secondary-400">Resources</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              State-of-the-art computing infrastructure, datasets, and equipment
              for cutting-edge research
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-400">
                  {totalCount}
                </div>
                <div className="text-sm text-gray-300">Total Resources</div>
              </div>
              <div className="w-px h-12 bg-gray-600" />
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-400">
                  {availableCount}
                </div>
                <div className="text-sm text-gray-300">Available</div>
              </div>
              <div className="w-px h-12 bg-gray-600" />
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-400">
                  {resourceTypes.length - 1}
                </div>
                <div className="text-sm text-gray-300">Categories</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Type Filters */}
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            {resourceTypes.map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                className={
                  selectedType === type
                    ? "bg-brand-600 hover:bg-brand-700"
                    : "border-brand-300 hover:bg-brand-50"
                }
                onClick={() => setSelectedType(type)}
              >
                {type}
              </Button>
            ))}
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            <Button
              variant={!selectedStatus ? "default" : "outline"}
              size="sm"
              className={
                !selectedStatus
                  ? "bg-brand-600 hover:bg-brand-700"
                  : "border-brand-300 hover:bg-brand-50"
              }
              onClick={() => setSelectedStatus(null)}
            >
              All Status
            </Button>
            <Button
              variant={selectedStatus === "AVAILABLE" ? "default" : "outline"}
              size="sm"
              className={
                selectedStatus === "AVAILABLE"
                  ? "bg-green-600 hover:bg-green-700"
                  : "border-green-300 hover:bg-green-50"
              }
              onClick={() => setSelectedStatus("AVAILABLE")}
            >
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Available
            </Button>
            <Button
              variant={selectedStatus === "UNAVAILABLE" ? "default" : "outline"}
              size="sm"
              className={
                selectedStatus === "UNAVAILABLE"
                  ? "bg-yellow-600 hover:bg-yellow-700"
                  : "border-yellow-300 hover:bg-yellow-50"
              }
              onClick={() => setSelectedStatus("UNAVAILABLE")}
            >
              <Clock className="w-3 h-3 mr-1" />
              In Use
            </Button>
            <Button
              variant={selectedStatus === "MAINTENANCE" ? "default" : "outline"}
              size="sm"
              className={
                selectedStatus === "MAINTENANCE"
                  ? "bg-red-600 hover:bg-red-700"
                  : "border-red-300 hover:bg-red-50"
              }
              onClick={() => setSelectedStatus("MAINTENANCE")}
            >
              <Settings className="w-3 h-3 mr-1" />
              Maintenance
            </Button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-brand-600 animate-spin mb-4" />
              <p className="text-gray-600">Loading resources...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="max-w-md mx-auto">
              <Card className="p-8 border-red-200 bg-red-50">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-red-100 rounded-full">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-red-900 mb-2">
                      Failed to Load Resources
                    </h3>
                    <p className="text-red-700">{error}</p>
                  </div>
                  <Button
                    onClick={refreshResources}
                    variant="outline"
                    className="border-red-300 hover:bg-red-100"
                  >
                    Try Again
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && resources.length === 0 && (
            <div className="text-center py-20">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gray-100 rounded-full">
                  <Server className="w-12 h-12 text-gray-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Resources Found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters to see more results.
              </p>
              <Button
                onClick={() => {
                  setSelectedType("All");
                  setSelectedStatus(null);
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Resources Grid */}
          {!loading && !error && resources.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource, index) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  index={index}
                  onBook={openBookingModal}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Booking Modal */}
      {bookingModal.resource && (
        <BookingModal
          isOpen={bookingModal.isOpen}
          onClose={closeBookingModal}
          resource={{
            id: bookingModal.resource.id,
            name: bookingModal.resource.name,
            type: bookingModal.resource.type,
          }}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
}

// Resource Card Component
function ResourceCard({
  resource,
  index,
  onBook,
}: {
  resource: Resource;
  index: number;
  onBook: (resource: Resource) => void;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-600 text-white";
      case "UNAVAILABLE":
        return "bg-yellow-600 text-white";
      case "MAINTENANCE":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return <CheckCircle2 className="w-3 h-3" />;
      case "UNAVAILABLE":
        return <Clock className="w-3 h-3" />;
      case "MAINTENANCE":
        return <Settings className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "COMPUTE":
      case "EQUIPMENT":
        return <Cpu className="w-5 h-5 text-brand-600" />;
      case "DATA":
        return <Database className="w-5 h-5 text-brand-600" />;
      case "ROOM":
        return <Monitor className="w-5 h-5 text-brand-600" />;
      case "SOFTWARE":
        return <Server className="w-5 h-5 text-brand-600" />;
      default:
        return <HardDrive className="w-5 h-5 text-brand-600" />;
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "Available";
      case "UNAVAILABLE":
        return "In Use";
      case "MAINTENANCE":
        return "Maintenance";
      default:
        return status;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card className="group h-full overflow-hidden bg-white hover:shadow-2xl hover:shadow-brand-500/20 transition-all duration-300 border border-gray-200 hover:border-brand-300">
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-100 rounded-lg">
                {getTypeIcon(resource.type)}
              </div>
              <div>
                <Badge variant="outline" className="mb-2 text-xs">
                  {resource.type}
                </Badge>
              </div>
            </div>
            <Badge
              className={`${getStatusColor(
                resource.status
              )} flex items-center gap-1`}
            >
              {getStatusIcon(resource.status)}
              {formatStatus(resource.status)}
            </Badge>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-600 transition-colors">
            {resource.name}
          </h3>

          {/* Description */}
          {resource.description && (
            <p className="text-gray-600 text-sm line-clamp-2">
              {resource.description}
            </p>
          )}

          {/* Specifications */}
          {resource.specifications && (
            <div className="space-y-2 pt-2">
              {Object.entries(resource.specifications)
                .slice(0, 3)
                .map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-gray-500">{key}:</span>
                    <span className="text-gray-900 font-medium">{value}</span>
                  </div>
                ))}
            </div>
          )}

          {/* Footer */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            {resource.location && (
              <div className="text-sm text-gray-600">{resource.location}</div>
            )}

            {/* Booking Info */}
            {resource.activeBookingsCount !== undefined && (
              <div className="text-xs text-gray-500">
                Active bookings: {resource.activeBookingsCount}
              </div>
            )}

            {/* Book Button */}
            <Button
              onClick={() => onBook(resource)}
              disabled={!resource.bookable || resource.status !== "AVAILABLE"}
              className="w-full"
              variant={
                resource.bookable && resource.status === "AVAILABLE"
                  ? "default"
                  : "outline"
              }
            >
              <Calendar className="w-4 h-4 mr-2" />
              {resource.status === "AVAILABLE"
                ? "Book Resource"
                : "Unavailable"}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
