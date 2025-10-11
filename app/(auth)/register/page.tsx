"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  UserPlus,
  Mail,
  User,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Phone,
  GraduationCap,
  Building2,
  FileText,
  Calendar,
  Briefcase,
} from "lucide-react";
import { motion } from "framer-motion";

type UserRole = "STUDENT" | "RESEARCHER";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    // Required fields
    fullName: "",
    email: "",
    requestedRole: "STUDENT" as UserRole,

    // Optional personal info
    chineseName: "",
    phone: "",

    // Optional academic info
    major: "",
    expectedGraduation: "",
    institution: "",
    degree: "",
    supervisor: "",

    // Optional additional info
    researchInterests: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [requestId, setRequestId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation - only email and full name are required
    if (!formData.email || !formData.fullName) {
      setError("Email and full name are required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration request failed");
      }

      setRequestId(data.requestId || "");
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <Card className="p-8 bg-white shadow-2xl">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Registration Request Submitted! 🎉
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Thank you for your interest in joining the CI2P Research Lab!
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-left">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  What happens next?
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">1.</span>
                    <span>
                      You&apos;ll receive a confirmation email shortly
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">2.</span>
                    <span>Our administrators will review your application</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">3.</span>
                    <span>
                      If approved, you&apos;ll receive temporary login
                      credentials
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">4.</span>
                    <span>
                      You&apos;ll set your own password on first login
                    </span>
                  </li>
                </ul>
              </div>

              {requestId && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600 mb-2">Your Request ID:</p>
                  <p className="font-mono text-sm text-gray-900 bg-white px-4 py-2 rounded border">
                    {requestId}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Save this ID for reference
                  </p>
                </div>
              )}

              <div className="text-sm text-gray-600 mb-6">
                <strong>Estimated review time:</strong> 2-3 business days
              </div>

              <div className="flex gap-4 justify-center">
                <Link href="/">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Return to Homepage
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline">
                    Already have an account? Login
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-40">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="p-8 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 shadow-2xl border border-white/50 backdrop-blur-sm">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <UserPlus className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Apply to Join CI2P Lab
            </h1>
            <p className="text-gray-700 font-medium">
              Submit your application to join our research community
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">
                  Registration Error
                </p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Info Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> Your application will be reviewed by our
                administrators. If approved, you&apos;ll receive login
                credentials via email.
              </p>
            </div>

            {/* Section 1: Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Basic Information
              </h3>

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-700 font-medium">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="pl-10 h-12 border-gray-300"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Chinese Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="chineseName"
                  className="text-gray-700 font-medium"
                >
                  Chinese Name (中文名)
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="chineseName"
                    type="text"
                    placeholder="张三"
                    value={formData.chineseName}
                    onChange={(e) =>
                      setFormData({ ...formData, chineseName: e.target.value })
                    }
                    className="pl-10 h-12 border-gray-300"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@ujn.edu.cn"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="pl-10 h-12 border-gray-300"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 font-medium">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+86 138-0000-0000"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="pl-10 h-12 border-gray-300"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Requested Role */}
              <div className="space-y-2">
                <Label
                  htmlFor="requestedRole"
                  className="text-gray-700 font-medium"
                >
                  Applying as <span className="text-red-500">*</span>
                </Label>
                <select
                  id="requestedRole"
                  value={formData.requestedRole}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      requestedRole: e.target.value as UserRole,
                    })
                  }
                  className="w-full h-12 border border-gray-300 rounded-md px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={isLoading}
                >
                  <option value="STUDENT">Student</option>
                  <option value="RESEARCHER">Researcher</option>
                </select>
              </div>
            </div>

            {/* Section 2: Academic Information */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                Academic Information
              </h3>

              <p className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <strong>Note:</strong> Your lab member ID and university ID will
                be assigned by administrators upon approval.
              </p>

              {/* Institution */}
              <div className="space-y-2">
                <Label
                  htmlFor="institution"
                  className="text-gray-700 font-medium"
                >
                  Institution
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="institution"
                    type="text"
                    placeholder="University of Jinan"
                    value={formData.institution}
                    onChange={(e) =>
                      setFormData({ ...formData, institution: e.target.value })
                    }
                    className="pl-10 h-12 border-gray-300"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Major */}
              <div className="space-y-2">
                <Label htmlFor="major" className="text-gray-700 font-medium">
                  Major / Department
                </Label>
                <Input
                  id="major"
                  type="text"
                  placeholder="Computer Science"
                  value={formData.major}
                  onChange={(e) =>
                    setFormData({ ...formData, major: e.target.value })
                  }
                  className="h-12 border-gray-300"
                  disabled={isLoading}
                />
              </div>

              {/* Degree */}
              <div className="space-y-2">
                <Label htmlFor="degree" className="text-gray-700 font-medium">
                  Degree Level
                </Label>
                <select
                  id="degree"
                  value={formData.degree}
                  onChange={(e) =>
                    setFormData({ ...formData, degree: e.target.value })
                  }
                  className="w-full h-12 border border-gray-300 rounded-md px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                >
                  <option value="">Select degree level</option>
                  <option value="Bachelor">Bachelor&apos;s</option>
                  <option value="Master">Master&apos;s</option>
                  <option value="PhD">PhD</option>
                  <option value="Postdoc">Postdoc</option>
                </select>
              </div>

              {/* Expected Graduation */}
              <div className="space-y-2">
                <Label
                  htmlFor="expectedGraduation"
                  className="text-gray-700 font-medium"
                >
                  Expected Graduation
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="expectedGraduation"
                    type="month"
                    value={formData.expectedGraduation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        expectedGraduation: e.target.value,
                      })
                    }
                    className="pl-10 h-12 border-gray-300"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Supervisor */}
              <div className="space-y-2">
                <Label
                  htmlFor="supervisor"
                  className="text-gray-700 font-medium"
                >
                  Supervisor / Advisor
                </Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="supervisor"
                    type="text"
                    placeholder="Prof. Sijie Niu"
                    value={formData.supervisor}
                    onChange={(e) =>
                      setFormData({ ...formData, supervisor: e.target.value })
                    }
                    className="pl-10 h-12 border-gray-300"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Research Interests */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Research & Additional Information
              </h3>

              {/* Research Interests */}
              <div className="space-y-2">
                <Label
                  htmlFor="researchInterests"
                  className="text-gray-700 font-medium"
                >
                  Research Interests
                </Label>
                <textarea
                  id="researchInterests"
                  placeholder="Describe your research interests and areas of expertise..."
                  value={formData.researchInterests}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      researchInterests: e.target.value,
                    })
                  }
                  className="w-full min-h-[100px] border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-gray-700 font-medium">
                  Additional Message
                </Label>
                <textarea
                  id="message"
                  placeholder="Any additional information you'd like to share..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full min-h-[100px] border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg shadow-blue-500/30 text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                  Submitting Application...
                </>
              ) : (
                <>
                  <UserPlus className="w-6 h-6 mr-2" />
                  Submit Application
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-700 font-semibold">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <Link href="/login">
              <Button
                variant="outline"
                className="w-full h-12 border-2 border-blue-300 hover:border-blue-500 hover:bg-blue-50 text-blue-700 font-semibold transition-all"
              >
                Sign In Instead
              </Button>
            </Link>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              ← Back to Homepage
            </Link>
          </div>
        </Card>

        {/* University Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-700 font-medium">
            University of Jinan - Key Laboratory of Intelligent Computing
            Technology
          </p>
        </div>
      </motion.div>
    </div>
  );
}
