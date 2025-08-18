import React from "react";

const Header = () => {
  return (
    <div className="bg-white dark:bg-black/5 px-6 pt-8 pb-2">
    
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-1">
          Conversions
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-400 mb-4">
          No conversions
        </p>
      </div>

      
      <div className="flex flex-wrap items-center gap-4 mb-4">
       
        <div className="flex-grow min-w-[890px] max-w-md">
          <input
            type="text"
            placeholder="Search conversions"
            className="w-full pl-4 pr-3 py-3 rounded border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800"
            aria-label="Search conversions"
          />
        </div>

       
        <button className="flex items-center bg-purple-600 dark:bg-purple-700 text-white text-sm rounded-full px-6 py-3 font-semibold shadow hover:bg-purple-700 dark:hover:bg-purple-800 transition-all min-w-[110px] justify-center">
          Export to csv
        </button>
      </div>

     
      <div className="flex flex-wrap items-center gap-4">
     
        <div className="flex gap-3 flex-shrink-0">
          <button className="rounded-full w-12 h-12 flex items-center justify-center text-sm font-semibold text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition shadow-none focus:outline-none">
            All
          </button>
          <button className="rounded-full px-4 py-1 text-sm font-semibold text-gray-500 dark:text-gray-400 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-800 transition focus:outline-none">
            Support Chat
          </button>
          <button className="rounded-full px-6 py-1 text-sm font-semibold text-gray-500 dark:text-gray-400 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-800 transition focus:outline-none">
            Lead
          </button>
        </div>

        
        <div className="flex flex-col flex-grow max-w-xs min-w-[150px]">
          <label className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
            Company
          </label>
          <select
            className="pl-4 pr-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-400 focus:outline-none w-full appearance-none text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800"
            aria-label="Company"
          >
            <option>All</option>
          </select>
        </div>

       
        <div className="flex flex-col flex-grow max-w-xs min-w-[150px]">
          <label className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
            Website
          </label>
          <select
            className="pl-4 pr-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-400 focus:outline-none w-full appearance-none text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800"
            aria-label="Website"
          >
            <option>All</option>
          </select>
        </div>

     
        <div className="flex flex-col flex-grow max-w-xs min-w-[150px]">
          <label className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
            Date
          </label>
          <input
            type="date"
            className="pl-4 pr-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-400 focus:outline-none w-full bg-white dark:bg-gray-800 appearance-none text-gray-700 dark:text-gray-300"
            aria-label="Date"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
