import React, { createContext, useState, useContext } from 'react';

const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [refreshData, setRefreshData] = useState(false);

  return (
    <DashboardContext.Provider value={{ 
      activeTab, 
      setActiveTab,
      refreshData,
      setRefreshData
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext); 