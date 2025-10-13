"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, UserPlus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

const ROLE_OPTIONS = ["SUPER_ADMIN", "ADMIN", "RESEARCHER", "STUDENT", "GUEST"];

export default function AdminCreateUserPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("RESEARCHER");
  const [fullName, setFullName] = useState("");
  const [memberId, setMemberId] = useState("");
  const [universityId, setUniversityId] = useState("");
  const [orcidId, setOrcidId] = useState("");
  const [showInTeam, setShowInTeam] = useState(true);
  const [teamOrder, setTeamOrder] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(
    null
  );
  const [createdUserId, setCreatedUserId] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    setSaving(true);
    setError(null);
    setGeneratedPassword(null);

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          role,
          password: password.trim() || undefined,
          profile: {
            fullName,
            memberId,
            universityId,
            orcidId,
            showInTeam,
            teamOrder,
            bio,
          },
        }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.error || "Failed to create user");
      }

      if (payload?.generatedPassword) {
        setGeneratedPassword(payload.generatedPassword as string);
      }

      if (payload?.data?.id) {
        setCreatedUserId(payload.data.id as string);
      }
    } catch (err) {
      console.error("Error creating user", err);
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UserPlus className="h-6 w-6" />
            Add Team Member
          </h1>
          <p className="text-sm text-gray-600">
            Create a new account and assign initial access credentials.
          </p>
        </div>
        <Link href="/admin/users">
          <Button variant="outline" className="border border-gray-300">
            Cancel
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="new.member@ci2p.org"
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
                Full Name
              </label>
              <Input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Member full name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Temporary Password (optional)
              </label>
              <Input
                type="text"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Leave blank to auto-generate"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Member ID
              </label>
              <Input
                value={memberId}
                onChange={(event) => setMemberId(event.target.value)}
                placeholder="CI2P001"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                University ID
              </label>
              <Input
                value={universityId}
                onChange={(event) => setUniversityId(event.target.value)}
                placeholder="202534100001"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                ORCID iD
              </label>
              <Input
                value={orcidId}
                onChange={(event) => setOrcidId(event.target.value)}
                placeholder="0000-0002-1825-0097"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Team Order
              </label>
              <Input
                type="number"
                min={0}
                value={teamOrder}
                onChange={(event) => setTeamOrder(event.target.value)}
                placeholder="0"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Biography (optional)
              </label>
              <Textarea
                rows={4}
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                placeholder="Short introduction for the member"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch checked={showInTeam} onCheckedChange={setShowInTeam} />
            <div>
              <div className="text-sm font-medium text-gray-900">
                Show in Team Directory
              </div>
              <p className="text-xs text-gray-500">
                Control whether this member appears on the public team page.
              </p>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {generatedPassword && (
          <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            Generated temporary password: {generatedPassword}
          </div>
        )}

        <div className="flex items-center justify-end gap-3">
          <Link href="/admin/users">
            <Button variant="outline" className="border border-gray-300">
              Cancel
            </Button>
          </Link>
          {createdUserId ? (
            <Button
              type="button"
              className="border border-blue-600"
              onClick={() => router.push(`/admin/users/${createdUserId}`)}
            >
              View Profile
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={saving}
              className="border border-blue-600"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Creating
                </span>
              ) : (
                "Create Member"
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
