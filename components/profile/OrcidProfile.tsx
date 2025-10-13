"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Pagination from "@/components/ui/Pagination";
import {
  BookOpen,
  ExternalLink,
  FileText,
  Briefcase,
  GraduationCap,
  DollarSign,
  Eye,
  CheckCircle2,
  Edit,
  Plus,
} from "lucide-react";
import type { OrcidProfile as OrcidProfileType } from "@/lib/types/paper";

interface UnifiedPublication {
  id: string;
  title: string;
  year: number | null;
  publicationType: string;
  journal?: string | null;
  conference?: string | null;
  doi?: string | null;
  pdfUrl?: string | null;
  abstract?: string | null;
  customTags?: string | null;
  citations?: number | null;
  source: "orcid" | "manual";
  orcidPutCode?: string;
  isEnhanced?: boolean;
  createdAt?: Date;
}

interface OrcidProfileProps {
  orcidProfile?: OrcidProfileType;
  manualPublications?: UnifiedPublication[];
  isOwnProfile?: boolean;
}

const ITEMS_PER_PAGE = 6;

export default function OrcidProfile({
  orcidProfile,
  manualPublications = [],
  isOwnProfile = false,
}: OrcidProfileProps) {
  const [publicationsPage, setPublicationsPage] = useState(1);
  const [employmentPage, setEmploymentPage] = useState(1);
  const [educationPage, setEducationPage] = useState(1);
  const [fundingPage, setFundingPage] = useState(1);
  const [peerReviewsPage, setPeerReviewsPage] = useState(1);

  // Merge ORCID works with manual publications
  const allPublications: UnifiedPublication[] = [];
  const publicationsMap = new Map<string, UnifiedPublication>();

  // Add manual publications first (they have priority and more details)
  manualPublications.forEach((pub) => {
    const key = pub.doi || pub.id;
    publicationsMap.set(key, {
      ...pub,
      source: "manual",
    });
  });

  // Add ORCID works
  if (orcidProfile?.works) {
    orcidProfile.works.forEach((work) => {
      const key = work.doi || `orcid-${work.putCode}`;
      if (!publicationsMap.has(key)) {
        publicationsMap.set(key, {
          id: `orcid-${work.putCode}`,
          title: work.title,
          year: work.publicationDate?.year || null,
          publicationType: work.type || "OTHER",
          journal: work.journal,
          doi: work.doi,
          source: "orcid",
          orcidPutCode: work.putCode,
        });
      } else {
        // Mark existing manual entry as enhanced with ORCID
        const existing = publicationsMap.get(key);
        if (existing) {
          existing.isEnhanced = true;
          existing.orcidPutCode = work.putCode;
        }
      }
    });
  }

  // Convert to array and sort by year
  allPublications.push(...Array.from(publicationsMap.values()));
  allPublications.sort((a, b) => (b.year || 0) - (a.year || 0));

  const employment = orcidProfile?.employment || [];
  const education = orcidProfile?.education || [];
  const funding = orcidProfile?.funding || [];
  const peerReviews = orcidProfile?.peerReviews || [];

  // Pagination calculations
  const totalPublications = allPublications.length;
  const totalPublicationsPages = Math.ceil(totalPublications / ITEMS_PER_PAGE);
  const paginatedPublications = allPublications.slice(
    (publicationsPage - 1) * ITEMS_PER_PAGE,
    publicationsPage * ITEMS_PER_PAGE
  );

  const totalEmployment = employment.length;
  const totalEmploymentPages = Math.ceil(totalEmployment / ITEMS_PER_PAGE);
  const paginatedEmployment = employment.slice(
    (employmentPage - 1) * ITEMS_PER_PAGE,
    employmentPage * ITEMS_PER_PAGE
  );

  const totalEducation = education.length;
  const totalEducationPages = Math.ceil(totalEducation / ITEMS_PER_PAGE);
  const paginatedEducation = education.slice(
    (educationPage - 1) * ITEMS_PER_PAGE,
    educationPage * ITEMS_PER_PAGE
  );

  const totalFunding = funding.length;
  const totalFundingPages = Math.ceil(totalFunding / ITEMS_PER_PAGE);
  const paginatedFunding = funding.slice(
    (fundingPage - 1) * ITEMS_PER_PAGE,
    fundingPage * ITEMS_PER_PAGE
  );

  const totalPeerReviews = peerReviews.length;
  const totalPeerReviewsPages = Math.ceil(totalPeerReviews / ITEMS_PER_PAGE);
  const paginatedPeerReviews = peerReviews.slice(
    (peerReviewsPage - 1) * ITEMS_PER_PAGE,
    peerReviewsPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      {/* ORCID Badge */}
      {orcidProfile && (
        <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center justify-between">
            <a
              href={`https://orcid.org/${orcidProfile.orcid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-green-300 rounded-lg hover:bg-green-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 256 256">
                <path
                  fill="#A6CE39"
                  d="M256 128c0 70.7-57.3 128-128 128S0 198.7 0 128 57.3 0 128 0s128 57.3 128 128z"
                />
                <path
                  fill="#FFF"
                  d="M86.3 186.2H70.9V79.1h15.4v107.1zM108.9 79.1h41.6c39.6 0 57 28.3 57 53.6 0 27.5-21.5 53.6-56.8 53.6h-41.8V79.1zm15.4 93.3h24.5c34.9 0 42.9-26.5 42.9-39.7C191.7 111.2 178 93 148 93h-23.7v79.4zM88.7 56.8c0 5.5-4.5 10.1-10.1 10.1s-10.1-4.6-10.1-10.1c0-5.6 4.5-10.1 10.1-10.1s10.1 4.6 10.1 10.1z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                {orcidProfile.name.givenName} {orcidProfile.name.familyName}
              </span>
              <ExternalLink className="w-4 h-4 text-gray-500" />
            </a>

            {isOwnProfile && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/profile/edit">
                    <Edit className="w-4 h-4 mr-2" />
                    Manage ORCID
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}

      <Tabs defaultValue="publications" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-gradient-to-r from-blue-100 to-indigo-100">
          <TabsTrigger
            value="publications"
            className="text-xs sm:text-sm data-[state=active]:bg-white"
          >
            <BookOpen className="w-4 h-4 mr-1" />
            Publications ({allPublications.length})
          </TabsTrigger>
          <TabsTrigger
            value="employment"
            className="text-xs sm:text-sm data-[state=active]:bg-white"
          >
            <Briefcase className="w-4 h-4 mr-1" />
            Work ({employment.length})
          </TabsTrigger>
          <TabsTrigger
            value="education"
            className="text-xs sm:text-sm data-[state=active]:bg-white"
          >
            <GraduationCap className="w-4 h-4 mr-1" />
            Education ({education.length})
          </TabsTrigger>
          <TabsTrigger
            value="funding"
            className="text-xs sm:text-sm data-[state=active]:bg-white"
          >
            <DollarSign className="w-4 h-4 mr-1" />
            Funding ({funding.length})
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="text-xs sm:text-sm data-[state=active]:bg-white"
          >
            <Eye className="w-4 h-4 mr-1" />
            Reviews ({peerReviews.length})
          </TabsTrigger>
        </TabsList>

        {/* Publications Tab */}
        <TabsContent value="publications" className="mt-6 space-y-4">
          {totalPublications === 0 ? (
            <Card className="p-8 text-center bg-gradient-to-br from-gray-50 to-blue-50">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 mb-4">No publications found</p>
              {isOwnProfile && (
                <Button variant="outline" asChild>
                  <Link href="/dashboard/papers/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Publication
                  </Link>
                </Button>
              )}
            </Card>
          ) : (
            <>
              <div className="grid gap-4">
                {paginatedPublications.map((pub) => (
                  <Card
                    key={pub.id}
                    className="p-6 hover:shadow-md transition-shadow bg-gradient-to-br from-white to-blue-50/30"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-2">
                          {pub.source === "orcid" ? (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-300"
                            >
                              <svg
                                className="w-3 h-3 mr-1"
                                viewBox="0 0 256 256"
                              >
                                <path
                                  fill="currentColor"
                                  d="M256 128c0 70.7-57.3 128-128 128S0 198.7 0 128 57.3 0 128 0s128 57.3 128 128z"
                                />
                              </svg>
                              ORCID
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-300"
                            >
                              <FileText className="w-3 h-3 mr-1" />
                              Manual
                            </Badge>
                          )}
                          {pub.isEnhanced && (
                            <Badge
                              variant="outline"
                              className="bg-purple-50 text-purple-700 border-purple-300"
                            >
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>

                        <h3 className="font-semibold text-gray-900 mb-2 leading-snug">
                          {pub.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 mb-3">
                          {pub.year && (
                            <span className="font-medium">{pub.year}</span>
                          )}
                          {pub.journal && <span>{pub.journal}</span>}
                          {pub.conference && <span>{pub.conference}</span>}
                          {pub.publicationType && (
                            <Badge variant="secondary" className="text-xs">
                              {pub.publicationType}
                            </Badge>
                          )}
                        </div>

                        {pub.abstract && (
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {pub.abstract}
                          </p>
                        )}

                        {pub.customTags && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {pub.customTags
                              .split(",")
                              .slice(0, 4)
                              .map((tag, i) => (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  className="text-xs bg-white"
                                >
                                  {tag.trim()}
                                </Badge>
                              ))}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                          {pub.doi && (
                            <a
                              href={`https://doi.org/${pub.doi}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                            >
                              DOI: {pub.doi}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {pub.pdfUrl && (
                            <a
                              href={pub.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-green-600 hover:underline flex items-center gap-1"
                            >
                              <FileText className="w-3 h-3" />
                              PDF
                            </a>
                          )}
                          {pub.citations !== null &&
                            pub.citations !== undefined && (
                              <span className="text-xs text-gray-500">
                                {pub.citations} citations
                              </span>
                            )}
                        </div>
                      </div>

                      {isOwnProfile && pub.source === "manual" && (
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/papers/${pub.id}/edit`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              {totalPublicationsPages > 1 && (
                <Pagination
                  currentPage={publicationsPage}
                  totalPages={totalPublicationsPages}
                  onPageChange={setPublicationsPage}
                />
              )}

              {isOwnProfile && (
                <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <p className="text-sm text-gray-700 mb-3">
                    <strong>Tip:</strong> Publications from ORCID are
                    automatically synced. You can add additional details or
                    manually add publications not in ORCID.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/papers/new">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Manual Publication
                    </Link>
                  </Button>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        {/* Employment Tab */}
        <TabsContent value="employment" className="mt-6 space-y-4">
          {totalEmployment === 0 ? (
            <Card className="p-8 text-center bg-gradient-to-br from-gray-50 to-purple-50">
              <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No employment history found</p>
            </Card>
          ) : (
            <>
              <div className="grid gap-4">
                {paginatedEmployment.map((emp, idx) => (
                  <Card
                    key={idx}
                    className="p-6 bg-gradient-to-br from-white to-purple-50/30"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-blue-100">
                        <Briefcase className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {emp.role || "Position"}
                        </h3>
                        <p className="text-gray-700 mb-2">{emp.organization}</p>
                        {emp.department && (
                          <p className="text-sm text-gray-600 mb-2">
                            {emp.department}
                          </p>
                        )}
                        {(emp.city || emp.country) && (
                          <p className="text-sm text-gray-500 mb-2">
                            {[emp.city, emp.country].filter(Boolean).join(", ")}
                          </p>
                        )}
                        <p className="text-sm text-gray-500">
                          {emp.startDate}
                          {emp.endDate ? ` - ${emp.endDate}` : " - Present"}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {totalEmploymentPages > 1 && (
                <Pagination
                  currentPage={employmentPage}
                  totalPages={totalEmploymentPages}
                  onPageChange={setEmploymentPage}
                />
              )}
            </>
          )}
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education" className="mt-6 space-y-4">
          {totalEducation === 0 ? (
            <Card className="p-8 text-center bg-gradient-to-br from-gray-50 to-green-50">
              <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No education history found</p>
            </Card>
          ) : (
            <>
              <div className="grid gap-4">
                {paginatedEducation.map((edu, idx) => (
                  <Card
                    key={idx}
                    className="p-6 bg-gradient-to-br from-white to-green-50/30"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-purple-100">
                        <GraduationCap className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {edu.degree || "Degree"}
                        </h3>
                        <p className="text-gray-700 mb-2">{edu.institution}</p>
                        {edu.department && (
                          <p className="text-sm text-gray-600 mb-2">
                            {edu.department}
                          </p>
                        )}
                        <p className="text-sm text-gray-500">
                          {edu.startDate}
                          {edu.endDate ? ` - ${edu.endDate}` : " - Present"}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {totalEducationPages > 1 && (
                <Pagination
                  currentPage={educationPage}
                  totalPages={totalEducationPages}
                  onPageChange={setEducationPage}
                />
              )}
            </>
          )}
        </TabsContent>

        {/* Funding Tab */}
        <TabsContent value="funding" className="mt-6 space-y-4">
          {totalFunding === 0 ? (
            <Card className="p-8 text-center bg-gradient-to-br from-gray-50 to-yellow-50">
              <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No funding information found</p>
            </Card>
          ) : (
            <>
              <div className="grid gap-4">
                {paginatedFunding.map((fund, idx) => (
                  <Card
                    key={idx}
                    className="p-6 bg-gradient-to-br from-white to-yellow-50/30"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-green-100">
                        <DollarSign className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {fund.title}
                        </h3>
                        <p className="text-gray-700 mb-2">
                          {fund.organization}
                        </p>
                        {(fund.amount || fund.currency) && (
                          <p className="text-sm text-gray-600 mb-2">
                            {fund.currency} {fund.amount}
                          </p>
                        )}
                        <p className="text-sm text-gray-500">
                          {fund.startDate}
                          {fund.endDate ? ` - ${fund.endDate}` : " - Ongoing"}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {totalFundingPages > 1 && (
                <Pagination
                  currentPage={fundingPage}
                  totalPages={totalFundingPages}
                  onPageChange={setFundingPage}
                />
              )}
            </>
          )}
        </TabsContent>

        {/* Peer Reviews Tab */}
        <TabsContent value="reviews" className="mt-6 space-y-4">
          {totalPeerReviews === 0 ? (
            <Card className="p-8 text-center bg-gradient-to-br from-gray-50 to-orange-50">
              <Eye className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No peer review activity found</p>
            </Card>
          ) : (
            <>
              <div className="grid gap-4">
                {paginatedPeerReviews.map((review, idx) => (
                  <Card
                    key={idx}
                    className="p-6 bg-gradient-to-br from-white to-orange-50/30"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-orange-100">
                        <Eye className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {review.title || "Peer Review"}
                        </h3>
                        {review.organization && (
                          <p className="text-sm text-gray-700 mb-2">
                            {review.organization}
                          </p>
                        )}
                        {review.role && (
                          <p className="text-sm text-gray-600 mb-2">
                            Role: {review.role}
                          </p>
                        )}
                        {review.completionDate && (
                          <p className="text-sm text-gray-500">
                            {review.completionDate}
                          </p>
                        )}
                        {review.url && (
                          <a
                            href={review.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-2"
                          >
                            View Details
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {totalPeerReviewsPages > 1 && (
                <Pagination
                  currentPage={peerReviewsPage}
                  totalPages={totalPeerReviewsPages}
                  onPageChange={setPeerReviewsPage}
                />
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
