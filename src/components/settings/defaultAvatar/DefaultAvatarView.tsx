"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import AvatarTemplatesView from "./AvatarTemplatesView";
import { Avatar } from "@/types/avatar";

// Add axios interceptors for better error handling
axios.interceptors.request.use(config => {
  console.log('Request:', config.method?.toUpperCase(), config.url);
  return config;
}, error => {
  console.error('Request error:', error);
  return Promise.reject(error);
});

axios.interceptors.response.use(response => {
  console.log('Response:', response.status, response.config.url);
  return response;
}, error => {
  if (error.response) {
    console.error('API Error:', {
      status: error.response.status,
      data: error.response.data,
      url: error.config.url,
      method: error.config.method
    });
  } else {
    console.error('Network Error:', error.message);
  }
  return Promise.reject(error);
});

const fetchWithRetry = async (url: string, options = {}, retries = 3) => {
  try {
    const response = await axios({ url, ...options });
    return response;
  } catch (error) {
    if (retries <= 0) throw error;
    await new Promise(resolve => setTimeout(resolve, 1000 * (4 - retries)));
    return fetchWithRetry(url, options, retries - 1);
  }
};

export default function DefaultAvatarView() {
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
      const response = await fetchWithRetry(
        `https://zotly.onrender.com/settings/default-avatars/get/1`
      );
      
      if (response.data && typeof response.data === 'object' && 
          response.data.avatarImageUrl !== undefined) {
        setDefaultAvatar({
          id: response.data.id || "0",
          userId: response.data.userId || 1,
          name: response.data.name || "",
          jobTitle: response.data.jobTitle || "",
          avatarImageUrl: response.data.avatarImageUrl || ""
        });
      } else {
        console.warn("No valid avatar data returned:", response.data);
        toast.info("No default avatar found");
      }
    } catch (error: any) {
      const errorDetails = {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method
        }
      };
      console.error("Error fetching default avatar:", errorDetails);
      
      if (error.response?.status === 404) {
        toast.info("No default avatar found");
      } else {
        toast.error(
          error.response?.data?.message || 
          "Failed to load default avatar. Please try again later."
        );
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
      const payload = {
        userId: defaultAvatar.userId,
        name: defaultAvatar.name,
        jobTitle: defaultAvatar.jobTitle,
        avatarImageUrl: defaultAvatar.avatarImageUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const response = await fetchWithRetry(
        "https://zotly.onrender.com/settings/default-avatars/save",
        {
          method: "post",
          data: payload
        }
      );
      
      setNewAvatar(response.data);
      setDefaultAvatar({
        id: "0",
        userId: 1,
        name: "",
        jobTitle: "",
        avatarImageUrl: "",
      });
      toast.success("Default avatar saved successfully!");
    } catch (error: any) {
      console.error("Error saving default avatar:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      toast.error(`Failed to save default avatar: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = async () => {
    try {
      setIsLoading(true);
      await fetchWithRetry(
        `https://zotly.onrender.com/settings/default-avatars/delete/1`,
        { method: 'delete' }
      );
      setDefaultAvatar({
        id: "0",
        userId: 1,
        name: "",
        jobTitle: "",
        avatarImageUrl: "",
      });
      toast.success("Default avatar cleared successfully!");
    } catch (error: any) {
      console.error("Error clearing default avatar:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      toast.error(`Failed to clear default avatar: ${error.response?.data?.message || error.message}`);
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
      <div className="p-10 bg-white rounded-lg shadow-md border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Default Avatar for Chat Widgets
        </h2>
        <hr />
        <div className="flex flex-col lg:flex-row items-center justify-between mt-6 space-y-6 lg:space-y-0 lg:space-x-10">
          <div className="flex items-center space-x-8 w-full">
            <div className="relative">
              {isLoading ? (
                <div className="w-24 h-24 bg-gray-300 rounded-full animate-pulse" />
              ) : defaultAvatar.avatarImageUrl ? (
                <img
                  src={defaultAvatar.avatarImageUrl}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border border-gray-300"
                  onError={(e) => {
                    e.currentTarget.src =
                      "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22800%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20800%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_1850b9a5d0e%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_1850b9a5d0e%22%3E%3Crect%20width%3D%22800%22%20height%3D%22800%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22285.9140625%22%20y%3D%22432.3%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E";
                  }}
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={defaultAvatar.name}
                  onChange={(e) =>
                    setDefaultAvatar((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  disabled={isLoading}
                  placeholder="e.g. Customer Support"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                <input
                  type="text"
                  value={defaultAvatar.jobTitle}
                  onChange={(e) =>
                    setDefaultAvatar((prev) => ({
                      ...prev,
                      jobTitle: e.target.value,
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  disabled={isLoading}
                  placeholder="e.g. Support Agent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
                <input
                  type="text"
                  value={defaultAvatar.avatarImageUrl}
                  onChange={(e) =>
                    setDefaultAvatar((prev) => ({
                      ...prev,
                      avatarImageUrl: e.target.value,
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="https://example.com/avatar.jpg"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 w-full lg:w-auto">
            <button
              onClick={handleSave}
              disabled={
                isLoading ||
                !defaultAvatar.name ||
                !defaultAvatar.jobTitle ||
                !defaultAvatar.avatarImageUrl
              }
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleClear}
              disabled={
                isLoading ||
                (!defaultAvatar.name && !defaultAvatar.jobTitle && !defaultAvatar.avatarImageUrl)
              }
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50"
            >
              Clear
            </button>
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