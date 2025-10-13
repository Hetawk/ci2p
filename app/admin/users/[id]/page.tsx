"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, UserCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Pagination from "@/components/ui/Pagination";
import type { OrcidWork } from "@/lib/types";

const ITEMS_PER_PAGE = 6;

interface ProfileFormState {
  fullName: string;
  chineseName: string;
  title: string;
  bio: string;
  phone: string;
  office: string;
  email: string;
  website: string;
  github: string;
  linkedin: string;
  googleScholar: string;
  researchGate: string;
  memberId: string;
  universityId: string;
  showInTeam: boolean;
  teamOrder: string;
  orcidId: string;
  orcidEnabled: boolean;
  interests: string;
  publicationCount: string;
  projectCount: string;
  citationCount: string;
  hIndex: string;
}

interface AdminUserResponse {
  success: boolean;
  data: {
    id: string;
    email: string;
    username: string | null;
    role: string;
    active: boolean;
    emailVerified: boolean;
    profile?: {
      fullName: string;
      chineseName?: string | null;
      title?: string | null;
      bio?: string | null;
      phone?: string | null;
      office?: string | null;
      email?: string | null;
      website?: string | null;
      github?: string | null;
      linkedin?: string | null;
      googleScholar?: string | null;
      researchGate?: string | null;
      memberId?: string | null;
      universityId?: string | null;
      showInTeam: boolean;
      teamOrder?: number | null;
      orcidId?: string | null;
      orcidEnabled: boolean;
      interests?: string | null;
      publicationCount: number;
      projectCount: number;
      citationCount: number;
      hIndex: number;
    } | null;
    stats: {
      publications: number;
      projects: number;
      orcidWorks: number;
      mergedPublications: number;
    };
    publications: Array<{
      id: string;
      title: string;
      year: number;
      publicationType: string;
      journal?: string | null;
      doi?: string | null;
      source: "manual" | "orcid";
      orcidPutCode?: string;
      isEnhanced?: boolean;
      url?: string;
    }>;
    projects: Array<{
      id: string;
      project: {
        id: string;
        title: string;
        status: string;
        startDate: string;
        endDate?: string | null;
      };
    }>;
    orcidWorks: OrcidWork[];
  };
}

const ROLE_OPTIONS = ["SUPER_ADMIN", "ADMIN", "RESEARCHER", "STUDENT", "GUEST"];

const DEFAULT_PROFILE: ProfileFormState = {
  fullName: "",
  chineseName: "",
  title: "",
  bio: "",
  phone: "",
  office: "",
  email: "",
  website: "",
  github: "",
  linkedin: "",
  googleScholar: "",
  researchGate: "",
  memberId: "",
  universityId: "",
  showInTeam: true,
  teamOrder: "",
  orcidId: "",
  orcidEnabled: true,
  interests: "",
  publicationCount: "0",
  projectCount: "0",
  citationCount: "0",
  hIndex: "0",
};

export default function AdminUserDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<AdminUserResponse["data"] | null>(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("GUEST");
  const [active, setActive] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);
  const [profile, setProfile] = useState<ProfileFormState>(DEFAULT_PROFILE);
  const [newPassword, setNewPassword] = useState("");
  const [passwordFeedback, setPasswordFeedback] = useState<string | null>(null);
  const [settingPassword, setSettingPassword] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [publicationsPage, setPublicationsPage] = useState(1);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/admin/users/${params.id}`, {
          credentials: "include",
        });
        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          throw new Error(payload?.error || "Failed to load user");
        }
        const payload = (await response.json()) as AdminUserResponse;
        if (!payload.success) {
          throw new Error("Failed to load user");
        }

        const userData = payload.data;
        setUser({
          ...userData,
          orcidWorks: userData.orcidWorks || [],
        });
        setEmail(userData.email);
        setUsername(userData.username || "");
        setRole(userData.role);
        setActive(userData.active);
        setEmailVerified(userData.emailVerified);

        const profileData = userData.profile;
        setProfile({
          fullName: profileData?.fullName || "",
          chineseName: profileData?.chineseName || "",
          title: profileData?.title || "",
          bio: profileData?.bio || "",
          phone: profileData?.phone || "",
          office: profileData?.office || "",
          email: profileData?.email || "",
          website: profileData?.website || "",
          github: profileData?.github || "",
          linkedin: profileData?.linkedin || "",
          googleScholar: profileData?.googleScholar || "",
          researchGate: profileData?.researchGate || "",
          memberId: profileData?.memberId || "",
          universityId: profileData?.universityId || "",
          showInTeam: profileData?.showInTeam ?? true,
          teamOrder:
            profileData?.teamOrder !== null &&
            profileData?.teamOrder !== undefined
              ? String(profileData.teamOrder)
              : "",
          orcidId: profileData?.orcidId || "",
          orcidEnabled: profileData?.orcidEnabled ?? true,
          interests: profileData?.interests || "",
          publicationCount: String(profileData?.publicationCount ?? 0),
          projectCount: String(profileData?.projectCount ?? 0),
          citationCount: String(profileData?.citationCount ?? 0),
          hIndex: String(profileData?.hIndex ?? 0),
        });
      } catch (err) {
        console.error("Error loading user", err);
        setError(err instanceof Error ? err.message : "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [params.id]);

  const handleProfileChange = <K extends keyof ProfileFormState>(
    key: K,
    value: ProfileFormState[K]
  ) => {
    setProfile((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/users/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          username: username || null,
          role,
          active,
          emailVerified,
          profile: {
            ...profile,
            teamOrder: profile.teamOrder ? Number(profile.teamOrder) : null,
            publicationCount: Number(profile.publicationCount || 0),
            projectCount: Number(profile.projectCount || 0),
            citationCount: Number(profile.citationCount || 0),
            hIndex: Number(profile.hIndex || 0),
          },
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || "Failed to update user");
      }

      router.refresh();
    } catch (err) {
      console.error("Error updating user", err);
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async () => {
    if (!confirm("Deactivate this user account?")) return;

    setDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/users/${params.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || "Failed to deactivate user");
      }

      router.push("/admin/users");
    } catch (err) {
      console.error("Error deactivating user", err);
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setDeleting(false);
    }
  };

  const handleManualPasswordUpdate = async () => {
    const candidate = newPassword.trim();
    if (!candidate) {
      setPasswordFeedback("Enter a password before saving.");
      return;
    }

    setSettingPassword(true);
    setPasswordFeedback(null);

    try {
      const response = await fetch(`/api/admin/users/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password: candidate }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.error || "Failed to update password");
      }

      setPasswordFeedback(
        "Password updated. User must change it at next login."
      );
      setNewPassword("");
      router.refresh();
    } catch (err) {
      console.error("Error setting password", err);
      setPasswordFeedback(
        err instanceof Error
          ? err.message
          : "Unexpected error setting password."
      );
    } finally {
      setSettingPassword(false);
    }
  };

  const handleGeneratePassword = async () => {
    setResettingPassword(true);
    setPasswordFeedback(null);

    try {
      const response = await fetch(`/api/admin/users/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ resetPassword: true }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.error || "Failed to reset password");
      }

      const generated = payload?.generatedPassword as string | undefined;
      if (generated) {
        setPasswordFeedback(
          `Temporary password generated: ${generated}. Share securely and ask the user to change it after logging in.`
        );
      } else {
        setPasswordFeedback("Password reset successfully.");
      }
      setNewPassword("");
      router.refresh();
    } catch (err) {
      console.error("Error generating password", err);
      setPasswordFeedback(
        err instanceof Error
          ? err.message
          : "Unexpected error resetting password."
      );
    } finally {
      setResettingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto rounded-md border border-amber-200 bg-amber-50 px-4 py-6 text-center text-amber-700">
        {error || "User not found."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-blue-100 p-3">
            <UserCircle className="h-7 w-7 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Manage {profile.fullName || user.email}
            </h1>
            <div className="flex flex-wrap gap-2 text-sm text-gray-600">
              <span>{user.email}</span>
              <span>•</span>
              <span>{user.role}</span>
              <span>•</span>
              <span>{user.active ? "Active" : "Inactive"}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleDeactivate}
            disabled={deleting}
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Deactivate"
            )}
          </Button>
          <Link href="/admin/users">
            <Button variant="outline">Back to users</Button>
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Account Details
            </h2>
            <p className="text-sm text-gray-500">
              Update core account information. Role changes require SUPER_ADMIN
              privileges.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Username
              </label>
              <Input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Role</label>
              <select
                value={role}
                onChange={(event) => setRole(event.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                {ROLE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Member ID
              </label>
              <Input
                value={profile.memberId}
                onChange={(event) =>
                  handleProfileChange("memberId", event.target.value)
                }
                placeholder="CI2P001"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                University ID
              </label>
              <Input
                value={profile.universityId}
                onChange={(event) =>
                  handleProfileChange("universityId", event.target.value)
                }
                placeholder="202534100001"
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch checked={active} onCheckedChange={setActive} />
              <div>
                <div className="text-sm font-medium text-gray-900">Active</div>
                <p className="text-xs text-gray-500">
                  Inactive accounts cannot log in to the dashboard.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={emailVerified}
                onCheckedChange={setEmailVerified}
              />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Email Verified
                </div>
                <p className="text-xs text-gray-500">
                  Toggle if this user has verified their email address.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Password Management
            </h2>
            <p className="text-sm text-gray-500">
              Only SUPER_ADMIN accounts can update credentials. Temporary
              passwords will force a reset on the user&apos;s next login.
            </p>
          </div>

          {passwordFeedback && (
            <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
              {passwordFeedback}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Set Temporary Password
              </label>
              <Input
                type="text"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="Enter a temporary password"
              />
            </div>
            <div className="flex items-end gap-3">
              <Button
                type="button"
                variant="outline"
                className="border border-blue-600"
                onClick={handleManualPasswordUpdate}
                disabled={settingPassword}
              >
                {settingPassword ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving
                  </span>
                ) : (
                  "Save Password"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border border-gray-300"
                onClick={handleGeneratePassword}
                disabled={resettingPassword}
              >
                {resettingPassword ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Generating
                  </span>
                ) : (
                  "Generate Secure Password"
                )}
              </Button>
            </div>
          </div>
        </section>

        <section className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Profile Information
            </h2>
            <p className="text-sm text-gray-500">
              Details shown on the public website and internal dashboards.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <Input
                required
                value={profile.fullName}
                onChange={(event) =>
                  handleProfileChange("fullName", event.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Chinese Name
              </label>
              <Input
                value={profile.chineseName}
                onChange={(event) =>
                  handleProfileChange("chineseName", event.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <Input
                value={profile.title}
                onChange={(event) =>
                  handleProfileChange("title", event.target.value)
                }
                placeholder="Professor, PhD"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Lab Email (optional)
              </label>
              <Input
                type="email"
                value={profile.email}
                onChange={(event) =>
                  handleProfileChange("email", event.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <Input
                value={profile.phone}
                onChange={(event) =>
                  handleProfileChange("phone", event.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Office
              </label>
              <Input
                value={profile.office}
                onChange={(event) =>
                  handleProfileChange("office", event.target.value)
                }
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Biography
              </label>
              <Textarea
                rows={6}
                value={profile.bio}
                onChange={(event) =>
                  handleProfileChange("bio", event.target.value)
                }
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Research Interests
              </label>
              <Textarea
                rows={4}
                value={profile.interests}
                onChange={(event) =>
                  handleProfileChange("interests", event.target.value)
                }
                placeholder="Computer vision, medical imaging, trustworthy AI"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Website
              </label>
              <Input
                value={profile.website}
                onChange={(event) =>
                  handleProfileChange("website", event.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                GitHub
              </label>
              <Input
                value={profile.github}
                onChange={(event) =>
                  handleProfileChange("github", event.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                LinkedIn
              </label>
              <Input
                value={profile.linkedin}
                onChange={(event) =>
                  handleProfileChange("linkedin", event.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Google Scholar
              </label>
              <Input
                value={profile.googleScholar}
                onChange={(event) =>
                  handleProfileChange("googleScholar", event.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                ResearchGate
              </label>
              <Input
                value={profile.researchGate}
                onChange={(event) =>
                  handleProfileChange("researchGate", event.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                ORCID iD
              </label>
              <Input
                value={profile.orcidId}
                onChange={(event) =>
                  handleProfileChange("orcidId", event.target.value)
                }
                placeholder="0000-0002-1825-0097"
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={profile.orcidEnabled}
                onCheckedChange={(checked) =>
                  handleProfileChange("orcidEnabled", checked)
                }
              />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Auto-sync ORCID
                </div>
                <p className="text-xs text-gray-500">
                  Enable scheduled sync of publications and affiliations.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={profile.showInTeam}
                onCheckedChange={(checked) =>
                  handleProfileChange("showInTeam", checked)
                }
              />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Show in Team
                </div>
                <p className="text-xs text-gray-500">
                  Controls visibility on the public team page.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Team Order
              </label>
              <Input
                type="number"
                min={0}
                value={profile.teamOrder}
                onChange={(event) =>
                  handleProfileChange("teamOrder", event.target.value)
                }
              />
            </div>
          </div>
        </section>

        <section className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Academic Metrics
            </h2>
            <p className="text-sm text-gray-500">
              Override metrics if automated data is unavailable or outdated.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {[
              "publicationCount",
              "projectCount",
              "citationCount",
              "hIndex",
            ].map((field) => (
              <div key={field} className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {field === "publicationCount"
                    ? "Publications"
                    : field === "projectCount"
                    ? "Projects"
                    : field === "citationCount"
                    ? "Citations"
                    : "h-index"}
                </label>
                <Input
                  type="number"
                  min={0}
                  value={profile[field as keyof typeof profile] as string}
                  onChange={(event) =>
                    handleProfileChange(
                      field as keyof ProfileFormState,
                      event.target
                        .value as ProfileFormState[keyof ProfileFormState]
                    )
                  }
                />
              </div>
            ))}
          </div>
        </section>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            className="border border-gray-300"
            onClick={() => router.back()}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="border border-blue-600"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Saving
              </span>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-xl border bg-gradient-to-br from-white to-blue-50/30 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Publications
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {user.stats.mergedPublications} Total
              </Badge>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-300 text-xs"
              >
                {user.stats.orcidWorks} ORCID
              </Badge>
            </div>
          </div>
          {user.publications.length === 0 ? (
            <p className="text-sm text-gray-500">
              No publications recorded for this user.
            </p>
          ) : (
            <>
              <ul className="space-y-3">
                {user.publications
                  .slice(
                    (publicationsPage - 1) * ITEMS_PER_PAGE,
                    publicationsPage * ITEMS_PER_PAGE
                  )
                  .map((publication) => (
                    <li
                      key={publication.id}
                      className="rounded-lg border bg-white p-3 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-sm font-semibold text-gray-900">
                              {publication.title}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 flex flex-wrap items-center gap-2">
                            <span>
                              {publication.publicationType.replace(/_/g, " ")}
                            </span>
                            {publication.journal && (
                              <span>• {publication.journal}</span>
                            )}
                            {publication.doi && (
                              <span>• DOI {publication.doi}</span>
                            )}
                            {publication.url && (
                              <a
                                href={publication.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                View
                              </a>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Badge variant="outline" className="text-xs">
                            {publication.year}
                          </Badge>
                          {publication.source === "orcid" && (
                            <Badge className="bg-green-50 text-green-700 border-green-300 text-xs">
                              ORCID
                            </Badge>
                          )}
                          {publication.isEnhanced && (
                            <Badge className="bg-purple-50 text-purple-700 border-purple-300 text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
              {user.publications.length > ITEMS_PER_PAGE && (
                <div className="pt-4">
                  <Pagination
                    currentPage={publicationsPage}
                    totalPages={Math.ceil(
                      user.publications.length / ITEMS_PER_PAGE
                    )}
                    onPageChange={setPublicationsPage}
                  />
                </div>
              )}
            </>
          )}
        </div>

        <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Project Memberships
            </h3>
            <Badge variant="secondary">{user.stats.projects}</Badge>
          </div>
          {user.projects.length === 0 ? (
            <p className="text-sm text-gray-500">
              No project memberships recorded for this user.
            </p>
          ) : (
            <ul className="space-y-3">
              {user.projects.map((membership) => (
                <li key={membership.id} className="rounded-lg border p-3">
                  <div className="text-sm font-semibold text-gray-900">
                    {membership.project.title}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                    <span>{membership.project.status.replace(/_/g, " ")}</span>
                    <span>•</span>
                    <span>
                      {new Date(
                        membership.project.startDate
                      ).toLocaleDateString()}
                    </span>
                    {membership.project.endDate && (
                      <>
                        <span>→</span>
                        <span>
                          {new Date(
                            membership.project.endDate
                          ).toLocaleDateString()}
                        </span>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
