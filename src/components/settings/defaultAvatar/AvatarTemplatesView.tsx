"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/ui/skeleton";
import { Plus, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { Avatar } from "@/types/avatar";

interface AvatarTemplatesViewProps {
  onSelectTemplate?: (template: Avatar) => void;
  newAvatar?: Avatar | null;
}

const fetchWithRetry = async (url: string, options = {}, retries = 3) => {
  try {
    const response = await axios({ url, ...options });
    return response;
  } catch (error) {
    if (retries <= 0) throw error;
    await new Promise(res => setTimeout(res, 1000 * (4 - retries)));
    return fetchWithRetry(url, options, retries - 1);
  }
};

export default function AvatarTemplatesView({ onSelectTemplate, newAvatar }: AvatarTemplatesViewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [templates, setTemplates] = useState<Avatar[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Omit<Avatar, "createdAt" | "updatedAt" | "id">>({
    userId: 1,
    name: "",
    jobTitle: "Support Agent",
    avatarImageUrl: "",
  });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);

  useEffect(() => {
    fetchTemplates();
  }, [searchKeyword, page]);

  useEffect(() => {
    if (newAvatar) {
      setTemplates((prev) => {
        // Avoid duplicates by checking if the avatar ID already exists
        if (prev.some((t) => t.id === newAvatar.id)) {
          return prev.map((t) => (t.id === newAvatar.id ? newAvatar : t));
        }
        return [newAvatar, ...prev];
      });
    }
  }, [newAvatar]);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const url = searchKeyword
        ? `https://zotly.onrender.com/settings/default-avatars/search?keyword=${encodeURIComponent(
            searchKeyword
          )}&page=${page}&size=${pageSize}`
        : "https://zotly.onrender.com/settings/default-avatars/list";
      
      const response = await fetchWithRetry(url, { method: 'get' });

      if (!Array.isArray(response.data)) {
        console.error("Invalid API response: Expected an array, got:", response.data);
        setTemplates([]);
        toast.error("Invalid data from server");
        return;
      }

      const validTemplates = response.data.filter(
        (item: any): item is Avatar =>
          item &&
          typeof item === "object" &&
          (typeof item.id === "string" || typeof item.id === "number") &&
          typeof item.userId === "number" &&
          typeof item.name === "string" &&
          typeof item.avatarImageUrl === "string"
      );

      setTemplates(validTemplates);
    } catch (error: any) {
      console.error("Error fetching templates:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      setTemplates([]);
      toast.error(error.response?.data?.message || "Failed to load avatar templates");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTemplate = async () => {
    if (!newTemplate.name || !newTemplate.avatarImageUrl) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const tempTemplate: Avatar = {
        id: `temp-${Date.now()}`,
        ...newTemplate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTemplates((prev) => [...prev, tempTemplate]);

      const response = await fetchWithRetry(
        "https://zotly.onrender.com/settings/default-avatars/save",
        {
          method: "post",
          data: {
            ...newTemplate,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        }
      );

      setNewTemplate({
        userId: 1,
        name: "",
        jobTitle: "Support Agent",
        avatarImageUrl: "",
      });
      setShowAddForm(false);

      setTemplates((prev) =>
        prev.map((t) =>
          t.id === tempTemplate.id ? { ...response.data, id: response.data.id } : t
        )
      );
      toast.success("Avatar template added successfully!");
    } catch (error: any) {
      console.error("Error adding template:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      toast.error(error.response?.data?.message || "Failed to add avatar template");
      await fetchTemplates();
    }
  };

  const handleDeleteTemplate = async (template: Avatar) => {
    if (!template.id) {
      toast.error("Template ID not found");
      return;
    }
    try {
      setTemplates((prev) => prev.filter((t) => t.id !== template.id));
      await fetchWithRetry(
        `https://zotly.onrender.com/settings/default-avatars/delete/${template.id}`,
        { method: 'delete' }
      );
      toast.success("Avatar template deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting template:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      toast.error(error.response?.data?.message || "Failed to delete avatar template");
      await fetchTemplates();
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Avatar Templates</h1>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Search templates..."
            className="p-2 border rounded"
          />
          <button
            onClick={() => setShowAddForm(true)}
            className="p-2 rounded-md hover:bg-gray-100"
            disabled={isLoading}
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium mb-3">Add New Template</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input
                type="text"
                value={newTemplate.name}
                onChange={(e) =>
                  setNewTemplate((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="w-full p-2 border rounded"
                placeholder="e.g. Customer Support"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Job Title</label>
              <input
                type="text"
                value={newTemplate.jobTitle}
                onChange={(e) =>
                  setNewTemplate((prev) => ({
                    ...prev,
                    jobTitle: e.target.value,
                  }))
                }
                className="w-full p-2 border rounded"
                placeholder="e.g. Support Agent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image URL *</label>
              <input
                type="text"
                value={newTemplate.avatarImageUrl}
                onChange={(e) =>
                  setNewTemplate((prev) => ({
                    ...prev,
                    avatarImageUrl: e.target.value,
                  }))
                }
                className="w-full p-2 border rounded"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewTemplate({
                  userId: 1,
                  name: "",
                  jobTitle: "Support Agent",
                  avatarImageUrl: "",
                });
              }}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleAddTemplate}
              disabled={!newTemplate.name || !newTemplate.avatarImageUrl}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Add Template
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {isLoading ? (
          Array(Math.min(templates.length || 4, 4))
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-2 p-4">
                <Skeleton className="w-24 h-24 rounded-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))
        ) : templates.length > 0 ? (
          templates.map((template) => (
            <div
              key={template.id}
              className="flex flex-col items-center p-4 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => onSelectTemplate?.(template)}
            >
              <div className="relative mb-2">
                <img
                  src={template.avatarImageUrl}
                  alt={template.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-white"
                  onError={(e) => {
                    e.currentTarget.src =
                      "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22800%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20800%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_1850b9a5d0e%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_1850b9a5d0e%22%3E%3Crect%20width%3D%22800%22%20height%3D%22800%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22285.9140625%22%20y%3D%22432.3%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E";
                  }}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTemplate(template);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  aria-label="Delete template"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <h3 className="font-medium text-center">{template.name}</h3>
              {template.jobTitle && (
                <p className="text-sm text-gray-500 text-center">{template.jobTitle}</p>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No templates found</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create First Template
            </button>
          </div>
        )}
      </div>

      {templates.length > 0 && (
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0 || isLoading}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span>Page {page + 1}</span>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={templates.length < pageSize || isLoading}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}