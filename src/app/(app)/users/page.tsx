// src/app/(app)/users/page.tsx or src/pages/users.tsx
"use client";

import React, { useState } from 'react';
import Header from '@/components/users/Header';
import TableComponent from '@/components/users/TableComponent';

interface User {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
}

const Page = () => {
  const [users, setUsers] = useState<User[]>([]);

  return (
    <div>
      <Header setUsers={setUsers} />
      <TableComponent  />
    </div>
  );
};

export default Page;
