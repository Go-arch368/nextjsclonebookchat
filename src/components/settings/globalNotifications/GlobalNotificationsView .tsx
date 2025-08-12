"use client";

import React from 'react';
import GlobalNotificationsHeader from './GlobalNotificationsHeader';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GlobalNotificationsView: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <GlobalNotificationsHeader />
    </div>
  );
};

export default GlobalNotificationsView;