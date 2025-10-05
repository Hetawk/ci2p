/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from "next";
import Image from "next/image";
import { Heart, Users, Target, ArrowRight, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Programs | Her Promise Fulfilled",
  description:
    "Empowering communities through education, mentorship, and support",
};

async function getPrograms() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/programs`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching programs:", error);
    return [];
  }
}

export default async function ProgramsPage() {
  const programs = await getPrograms();
  const activePrograms = programs.filter((p: any) => p.active);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20" />
          <div className="absolute top-20 left-20 w-72 h-72 bg-pink-400/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-6">
              <Sparkles className="w-5 h-5 text-pink-600" />
              <span className="text-sm font-medium text-gray-700">
                Empowering Communities
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Our <span className="text-pink-600">Programs</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Creating lasting change through education, mentorship, and
              community support
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-600 mb-2">
                  {activePrograms.length}+
                </div>
                <div className="text-sm text-gray-600">Active Programs</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {activePrograms.reduce(
                    (acc: number, p: any) => acc + (p.beneficiaries || 0),
                    0
                  )}
                  +
                </div>
                <div className="text-sm text-gray-600">Lives Impacted</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-600 mb-2">
                  100%
                </div>
                <div className="text-sm text-gray-600">Dedicated</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {activePrograms.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 text-pink-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Programs coming soon
              </h3>
              <p className="text-gray-600">
                We&apos;re working on exciting new programs to serve our
                community better!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {activePrograms.map((program: any, index: number) => (
                <div
                  key={program.id}
                  className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Featured Badge */}
                  {program.featured && (
                    <div className="absolute top-6 right-6 z-10 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-bold rounded-full shadow-lg">
                      <Sparkles className="w-4 h-4 inline mr-1" />
                      Featured
                    </div>
                  )}

                  {/* Image */}
                  {program.image && (
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={program.image}
                        alt={program.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                      {/* Category Badge */}
                      <div className="absolute bottom-6 left-6">
                        <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-900 rounded-full text-sm font-bold">
                          {program.category}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-8">
                    <h3 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-pink-600 transition-colors">
                      {program.name}
                    </h3>

                    <p className="text-gray-600 mb-6 line-clamp-3">
                      {program.description}
                    </p>

                    {/* Impact Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {program.beneficiaries > 0 && (
                        <div className="flex items-center gap-3 p-4 bg-pink-50 rounded-xl">
                          <Users className="w-8 h-8 text-pink-600" />
                          <div>
                            <div className="text-2xl font-bold text-gray-900">
                              {program.beneficiaries}+
                            </div>
                            <div className="text-sm text-gray-600">
                              Beneficiaries
                            </div>
                          </div>
                        </div>
                      )}

                      {program.location && (
                        <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
                          <Target className="w-8 h-8 text-purple-600" />
                          <div>
                            <div className="text-lg font-bold text-gray-900">
                              {program.location}
                            </div>
                            <div className="text-sm text-gray-600">
                              Location
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Impact Text */}
                    {program.impact && (
                      <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl mb-6">
                        <p className="text-sm text-gray-700 italic">
                          &quot;{program.impact}&quot;
                        </p>
                      </div>
                    )}

                    {/* Learn More Link */}
                    <button className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg">
                      Learn More
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-pink-500 to-purple-500 rounded-3xl p-12 text-center text-white shadow-2xl">
            <Heart className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">Want to Get Involved?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join us in making a difference in the lives of others
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-8 py-4 bg-white text-pink-600 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg">
                Volunteer Today
              </button>
              <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300">
                Donate Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
