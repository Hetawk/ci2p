/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from "next";
import {
  TrendingUp,
  Users,
  Heart,
  Award,
  Target,
  Sparkles,
  Globe,
  Book,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Our Impact | Her Promise Fulfilled",
  description: "See the real difference we're making in communities worldwide",
};

async function getImpactMetrics() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/impact`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching impact metrics:", error);
    return [];
  }
}

const iconMap: Record<string, any> = {
  users: Users,
  heart: Heart,
  award: Award,
  target: Target,
  globe: Globe,
  book: Book,
  trending: TrendingUp,
};

export default async function ImpactPage() {
  const metrics = await getImpactMetrics();
  const activeMetrics = metrics.filter((m: any) => m.active);
  const featuredMetrics = activeMetrics.filter((m: any) => m.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20" />
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-400/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-400/30 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-6 animate-bounce">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">
                Making Real Difference
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Our <span className="text-purple-600">Impact</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Transforming lives, one promise at a time. See the measurable
              difference we&apos;re making in communities around the world.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Impact Metrics */}
      {featuredMetrics.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12">
                Key <span className="text-purple-600">Achievements</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredMetrics.map((metric: any, index: number) => {
                  const Icon =
                    iconMap[metric.icon?.toLowerCase() || "heart"] || Heart;

                  return (
                    <div
                      key={metric.id}
                      className="relative group"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />

                      <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                        {/* Icon */}
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                          <Icon className="w-8 h-8 text-white" />
                        </div>

                        {/* Value */}
                        <div className="text-5xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                          {metric.value}
                        </div>

                        {/* Label */}
                        <h3 className="text-xl font-bold text-gray-700 mb-2">
                          {metric.label}
                        </h3>

                        {/* Description */}
                        {metric.description && (
                          <p className="text-gray-600 text-sm">
                            {metric.description}
                          </p>
                        )}

                        {/* Year Badge */}
                        {metric.year && (
                          <div className="mt-4 inline-block px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-bold">
                            {metric.year}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* All Impact Metrics */}
      {activeMetrics.length > featuredMetrics.length && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12">
                More <span className="text-pink-600">Metrics</span>
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {activeMetrics
                  .filter((m: any) => !m.featured)
                  .map((metric: any) => {
                    const Icon =
                      iconMap[metric.icon?.toLowerCase() || "heart"] || Heart;

                    return (
                      <div
                        key={metric.id}
                        className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center"
                      >
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <Icon className="w-6 h-6 text-purple-600" />
                        </div>

                        <div className="text-3xl font-bold text-gray-900 mb-2">
                          {metric.value}
                        </div>

                        <div className="text-sm font-medium text-gray-600">
                          {metric.label}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {activeMetrics.length === 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Impact metrics coming soon
              </h3>
              <p className="text-gray-600">
                We&apos;re tracking our progress and will share our impact
                metrics soon!
              </p>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-12 text-center text-white shadow-2xl">
            <Sparkles className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">Be Part of Our Story</h2>
            <p className="text-xl mb-8 opacity-90">
              Your support helps us create even greater impact in communities
              worldwide
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-8 py-4 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg">
                Support Our Cause
              </button>
              <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
