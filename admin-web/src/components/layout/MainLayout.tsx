import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const pathNames = location.pathname.split('/').filter(x => x);

  return (
    <div className="flex h-screen bg-[#10182E] text-slate-100 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-[#131E3A] border-b border-gold-500/20 z-10 hidden md:block">
          <div className="max-w-7xl mx-auto py-3 px-6 flex items-center justify-between">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <span className="text-gold-400 font-bold text-xs tracking-wider">EAD BPO OPERACIONES</span>
                </li>
                {pathNames.map((name, index) => {
                  const isLast = index === pathNames.length - 1;
                  return (
                    <li key={name} className="flex items-center">
                      <span className="text-slate-500 mx-1.5">/</span>
                      <span className={`capitalize text-xs ${isLast ? 'text-white font-semibold' : 'text-slate-400'}`}>
                        {name.replace('-', ' ')}
                      </span>
                    </li>
                  )
                })}
              </ol>
            </nav>
            <div className="flex items-center space-x-3 text-xs">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5" />
                Torre de Control Activa
              </span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
