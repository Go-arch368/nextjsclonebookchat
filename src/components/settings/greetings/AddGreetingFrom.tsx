
"use client";

import React, { useState, useRef } from 'react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Textarea } from '@/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { MessageSquare, Plus } from 'lucide-react';

// TypeScript interface for the greeting
interface Translation {
  language: string;
  greeting: string;
}

interface Greeting {
  id: number;
  title: string;
  greeting: string;
  type: string;
  translations: Translation[];
  visible: boolean; // Added for visibility toggle
}

interface AddGreetingFormProps {
  onSave: (greeting: Greeting) => void;
  onCancel: () => void;
}

const AddGreetingForm: React.FC<AddGreetingFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    greeting: '',
    type: 'All Visitors',
    translations: [] as Translation[],
    visible: true, // Default to visible
  });
  const [translationFields, setTranslationFields] = useState<
    { id: number; language: string; greeting: string }[]
  >([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const translationRefs = useRef<(HTMLTextAreaElement | null)[]>([]);

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

  const languages = [
    'Abkhazian', 'Afar', 'Afrikaans', 'Akan', 'Albanian', 'Amharic', 'Arabic', 'Aragonese', 'Armenian',
    'Assamese', 'Avaric', 'Avestan', 'Aymara', 'Azerbaijani', 'Bambara', 'Bangla', 'Bashkir', 'Basque',
    'Belarusian', 'Bihari', 'Bislama', 'Bosnian', 'Breton', 'Bulgarian', 'Burmese', 'Catalan', 'Chamorro',
    'Chechen', 'Chinese', 'Church Slavic', 'Chuvash', 'Cornish', 'Corsican', 'Cree', 'Croatian', 'Czech',
    'Danish', 'Divehi', 'Dutch', 'Dzongkha', 'English', 'Esperanto', 'Estonian', 'Ewe', 'Faroese', 'Fijian',
    'Finnish', 'French', 'Fulah', 'Galician', 'Ganda', 'Georgian', 'German', 'Greek', 'Guarani', 'Gujarati',
    'Haitian Creole', 'Hausa', 'Hebrew', 'Herero', 'Hindi', 'Hiri Motu', 'Hungarian', 'Icelandic', 'Ido',
    'Igbo', 'Indonesian', 'Interlingua', 'Interlingue', 'Inuktitut', 'Inupiaq', 'Irish', 'Italian',
    'Japanese', 'Javanese', 'Kalaallisut', 'Kannada', 'Kanuri', 'Kashmiri', 'Kazakh', 'Khmer', 'Kikuyu',
    'Kinyarwanda', 'Komi', 'Kongo', 'Korean', 'Kuanyama', 'Kurdish', 'Kyrgyz', 'Lao', 'Latin', 'Latvian',
    'Limburgish', 'Lingala', 'Lithuanian', 'Luba-Katanga', 'Luxembourgish', 'Macedonian', 'Malagasy',
    'Malay', 'Malayalam', 'Maltese', 'Manx', 'Maori', 'Marathi', 'Marshallese', 'Moldavian', 'Mongolian',
    'Nauru', 'Navajo', 'Ndonga', 'Nepali', 'North Ndebele', 'Northern Sami', 'Norwegian',
    'Norwegian Bokmål', 'Norwegian Nynorsk', 'Nyanja', 'Occitan', 'Odia', 'Ojibwa', 'Oromo', 'Ossetic',
    'Pali', 'Pashto', 'Persian', 'Polish', 'Portuguese', 'Punjabi', 'Quechua', 'Romanian', 'Romansh',
    'Rundi', 'Russian', 'Samoan', 'Sango', 'Sanskrit', 'Sardinian', 'Scottish Gaelic', 'Serbian', 'Shona',
    'Sichuan Yi', 'Sindhi', 'Sinhala', 'Slovak', 'Slovenian', 'Somali', 'South Ndebele', 'Southern Sotho',
    'Spanish', 'Sundanese', 'Swahili', 'Swati', 'Swedish', 'Tagalog', 'Tahitian', 'Tajik', 'Tamil', 'Tatar',
    'Telugu', 'Thai', 'Tibetan', 'Tigrinya', 'Tongan', 'Tsonga', 'Tswana', 'Turkish', 'Turkmen', 'Twi',
    'Ukrainian', 'Urdu', 'Uyghur', 'Uzbek', 'Venda', 'Vietnamese', 'Volapük', 'Walloon', 'Welsh',
    'Western Frisian', 'Wolof', 'Xhosa', 'Yiddish', 'Yoruba', 'Zhuang', 'Zulu',
  ];

  const insertVariable = (variable: string, isTranslation: boolean, index?: number) => {
    if (isTranslation && index !== undefined) {
      const textarea = translationRefs.current[index];
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newValue =
          formData.translations[index].greeting.slice(0, start) +
          variable +
          formData.translations[index].greeting.slice(end);
        setFormData({
          ...formData,
          translations: formData.translations.map((t, i) =>
            i === index ? { ...t, greeting: newValue } : t
          ),
        });
      }
    } else {
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newValue =
          formData.greeting.slice(0, start) + variable + formData.greeting.slice(end);
        setFormData({ ...formData, greeting: newValue });
      }
    }
  };

  const addTranslation = () => {
    setTranslationFields((prev) => [
      ...prev,
      { id: Date.now(), language: '', greeting: '' },
    ]);
    setFormData((prev) => ({
      ...prev,
      translations: [...prev.translations, { language: '', greeting: '' }],
    }));
  };

  const updateTranslation = (index: number, field: 'language' | 'greeting', value: string) => {
    setFormData((prev) => ({
      ...prev,
      translations: prev.translations.map((t, i) =>
        i === index ? { ...t, [field]: value } : t
      ),
    }));
    setTranslationFields((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [field]: value } : t))
    );
  };

  const removeTranslation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      translations: prev.translations.filter((_, i) => i !== index),
    }));
    setTranslationFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: Date.now(),
      title: formData.title,
      greeting: formData.greeting,
      type: formData.type,
      translations: formData.translations.filter((t) => t.language && t.greeting),
      visible: formData.visible,
    });
    setFormData({
      title: '',
      greeting: '',
      type: 'All Visitors',
      translations: [],
      visible: true,
    });
    setTranslationFields([]);
    onCancel();
  };

  return (
    <div className="p-10 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-4xl font-bold text-gray-800 mb-10">Add a new greeting</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1) Title */}
        <div className="p-4">
          <Label htmlFor="title" className="text-sm font-medium text-gray-700">Title</Label>
          <div className="relative mt-2">
            <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full pl-10 border-gray-300 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter greeting title"
            />
          </div>
        </div>

        {/* 2) Greeting Type */}
        <div className="p-4">
          <Label htmlFor="type" className="text-sm font-medium text-gray-700 mb-10">Greeting Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger className="w-full rounded-full bg-gray-600 text-white focus:ring-2 focus:ring-blue-500 mt-2">
              <SelectValue placeholder="All Visitors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Visitors">All Visitors</SelectItem>
              <SelectItem value="Returning Visitors">Returning Visitors</SelectItem>
              <SelectItem value="First Time Visitors">First Time Visitors</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 3) Greeting Message */}
        <div className="p-4">
          <Label htmlFor="greeting" className="text-sm font-medium text-gray-700 mb-10">Greeting Message</Label>
          <div className="flex flex-wrap gap-2 mb-2 mt-2">
            {variables.map((variable) => (
              <Button
                key={variable}
                type="button"
                className="bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm hover:bg-gray-300"
                onClick={() => insertVariable(variable, false)}
              >
                {variable}
              </Button>
            ))}
          </div>
          <Textarea
            id="greeting"
            value={formData.greeting}
            onChange={(e) => setFormData({ ...formData, greeting: e.target.value })}
            className="w-full min-h-[150px] border-gray-300 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter greeting message"
            ref={textareaRef}
          />
          <p className="text-sm text-gray-500 mt-2">
            Set the default greeting message. Use variables to personalize the greeting.
          </p>
        </div>

        {/* 4) Visibility */}
        <div className="p-4">
          <Label htmlFor="visible" className="text-sm font-medium text-gray-700">Visibility</Label>
          <div className="mt-2">
            <Input
              id="visible"
              type="checkbox"
              checked={formData.visible}
              onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Make this greeting visible</span>
          </div>
        </div>

        {/* 5) Translations */}
        <div className="p-4">
          <Label className="text-sm font-medium text-gray-700">Translations</Label>
          <p className="text-sm text-gray-500 mt-2 mb-6">
            Set greetings in different languages. The greeting version will be selected according to the user's language settings or the default greeting message above will be used.
          </p>
          {translationFields.map((field, index) => (
            <div key={field.id} className="space-y-4 mb-6 border-t border-gray-200 pt-4">
              <div className="flex items-center gap-3">
                <Select
                  value={field.language}
                  onValueChange={(value) => updateTranslation(index, 'language', value)}
                >
                  <SelectTrigger className="w-[200px] border-gray-300 focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {languages.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => removeTranslation(index)}
                >
                  Remove
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {variables.map((variable) => (
                  <Button
                    key={variable}
                    type="button"
                    className="bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm hover:bg-gray-300"
                    onClick={() => insertVariable(variable, true, index)}
                  >
                    {variable}
                  </Button>
                ))}
              </div>
              <Textarea
                value={formData.translations[index]?.greeting || ''}
                onChange={(e) => updateTranslation(index, 'greeting', e.target.value)}
                className="w-full min-h-[150px] border-gray-300 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter translated greeting message"
                // ref={(el) => (translationRefs.current[index] = el)}
              />
            </div>
          ))}
          {/* 6) +Add a translation */}
          <Button
            type="button"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            onClick={addTranslation}
          >
            <Plus className="h-4 w-4" />
            Add a translation
          </Button>
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

export default AddGreetingForm;
