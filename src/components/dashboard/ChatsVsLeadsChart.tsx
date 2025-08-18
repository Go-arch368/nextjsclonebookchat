"use client";
import React from "react";
import { Card } from "@/ui/card"; // Adjust the import for shadcn/ui

const ChatsVsLeadsChart = () => {
  return (
    <div className="px-5 mb-5">
    <Card className="bg-white shadow rounded-2xl px-10 pt-8 pb-2 w-full min-h-[210px] mt-10">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-semibold text-gray-800">
          Chats vs. Leads
        </h2>
        <button className="rounded-full px-4 py-1 bg-gray-100 text-gray-500 text-sm font-medium shadow hover:bg-gray-200">
          30 days
        </button>
      </div>
      {/* Chart area */}
      <div className="relative w-full h-[400px]">
        {/* X Axis labels */}
        <div className="absolute w-full left-0 bottom-0 flex justify-between items-end px-2 pb-2 text-gray-400 text-base">
          <span>20 Jul</span>
          <span>22 Jul</span>
          <span>24 Jul</span>
          <span>26 Jul</span>
          <span>28 Jul</span>
          <span>30 Jul</span>
          <span className="font-bold text-gray-500">Aug '25</span>
          <span>04 Aug</span>
          <span>07 Aug</span>
          <span>09 Aug</span>
          <span>11 Aug</span>
          <span>13 Aug</span>
          <span>15 Aug</span>
          <span>17 Aug</span>
        </div>
      </div>
    </Card>
    </div>
  );
};

export default ChatsVsLeadsChart;
