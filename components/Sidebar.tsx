
import React from 'react';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  const menuItems = [
    { id: 'dashboard', icon: 'fa-gauge-high', label: 'Dashboard' },
    { id: 'deliveries', icon: 'fa-truck-fast', label: 'Deliveries' },
    { id: 'profile', icon: 'fa-user-ninja', label: 'Rider Profile' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-3 text-indigo-600">
          <i className="fa-solid fa-person-biking text-3xl"></i>
          <span className="text-xl font-black tracking-tight text-gray-900">BANDIT<span className="text-indigo-600">RIDERS</span></span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activePage === item.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <i className={`fa-solid ${item.icon} text-lg`}></i>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t">
        <div className="bg-indigo-50 rounded-2xl p-4">
          <h5 className="text-xs font-bold text-indigo-700 uppercase mb-1">Weekly Goal</h5>
          <div className="flex justify-between items-end mb-2">
            <span className="text-lg font-bold text-indigo-900">42/50</span>
            <span className="text-xs text-indigo-600">84%</span>
          </div>
          <div className="w-full bg-indigo-200 rounded-full h-1.5">
            <div className="bg-indigo-600 h-1.5 rounded-full w-[84%]"></div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
