/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { Metadata } from "next";
import {
  Heart,
  DollarSign,
  Target,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Gift,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Donate | Her Promise Fulfilled",
  description: "Support our mission to empower and transform lives",
};

async function getCampaigns() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/donate/campaigns`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return [];
  }
}

const donationAmounts = [25, 50, 100, 250, 500, 1000];

export default async function DonatePage() {
  const campaigns = await getCampaigns();
  const activeCampaigns = campaigns.filter((c: any) => c.active);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-pink-500/20" />
          <div className="absolute top-20 left-20 w-72 h-72 bg-rose-400/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-400/30 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-6">
              <Heart className="w-5 h-5 text-rose-600 animate-pulse" />
              <span className="text-sm font-medium text-gray-700">
                Make a Difference Today
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Support Our <span className="text-rose-600">Mission</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Your generosity empowers us to transform lives and create lasting
              change in communities worldwide
            </p>
          </div>
        </div>
      </section>

      {/* Quick Donate Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
              <div className="text-center mb-8">
                <Gift className="w-16 h-16 text-rose-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Make a One-Time Donation
                </h2>
                <p className="text-gray-600">
                  Choose an amount or enter your own
                </p>
              </div>

              {/* Amount Selection */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {donationAmounts.map((amount) => (
                  <button
                    key={amount}
                    className="py-6 px-6 bg-gradient-to-br from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 rounded-2xl border-2 border-transparent hover:border-rose-500 transition-all duration-300 group"
                  >
                    <div className="text-3xl font-bold text-gray-900 mb-1 group-hover:text-rose-600 transition-colors">
                      ${amount}
                    </div>
                    <div className="text-sm text-gray-600">One-time</div>
                  </button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or enter custom amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    placeholder="Enter amount"
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:outline-none text-lg"
                  />
                </div>
              </div>

              {/* Monthly Option */}
              <div className="mb-8 p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border-2 border-rose-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-rose-600 rounded"
                  />
                  <div>
                    <div className="font-bold text-gray-900">
                      Make this a monthly donation
                    </div>
                    <div className="text-sm text-gray-600">
                      Sustaining support creates lasting impact
                    </div>
                  </div>
                </label>
              </div>

              {/* Donate Button */}
              <button className="w-full py-6 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-lg rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                Donate Now
                <Heart className="w-5 h-5" />
              </button>

              {/* Trust Indicators */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span>Secure Donation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span>Tax Deductible</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span>100% Goes to Cause</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Active Campaigns */}
      {activeCampaigns.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12">
                Featured <span className="text-rose-600">Campaigns</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {activeCampaigns.map((campaign: any, index: number) => {
                  const progress = (campaign.raised / campaign.goal) * 100;

                  return (
                    <div
                      key={campaign.id}
                      className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Campaign Image */}
                      {campaign.image && (
                        <div className="relative h-56 overflow-hidden">
                          <img
                            src={campaign.image}
                            alt={campaign.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                      )}

                      <div className="p-8">
                        {/* Title */}
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                          {campaign.title}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 mb-6 line-clamp-2">
                          {campaign.description}
                        </p>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-bold text-gray-900">
                              ${campaign.raised.toLocaleString()} raised
                            </span>
                            <span className="text-gray-600">
                              of ${campaign.goal.toLocaleString()} goal
                            </span>
                          </div>
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                          <div className="text-sm text-gray-600 mt-2">
                            {progress.toFixed(0)}% funded
                          </div>
                        </div>

                        {/* Donate Button */}
                        <button className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center gap-2">
                          Support This Campaign
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Why Donate Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">
              Why Your <span className="text-rose-600">Support Matters</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8">
                <div className="w-20 h-20 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Direct Impact
                </h3>
                <p className="text-gray-600">
                  100% of your donation goes directly to funding our programs
                  and serving communities in need
                </p>
              </div>

              <div className="text-center p-8">
                <div className="w-20 h-20 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Proven Results
                </h3>
                <p className="text-gray-600">
                  Our transparent approach ensures every dollar creates
                  measurable and lasting change
                </p>
              </div>

              <div className="text-center p-8">
                <div className="w-20 h-20 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Transform Lives
                </h3>
                <p className="text-gray-600">
                  Your generosity empowers individuals and communities to build
                  better futures
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
