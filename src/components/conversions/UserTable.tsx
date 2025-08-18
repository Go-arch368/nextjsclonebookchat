"use client";

import * as React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/ui/table";

export default function UserTable() {
  return (
    <div className="overflow-x-auto sm:overflow-y-auto mt-2">
      <Table className="w-full min-w-[800px] table-fixed bg-transparent">
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-black/5 shadow">
            <TableHead className="w-40 text-gray-700 dark:text-gray-300 px-4 py-3">
              First Name
            </TableHead>
            <TableHead className="w-40 text-gray-700 dark:text-gray-300 px-4 py-3">
              Last Name
            </TableHead>
            <TableHead className="w-40 text-gray-700 dark:text-gray-300 px-4 py-3">
              Email
            </TableHead>
            <TableHead className="w-40 text-gray-700 dark:text-gray-300 px-4 py-3">
              Phone Number
            </TableHead>
            <TableHead className="w-40 text-gray-700 dark:text-gray-300 px-4 py-3">
              Country/City
            </TableHead>
            <TableHead className="w-40 text-gray-700 dark:text-gray-300 px-4 py-3">
              Visitor start time
            </TableHead>
            <TableHead className="w-20 text-gray-700 dark:text-gray-300 px-4 py-3">
              Lead
            </TableHead>
            <TableHead className="w-20 text-gray-700 dark:text-gray-300 px-4 py-3">
              Support
            </TableHead>
            <TableHead className="w-30 text-gray-700 dark:text-gray-300 px-4 py-3">
              Subject
            </TableHead>
            <TableHead className="w-40 text-gray-700 dark:text-gray-300 px-4 py-3">
              Chat Token
            </TableHead>
            <TableHead className="w-40 text-gray-700 dark:text-gray-300 px-4 py-3">
              Company
            </TableHead>
            <TableHead className="w-40 text-gray-700 dark:text-gray-300 px-4 py-3">
              Website
            </TableHead>
            <TableHead className="w-40 text-gray-700 dark:text-gray-300 px-4 py-3">
              Started on
            </TableHead>
            <TableHead className="w-24 text-gray-700 dark:text-gray-300 pr-8 px-4 py-3">
              Details
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Add TableRow here for each record */}

          <TableRow>
            <TableCell className="px-4 py-3">John</TableCell>
            <TableCell className="px-4 py-3">Doe</TableCell>
            <TableCell className="px-4 py-3">john.doe@email.com</TableCell>
            <TableCell className="px-4 py-3">+123456789</TableCell>
            <TableCell className="px-4 py-3">USA/New York</TableCell>
            <TableCell className="px-4 py-3">10:05AM</TableCell>
            <TableCell className="px-4 py-3">✓</TableCell>
            <TableCell className="px-4 py-3">No</TableCell>
            <TableCell className="px-4 py-3">Product Inquiry</TableCell>
            <TableCell className="px-4 py-3">#100123</TableCell>
            <TableCell className="px-4 py-3">Acme Corp</TableCell>
            <TableCell className="px-4 py-3">example.com</TableCell>
            <TableCell className="px-4 py-3">12 Aug</TableCell>
            <TableCell className="px-4 py-3">
              <button className="text-blue-600 dark:text-blue-400 underline text-xs">
                View
              </button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
