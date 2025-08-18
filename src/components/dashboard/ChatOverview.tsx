"use client";
import React from "react";
import { Card } from "@/ui/card";

const ChatOverview = () => {
  return (
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full mt-8 px-5">
      <Card className="sm:col-span-2 lg:col-span-3 bg-[#232B3E] dark:bg-[#232B3E] shadow rounded-2xl overflow-hidden flex flex-col flex-auto">
        {/* Header */}
        <div className="flex items-center justify-between mt-8 mb-2 px-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-1">Chat Overview</h2>
            <div className="font-medium text-gray-300 text-base">
              Number of chats VS Number of leads
            </div>
          </div>
          <button className="rounded-full px-4 py-1 bg-[#283046] text-gray-300 hover:bg-[#232a3b] text-sm font-medium">
            7 days
          </button>
        </div>

        {/* Chart Legend */}
        <div className="flex items-center px-10 mb-4 space-x-8">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-4 h-4 bg-indigo-400 rounded-full" />
            <span className="text-gray-300 font-medium">Visitors</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-block w-4 h-4 bg-indigo-400 rounded-full" />
            <span className="text-gray-300 font-medium">Leads</span>
          </div>
        </div>

        {/* Chart Area with spacious grid */}
        <div className="relative flex-1 min-h-[320px] px-8 pb-6">
          {/* Chart grid */}
          <div className="absolute inset-0 rounded-2xl">
            {/* Vertical grid lines */}
            <div className="absolute inset-0 flex">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 border-l ${i === 0 ? "border-l-0" : ""} border-[#334155]`}
                />
              ))}
            </div>
            {/* Horizontal grid lines */}
            <div className="absolute inset-0 flex flex-col">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex-1 border-b border-[#334155]"
                  style={{ minHeight: "60px" }} // Space between lines
                />
              ))}
            </div>
          </div>

          {/* X Axis Labels */}
          <div className="absolute w-full left-0 bottom-0 flex justify-between text-gray-400 text-base px-2" style={{ letterSpacing: 0.5 }}>
            <span>12 Aug</span>
            <span>13 Aug</span>
            <span>14 Aug</span>
            <span>15 Aug</span>
            <span>16 Aug</span>
            <span>17 Aug</span>
            <span>18 Aug</span>
          </div>

          {/* Tooltip Example (static, replace with chart tooltip) */}
          <div className="absolute left-[61%] top-[62%] bg-[#191e29] rounded-lg shadow-lg p-3 text-white min-w-[150px]">
            <div className="text-md mb-2">Aug 16, 2025</div>
            <div className="flex items-center mb-1">
              <span className="inline-block w-3 h-3 bg-indigo-400 rounded-full mr-2"></span>
              <span className="text-gray-300 text-md">Visitors:&nbsp;0</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-indigo-400 rounded-full mr-2"></span>
              <span className="text-gray-300 text-md">Leads:&nbsp;0</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatOverview;
