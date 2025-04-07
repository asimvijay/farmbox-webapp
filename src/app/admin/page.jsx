"use client"

import { useState } from 'react';
import Head from 'next/head';
import Sidebar from '../components/admin/sidebar';
import Header from '../components/admin/header';
import TabContent from '../components/admin/TabContent';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50">
      <Head>
        <title>Admin Dashboard | FarmBox</title>
        <meta name="description" content="FarmBox Admin Dashboard" />
      </Head>

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />

      <div className="flex-1 overflow-auto">
        <Header activeTab={activeTab} />
        
        <main className="p-6">
          <TabContent activeTab={activeTab} />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;