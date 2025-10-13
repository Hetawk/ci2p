"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import {
  Loader2,
  User,
  Mail,
  Phone,
  Building2,
  Save,
  Camera,
  Globe,
  Github as GithubIcon,
  Linkedin as LinkedinIcon,
  GraduationCap,
  MapPin,
} from "lucide-react";

export default function ProfileSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState({
    id: "",
    fullName: "",
    email: "",
    username: "",
    chineseName: "",
    title: "",
    bio: "",
    interests: "",
    phone: "",
    office: "",
    profileEmail: "",
    website: "",
    github: "",
    linkedin: "",
    googleScholar: "",
    researchGate: "",
    avatar: "",
    memberId: "",
    universityId: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/auth/me?_=${timestamp}`, {
          cache: "no-store",
          credentials: "include",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Profile data:", data);
          setProfile({
            id: data.user?.id || "",
            fullName: data.user?.profile?.fullName || "",
            email: data.user?.email || "",
            username: data.user?.username || "",
            chineseName: data.user?.profile?.chineseName || "",
            title: data.user?.profile?.title || "",
            bio: data.user?.profile?.bio || "",
            interests: data.user?.profile?.interests || "",
            phone: data.user?.profile?.phone || "",
            office: data.user?.profile?.office || "",
            profileEmail: data.user?.profile?.email || "",
            website: data.user?.profile?.website || "",
            github: data.user?.profile?.github || "",
            linkedin: data.user?.profile?.linkedin || "",
            googleScholar: data.user?.profile?.googleScholar || "",
            researchGate: data.user?.profile?.researchGate || "",
            avatar: data.user?.profile?.avatar || "",
            memberId: data.user?.profile?.memberId || "",
            universityId: data.user?.profile?.universityId || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setMessage({
          type: "error",
          text: "Failed to load profile data",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage({
        type: "error",
        text: "Please select an image file",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        type: "error",
        text: "File size must be less than 5MB",
      });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setProfile({ ...profile, avatar: data.url });
      setMessage({
        type: "success",
        text: "Photo uploaded! Remember to save changes.",
      });
    } catch (error) {
      console.error("Failed to upload photo:", error);
      setMessage({
        type: "error",
        text: "Failed to upload photo",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch("/api/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: profile.fullName,
          chineseName: profile.chineseName,
          title: profile.title,
          bio: profile.bio,
          interests: profile.interests,
          phone: profile.phone,
          office: profile.office,
          email: profile.profileEmail,
          website: profile.website,
          github: profile.github,
          linkedin: profile.linkedin,
          googleScholar: profile.googleScholar,
          researchGate: profile.researchGate,
          avatar: profile.avatar,
        }),
      });

      if (!response.ok) {
        throw new Error("Update failed");
      }

      localStorage.setItem("user-changed", Date.now().toString());
      window.dispatchEvent(new Event("storage"));

      setMessage({
        type: "success",
        text: "Profile updated successfully!",
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      setMessage({
        type: "error",
        text: "Failed to update profile",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Profile Photo
            </h3>
            <div className="flex items-center gap-6">
              <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 flex-shrink-0 shadow-lg">
                {profile.avatar ? (
                  <Image
                    src={profile.avatar}
                    alt={profile.fullName || "Profile"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                    {profile.fullName?.charAt(0) || "U"}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="border-blue-200 hover:bg-blue-50"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4 mr-2" />
                      Change Photo
                    </>
                  )}
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Upload a profile photo (max 5MB, JPG, PNG, or GIF)
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-900">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="fullName"
                    value={profile.fullName}
                    onChange={(e) =>
                      setProfile({ ...profile, fullName: e.target.value })
                    }
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="chineseName">Chinese Name</Label>
                <Input
                  id="chineseName"
                  value={profile.chineseName}
                  onChange={(e) =>
                    setProfile({ ...profile, chineseName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Position/Title</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="title"
                    value={profile.title}
                    onChange={(e) =>
                      setProfile({ ...profile, title: e.target.value })
                    }
                    placeholder="e.g., Graduate Student, Professor"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Account Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="pl-10 bg-gray-50"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Account email cannot be changed. Contact admin if needed.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={profile.username}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500">
                  Username cannot be changed.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t">
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                placeholder="Tell us about yourself..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests">Research Interests</Label>
              <Input
                id="interests"
                value={profile.interests}
                onChange={(e) =>
                  setProfile({ ...profile, interests: e.target.value })
                }
                placeholder="Separate interests with commas: AI, Machine Learning, etc."
              />
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-900">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="office">Office</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="office"
                    value={profile.office}
                    onChange={(e) =>
                      setProfile({ ...profile, office: e.target.value })
                    }
                    placeholder="Room number, building"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profileEmail">Public Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="profileEmail"
                    type="email"
                    value={profile.profileEmail}
                    onChange={(e) =>
                      setProfile({ ...profile, profileEmail: e.target.value })
                    }
                    placeholder="Email to display on your profile"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-900">
              Online Profiles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="website"
                    value={profile.website}
                    onChange={(e) =>
                      setProfile({ ...profile, website: e.target.value })
                    }
                    placeholder="https://yourwebsite.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="github">GitHub Username</Label>
                <div className="relative">
                  <GithubIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="github"
                    value={profile.github}
                    onChange={(e) =>
                      setProfile({ ...profile, github: e.target.value })
                    }
                    placeholder="yourusername"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <div className="relative">
                  <LinkedinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="linkedin"
                    value={profile.linkedin}
                    onChange={(e) =>
                      setProfile({ ...profile, linkedin: e.target.value })
                    }
                    placeholder="https://linkedin.com/in/..."
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="googleScholar">Google Scholar URL</Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="googleScholar"
                    value={profile.googleScholar}
                    onChange={(e) =>
                      setProfile({ ...profile, googleScholar: e.target.value })
                    }
                    placeholder="https://scholar.google.com/..."
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="researchGate">ResearchGate URL</Label>
                <Input
                  id="researchGate"
                  value={profile.researchGate}
                  onChange={(e) =>
                    setProfile({ ...profile, researchGate: e.target.value })
                  }
                  placeholder="https://www.researchgate.net/profile/..."
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-900">
              University Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="memberId">Lab Member ID</Label>
                <Input
                  id="memberId"
                  value={profile.memberId}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500">
                  Assigned by admin. Contact admin if incorrect.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="universityId">University ID</Label>
                <Input
                  id="universityId"
                  value={profile.universityId}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500">
                  Contact admin to update your university ID.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
