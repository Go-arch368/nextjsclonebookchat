"use client";

import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { ChevronDown } from 'lucide-react';

interface ZapierProps {
  integrations: Integration[];
  onConfigure: () => void;
  onEdit: (integration: Integration) => void;
}

interface Integration {
  id: number;
  userId: number;
  service: 'ZAPIER' | 'DRIFT';
  website: string;
  apiKey: string;
  isConfigured: boolean;
  createdAt: string;
  updatedAt: string;
}

const Zapier: React.FC<ZapierProps> = ({ integrations, onConfigure, onEdit }) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIntegrationId, setSelectedIntegrationId] = useState<string | null>(null);

  const handleInputClick = () => {
    setIsOpen(!isOpen);
  };

  const selectedIntegration = integrations.find((i) => i.id.toString() === selectedIntegrationId) || null;

  return (
    <div className="mt-5">
      <div className="space-y-6">
        <div className="p-6 rounded-lg">
          <div className="relative">
            <Input
              value={`Zapier Integrations (${integrations.length})`}
              readOnly
              onClick={handleInputClick}
              className={`w-full border ${
                theme === 'dark' ? 'bg-sky-800 text-white hover:bg-sky-900' : 'bg-sky-300 text-black hover:bg-white'
              } font-bold ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
              } focus:ring-2 focus:ring-blue-500 p-6 pr-10 cursor-pointer`}
            />
            <ChevronDown
              className={`absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 ${
                theme === 'dark' ? 'text-white' : 'text-black'
              } pointer-events-none`}
              aria-hidden="true"
            />
          </div>
          {isOpen && (
            <div className={`mt-10 p-6 ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } shadow-lg rounded-lg text-center`}>
              {integrations.length > 0 ? (
                <>
                  <p className={`mb-4 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Manage multiple Zapier integrations. Select an integration to view or edit its details.
                  </p>
                  <Select
                    value={selectedIntegrationId || ''}
                    onValueChange={(value) => setSelectedIntegrationId(value)}
                  >
                    <SelectTrigger className={`w-full mb-4 ${
                      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500`}>
                      <SelectValue placeholder={`Select from ${integrations.length} Zapier integrations`} />
                    </SelectTrigger>
                    <SelectContent className={`max-h-60 overflow-y-auto ${
                      theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''
                    }`}>
                      {integrations.map((integration) => (
                        <SelectItem 
                          key={integration.id} 
                          value={integration.id.toString()}
                          className={theme === 'dark' ? 'hover:bg-gray-700' : ''}
                        >
                          {integration.website}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedIntegration ? (
                    <>
                      <p className={`mb-2 font-bold text-2xl ${
                        theme === 'dark' ? 'text-white' : 'text-gray-800'
                      }`}>
                        Zapier Integration Details
                      </p>
                      <p className={theme === 'dark' ? 'text-gray-300' : ''}>
                        Website: {selectedIntegration.website}
                      </p>
                      <p className={theme === 'dark' ? 'text-gray-300' : ''}>
                        API Key: {selectedIntegration.apiKey}
                      </p>
                      <p className={theme === 'dark' ? 'text-gray-300' : ''}>
                        Status: {selectedIntegration.isConfigured ? 'Configured' : 'Not Configured'}
                      </p>
                      <Button
                        className={`mt-4 ${
                          theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
                        } text-white px-4 py-2 rounded`}
                        onClick={() => onEdit(selectedIntegration)}
                      >
                        Edit Integration
                      </Button>
                    </>
                  ) : (
                    <p className={`mb-2 font-bold text-xl ${
                      theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}>
                      Select an integration to view details
                    </p>
                  )}
                  <Button
                    className={`mt-4 ${
                      theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
                    } text-white px-4 py-2 rounded`}
                    onClick={onConfigure}
                  >
                    Add New Zapier Integration
                  </Button>
                </>
              ) : (
                <>
                  <p className={`mb-2 font-bold text-2xl ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>
                    Zapier Integration Not Configured
                  </p>
                  <p className={theme === 'dark' ? 'text-gray-300' : ''}>
                    It looks like Zapier is not integrated with your account. Add as many integrations as needed.
                  </p>
                  <Button
                    className={`mt-4 ${
                      theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
                    } text-white px-4 py-2 rounded`}
                    onClick={onConfigure}
                  >
                    Configure Zapier
                  </Button>
                </>
              )}
              {/* ... (rest of your Zapier instructions with theme classes) */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Zapier;