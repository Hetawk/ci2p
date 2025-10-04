"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Plus, Edit, Trash2, Save, X } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  category: string;
  level: string;
  order: number;
}

const CATEGORIES = [
  { value: "RESEARCH", label: "Research", color: "blue" },
  { value: "ECONOMICS", label: "Economics", color: "green" },
  { value: "TECHNICAL", label: "Technical", color: "purple" },
  { value: "COMMUNICATION", label: "Communication", color: "pink" },
  { value: "LEADERSHIP", label: "Leadership", color: "orange" },
  { value: "LANGUAGES", label: "Languages", color: "cyan" },
];

const LEVELS = [
  { value: "BASIC", label: "Basic", color: "slate" },
  { value: "INTERMEDIATE", label: "Intermediate", color: "blue" },
  { value: "ADVANCED", label: "Advanced", color: "purple" },
  { value: "FLUENT", label: "Fluent", color: "green" },
  { value: "NATIVE", label: "Native", color: "amber" },
];

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Skill>>({
    name: "",
    category: "TECHNICAL",
    level: "INTERMEDIATE",
  });
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch("/api/portfolio/skills");
      const data = await response.json();
      setSkills(data.sort((a: Skill, b: Skill) => a.order - b.order));
    } catch (error) {
      console.error("Failed to fetch skills:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      const url = editingId
        ? `/api/portfolio/skills/${editingId}`
        : "/api/portfolio/skills";

      const method = editingId ? "PUT" : "POST";

      const payload = {
        ...formData,
        order: editingId ? formData.order : skills.length,
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
            ? "Skill updated successfully!"
            : "Skill added successfully!",
        });
        fetchSkills();
        resetForm();
      } else {
        throw new Error("Failed to save");
      }
    } catch {
      setMessage({
        type: "error",
        text: "Failed to save skill. Please try again.",
      });
    }
  };

  const handleEdit = (skill: Skill) => {
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      order: skill.order,
    });
    setEditingId(skill.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;

    try {
      const response = await fetch(`/api/portfolio/skills/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Skill deleted successfully!" });
        fetchSkills();
      } else {
        throw new Error("Failed to delete");
      }
    } catch {
      setMessage({
        type: "error",
        text: "Failed to delete skill. Please try again.",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "TECHNICAL",
      level: "INTERMEDIATE",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getLevelColor = (level: string) => {
    return LEVELS.find((l) => l.value === level)?.color || "slate";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <Sparkles className="w-10 h-10 text-indigo-500" />
            Skills
          </h1>
          <p className="text-slate-600">
            Manage your skills and expertise areas
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Skill
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
              className="bg-white rounded-2xl p-6 max-w-lg w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  {editingId ? "Edit Skill" : "Add Skill"}
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
                    Skill Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                    placeholder="e.g., Data Analysis, Public Speaking"
                  />
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
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
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
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
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
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all"
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

      {/* Skills List */}
      <div className="space-y-6">
        {skills.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl p-12 text-center border border-slate-200/50"
          >
            <Sparkles className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No skills added yet
            </h3>
            <p className="text-slate-600 mb-6">
              Start showcasing your expertise and abilities
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Your First Skill
            </button>
          </motion.div>
        ) : (
          CATEGORIES.map((category, catIndex) => {
            const categorySkills = groupedSkills[category.value];
            if (!categorySkills || categorySkills.length === 0) return null;

            return (
              <motion.div
                key={category.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIndex * 0.1 }}
                className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50"
              >
                <h3
                  className={`text-xl font-bold text-${category.color}-600 mb-4 flex items-center gap-2`}
                >
                  {category.label}
                  <span className="text-sm font-normal text-slate-500">
                    ({categorySkills.length})
                  </span>
                </h3>
                <div className="grid gap-3">
                  {categorySkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl hover:bg-slate-100/50 transition-all group"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-lg font-medium text-slate-900">
                          {skill.name}
                        </span>
                        <span
                          className={`px-3 py-1 bg-${getLevelColor(
                            skill.level
                          )}-100 text-${getLevelColor(
                            skill.level
                          )}-700 text-xs font-semibold rounded-full`}
                        >
                          {LEVELS.find((l) => l.value === skill.level)?.label}
                        </span>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(skill)}
                          className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(skill.id)}
                          className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
