"use client";

import React, { useState } from 'react';
import Header from '@/components/websites/Header';
import TableComponent from '@/components/websites/TableComponent';

interface Website {
  _id?: string;
  protocol?: string;
  domain?: string;
  company?: string;
  category?: string;
}

const Page = () => {
  const [websites, setWebsites] = useState<Website[]>([]);

  return (
    <div>
      <Header setWebsites={setWebsites} />
      <TableComponent/>
    </div>
  );
};

export default Page;
