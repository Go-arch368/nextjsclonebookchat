import React from 'react';
import Zapier from './Zapier';
import Drift from './Drift';

const IntegrationsHeader = () => {
  return (
    <div className="p-12 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="font-bold text-4xl">Integrations</h1>
      <hr className="mt-10" />
      <Zapier />
      <Drift />
    </div>
  );
};

export default IntegrationsHeader;