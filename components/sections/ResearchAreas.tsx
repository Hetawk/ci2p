"use client";

// Research Areas Showcase Section
// Displays CI2P Lab's main research focuses

import {
  Brain,
  Cpu,
  Image as ImageIcon,
  Network,
  Zap,
  Database,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const researchAreas = [
  {
    icon: Brain,
    title: "Machine Learning",
    description:
      "Advanced ML algorithms and deep learning architectures for intelligent systems",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Cpu,
    title: "Artificial Intelligence",
    description:
      "Cutting-edge AI research in computer vision, NLP, and autonomous systems",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: ImageIcon,
    title: "Image Processing",
    description:
      "Novel techniques for image analysis, enhancement, and computer vision applications",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Network,
    title: "Neural Networks",
    description:
      "Deep neural network architectures and optimization techniques",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Zap,
    title: "Intelligent Computing",
    description:
      "High-performance computing solutions for complex problem solving",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Database,
    title: "Data Science",
    description:
      "Big data analytics, data mining, and pattern recognition research",
    color: "from-indigo-500 to-blue-500",
  },
];

export function ResearchAreas() {
  return (
    <section className="relative py-20 px-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Research Focus Areas
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pioneering research in intelligent computing technology and
            artificial intelligence at the University of Jinan
          </p>
        </div>

        {/* Research Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {researchAreas.map((area, index) => {
            const Icon = area.icon;

            return (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 overflow-hidden relative"
              >
                {/* Gradient Background Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${area.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />

                <CardContent className="p-6 relative">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${area.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {area.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {area.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
