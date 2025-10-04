"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Star,
  Calendar,
  Building2,
  Image as ImageIcon,
} from "lucide-react";

interface AwardData {
  id: string;
  title: string;
  organization: string;
  date: string;
  description?: string;
  category: string;
  imageUrl?: string;
  featured: boolean;
  order: number;
}

const CATEGORIES = [
  { value: "ACADEMIC", label: "Academic", color: "blue" },
  { value: "PUBLIC_SPEAKING", label: "Public Speaking", color: "purple" },
  { value: "TECHNICAL", label: "Technical", color: "cyan" },
  { value: "SPORTS", label: "Sports", color: "green" },
  { value: "LEADERSHIP", label: "Leadership", color: "orange" },
  { value: "CERTIFICATION", label: "Certification", color: "pink" },
];

export default function AwardsPage() {
  const [awards, setAwards] = useState<AwardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<AwardData>>({
    title: "",
    organization: "",
    date: "",
    description: "",
    category: "ACADEMIC",
    imageUrl: "",
    featured: false,
  });
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchAwards();
  }, []);

  const fetchAwards = async () => {
    try {
      const response = await fetch("/api/portfolio/awards");
      const data = await response.json();
      setAwards(data.sort((a: AwardData, b: AwardData) => a.order - b.order));
    } catch (error) {
      console.error("Failed to fetch awards:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      const url = editingId
        ? `/api/portfolio/awards/${editingId}`
        : "/api/portfolio/awards";

      const method = editingId ? "PUT" : "POST";

      const payload = {
        ...formData,
        order: editingId ? formData.order : awards.length,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: editingId
            ? "Award updated successfully!"
            : "Award added successfully!",
        });
        fetchAwards();
        resetForm();
      } else {
        throw new Error("Failed to save");
      }
    } catch {
      setMessage({
        type: "error",
        text: "Failed to save award. Please try again.",
      });
    }
  };

  const handleEdit = (award: AwardData) => {
    setFormData({
      title: award.title,
      organization: award.organization,
      date: new Date(award.date).toISOString().split("T")[0],
      description: award.description || "",
      category: award.category,
      imageUrl: award.imageUrl || "",
      featured: award.featured,
      order: award.order,
    });
    setEditingId(award.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this award?")) return;

    try {
      const response = await fetch(`/api/portfolio/awards/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Award deleted successfully!" });
        fetchAwards();
      } else {
        throw new Error("Failed to delete");
      }
    } catch {
      setMessage({
        type: "error",
        text: "Failed to delete award. Please try again.",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      organization: "",
      date: "",
      description: "",
      category: "ACADEMIC",
      imageUrl: "",
      featured: false,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getCategoryColor = (category: string) => {
    const cat = CATEGORIES.find((c) => c.value === category);
    return cat?.color || "blue";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <Award className="w-10 h-10 text-orange-500" />
            Awards & Certifications
          </h1>
          <p className="text-slate-600">
            Manage your achievements and recognitions
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Award
        </button>
      </motion.div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-xl ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </motion.div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => resetForm()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  {editingId ? "Edit Award" : "Add Award"}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Award Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                    placeholder="Best Student Award"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Organization *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          organization: e.target.value,
                        })
                      }
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                      placeholder="University Name or Organization"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all resize-none"
                    placeholder="Brief description of the award or achievement..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Image URL
                  </label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="url"
                      value={formData.imageUrl || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                      placeholder="https://example.com/certificate.jpg"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                    className="w-5 h-5 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                  />
                  <label
                    htmlFor="featured"
                    className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer"
                  >
                    <Star className="w-4 h-4 text-amber-500" />
                    Feature this award on portfolio
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all"
                  >
                    <Save className="w-5 h-5" />
                    {editingId ? "Update" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Awards List */}
      <div className="space-y-4">
        {awards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl p-12 text-center border border-slate-200/50"
          >
            <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No awards yet
            </h3>
            <p className="text-slate-600 mb-6">
              Start adding your achievements and recognitions
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Your First Award
            </button>
          </motion.div>
        ) : (
          awards.map((award, index) => (
            <motion.div
              key={award.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-slate-900">
                      {award.title}
                    </h3>
                    {award.featured && (
                      <span className="flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                        <Star className="w-3 h-3 fill-amber-500" />
                        Featured
                      </span>
                    )}
                    <span
                      className={`px-3 py-1 bg-${getCategoryColor(
                        award.category
                      )}-100 text-${getCategoryColor(
                        award.category
                      )}-700 text-xs font-semibold rounded-full`}
                    >
                      {
                        CATEGORIES.find((c) => c.value === award.category)
                          ?.label
                      }
                    </span>
                  </div>
                  <p className="text-lg text-orange-600 font-semibold mb-2">
                    {award.organization}
                  </p>
                  <p className="text-sm text-slate-600 mb-3">
                    {new Date(award.date).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  {award.description && (
                    <p className="text-slate-700 leading-relaxed">
                      {award.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(award)}
                    className="p-2 hover:bg-orange-50 text-orange-600 rounded-lg transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(award.id)}
                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
