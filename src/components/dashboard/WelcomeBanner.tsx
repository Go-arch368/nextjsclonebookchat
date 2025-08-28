"use client";
import { Card } from "@/ui/card";
import React from "react";



const WelcomeBanner = () => {
  return (
    <Card className="bg-slate-800 rounded-1xl">
      <div className="flex flex-col w-full max-w-screen-xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 my-8 sm:my-8">
          <div className="flex flex-auto items-center min-w-0">
            <div className="flex-0 w-16 h-16 rounded overflow-hidden bg-muted" />

            <div className="flex flex-col min-w-0 ml-4">
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight leading-7 md:leading-10 truncate text-white">
                Welcome to Zotly Beta
              </h1>

              <div className="flex items-center mt-2">
                <p className="ml-1.5 leading-6 truncate text-gray-300 text-sm md:text-base">
                  For any feedback please email me directly at{" "}
                  <a
                    href="mailto:terry@chatmetrics.com"
                    className="underline text-purple-400"
                  >
                    terry@chatmetrics.com
                  </a>{" "}
                  or request to join our{" "}
                  <span className="font-medium text-gray-200">
                    Zotly-Beta Slack Channel
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </Card>
  );
};

export default WelcomeBanner;
