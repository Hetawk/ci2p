"use client";

// Research Showcase Slider
// Beautiful image carousel displaying CI2P Lab research visuals

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const researchImages = [
  {
    src: "/utils/machine_learning_robot.jpg",
    title: "Machine Learning & Robotics",
    description: "Advanced ML algorithms powering intelligent robotic systems",
  },
  {
    src: "/utils/deep-learning-simulation.jpg",
    title: "Deep Learning Simulation",
    description: "Neural network architectures and training visualizations",
  },
  {
    src: "/utils/dnn.jpg",
    title: "Deep Neural Networks",
    description: "Complex DNN architectures for image recognition",
  },
  {
    src: "/utils/dnn_flow.jpg",
    title: "Neural Network Flow",
    description: "Data flow and processing pipelines in neural networks",
  },
];

export function ResearchShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Auto-advance slider
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % researchImages.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex(
      (prev) => (prev - 1 + researchImages.length) % researchImages.length
    );
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
  };

  return (
    <section className="relative py-20 bg-gradient-to-br from-slate-50 via-white to-primary-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
              Our Research
            </span>{" "}
            in Action
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our cutting-edge work in AI, Machine Learning, and Image
            Processing
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative max-w-6xl mx-auto">
          {/* Main Slide */}
          <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.3 },
                }}
                className="absolute inset-0"
              >
                {/* Image */}
                <div className="relative w-full h-full">
                  <Image
                    src={researchImages[currentIndex].src}
                    alt={researchImages[currentIndex].title}
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12 text-white">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-3xl lg:text-4xl font-bold mb-3">
                      {researchImages[currentIndex].title}
                    </h3>
                    <p className="text-lg text-gray-200 max-w-2xl">
                      {researchImages[currentIndex].description}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-primary-600" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-primary-600" />
            </button>
          </div>

          {/* Thumbnail Navigation */}
          <div className="flex justify-center gap-4 mt-8">
            {researchImages.map((image, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative group transition-all ${
                  index === currentIndex
                    ? "ring-4 ring-primary-500 scale-110"
                    : "hover:scale-105 opacity-60 hover:opacity-100"
                }`}
              >
                <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.title}
                    fill
                    className="object-cover"
                  />
                  {/* Overlay on inactive */}
                  {index !== currentIndex && (
                    <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/20 transition-colors" />
                  )}
                </div>
                {/* Active Indicator */}
                {index === currentIndex && (
                  <motion.div
                    layoutId="activeSlide"
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary-500 rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Progress Indicators (Alternative) */}
          <div className="flex justify-center gap-2 mt-6">
            {researchImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="group"
                aria-label={`Go to slide ${index + 1}`}
              >
                <div
                  className={`h-1 rounded-full transition-all ${
                    index === currentIndex
                      ? "w-12 bg-gradient-to-r from-primary-500 to-secondary-500"
                      : "w-6 bg-gray-300 group-hover:bg-gray-400"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-accent-500/10 to-primary-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
    </section>
  );
}
