"use client";

import React, { useState, useRef } from 'react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Textarea } from '@/ui/textarea';
import { MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface KnowledgeBaseRecord {
  id?: number;
  userId?: number;
  questionTitle: string;
  answerInformation: string;
  keywords: string;
  websites: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface AddKnowledgeBaseRecordFormProps {
  onSave: (record: KnowledgeBaseRecord) => void;
  onCancel: () => void;
  initialRecord: KnowledgeBaseRecord | null;
}

const AddKnowledgeBaseRecordForm: React.FC<AddKnowledgeBaseRecordFormProps> = ({
  onSave,
  onCancel,
  initialRecord,
}) => {
  const [formData, setFormData] = useState<KnowledgeBaseRecord>({
    questionTitle: initialRecord?.questionTitle || '',
    answerInformation: initialRecord?.answerInformation || '',
    keywords: initialRecord?.keywords || '',
    websites: initialRecord?.websites || [],
  });
  const [errors, setErrors] = useState<{ questionTitle?: string; answerInformation?: string; keywords?: string }>({});
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const variables = [
    '+Company Name',
    '+Website Domain',
    '+Visitor Continent',
    '+Visitor Country',
    '+Visitor Region',
    '+Visitor City',
    '+Visitor Language',
    '+Visitor Os Name',
    '+Visitor Browser',
  ];

  const insertVariable = (variable: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = formData.answerInformation.slice(0, start) + variable + formData.answerInformation.slice(end);
      setFormData({ ...formData, answerInformation: newValue });
      setErrors((prev) => ({ ...prev, answerInformation: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { questionTitle?: string; answerInformation?: string; keywords?: string } = {};
    if (!formData.questionTitle.trim()) {
      newErrors.questionTitle = 'Question/Title is required';
    }
    if (!formData.answerInformation.trim()) {
      newErrors.answerInformation = 'Answer/Information is required';
    }
    if (!formData.keywords.trim()) {
      newErrors.keywords = 'Keywords are required';
    }
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fill in all required fields');
      return;
    }

    onSave({
      id: initialRecord?.id,
      userId: 1,
      questionTitle: formData.questionTitle.trim(),
      answerInformation: formData.answerInformation.trim(),
      keywords: formData.keywords.trim(),
      websites: formData.websites,
      createdAt: initialRecord?.createdAt || new Date().toISOString().slice(0, 19),
      updatedAt: new Date().toISOString().slice(0, 19),
    });
    setFormData({
      questionTitle: '',
      answerInformation: '',
      keywords: '',
      websites: [],
    });
    setErrors({});
    toast.success(initialRecord ? 'Record updated successfully!' : 'Record added successfully!');
    onCancel();
  };

  return (
    <div className="p-10 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-4xl font-bold text-gray-800 mb-10">
        {initialRecord ? 'Edit Knowledge Base Record' : 'Add a new Knowledge Base Record'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Question/Title */}
        <div className="p-4">
          <Label htmlFor="questionTitle" className="text-sm font-medium text-gray-700">Question/Title *</Label>
          <div className="relative mt-2">
            <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <Input
              id="questionTitle"
              value={formData.questionTitle}
              onChange={(e) => {
                setFormData({ ...formData, questionTitle: e.target.value });
                setErrors((prev) => ({ ...prev, questionTitle: '' }));
              }}
              className={`w-full pl-10 border-gray-300 focus:ring-2 focus:ring-blue-500 ${errors.questionTitle ? 'border-red-500' : ''}`}
              placeholder="Enter question or title"
            />
            {errors.questionTitle && <p className="text-red-500 text-sm mt-1">{errors.questionTitle}</p>}
          </div>
        </div>

        {/* Answer/Information */}
        <div className="p-4">
          <Label htmlFor="answerInformation" className="text-sm font-medium text-gray-700 mb-2">Answer/Information *</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {variables.map((variable) => (
              <Button
                key={variable}
                type="button"
                className="bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm hover:bg-gray-300"
                onClick={() => insertVariable(variable)}
              >
                {variable}
              </Button>
            ))}
          </div>
          <Textarea
            id="answerInformation"
            value={formData.answerInformation}
            onChange={(e) => {
              setFormData({ ...formData, answerInformation: e.target.value });
              setErrors((prev) => ({ ...prev, answerInformation: '' }));
              if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
              }
            }}
            className={`w-full min-h-[150px] border-gray-300 focus:ring-2 focus:ring-blue-500 ${errors.answerInformation ? 'border-red-500' : ''}`}
            placeholder="Enter answer or information"
            ref={textareaRef}
          />
          {errors.answerInformation && <p className="text-red-500 text-sm mt-1">{errors.answerInformation}</p>}
          <p className="text-sm text-gray-500 mt-2">
            Set the answer/information. Use variables to personalize the response.
          </p>
        </div>

        {/* Keywords */}
        <div className="p-4">
          <Label htmlFor="keywords" className="text-sm font-medium text-gray-700">Keywords *</Label>
          <div className="relative mt-2">
            <Input
              id="keywords"
              value={formData.keywords}
              onChange={(e) => {
                setFormData({ ...formData, keywords: e.target.value });
                setErrors((prev) => ({ ...prev, keywords: '' }));
              }}
              className={`w-full pl-10 border-gray-300 focus:ring-2 focus:ring-blue-500 ${errors.keywords ? 'border-red-500' : ''}`}
              placeholder="Enter keywords (comma-separated)"
            />
            {errors.keywords && <p className="text-red-500 text-sm mt-1">{errors.keywords}</p>}
          </div>
        </div>

        {/* Websites */}
        <div className="p-4">
          <Label htmlFor="websites" className="text-sm font-medium text-gray-700">Websites</Label>
          <div className="relative mt-2">
            <Input
              id="websites"
              value={formData.websites.join(', ')}
              onChange={(e) => {
                setFormData({ ...formData, websites: e.target.value.split(',').map(w => w.trim()).filter(w => w) });
              }}
              className="w-full pl-10 border-gray-300 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter websites (comma-separated)"
            />
          </div>
        </div>

        {/* Save and Cancel Buttons */}
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