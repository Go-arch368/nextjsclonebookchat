// app/websites/page.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Header from "@/components/websites/Header";
import TableComponent from "@/components/websites/TableComponent";
import { Website } from "@/types/website";

export default function WebsitesPage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const API_BASE_URL = "https://zotly.onrender.com/websites";

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${API_BASE_URL}/list`);
        console.log("GET /list response:", response.data); // Debug log
        setWebsites(response.data || []);
      } catch (error: any) {
        console.error("Error fetching websites:", error.message);
        setWebsites([]);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="container mx-auto">
      <Header setWebsites={setWebsites} websites={websites} />
      <TableComponent websites={websites} setWebsites={setWebsites} />
    </div>
  );
}