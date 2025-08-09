"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Header from "@/components/websites/Header";
import TableComponent from "@/components/websites/TableComponent";
import { Website } from "@/types/website";

export default function WebsitesPage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const API_BASE_URL = "/api/websites";

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get<Website[]>(`${API_BASE_URL}?action=list`);
        if (!Array.isArray(response.data)) {
          throw new Error('Invalid response format: Expected an array');
        }
        setWebsites(response.data);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || error.message || "Failed to fetch websites";
        console.error("Error fetching websites:", errorMessage, error.response?.data);
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