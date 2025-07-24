"use client";

import { useState, ChangeEvent } from "react";
import AvatarTemplatesView from "./AvatarTemplatesView";

export default function DefaultAvatarView() {
  const [name, setName] = useState("Agent Zoi");
  const [jobTitle, setJobTitle] = useState("Customer Care");
  const [avatar, setAvatar] = useState<string | null>(null);

  const handleAvatarUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    console.log("Saved:", { name, jobTitle, avatar });
  };

  return (
    <div className="space-y-6">
      <div className="p-10 bg-white rounded-lg shadow-md border border-gray-200">
        <h2 className="  text-3xl font-bold text-gray-800 mb-6">
          Default avatar for chat widgets
        </h2>
        <hr />
        <div className="flex flex-col lg:flex-row items-center justify-between mt-6 space-y-6 lg:space-y-0 lg:space-x-10">
          <div className="flex items-center space-x-8 w-full">
            {/* Avatar Upload */}
            <div className="relative">
              <div className="w-24 h-24 bg-gray-300 rounded-full overflow-hidden">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    className="w-full h-full text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-black text-white p-1 rounded-full cursor-pointer text-xs">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                />
                📷
              </label>
            </div>

            {/* Form Fields */}
            <div className="flex-1 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Agent Zoi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Job Title *</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Customer Care"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="w-full lg:w-auto text-center lg:text-right">
            <button
              onClick={handleSave}
              className="px-6 py-3 relative -top-35 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Save
            </button>
          </div>
        </div>
      </div>
      <AvatarTemplatesView />
    </div>
  );
}