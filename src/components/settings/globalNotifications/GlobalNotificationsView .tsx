"use client";

import React from 'react';
import GlobalNotificationsHeader from './GlobalNotificationsHeader';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GlobalNotificationsView: React.FC = () => {
  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick />
      <GlobalNotificationsHeader />
    </div>
  );
};

export default GlobalNotificationsView;