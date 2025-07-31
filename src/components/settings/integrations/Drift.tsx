"use client";

import React, { useState } from 'react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { ChevronDown } from 'lucide-react';

interface DriftProps {
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

const Drift: React.FC<DriftProps> = ({ integrations, onConfigure, onEdit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIntegrationId, setSelectedIntegrationId] = useState<string | null>(null);

  const handleInputClick = () => {
    setIsOpen(!isOpen);
  };

  const selectedIntegration = integrations.find((i) => i.id.toString() === selectedIntegrationId) || null;

  return (
    <div className="mt-5">
      <div className="space-y-6">
        <div className="p-4 rounded-lg">
          <div className="relative">
            <Input
              value={`Drift Integrations (${integrations.length})`}
              readOnly
              onClick={handleInputClick}
              className="w-full border bg-sky-300 text-black font-bold border-gray-300 hover:bg-white focus:ring-2 focus:ring-blue-500 p-6 pr-10 cursor-pointer"
            />
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black pointer-events-none"
              aria-hidden="true"
            />
          </div>
          {isOpen && (
            <div className="mt-12 p-6 bg-sky-300 shadow-lg rounded-lg text-center">
              {integrations.length > 0 ? (
                <>
                  <p className="mb-4 text-gray-600">
                    Manage multiple Drift integrations. Select an integration to view or edit its details.
                  </p>
                  <Select
                    value={selectedIntegrationId || ''}
                    onValueChange={(value) => setSelectedIntegrationId(value)}
                  >
                    <SelectTrigger className="w-full mb-4 border-gray-300 focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder={`Select from ${integrations.length} Drift integrations`} />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {integrations.map((integration) => (
                        <SelectItem key={integration.id} value={integration.id.toString()}>
                          {integration.website}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedIntegration ? (
                    <>
                      <p className="mb-2 font-bold text-2xl">Drift Integration Details</p>
                      <p>Website: {selectedIntegration.website}</p>
                      <p>API Key: {selectedIntegration.apiKey}</p>
                      <p>Status: {selectedIntegration.isConfigured ? 'Configured' : 'Not Configured'}</p>
                      <Button
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        onClick={() => onEdit(selectedIntegration)}
                      >
                        Edit Integration
                      </Button>
                    </>
                  ) : (
                    <p className="mb-2 font-bold text-xl">Select an integration to view details</p>
                  )}
                  <Button
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={onConfigure}
                  >
                    Add New Drift Integration
                  </Button>
                </>
              ) : (
                <>
                  <p className="mb-2 font-bold text-2xl">Drift Integration Not Configured</p>
                  <p>It looks like Drift is not integrated with your account. Add as many integrations as needed.</p>
                  <Button
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={onConfigure}
                  >
                    Configure Drift
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Drift;