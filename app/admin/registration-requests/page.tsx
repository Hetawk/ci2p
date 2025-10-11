"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  UserPlus,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  GraduationCap,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Pagination from "@/components/ui/Pagination";

type RegistrationStatus = "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED";

interface RegistrationRequest {
  id: string;
  email: string;
  fullName: string;
  chineseName?: string;
  requestedRole: string;
  phone?: string;
  universityId?: string;
  major?: string;
  institution?: string;
  degree?: string;
  supervisor?: string;
  researchInterests?: string;
  message?: string;
  status: RegistrationStatus;
  createdAt: string;
  updatedAt: string;
}

export default function RegistrationRequestsPage() {
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<
    RegistrationRequest[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<RegistrationStatus | "ALL">(
    "PENDING"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] =
    useState<RegistrationRequest | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const itemsPerPage = 10;

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/registration-requests");
      if (!response.ok) throw new Error("Failed to fetch requests");
      const data = await response.json();
      setRequests(data.requests || []);
    } catch (error) {
      console.error("Error fetching registration requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterRequests = useCallback(() => {
    let filtered = requests;

    // Filter by status
    if (filterStatus !== "ALL") {
      filtered = filtered.filter((req) => req.status === filterStatus);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (req) =>
          req.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          req.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          req.chineseName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [requests, filterStatus, searchQuery]);

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [filterRequests]);

  const handleApprove = async (request: RegistrationRequest) => {
    setSelectedRequest(request);
  };

  const handleReject = async (requestId: string) => {
    if (!confirm("Are you sure you want to reject this application?")) return;

    setIsProcessing(true);
    try {
      const response = await fetch(
        `/api/admin/registration-requests/${requestId}/reject`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rejectionReason: "Application did not meet requirements.",
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to reject request");

      await fetchRequests();
      alert("Application rejected successfully");
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("Failed to reject application");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmitApproval = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedRequest) return;

    const formData = new FormData(e.currentTarget);
    const memberId = formData.get("memberId") as string;
    const universityId = formData.get("universityId") as string;
    const username = formData.get("username") as string;

    if (!memberId || !username) {
      alert("Member ID and Username are required");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch(
        `/api/admin/registration-requests/${selectedRequest.id}/approve`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            memberId,
            universityId,
            username,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to approve request");
      }

      await fetchRequests();
      setSelectedRequest(null);
      alert(
        "Application approved successfully! User credentials have been sent via email."
      );
    } catch (error) {
      console.error("Error approving request:", error);
      alert(
        error instanceof Error ? error.message : "Failed to approve application"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const statusIcons = {
    PENDING: <Clock className="w-4 h-4" />,
    APPROVED: <CheckCircle className="w-4 h-4" />,
    REJECTED: <XCircle className="w-4 h-4" />,
    EXPIRED: <AlertCircle className="w-4 h-4" />,
  };

  const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
    APPROVED: "bg-green-100 text-green-800 border-green-300",
    REJECTED: "bg-red-100 text-red-800 border-red-300",
    EXPIRED: "bg-gray-100 text-gray-800 border-gray-300",
  };

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequests = filteredRequests.slice(startIndex, endIndex);

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
            Registration Requests
          </h1>
          <p className="text-gray-600">
            Review and manage new user registration applications
          </p>
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
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <Label htmlFor="status">Filter by Status</Label>
                <select
                  id="status"
                  value={filterStatus}
                  onChange={(e) =>
                    setFilterStatus(
                      e.target.value as RegistrationStatus | "ALL"
                    )
                  }
                  className="w-full h-10 border border-gray-300 rounded-md px-3"
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="EXPIRED">Expired</option>
                </select>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-800">
                  {requests.filter((r) => r.status === "PENDING").length}
                </div>
                <div className="text-sm text-yellow-600">Pending</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-800">
                  {requests.filter((r) => r.status === "APPROVED").length}
                </div>
                <div className="text-sm text-green-600">Approved</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-800">
                  {requests.filter((r) => r.status === "REJECTED").length}
                </div>
                <div className="text-sm text-red-600">Rejected</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">
                  {requests.length}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requests List */}
        <div className="space-y-4">
          {currentRequests.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No registration requests found</p>
              </CardContent>
            </Card>
          ) : (
            currentRequests.map((request) => (
              <Card
                key={request.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {request.fullName}
                          {request.chineseName && (
                            <span className="ml-2 text-gray-600">
                              ({request.chineseName})
                            </span>
                          )}
                        </h3>
                        <Badge
                          variant="outline"
                          className={statusColors[request.status]}
                        >
                          {statusIcons[request.status]}
                          <span className="ml-1">{request.status}</span>
                        </Badge>
                        <Badge variant="outline" className="bg-blue-50">
                          {request.requestedRole}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {request.email}
                        </div>
                        {request.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {request.phone}
                          </div>
                        )}
                        {request.institution && (
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" />
                            {request.institution}
                          </div>
                        )}
                        {request.major && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Major:</span>
                            {request.major}
                          </div>
                        )}
                      </div>

                      {request.researchInterests && (
                        <div className="mt-3 text-sm">
                          <span className="font-medium text-gray-700">
                            Research Interests:
                          </span>
                          <p className="text-gray-600 mt-1">
                            {request.researchInterests}
                          </p>
                        </div>
                      )}

                      <div className="mt-3 text-xs text-gray-500">
                        Applied on:{" "}
                        {new Date(request.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </div>
                    </div>

                    {request.status === "PENDING" && (
                      <div className="flex gap-2 ml-4">
                        <Button
                          onClick={() => handleApprove(request)}
                          className="bg-green-600 hover:bg-green-700"
                          disabled={isProcessing}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleReject(request.id)}
                          variant="outline"
                          className="border-red-300 text-red-600 hover:bg-red-50"
                          disabled={isProcessing}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}
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

        {/* Approval Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Approve Registration Request
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {selectedRequest.fullName}
                    {selectedRequest.chineseName &&
                      ` (${selectedRequest.chineseName})`}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedRequest.email}
                  </p>
                  <Badge className="mt-2">
                    {selectedRequest.requestedRole}
                  </Badge>
                </div>

                <form onSubmit={handleSubmitApproval} className="space-y-4">
                  <div>
                    <Label htmlFor="memberId">
                      Lab Member ID <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="memberId"
                      name="memberId"
                      placeholder="e.g., CI2PSTD001, CI2PRES001"
                      required
                      disabled={isProcessing}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Format: CI2PSTD### for students, CI2PRES### for
                      researchers
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="universityId">
                      University ID (Optional)
                    </Label>
                    <Input
                      id="universityId"
                      name="universityId"
                      placeholder="e.g., 202324100003"
                      disabled={isProcessing}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Can be added later if not yet enrolled
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="username">
                      Username <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="username"
                      name="username"
                      placeholder="e.g., john-doe"
                      required
                      disabled={isProcessing}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Lowercase, alphanumeric with hyphens
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve & Create Account
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSelectedRequest(null)}
                      disabled={isProcessing}
                    >
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
