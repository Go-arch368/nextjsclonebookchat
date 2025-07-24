"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/ui/skeleton";
import { Plus, Trash2 } from "lucide-react";

type AvatarProps = {
  elementId: string;
  elementName: string;
  gender: string;
  image: string;
};

const avatars: AvatarProps[] = [
  {
    elementId: "1",
    elementName: "John",
    gender: "Male",
    image: "/avatars/man1.jpg",
  },
  {
    elementId: "2",
    elementName: "Jane",
    gender: "Female",
    image: "/avatars/woman1.jpg",
  },
  {
    elementId: "3",
    elementName: "Mike",
    gender: "Male",
    image: "/avatars/man2.jpeg", // Updated to match .jpeg if applicable
  },
  {
    elementId: "4",
    elementName: "Alice",
    gender: "Female",
    image: "/avatars/woman2.jpg",
  },
  {
    elementId: "5",
    elementName: "David",
    gender: "Male",
    image: "/avatars/man3.jpg",
  },
];

export default function AvatarTemplatesView() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
  };

  const filteredAvatars = avatars.filter((avatar) => {
    if (activeFilter === "All") return true;
    return avatar.gender === activeFilter;
  });

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-end items-center mb-6 space-x-2">
        <h1 className=" relative right-70 text-3xl font-bold text-gray-800 mr-4">Avatar Templates</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleFilterClick("All")}
            className={`px-3 py-1 rounded-md text-sm text-black ${
              activeFilter === "All"
                ? "bg-gray-200"
                : "bg-transparent hover:bg-gray-100"
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleFilterClick("Male")}
            className={`px-3 py-1 rounded-md text-sm text-black ${
              activeFilter === "Male"
                ? "bg-gray-200"
                : "bg-transparent hover:bg-gray-100"
            }`}
          >
            Male
          </button>
          <button
            onClick={() => handleFilterClick("Female")}
            className={`px-3 py-1 rounded-md text-sm text-black ${
              activeFilter === "Female"
                ? "bg-gray-200"
                : "bg-transparent hover:bg-gray-100"
            }`}
          >
            Female
          </button>
          <button
            className="p-1 rounded-full text-sm text-black bg-transparent hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-6">
        {filteredAvatars.map((avatar) => (
          <div
            key={avatar.elementId}
            className={`flex flex-col items-center space-y-2 ${
              avatar.gender === "Male" ? "bg-blue-200" : "bg-pink-200"
            } p-2 rounded-lg relative`}
          >
            <div className="relative w-32 h-32">
              {isLoading ? (
                <Skeleton className="w-32 h-32 rounded-full" />
              ) : (
                <img
                  src={avatar.image}
                  alt={avatar.elementName}
                  className="w-32 h-32 rounded-full object-cover border border-gray-200 shadow-sm"
                />
              )}
              <button
                className="absolute top-2 left-1/2 transform -translate-x-1/2 text-white rounded-full p-1"
                onClick={() => console.log(`Delete ${avatar.elementName}`)} // Placeholder for delete action
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold">{avatar.elementName}</h2>
              <p className="text-sm text-muted-foreground">{avatar.gender}</p>
            </div>
          </div>
        ))}
      </div>
      {filteredAvatars.length === 0 && (
        <p className="text-gray-600 text-center mt-4">
          No avatars available for this filter.
        </p>
      )}
    </div>
  );
}