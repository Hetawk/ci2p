"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  MapPin,
  Calendar,
} from "lucide-react";

interface Experience {
  id: string;
  role: string;
  organization: string;
  location: string;
  startDate: string;
  endDate?: string;
  description?: string;
  highlights?: string[];
  type: string;
  order: number;
}

const TYPES = [
  { value: "LEADERSHIP", label: "Leadership", color: "orange" },
  { value: "PROFESSIONAL", label: "Professional", color: "blue" },
  { value: "VOLUNTEER", label: "Volunteer", color: "green" },
  { value: "ENTREPRENEURSHIP", label: "Entrepreneurship", color: "purple" },
];

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Experience>>({
    role: "",
    organization: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
    highlights: [],
    type: "PROFESSIONAL",
  });
  const [highlightInput, setHighlightInput] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await fetch("/api/portfolio/experience");
      const data = await response.json();
      setExperiences(
        data.sort((a: Experience, b: Experience) => a.order - b.order)
      );
    } catch (error) {
      console.error("Failed to fetch experiences:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      const url = editingId
        ? `/api/portfolio/experience/${editingId}`
        : "/api/portfolio/experience";

      const method = editingId ? "PUT" : "POST";

      const payload = {
        ...formData,
        order: editingId ? formData.order : experiences.length,
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
            ? "Experience updated successfully!"
            : "Experience added successfully!",
        });
        fetchExperiences();
        resetForm();
      } else {
        throw new Error("Failed to save");
      }
    } catch {
      setMessage({
        type: "error",
        text: "Failed to save experience. Please try again.",
      });
    }
  };

  const handleEdit = (exp: Experience) => {
    setFormData({
      role: exp.role,
      organization: exp.organization,
      location: exp.location,
      startDate: new Date(exp.startDate).toISOString().split("T")[0],
      endDate: exp.endDate
        ? new Date(exp.endDate).toISOString().split("T")[0]
        : "",
      description: exp.description || "",
      highlights: exp.highlights || [],
      type: exp.type,
      order: exp.order,
    });
    setEditingId(exp.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;

    try {
      const response = await fetch(`/api/portfolio/experience/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Experience deleted successfully!",
        });
        fetchExperiences();
      } else {
        throw new Error("Failed to delete");
      }
    } catch {
      setMessage({
        type: "error",
        text: "Failed to delete experience. Please try again.",
      });
    }
  };

  const addHighlight = () => {
    if (highlightInput.trim()) {
      setFormData({
        ...formData,
        highlights: [...(formData.highlights || []), highlightInput.trim()],
      });
      setHighlightInput("");
    }
  };

  const removeHighlight = (index: number) => {
    setFormData({
      ...formData,
      highlights: formData.highlights?.filter((_, i) => i !== index),
    });
  };

  const resetForm = () => {
    setFormData({
      role: "",
      organization: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
      highlights: [],
      type: "PROFESSIONAL",
    });
    setHighlightInput("");
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
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
            <Briefcase className="w-10 h-10 text-green-500" />
            Experience
          </h1>
          <p className="text-slate-600">
            Manage your work and leadership experience
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Experience
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
                  {editingId ? "Edit Experience" : "Add Experience"}
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
                    Role/Position *
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    placeholder="Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Organization *
                  </label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) =>
                      setFormData({ ...formData, organization: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    placeholder="Company Name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Location *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                        placeholder="City, Country"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    >
                      {TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Start Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            startDate: e.target.value,
                          })
                        }
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    />
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
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all resize-none"
                    placeholder="Brief overview of your role and responsibilities..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Key Highlights
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={highlightInput}
                      onChange={(e) => setHighlightInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), addHighlight())
                      }
                      className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                      placeholder="Add a highlight and press Enter"
                    />
                    <button
                      type="button"
                      onClick={addHighlight}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-all"
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.highlights?.map((highlight, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg"
                      >
                        <span className="flex-1 text-sm text-slate-700">
                          {highlight}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeHighlight(index)}
                          className="p-1 hover:bg-red-100 text-red-600 rounded transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all"
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

      {/* Experience List */}
      <div className="space-y-4">
        {experiences.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl p-12 text-center border border-slate-200/50"
          >
            <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No experience entries yet
            </h3>
            <p className="text-slate-600 mb-6">
              Start adding your work and leadership experience
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Your First Experience
            </button>
          </motion.div>
        ) : (
          experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-slate-900">
                      {exp.role}
                    </h3>
                    <span
                      className={`px-3 py-1 bg-${
                        TYPES.find((t) => t.value === exp.type)?.color
                      }-100 text-${
                        TYPES.find((t) => t.value === exp.type)?.color
                      }-700 text-xs font-semibold rounded-full`}
                    >
                      {TYPES.find((t) => t.value === exp.type)?.label}
                    </span>
                  </div>
                  <p className="text-lg text-green-600 font-semibold mb-2">
                    {exp.organization}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {exp.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(exp.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                      {" - "}
                      {exp.endDate
                        ? new Date(exp.endDate).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })
                        : "Present"}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-slate-700 leading-relaxed mb-3">
                      {exp.description}
                    </p>
                  )}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                      {exp.highlights.map((highlight, i) => (
                        <li key={i}>{highlight}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(exp)}
                    className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
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
