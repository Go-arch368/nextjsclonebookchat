
"use client";

import React, { useState } from 'react';
import GreetingHeader from './GreetingHeader';
import AddGreetingForm from './AddGreetingFrom';

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
}

const GreetingsView: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [greetings, setGreetings] = useState<Greeting[]>([]);

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
  };

  const handleSave = (newGreeting: Greeting) => {
    setGreetings((prev) => [...prev, newGreeting]);
    setShowAddForm(false);
  };

  return (
    <div>
      {showAddForm ? (
        <AddGreetingForm onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <GreetingHeader onAddClick={handleAddClick} onAddGreeting={handleSave} greetings={greetings} />
      )}
    </div>
  );
};

export default GreetingsView;
