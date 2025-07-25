
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/ui/button';
import { Checkbox } from '@/ui/checkbox';
import { Plus, Upload, Download, Globe, ChevronDown, Pencil, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { Label } from '@/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { Skeleton } from '@/ui/skeleton';
import knowledgeBaseData from './knowledgeBaseData.json';

// TypeScript interface for the JSON data
interface KnowledgeBaseData {
  id: number;
  questionTitle: string;
  answerInformation: string;
  keywords: string;
}

const KnowledgeBaseHeader: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [tableData, setTableData] = useState<KnowledgeBaseData[]>(knowledgeBaseData);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [sortDirection, setSortDirection] = useState<Record<string, 'asc' | 'desc' | null>>({
    questionTitle: null,
    answerInformation: null,
    keywords: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const urls = [
    'http://abc.com',
    'http://cisco.com',
    'http://devtestloginwithgoogle.com',
    'http://nicramfaust-test.com',
    'http://nicramitsolutions-test.com',
    'http://oxnia.com',
    'http://test-zapier.com',
    'http://test-zotly-to-drift-flow.com',
    'https://abc.com',
    'https://abc@gmail.com',
    'https://cdpresolution.com',
    'https://chatmetrics.net',
    'https://dasvaan.com',
    'https://delivr.ai',
    'https://doctor.com',
    'https://drift.com',
    'https://drift.com',
    'https://drift.com',
    'https://drift.com',
    'https://faust-it-test.com',
    'https://fox.com',
    'https://getchatmetrics.co',
    'https://homnicra.com',
    'https://localhost.pl',
    'https://n2n2.com',
    'https://nextwebsitetest.com',
    'https://nicramt.com.pl',
    'https://nnni.com',
    'https://ok.com',
    'https://softspawn.ddns.net',
    'https://spacecreatures.com',
    'https://swas.com',
    'https://swastechies.com/chat',
    'https://techska.com',
    'https://techska.com/chattest/',
    'https://techska.com/chattest2/',
    'https://techska.com/test/',
    'https://techska.com/zotlystagingtest/',
    'https://test-duplicate.com',
    'https://test-integrations.com',
    'https://test.ai',
    'https://test.com',
    'https://test.com',
    'https://test.pl',
    'https://testbetazotly.godaddysites.com/',
    'https://testbug.com',
    'https://time.com',
    'https://virtualletterbox.co',
    'https://www',
    'https://www.chatmetrics.com',
    'https://www.route.com',
    'https://www.webstack.com.au/',
    'https://zotlychattest.mobirisesite.com/',
  ];

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleCheckboxChange = (url: string) => {
    setSelectedUrls((prev) =>
      prev.includes(url) ? prev.filter((item) => item !== url) : [...prev, url]
    );
  };

  const handleRowCheckboxChange = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSort = (column: keyof KnowledgeBaseData) => {
    const newDirection = sortDirection[column] === 'asc' ? 'desc' : 'asc';
    setSortDirection((prev) => ({ ...prev, [column]: newDirection }));
    const sortedData = [...tableData].sort((a, b) => {
      const aValue = a[column] || '';
      const bValue = b[column] || '';
      return newDirection === 'asc'
        ? aValue.toString().localeCompare(bValue.toString())
        : bValue.toString().localeCompare(aValue.toString());
    });
    setTableData(sortedData);
  };

  const handleDelete = (id: number) => {
    setTableData((prevData) => {
      const newData = prevData.filter((item) => item.id !== id);
      setSelectedRows((prev) => prev.filter((rowId) => rowId !== id));
      if (newData.length <= (currentPage - 1) * 5) {
        setCurrentPage((prev) => Math.max(1, prev - 1));
      }
      return newData;
    });
  };

  const getSortIcon = (column: string) => {
    const direction = sortDirection[column];
    if (direction === 'asc') return <ArrowUp className="h-4 w-4 ml-2" />;
    if (direction === 'desc') return <ArrowDown className="h-4 w-4 ml-2" />;
    return null;
  };

  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = tableData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(tableData.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-12 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-800">Knowledge Base</h1>
        <div className="flex justify-end items-center gap-4">
          <Button
            className="px-6 py-3 bg-blue-500 text-white hover:bg-blue-600 rounded-lg flex items-center gap-2"
            onClick={() => console.log('Add clicked')}
          >
            <Plus className="h-5 w-5" />
            <span>Add</span>
          </Button>
          <Button
            className="px-6 py-3 bg-gray-800 text-white rounded-lg flex items-center gap-2"
            onClick={() => console.log('Import clicked')}
          >
            <Upload className="h-5 w-5" />
            <span>Import</span>
          </Button>
          <Button
            className="px-6 py-3 bg-gray-800 text-white  rounded-lg flex items-center gap-2"
            onClick={() => console.log('Download template clicked')}
          >
            <Download className="h-5 w-5" />
            <span>Download template</span>
          </Button>
        </div>
      </div>
      <div className="mt-8 flex flex-col w-[350px]">
        <Label className="text-sm font-medium text-gray-700">Website</Label>
        <div className="relative mt-2">
          <div
            className="w-full p-3 border border-gray-300 rounded-md flex items-center justify-between cursor-pointer bg-white"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-gray-500" />
              <span className="text-gray-500">
                {selectedUrls.length > 0 ? `${selectedUrls.length} selected` : 'Select a website'}
              </span>
            </div>
            <ChevronDown
              className={`h-5 w-5 text-gray-500 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </div>
          {isDropdownOpen && (
            <div className="absolute w-full max-h-60 overflow-y-auto border border-gray-300 rounded-md bg-white shadow-lg z-10 mt-1">
              {urls.map((url, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 hover:bg-gray-100 cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    checked={selectedUrls.includes(url)}
                    onCheckedChange={() => handleCheckboxChange(url)}
                    className="h-4 w-4 text-blue-500"
                  />
                  <span className="text-sm text-gray-700 truncate">{url}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="mt-8">
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : tableData.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <Button onClick={() => console.log('Add Entry clicked')}>
              <Plus className="mr-2 h-4 w-4" />
              Add Entry
            </Button>
          </div>
        ) : (
          <>
            <Table className="border border-gray-200 w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4 py-4 hover:bg-gray-100 w-[5%] text-center">
                    <Checkbox
                      checked={selectedRows.length === currentData.length && currentData.length > 0}
                      onCheckedChange={() => {
                        if (selectedRows.length === currentData.length) {
                          setSelectedRows([]);
                        } else {
                          setSelectedRows(currentData.map((item) => item.id));
                        }
                      }}
                      className="h-4 w-4 text-blue-500"
                    />
                  </TableHead>
                  <TableHead className="px-4 py-4 hover:bg-gray-100 w-[25%] text-center">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('questionTitle')}
                      className="p-0 w-full flex items-center justify-center"
                    >
                      <span>Question/Title</span>
                      {getSortIcon('questionTitle')}
                    </Button>
                  </TableHead>
                  <TableHead className="px-4 py-4 hover:bg-gray-100 w-[35%] text-center">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('answerInformation')}
                      className="p-0 w-full flex items-center justify-center"
                    >
                      <span>Answer/Information</span>
                      {getSortIcon('answerInformation')}
                    </Button>
                  </TableHead>
                  <TableHead className="px-4 py-4 hover:bg-gray-100 w-[15%] text-center">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('keywords')}
                      className="p-0 w-full flex items-center justify-center"
                    >
                      <span>Keywords</span>
                      {getSortIcon('keywords')}
                    </Button>
                  </TableHead>
                  <TableHead className="px-4 py-4 hover:bg-gray-100 w-[15%] text-center">
                    <span>Details</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-100">
                    <TableCell className="px-4 py-3 w-[5%] text-center">
                      <Checkbox
                        checked={selectedRows.includes(item.id)}
                        onCheckedChange={() => handleRowCheckboxChange(item.id)}
                        className="h-4 w-4 text-blue-500"
                      />
                    </TableCell>
                    <TableCell className="px-4 py-3 w-[25%] text-left text-ellipsis overflow-hidden max-w-0">{item.questionTitle}</TableCell>
                    <TableCell className="px-4 py-3 w-[35%] text-left text-ellipsis overflow-hidden max-w-0">{item.answerInformation}</TableCell>
                    <TableCell className="px-4 py-3 w-[15%] text-left text-ellipsis overflow-hidden max-w-0">{item.keywords}</TableCell>
                    <TableCell className="px-4 py-3 w-[15%] text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          className="bg-white p-1 rounded-full"
                          onClick={() => console.log(`Edit clicked for ${item.questionTitle}`)}
                        >
                          <Pencil className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          className="bg-white p-1 rounded-full"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-center mt-4 gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  onClick={() => paginate(page)}
                  className="px-3 py-1"
                >
                  {page}
                </Button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default KnowledgeBaseHeader;
