"use client";

// ViewMode type for view switching functionality
type ViewMode = "patience" | "organization";

interface HeroProps {
  viewMode: ViewMode;
}

export function Hero({ viewMode }: HeroProps) {
  const isPatience = viewMode === "patience";

  return (
    <section className="relative min-h-[600px] flex items-center justify-center bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-display">
          {isPatience ? (
            <>
              Patience Fero
              <span className="block text-3xl md:text-4xl font-normal mt-4 text-brand-100">
                Computer Scientist & Researcher
              </span>
            </>
          ) : (
            <>
              Her Promise Fulfilled
              <span className="block text-3xl md:text-4xl font-normal mt-4 text-brand-100">
                Empowering Communities Through Innovation
              </span>
            </>
          )}
        </h1>

        <p className="text-xl md:text-2xl text-brand-100 mb-8 max-w-3xl mx-auto">
          {isPatience
            ? "Advancing the frontiers of computer science through innovative research and dedication to excellence."
            : "A non-profit organization dedicated to creating positive change through technology and community engagement."}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="#content"
            className="px-8 py-3 bg-white text-brand-600 rounded-lg font-semibold hover:bg-brand-50 transition-colors shadow-lg"
          >
            Learn More
          </a>
          <a
            href={isPatience ? "/papers" : "/programs"}
            className="px-8 py-3 bg-brand-500 text-white rounded-lg font-semibold hover:bg-brand-400 transition-colors border-2 border-white/30"
          >
            {isPatience ? "View Publications" : "Explore Programs"}
          </a>
        </div>

        {/* Quick Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {isPatience ? (
            <>
              <div className="text-white">
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-brand-100 text-sm uppercase tracking-wide">
                  Publications
                </div>
              </div>
              <div className="text-white">
                <div className="text-4xl font-bold mb-2">15+</div>
                <div className="text-brand-100 text-sm uppercase tracking-wide">
                  Projects
                </div>
              </div>
              <div className="text-white">
                <div className="text-4xl font-bold mb-2">10+</div>
                <div className="text-brand-100 text-sm uppercase tracking-wide">
                  Awards
                </div>
              </div>
              <div className="text-white">
                <div className="text-4xl font-bold mb-2">5+</div>
                <div className="text-brand-100 text-sm uppercase tracking-wide">
                  Years Experience
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-white">
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-brand-100 text-sm uppercase tracking-wide">
                  Lives Impacted
                </div>
              </div>
              <div className="text-white">
                <div className="text-4xl font-bold mb-2">20+</div>
                <div className="text-brand-100 text-sm uppercase tracking-wide">
                  Programs
                </div>
              </div>
              <div className="text-white">
                <div className="text-4xl font-bold mb-2">10+</div>
                <div className="text-brand-100 text-sm uppercase tracking-wide">
                  Communities
                </div>
              </div>
              <div className="text-white">
                <div className="text-4xl font-bold mb-2">$100K+</div>
                <div className="text-brand-100 text-sm uppercase tracking-wide">
                  Funds Raised
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
}
