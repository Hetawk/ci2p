"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Camera } from "lucide-react";

const teamImages = [
  {
    src: "/team/research_meeeting.jpg",
    alt: "Research Team Meeting",
    caption:
      "Research Team Meeting - Collaborative discussions and brainstorming sessions",
  },
  {
    src: "/team/research-team-out.jpg",
    alt: "Research Team Outing",
    caption: "Research Team Outing - Building connections beyond the lab",
  },
  {
    src: "/team/research-team-outdoor.jpg",
    alt: "Research Team Outdoor Activity",
    caption: "Research Team Outdoor Activity - Team building and collaboration",
  },
  {
    src: "/team/workshop.jpg",
    alt: "Research Workshop",
    caption: "Research Workshop - Knowledge sharing and skill development",
  },
];

export default function TeamGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % teamImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(
      (prev) => (prev - 1 + teamImages.length) % teamImages.length
    );
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % teamImages.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Camera className="w-4 h-4" />
            Team Gallery
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Life at CI2P Lab
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Capturing moments of collaboration, innovation, and team spirit
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Main Image Display */}
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200">
            {teamImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  index === currentIndex
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-105"
                }`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <p className="text-lg md:text-xl font-medium drop-shadow-lg">
                    {image.caption}
                  </p>
                </div>
              </div>
            ))}

            {/* Navigation Buttons */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 group"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800 group-hover:text-blue-600" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 group"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 text-gray-800 group-hover:text-blue-600" />
            </button>
          </div>

          {/* Thumbnail Navigation */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            {teamImages.map((image, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative aspect-[16/9] rounded-xl overflow-hidden transition-all duration-300 ${
                  index === currentIndex
                    ? "ring-4 ring-blue-600 scale-105 shadow-xl"
                    : "ring-2 ring-gray-200 hover:ring-blue-400 opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
                {index === currentIndex && (
                  <div className="absolute inset-0 bg-blue-600/20" />
                )}
              </button>
            ))}
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {teamImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? "w-8 h-2 bg-blue-600"
                    : "w-2 h-2 bg-gray-300 hover:bg-blue-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Auto-play indicator */}
          <div className="text-center mt-4">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
              {isAutoPlaying ? "⏸ Pause" : "▶ Play"} slideshow
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
