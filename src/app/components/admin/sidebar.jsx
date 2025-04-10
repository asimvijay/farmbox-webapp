"use client"

import Link from 'next/link'

const Sidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
  const navItems = [
    { id: 'dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', label: 'Dashboard' },
    { id: 'orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', label: 'Orders' },
    { id: 'products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', label: 'Products' },
    { id: 'customers', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', label: 'Customers' },
    { id: 'deliveries', icon: 'M9 20l-4.447-2.724A1 1 0 014 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7', label: 'Deliveries' },
    { id: 'reports', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', label: 'Reports' },
    { id: 'farmboxes', icon: 'M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h10v10H7V7z', label: 'FarmBoxes' },
  ];

  return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-green-800 text-white transition-all duration-300 flex flex-col`}>
      <div className="p-4 flex items-center justify-between border-b border-green-700">
        {sidebarOpen ? (
          <h1 className="text-xl font-bold">FarmBox Admin</h1>
        ) : (
          <h1 className="text-xl font-bold">FB</h1>
        )}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 rounded-lg hover:bg-green-700"
        >
          {sidebarOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center w-full p-3 rounded-lg ${activeTab === item.id ? 'bg-green-700' : 'hover:bg-green-700'}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            {sidebarOpen && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-green-700">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
            <span className="text-white font-bold">A</span>
          </div>
          {sidebarOpen && (
            <div className="ml-3">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-green-200">admin@farmbox.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;