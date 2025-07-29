// src/app/billing/page.tsx
'use client';

import { useState } from 'react';
import clsx from 'clsx';
import InvoicesView from '@/components/billing/InvoicesView';
import PaymentsView from '@/components/billing/PaymentsView';
import PricePlansTable from '@/components/billing/PricePlansTable';
import { useBillingStore } from '@/stores/useBillingStore';

export default function Page() {
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments' | 'price plans'>('invoices');
  const { pricePlans } = useBillingStore();

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <div className="w-[150px] border-r p-2 bg-gray-50 dark:bg-zinc-900">
        <nav className="flex flex-col gap-2">
          {['invoices', 'payments', 'price plans'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={clsx(
                'text-left px-3 py-2 rounded-md text-sm font-medium capitalize',
                {
                  'bg-blue-100 text-blue-900 dark:bg-blue-800 dark:text-white':
                    activeTab === tab,
                  'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800':
                    activeTab !== tab,
                }
              )}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'invoices' && <InvoicesView />}
        {activeTab === 'payments' && <PaymentsView />}
        {activeTab === 'price plans' && <PricePlansTable />}
      </div>
    </div>
  );
}