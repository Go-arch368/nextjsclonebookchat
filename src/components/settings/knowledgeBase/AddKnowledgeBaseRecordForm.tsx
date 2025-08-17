"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Textarea } from '@/ui/textarea';
import { MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface KnowledgeBaseRecord {
  id?: number;
  questionTitle: string;
  answerInformation: string;
  keywords: string;
  websites: string[];
}

interface AddKnowledgeBaseRecordFormProps {
  onSave: (record: KnowledgeBaseRecord) => void;
  onCancel: () => void;
  initialRecord: KnowledgeBaseRecord | null;
}

const AddKnowledgeBaseRecordForm: React.FC<AddKnowledgeBaseRecordFormProps> = ({ 
  onSave, 
  onCancel, 
  initialRecord 
}) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<KnowledgeBaseRecord>({
    questionTitle: '',
    answerInformation: '',
    keywords: '',
    websites: [],
  });
  const [errors, setErrors] = useState({
    questionTitle: '',
    answerInformation: '',
    keywords: '',
  });
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

  useEffect(() => {
    if (initialRecord) {
      setFormData({
        id: initialRecord.id,
        questionTitle: initialRecord.questionTitle,
        answerInformation: initialRecord.answerInformation,
        keywords: initialRecord.keywords,
        websites: initialRecord.websites || [],
      });
    }
  }, [initialRecord]);

  const insertVariable = (variable: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = formData.answerInformation.slice(0, start) + variable + formData.answerInformation.slice(end);
      setFormData({ ...formData, answerInformation: newValue });
      setErrors(prev => ({ ...prev, answerInformation: '' }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      questionTitle: '',
      answerInformation: '',
      keywords: '',
    };

    if (!formData.questionTitle.trim()) {
      newErrors.questionTitle = 'Question/Title is required';
      valid = false;
    }
    if (!formData.answerInformation.trim()) {
      newErrors.answerInformation = 'Answer/Information is required';
      valid = false;
    }
    if (!formData.keywords.trim()) {
      newErrors.keywords = 'Keywords are required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    const payload: KnowledgeBaseRecord = {
      ...formData,
      questionTitle: formData.questionTitle.trim(),
      answerInformation: formData.answerInformation.trim(),
      keywords: formData.keywords.trim(),
      websites: Array.isArray(formData.websites) ? formData.websites : [],
    };

    onSave(payload);
  };

  return (
    <div className={`p-10 rounded-xl shadow-lg border ${
      theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <h1 className={`text-2xl font-semibold text-gray-800 dark:text-white mb-10 ${
        theme === 'dark' ? 'text-white' : 'text-gray-800'
      }`}>
        {initialRecord ? 'Edit Knowledge Base Record' : 'Add New Record'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="questionTitle" className={theme === 'dark' ? 'text-gray-300' : ''}>
            Question/Title
          </Label>
          <div className="relative mt-2">
            <MessageSquare className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <Input
              id="questionTitle"
              value={formData.questionTitle}
              onChange={(e) => {
                setFormData({ ...formData, questionTitle: e.target.value });
                setErrors(prev => ({ ...prev, questionTitle: '' }));
              }}
              className={`w-full pl-10 ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : ''
              } ${errors.questionTitle ? 'border-red-500' : ''}`}
              placeholder="Enter question or title"
            />
            {errors.questionTitle && (
              <p className="text-red-500 text-sm mt-1">{errors.questionTitle}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="answerInformation" className={theme === 'dark' ? 'text-gray-300' : ''}>
            Answer/Information
          </Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {variables.map((variable) => (
              <Button
                key={variable}
                type="button"
                variant="outline"
                className={`text-sm ${
                  theme === 'dark' ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'
                }`}
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
              setErrors(prev => ({ ...prev, answerInformation: '' }));
              if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
              }
            }}
            ref={textareaRef}
            className={`w-full min-h-[150px] ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : ''
            } ${errors.answerInformation ? 'border-red-500' : ''}`}
            placeholder="Enter answer or information"
          />
          {errors.answerInformation && (
            <p className="text-red-500 text-sm mt-1">{errors.answerInformation}</p>
          )}
        </div>

        <div>
          <Label htmlFor="keywords" className={theme === 'dark' ? 'text-gray-300' : ''}>
            Keywords
          </Label>
          <Input
            id="keywords"
            value={formData.keywords}
            onChange={(e) => {
              setFormData({ ...formData, keywords: e.target.value });
              setErrors(prev => ({ ...prev, keywords: '' }));
            }}
            className={`w-full ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : ''
            } ${errors.keywords ? 'border-red-500' : ''}`}
            placeholder="Enter keywords (comma-separated)"
          />
          {errors.keywords && (
            <p className="text-red-500 text-sm mt-1">{errors.keywords}</p>
          )}
        </div>

        <div>
          <Label htmlFor="websites" className={theme === 'dark' ? 'text-gray-300' : ''}>
            Websites (comma-separated)
          </Label>
          <Input
            id="websites"
            value={Array.isArray(formData.websites) ? formData.websites.join(', ') : ''}
            onChange={(e) => {
              const websites = e.target.value.split(',').map(w => w.trim()).filter(w => w);
              setFormData({ ...formData, websites });
            }}
            className={`w-full ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : ''
            }`}
            placeholder="Enter websites (e.g., example.com, test.com)"
          />
        </div>

        <div className="flex justify-end gap-3 mt-8">
     <Button
  type="button"
  variant="outline"
  className={`flex items-center gap-2 px-3 py-1.5 border text-sm rounded-lg ${
    theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
  }`}
  onClick={onCancel}
>
  Cancel
</Button>

{/* Save/Update Button - Structure updated, original colors kept */}
<Button
  type="submit"
  className="flex items-center gap-2 px-3 py-1.5 border text-sm rounded-lg bg-blue-600 hover:bg-blue-800 text-white"
>
  {initialRecord ? 'Update' : 'Save'}
</Button>
        </div>
      </form>
    </div>
  );
};

export default AddKnowledgeBaseRecordForm;