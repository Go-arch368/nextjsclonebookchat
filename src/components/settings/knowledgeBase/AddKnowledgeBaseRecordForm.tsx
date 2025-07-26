
"use client";

import React, { useState } from 'react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';

interface KnowledgeBaseRecord {
  id: number;
  questionTitle: string;
  answerInformation: string;
  keywords: string;
  websites: string;
}

interface AddKnowledgeBaseRecordFormProps {
  onSave: (record: KnowledgeBaseRecord) => void;
  onCancel: () => void;
}

const AddKnowledgeBaseRecordForm: React.FC<AddKnowledgeBaseRecordFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    questionTitle: '',
    answerInformation: '',
    keywords: '',
    websites: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.questionTitle || !formData.answerInformation || !formData.keywords) {
      alert('Question/Title, Answer/Information, and Keywords are required.');
      return;
    }
    onSave({
      id: Date.now(),
      questionTitle: formData.questionTitle,
      answerInformation: formData.answerInformation,
      keywords: formData.keywords,
      websites: formData.websites,
    });
    setFormData({
      questionTitle: '',
      answerInformation: '',
      keywords: '',
      websites: '',
    });
    onCancel();
  };

  return (
    <div className="p-10 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-4xl font-bold text-gray-800 mb-10">Add a new record</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="questionTitle" className="text-sm font-medium text-gray-700">
            Question/Title *
          </Label>
          <Input
            id="questionTitle"
            name="questionTitle"
            value={formData.questionTitle}
            onChange={handleInputChange}
            className="w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter question or title"
            required
          />
        </div>
        <div>
          <Label htmlFor="answerInformation" className="text-sm font-medium text-gray-700">
            Answer/Information *
          </Label>
          <Input
            id="answerInformation"
            name="answerInformation"
            value={formData.answerInformation}
            onChange={handleInputChange}
            className="w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter answer or information"
            required
          />
        </div>
        <div>
          <Label htmlFor="keywords" className="text-sm font-medium text-gray-700">
            Keywords *
          </Label>
          <Input
            id="keywords"
            name="keywords"
            value={formData.keywords}
            onChange={handleInputChange}
            className="w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter keywords (comma-separated)"
            required
          />
        </div>
        <div>
          <Label htmlFor="websites" className="text-sm font-medium text-gray-700">
            Websites
          </Label>
          <Input
            id="websites"
            name="websites"
            value={formData.websites}
            onChange={handleInputChange}
            className="w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter websites (comma-separated)"
          />
        </div>
        <div className="flex justify-end gap-3 mt-8">
          <Button
            type="button"
            variant="outline"
            className="px-6 py-2 border-gray-300 text-gray-800"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-800"
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddKnowledgeBaseRecordForm;
