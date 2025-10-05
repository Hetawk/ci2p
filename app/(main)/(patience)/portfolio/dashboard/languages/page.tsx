"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Languages, Plus, Edit, Trash2, Save, X } from "lucide-react";
import { PublishToggle } from "@/components/ui/PublishToggle";

interface Language {
  id: string;
  name: string;
  level: string;
  order: number;
  published: boolean;
}

const LEVELS = [
  { value: "BASIC", label: "Basic", color: "slate", width: "20%" },
  { value: "INTERMEDIATE", label: "Intermediate", color: "blue", width: "40%" },
  { value: "ADVANCED", label: "Advanced", color: "purple", width: "60%" },
  { value: "FLUENT", label: "Fluent", color: "green", width: "80%" },
  { value: "NATIVE", label: "Native", color: "amber", width: "100%" },
];

export default function LanguagesPage() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Language>>({
    name: "",
    level: "INTERMEDIATE",
  });
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      const response = await fetch("/api/portfolio/languages");
      const data = await response.json();
      setLanguages(data.sort((a: Language, b: Language) => a.order - b.order));
    } catch (error) {
      console.error("Failed to fetch languages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      const url = editingId
        ? `/api/portfolio/languages/${editingId}`
        : "/api/portfolio/languages";

      const method = editingId ? "PUT" : "POST";

      const payload = {
        ...formData,
        order: editingId ? formData.order : languages.length,
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
            ? "Language updated successfully!"
            : "Language added successfully!",
        });
        fetchLanguages();
        resetForm();
      } else {
        throw new Error("Failed to save");
      }
    } catch {
      setMessage({
        type: "error",
        text: "Failed to save language. Please try again.",
      });
    }
  };

  const handleEdit = (language: Language) => {
    setFormData({
      name: language.name,
      level: language.level,
      order: language.order,
    });
    setEditingId(language.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this language?")) return;

    try {
      const response = await fetch(`/api/portfolio/languages/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Language deleted successfully!" });
        fetchLanguages();
      } else {
        throw new Error("Failed to delete");
      }
    } catch {
      setMessage({
        type: "error",
        text: "Failed to delete language. Please try again.",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      level: "INTERMEDIATE",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getLevelData = (level: string) => {
    return LEVELS.find((l) => l.value === level) || LEVELS[0];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <Languages className="w-10 h-10 text-pink-500" />
            Languages
          </h1>
          <p className="text-slate-600">Manage your language proficiency</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Language
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
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  {editingId ? "Edit Language" : "Add Language"}
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
                    Language *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
                    placeholder="e.g., English, Spanish, Mandarin"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Proficiency Level *
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({ ...formData, level: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
                  >
                    {LEVELS.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl hover:shadow-lg transition-all"
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

      {/* Languages List */}
      <div className="space-y-4">
        {languages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl p-12 text-center border border-slate-200/50"
          >
            <Languages className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No languages added yet
            </h3>
            <p className="text-slate-600 mb-6">
              Start adding the languages you speak
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Your First Language
            </button>
          </motion.div>
        ) : (
          languages.map((language, index) => {
            const levelData = getLevelData(language.level);
            return (
              <motion.div
                key={language.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-slate-900">
                      {language.name}
                    </h3>
                    <span
                      className={`px-3 py-1 bg-${levelData.color}-100 text-${levelData.color}-700 text-xs font-semibold rounded-full`}
                    >
                      {levelData.label}
                    </span>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <PublishToggle
                      id={language.id}
                      published={language.published}
                      endpoint="/api/portfolio/languages"
                      onToggle={(newPublished) => {
                        setLanguages(
                          languages.map((l) =>
                            l.id === language.id
                              ? { ...l, published: newPublished }
                              : l
                          )
                        );
                      }}
                      size="sm"
                    />
                    <button
                      onClick={() => handleEdit(language)}
                      className="p-2 hover:bg-pink-50 text-pink-600 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(language.id)}
                      className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                  <div
                    className={`bg-gradient-to-r from-pink-500 to-rose-600 h-2.5 rounded-full transition-all duration-500`}
                    style={{ width: levelData.width }}
                  ></div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
