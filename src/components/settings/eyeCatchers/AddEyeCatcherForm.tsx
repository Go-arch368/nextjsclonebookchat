
"use client";

import React, { useState, useRef } from 'react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Camera, Trash2 } from 'lucide-react';

interface EyeCatcher {
  id: number;
  title: string;
  text: string;
  backgroundColor: string;
  textColor: string;
  image?: string;
}

interface AddEyeCatcherFormProps {
  onSave: (eyeCatcher: EyeCatcher) => void;
  onCancel: () => void;
}

const AddEyeCatcherForm: React.FC<AddEyeCatcherFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    text: '',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    image: '' as string | undefined,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageDelete = () => {
    setFormData({ ...formData, image: undefined });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: Date.now(),
      title: formData.title,
      text: formData.text,
      backgroundColor: formData.backgroundColor,
      textColor: formData.textColor,
      image: formData.image,
    });
    setFormData({
      title: '',
      text: '',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      image: undefined,
    });
    onCancel();
  };

  return (
    <div className="p-10 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-4xl font-bold text-gray-800 mb-10">Add a new eye catcher</h1>
      <hr className='mb-10 font-bold'/>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex gap-6">
          {/* Input Section */}
          <div className="flex-1 space-y-6">
            {/* Title */}
            <div>
              <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter eye catcher title"
              />
            </div>

            {/* Text */}
            <div>
              <Label htmlFor="text" className="text-sm font-medium text-gray-700">
                Text
              </Label>
              <Input
                id="text"
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                className="w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter eye catcher text"
              />
            </div>

            {/* Background Color */}
            <div>
              <Label htmlFor="backgroundColor" className="text-sm font-medium text-gray-700">
                Background Color
              </Label>
              <Input
                id="backgroundColor"
                type="color"
                value={formData.backgroundColor}
                onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                className="w-16 h-10 mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Text Color */}
            <div>
              <Label htmlFor="textColor" className="text-sm font-medium text-gray-700">
                Text Color
              </Label>
              <Input
                id="textColor"
                type="color"
                value={formData.textColor}
                onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                className="w-16 h-10 mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Preview and Image Upload Section */}
          <div className="flex-1 space-y-6">
            {/* Dummy Preview Container */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Preview</Label>
              <div
                className="w-[300px] h-[200px] mt-2 border border-gray-300 shadow-lg rounded-md p-4 flex flex-col justify-center items-center"
                style={{ backgroundColor: formData.backgroundColor }}
              >
                <h2
                  className="text-lg font-semibold text-center"
                  style={{ color: formData.textColor }}
                >
                  {formData.title || 'Title Placeholder'}
                </h2>
                <p
                  className="text-sm text-center mt-2"
                  style={{ color: formData.textColor }}
                >
                  {formData.text || 'Text Placeholder'}
                </p>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <Label htmlFor="image" className="text-sm font-medium text-gray-700">
                Image Upload
              </Label>
              <div className="w-[150px] h-[150px] mt-2 bg-gray-200 border border-gray-300 shadow-lg rounded-md flex flex-col justify-center items-center relative">
                {formData.image ? (
                  <>
                    <img
                      src={formData.image}
                      alt="Uploaded"
                      className="w-full h-full object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      className="absolute top-2 right-2 p-1 bg-white rounded-full"
                      onClick={handleImageDelete}
                    >
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Camera className="h-8 w-8 text-gray-500" />
                    <span className="text-sm text-gray-500 mt-2">Upload Image</span>
                  </>
                )}
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleImageUpload}
                  ref={fileInputRef}
                />
              </div>
            </div>
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

export default AddEyeCatcherForm;
