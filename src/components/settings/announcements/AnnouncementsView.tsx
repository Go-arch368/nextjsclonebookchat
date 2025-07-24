'use client';
import React from "react";
import { Plus, Camera, Trash2 } from "lucide-react";

const AnnouncementsView = () => {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected file:", file);
    }
  };

  return (
    <div className="space-y-10">
      {/* Login Page Announcement */}
      <section className="p-6 bg-white rounded-lg shadow-md border border-gray-200 mt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Announcements for Login Page</h2>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center gap-2"
            onClick={() => console.log("Save clicked")}
          >
            <Plus className="h-5 w-5" />
            <span>Save</span>
          </button>
        </div>

        <hr className="border-t border-gray-300 mb-10" />

        <div className="p-4 border bg-gray-900 rounded-lg w-[350px] mb-6">
          <p className="text-white text-lg leading-relaxed">
            Welcome to Zotly <br /> Beta Testings.
          </p>
          <span className="text-sm text-gray-400">
            For any feedback please email me directly at{" "}
            <a href="mailto:terry@chatmetrics.com" className="underline">
              terry@chatmetrics.com
            </a>{" "}
            or request to join our Zotly-Beta Slack Channel.
          </span>
        </div>

        <div className="flex flex-wrap gap-8">
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="login-title" className="block text-black text-sm font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                id="login-title"
                defaultValue="Welcome to Zotly Beta Testings."
                className="w-[600px] p-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              />
            </div>

            <div className="w-[600px] border rounded-lg p-2 text-gray-800 text-sm">
              For any feedback please email me directly at terry@chatmetrics.com or request to join our Zotly-Beta Slack Channel at the same email.
            </div>
          </div>

          <div>
            <input
              type="file"
              id="image-upload-login"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <label
              htmlFor="image-upload-login"
              className="px-6 py-4 bg-gray-200 text-gray-700 w-[180px] h-[180px] rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex flex-col items-center justify-center gap-2 cursor-pointer"
            >
              <div className="flex gap-4">
                <Camera className="h-5 w-5" />
                <Trash2 className="h-5 w-5" />
              </div>
            </label>
          </div>
        </div>
      </section>

      {/* Dashboard Page Announcement */}
      <section className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Announcements for Dashboard Page</h2>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center gap-2"
            onClick={() => console.log("Save clicked")}
          >
            <Plus className="h-5 w-5" />
            <span>Save</span>
          </button>
        </div>

        <div className="p-4 border bg-gray-900 rounded-lg w-fit mb-6">
          <p className="text-white text-5xl p-5 leading-tight">
            Welcome to Zotly Beta
          </p>
          <span className="text-sm text-gray-400 px-5 pb-3 block">
            For any feedback please email me directly at{" "}
            <a href="mailto:terry@chatmetrics.com" className="underline">
              terry@chatmetrics.com
            </a>{" "}
            or request to join our Zotly-Beta Slack Channel.
          </span>
        </div>

        <div className="flex flex-wrap gap-8">
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="dashboard-title" className="block text-black text-sm font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                id="dashboard-title"
                defaultValue="Welcome to Zotly Beta Testings."
                className="w-[600px] p-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              />
            </div>

            <div className="w-[600px] border rounded-lg p-2 text-gray-800 text-sm">
              For any feedback please email me directly at terry@chatmetrics.com or request to join our Zotly-Beta Slack Channel at the same email.
            </div>
          </div>

          <div>
            <input
              type="file"
              id="image-upload-dashboard"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <label
              htmlFor="image-upload-dashboard"
              className="px-6 py-4 bg-gray-200 text-gray-700 w-[180px] h-[180px] rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex flex-col items-center justify-center gap-2 cursor-pointer"
            >
              <div className="flex gap-4">
                <Camera className="h-5 w-5" />
                <Trash2 className="h-5 w-5" />
              </div>
            </label>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AnnouncementsView;
