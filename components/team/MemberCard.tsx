"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Linkedin, Github, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  category: "faculty" | "masters" | "undergrad" | "alumni";
  photo?: string;
  email?: string;
  researchInterests?: string[];
  linkedin?: string;
  github?: string;
  orcid?: string;
  website?: string;
  graduationYear?: string;
  currentPosition?: string;
}

interface MemberCardProps {
  member: TeamMember;
  index: number;
}

export function MemberCard({ member, index }: MemberCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/team/${member.id}`}>
        <Card className="group relative overflow-hidden bg-white hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-300 border border-gray-200 hover:border-primary-300 cursor-pointer">
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 via-secondary-500/0 to-purple-500/0 group-hover:from-primary-500/5 group-hover:via-secondary-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none" />

          <div className="relative p-6 space-y-4">
          {/* Photo */}
          <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
            {member.photo ? (
              <Image
                src={member.photo}
                alt={member.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100">
                <span className="text-4xl font-bold text-primary-600">
                  {member.name.charAt(0)}
                </span>
              </div>
            )}

            {/* Category badge */}
            <div className="absolute top-3 right-3">
              <Badge
                variant={
                  member.category === "faculty" ? "default" : "secondary"
                }
                className={`
                  ${
                    member.category === "faculty"
                      ? "bg-primary-600 text-white"
                      : member.category === "masters"
                      ? "bg-secondary-600 text-white"
                      : member.category === "undergrad"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-600 text-white"
                  }
                  shadow-lg
                `}
              >
                {member.category === "faculty"
                  ? "Faculty"
                  : member.category === "masters"
                  ? "Master's"
                  : member.category === "undergrad"
                  ? "Undergrad"
                  : "Alumni"}
              </Badge>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
              {member.name}
            </h3>
            <p className="text-sm font-medium text-primary-600">
              {member.role}
            </p>

            {member.graduationYear && (
              <p className="text-xs text-gray-500">
                Graduated: {member.graduationYear}
              </p>
            )}

            {member.currentPosition && (
              <p className="text-xs text-gray-600 font-medium">
                {member.currentPosition}
              </p>
            )}
          </div>

          {/* Research Interests */}
          {member.researchInterests && member.researchInterests.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-700">
                Research Interests:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {member.researchInterests.slice(0, 3).map((interest, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                  >
                    {interest}
                  </Badge>
                ))}
                {member.researchInterests.length > 3 && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-gray-50 text-gray-600 border-gray-200"
                  >
                    +{member.researchInterests.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Social Links */}
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="p-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-all"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}
            {member.github && (
              <a
                href={`https://github.com/${member.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {member.orcid && (
              <a
                href={`https://orcid.org/${member.orcid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all"
                title="ORCID"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {member.website && (
              <a
                href={member.website}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-gray-600 hover:text-secondary-600 hover:bg-secondary-50 transition-all"
                title="Website"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
