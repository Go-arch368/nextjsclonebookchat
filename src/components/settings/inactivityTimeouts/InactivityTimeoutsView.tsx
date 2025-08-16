"use client";

import { useTheme } from "next-themes";
import InactivityTimeoutsHeader from './inactivityTimeoutsHeader';

const InactivityTimeoutsView = () => {
  const { theme } = useTheme();
  
  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <InactivityTimeoutsHeader/>
    </div>
  )
}

export default InactivityTimeoutsView