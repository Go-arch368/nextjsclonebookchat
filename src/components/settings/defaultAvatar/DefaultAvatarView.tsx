"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import AvatarTemplatesView from "./AvatarTemplatesView";
import { Avatar } from "@/types/avatar";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Skeleton } from "@/ui/skeleton";

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

export default function DefaultAvatarView() {
  const { theme } = useTheme();
  const [defaultAvatar, setDefaultAvatar] = useState<Avatar>({
    id: "0",
    userId: 1,
    name: "",
    jobTitle: "",
    avatarImageUrl: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [newAvatar, setNewAvatar] = useState<Avatar | null>(null);

  useEffect(() => {
    fetchDefaultAvatar();
  }, []);

  const fetchDefaultAvatar = async () => {
    try {
      setIsLoading(true);
      const data = await fetchWithRetry('/api/settings/default-avatars');
      
      if (data && data.avatarImageUrl !== undefined) {
        setDefaultAvatar({
          id: data.id || "0",
          userId: data.userId || 1,
          name: data.name || "",
          jobTitle: data.jobTitle || "",
          avatarImageUrl: data.avatarImageUrl || ""
        });
      } else {
        toast.info("No default avatar found");
      }
    } catch (error: any) {
      console.error("Error fetching default avatar:", error);
      if (error.message.includes('404')) {
        toast.info("No default avatar found");
      } else {
        toast.error(error.message || "Failed to load default avatar");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!defaultAvatar.name || !defaultAvatar.jobTitle || !defaultAvatar.avatarImageUrl) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetchWithRetry('/api/settings/default-avatars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...defaultAvatar,
          id: "1" // Using 1 as the default avatar ID
        })
      });

      setNewAvatar(response);
      setDefaultAvatar({
        id: "0",
        userId: 1,
        name: "",
        jobTitle: "",
        avatarImageUrl: "",
      });
      toast.success("Default avatar saved successfully!");
    } catch (error: any) {
      console.error("Error saving default avatar:", error);
      toast.error(error.message || "Failed to save default avatar");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = async () => {
    try {
      setIsLoading(true);
      await fetchWithRetry('/api/settings/default-avatars?id=1', {
        method: 'DELETE'
      });
      setDefaultAvatar({
        id: "0",
        userId: 1,
        name: "",
        jobTitle: "",
        avatarImageUrl: "",
      });
      toast.success("Default avatar cleared successfully!");
    } catch (error: any) {
      console.error("Error clearing default avatar:", error);
      toast.error(error.message || "Failed to clear default avatar");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTemplate = (template: Avatar) => {
    setDefaultAvatar({
      ...defaultAvatar,
      name: template.name,
      jobTitle: template.jobTitle || "Support Agent",
      avatarImageUrl: template.avatarImageUrl,
    });
  };

  return (
    <div className="space-y-6">
      <div className={`p-6 rounded-lg shadow-md border ${
        theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h2 className={`text-3xl font-bold mb-6 ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>
          Default Avatar for Chat Widgets
        </h2>
        <hr className={theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} />
        <div className="flex flex-col lg:flex-row items-center justify-between mt-6 space-y-6 lg:space-y-0 lg:space-x-10">
          <div className="flex items-center space-x-8 w-full">
            <div className="relative">
              {isLoading ? (
                <Skeleton className="w-24 h-24 rounded-full" />
              ) : defaultAvatar.avatarImageUrl ? (
                <img
                  src={defaultAvatar.avatarImageUrl}
                  alt="Avatar"
                  className={`w-24 h-24 rounded-full object-cover border ${
                    theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                  }`}
                  onError={(e) => {
                    e.currentTarget.src =
                      "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22800%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20800%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_1850b9a5d0e%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_1850b9a5d0e%22%3E%3Crect%20width%3D%22800%22%20height%3D%22800%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22285.9140625%22%20y%3D%22432.3%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E";
                  }}
                />
              ) : (
                <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                }`}>
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                    No Image
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <Label className={theme === 'dark' ? 'text-gray-300' : ''}>Name *</Label>
                <Input
                  type="text"
                  value={defaultAvatar.name}
                  onChange={(e) =>
                    setDefaultAvatar((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}
                  disabled={isLoading}
                  placeholder="e.g. Customer Support"
                />
              </div>
              <div>
                <Label className={theme === 'dark' ? 'text-gray-300' : ''}>Job Title *</Label>
                <Input
                  type="text"
                  value={defaultAvatar.jobTitle}
                  onChange={(e) =>
                    setDefaultAvatar((prev) => ({
                      ...prev,
                      jobTitle: e.target.value,
                    }))
                  }
                  className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}
                  disabled={isLoading}
                  placeholder="e.g. Support Agent"
                />
              </div>
              <div>
                <Label className={theme === 'dark' ? 'text-gray-300' : ''}>Image URL *</Label>
                <Input
                  type="text"
                  value={defaultAvatar.avatarImageUrl}
                  onChange={(e) =>
                    setDefaultAvatar((prev) => ({
                      ...prev,
                      avatarImageUrl: e.target.value,
                    }))
                  }
                  className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}
                  placeholder="https://example.com/avatar.jpg"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 w-full lg:w-auto">
            <Button
              onClick={handleSave}
              disabled={
                isLoading ||
                !defaultAvatar.name ||
                !defaultAvatar.jobTitle ||
                !defaultAvatar.avatarImageUrl
              }
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="outline"
              onClick={handleClear}
              disabled={
                isLoading ||
                (!defaultAvatar.name && !defaultAvatar.jobTitle && !defaultAvatar.avatarImageUrl)
              }
            >
              Clear
            </Button>
          </div>
        </div>
      </div>
      <AvatarTemplatesView 
        onSelectTemplate={handleSelectTemplate} 
        newAvatar={newAvatar}
      />
    </div>
  );
}