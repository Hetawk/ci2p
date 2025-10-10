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
  Zap,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
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
  specifications: Record<string, any> | null;
  activeBookingsCount?: number;
  nextAvailableTime?: string | null;
}

// Mock resources data
const mockResources: Resource[] = [
  {
    id: "1",
    name: "High-Performance GPU Cluster",
    category: "Computing",
    description:
      "Dedicated GPU cluster for deep learning training and inference with 8x NVIDIA A100 GPUs.",
    specifications: {
      GPUs: "8x NVIDIA A100 80GB",
      CPU: "2x AMD EPYC 7763 (128 cores)",
      RAM: "1TB DDR4",
      Storage: "20TB NVMe SSD",
      Network: "200 Gbps InfiniBand",
    },
    status: "available",
    location: "Server Room A, Building 3",
    contact: "lab@ci2p.ujn.edu.cn",
  },
  {
    id: "2",
    name: "Workstation - Deep Learning",
    category: "Computing",
    description:
      "Individual workstation optimized for deep learning development and testing.",
    specifications: {
      GPU: "NVIDIA RTX 4090 24GB",
      CPU: "Intel i9-13900K (24 cores)",
      RAM: "128GB DDR5",
      Storage: "4TB NVMe SSD",
      Display: "Dual 4K Monitors",
    },
    status: "in-use",
    location: "Lab Room 201",
    contact: "lab@ci2p.ujn.edu.cn",
  },
  {
    id: "3",
    name: "Medical Imaging Database",
    category: "Data",
    description:
      "Curated collection of medical imaging datasets including retinal images, X-rays, and MRI scans.",
    specifications: {
      Size: "50TB",
      Datasets: "15 public datasets",
      Images: "2M+ annotated images",
      Formats: "DICOM, PNG, JPEG, NIFTI",
      Access: "Secure network drive",
    },
    status: "available",
    location: "Data Center",
    contact: "lab@ci2p.ujn.edu.cn",
  },
  {
    id: "4",
    name: "High-Resolution Display Wall",
    category: "Visualization",
    description:
      "4x4 display wall for data visualization and presentation of research results.",
    specifications: {
      Resolution: "15360x8640 (8K equivalent)",
      Size: "16 x 55-inch displays",
      Technology: "LED-backlit LCD",
      Connectivity: "DisplayPort, HDMI",
      Control: "Centralized management system",
    },
    status: "available",
    location: "Visualization Lab, Room 305",
    contact: "lab@ci2p.ujn.edu.cn",
  },
  {
    id: "5",
    name: "Cloud Computing Credits",
    category: "Cloud",
    description:
      "AWS and Azure cloud computing credits for scalable experiments and deployment.",
    specifications: {
      Provider: "AWS, Azure, Google Cloud",
      Credits: "$50,000/year",
      Services: "EC2, S3, Lambda, Azure ML",
      GPUs: "P3, P4, V100, A100 instances",
    },
    status: "available",
    location: "Cloud-based",
    contact: "lab@ci2p.ujn.edu.cn",
  },
  {
    id: "6",
    name: "3D Printer",
    category: "Fabrication",
    description:
      "Industrial-grade 3D printer for prototyping and hardware projects.",
    specifications: {
      Model: "Ultimaker S5 Pro Bundle",
      "Build Volume": "330 x 240 x 300 mm",
      Materials: "PLA, ABS, Nylon, TPU",
      "Layer Resolution": "20-200 microns",
      Features: "Dual extruder, air management",
    },
    status: "maintenance",
    location: "Fabrication Lab, Room 105",
    contact: "lab@ci2p.ujn.edu.cn",
  },
];

const categories = [
  "All",
  "Computing",
  "Data",
  "Visualization",
  "Cloud",
  "Fabrication",
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle, rgb(59 130 246 / 0.15) 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="absolute top-20 left-10 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-primary-500/20 rounded-2xl backdrop-blur-sm border border-primary-400/30">
                <Server className="w-8 h-8 text-primary-300" />
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
                  {mockResources.length}
                </div>
                <div className="text-sm text-gray-300">Total Resources</div>
              </div>
              <div className="w-px h-12 bg-gray-600" />
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-400">
                  {mockResources.filter((r) => r.status === "available").length}
                </div>
                <div className="text-sm text-gray-300">Available</div>
              </div>
              <div className="w-px h-12 bg-gray-600" />
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-400">
                  {categories.length - 1}
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
          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                className="border-primary-300 hover:bg-primary-50"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Resources Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockResources.map((resource, index) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                index={index}
              />
            ))}
          </div>

          {/* Booking Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-16"
          >
            <Card className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-primary-200">
              <div className="text-center max-w-2xl mx-auto space-y-4">
                <div className="flex justify-center">
                  <div className="p-4 bg-primary-600 rounded-2xl">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Need to Book a Resource?
                </h2>
                <p className="text-gray-700">
                  Lab members can request access to resources through our
                  booking system. Please contact the lab administrator for more
                  information.
                </p>
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                  <Button
                    className="bg-primary-600 hover:bg-primary-700"
                    asChild
                  >
                    <Link href="mailto:lab@ci2p.ujn.edu.cn">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Lab Admin
                    </Link>
                  </Button>
                  <Button variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    View Booking Calendar
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// Resource Card Component
function ResourceCard({
  resource,
  index,
}: {
  resource: Resource;
  index: number;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-600 text-white";
      case "in-use":
        return "bg-yellow-600 text-white";
      case "maintenance":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle2 className="w-3 h-3" />;
      case "in-use":
        return <Clock className="w-3 h-3" />;
      case "maintenance":
        return <Zap className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Computing":
        return <Cpu className="w-5 h-5 text-primary-600" />;
      case "Data":
        return <Database className="w-5 h-5 text-primary-600" />;
      case "Visualization":
        return <Monitor className="w-5 h-5 text-primary-600" />;
      case "Cloud":
        return <Server className="w-5 h-5 text-primary-600" />;
      case "Fabrication":
        return <HardDrive className="w-5 h-5 text-primary-600" />;
      default:
        return <Server className="w-5 h-5 text-primary-600" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card className="group h-full overflow-hidden bg-white hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-300 border border-gray-200 hover:border-primary-300">
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                {getCategoryIcon(resource.category)}
              </div>
              <div>
                <Badge variant="outline" className="mb-2 text-xs">
                  {resource.category}
                </Badge>
              </div>
            </div>
            <Badge
              className={`${getStatusColor(
                resource.status
              )} flex items-center gap-1`}
            >
              {getStatusIcon(resource.status)}
              {resource.status}
            </Badge>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
            {resource.name}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm line-clamp-2">
            {resource.description}
          </p>

          {/* Specifications */}
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

          {/* Footer */}
          <div className="pt-4 border-t border-gray-100 space-y-2">
            <div className="text-sm text-gray-600">{resource.location}</div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
