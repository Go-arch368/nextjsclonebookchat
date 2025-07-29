// src/app/(app)/users/page.tsx
"use client";

import React, { useState } from 'react';
import Header from '@/components/users/Header';
import TableComponent from '@/components/users/TableComponent';
import { User } from '@/types/user';

const Page = () => {
  const [users, setUsers] = useState<User[]>([]);

  return (
    <div>
      <Header setUsers={setUsers} users={users} />
      <TableComponent users={users} setUsers={setUsers} />
    </div>
  );
};

export default Page;