"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Skeleton } from "@/ui/skeleton";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/types/avatar";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";

interface AvatarTemplatesViewProps {
  onSelectTemplate?: (template: Avatar) => void;
  newAvatar?: Avatar | null;
}

const fetchWithRetry = async (url: string, options: RequestInit = {}, retries = 3) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    if (retries <= 0) throw error;
    await new Promise(resolve => setTimeout(resolve, 1000 * (4 - retries)));
    return fetchWithRetry(url, options, retries - 1);
  }
};

export default function AvatarTemplatesView({ onSelectTemplate, newAvatar }: AvatarTemplatesViewProps) {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [templates, setTemplates] = useState<Avatar[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Omit<Avatar, "id" | "createdAt" | "updatedAt">>({
    userId: 1,
    name: "",
    jobTitle: "Support Agent",
    avatarImageUrl: "",
  });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetchTemplates();
  }, [searchKeyword, page]);

  useEffect(() => {
    if (newAvatar) {
      setTemplates(prev => {
        if (prev.some(t => t.id === newAvatar.id)) {
          return prev.map(t => (t.id === newAvatar.id ? newAvatar : t));
        }
        return [newAvatar, ...prev];
      });
    }
  }, [newAvatar]);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const endpoint = searchKeyword 
        ? `/api/settings/default-avatars?keyword=${encodeURIComponent(searchKeyword)}&page=${page}&size=${pageSize}`
        : '/api/settings/default-avatars';

      const data = await fetchWithRetry(endpoint);
      
      const validTemplates = data.filter((item: any): item is Avatar =>
        item && typeof item === "object" &&
        (typeof item.id === "string" || typeof item.id === "number") &&
        typeof item.userId === "number" &&
        typeof item.name === "string" &&
        typeof item.avatarImageUrl === "string"
      );

      setTemplates(validTemplates);
    } catch (error: any) {
      console.error("Error fetching templates:", error);
      setTemplates([]);
      toast.error(error.message || "Failed to load avatar templates");
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
      setTemplates(prev => [...prev, tempTemplate]);

      const response = await fetch('/api/settings/default-avatars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTemplate,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save avatar');
      }

      const savedAvatar = await response.json();
      
      setTemplates(prev => 
        prev.map(t => t.id === tempTemplate.id ? savedAvatar : t)
      );
      
      setNewTemplate({
        userId: 1,
        name: "",
        jobTitle: "Support Agent",
        avatarImageUrl: "",
      });
      setShowAddForm(false);
      
      toast.success("Avatar template added successfully!");
    } catch (error: any) {
      setTemplates(prev => prev.filter(t => t.id !== `temp-${Date.now()}`));
      console.error('Save error:', error);
      toast.error(`Failed to add avatar: ${error.message}`);
    }
  };

  const handleDeleteTemplate = async (template: Avatar) => {
    if (!template.id) {
      toast.error("Template ID not found");
      return;
    }

    try {
      setTemplates(prev => prev.filter(t => t.id !== template.id));

      const response = await fetch(`/api/settings/default-avatars?id=${template.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        let errorMessage = 'Deletion failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      toast.success("Avatar template deleted successfully!");
    } catch (error: any) {
      setTemplates(prev => [...prev, template]);
      console.error('Delete error:', error);
      toast.error(`Deletion failed: ${error.message}`);
      await fetchTemplates();
    }
  };

  return (
    <div className={`p-6 rounded-lg shadow-md border ${
      theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-semibold text-gray-800 dark:text-white ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>
          Avatar Templates
        </h1>
        <div className="flex gap-2">
          <Input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Search templates..."
            className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowAddForm(true)}
            disabled={isLoading}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {showAddForm && (
        <div className={`mb-6 p-4 rounded-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
        }`}>
          <h3 className={`text-lg font-medium mb-3 ${
            theme === 'dark' ? 'text-white' : ''
          }`}>
            Add New Template
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label className={theme === 'dark' ? 'text-gray-300' : ''}>Name *</Label>
              <Input
                type="text"
                value={newTemplate.name}
                onChange={(e) =>
                  setNewTemplate((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className={`${theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}`}
                placeholder="e.g. Customer Support"
              />
            </div>
            <div>
              <Label className={theme === 'dark' ? 'text-gray-300' : ''}>Job Title</Label>
              <Input
                type="text"
                value={newTemplate.jobTitle}
                onChange={(e) =>
                  setNewTemplate((prev) => ({
                    ...prev,
                    jobTitle: e.target.value,
                  }))
                }
                className={`${theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}`}
                placeholder="e.g. Support Agent"
              />
            </div>
            <div>
              <Label className={theme === 'dark' ? 'text-gray-300' : ''}>Image URL *</Label>
              <Input
                type="text"
                value={newTemplate.avatarImageUrl}
                onChange={(e) =>
                  setNewTemplate((prev) => ({
                    ...prev,
                    avatarImageUrl: e.target.value,
                  }))
                }
                className={`${theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}`}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddForm(false);
                setNewTemplate({
                  userId: 1,
                  name: "",
                  jobTitle: "Support Agent",
                  avatarImageUrl: "",
                });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddTemplate}
              disabled={!newTemplate.name || !newTemplate.avatarImageUrl}
            >
              Add Template
            </Button>
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
              className={`flex flex-col items-center p-4 rounded-lg cursor-pointer transition-colors ${
                theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
              }`}
              onClick={() => onSelectTemplate?.(template)}
            >
              <div className="relative mb-2">
                <img
                  src={template.avatarImageUrl}
                  alt={template.name}
                  className={`w-24 h-24 rounded-full object-cover border-2 ${
                    theme === 'dark' ? 'border-gray-600' : 'border-white'
                  }`}
                  onError={(e) => {
                    e.currentTarget.src =
                      "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22800%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20800%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_1850b9a5d0e%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_1850b9a5d0e%22%3E%3Crect%20width%3D%22800%22%20height%3D%22800%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22285.9140625%22%20y%3D%22432.3%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E";
                  }}
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 p-1 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTemplate(template);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <h3 className={`font-medium text-center ${
                theme === 'dark' ? 'text-white' : ''
              }`}>
                {template.name}
              </h3>
              {template.jobTitle && (
                <p className={`text-sm text-center ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {template.jobTitle}
                </p>
              )}
            </div>
          ))
        ) : (
          <div className={`col-span-full text-center py-8 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
          }`}>
            <p>No templates found</p>
            <Button
              onClick={() => setShowAddForm(true)}
              className="mt-2"
            >
              Create First Template
            </Button>
          </div>
        )}
      </div>

      {templates.length > 0 && (
        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0 || isLoading}
          >
            Previous
          </Button>
          <span className={theme === 'dark' ? 'text-gray-300' : ''}>
            Page {page + 1}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={templates.length < pageSize || isLoading}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}