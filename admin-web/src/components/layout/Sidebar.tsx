import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { EADLogo } from '../common/EADLogo';
import { 
  LayoutDashboard, 
  Files, 
  Users, 
  Briefcase, 
  RadioTower, 
  BarChart3, 
  Coins,
  Trophy,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Ranking de Gestores', href: '/ranking', icon: Trophy, highlight: true },
  { name: 'Bolsa de Recolección', href: '/ofertas', icon: Coins },
  { name: 'Cuentas', href: '/cuentas', icon: Briefcase },
  { name: 'Comisionistas', href: '/comisionistas', icon: Users },
  { name: 'Carteras (Excel)', href: '/carteras', icon: Files },
  { name: 'Torre de Control', href: '/torre-control', icon: RadioTower },
  { name: 'Reportes', href: '/reportes', icon: BarChart3 },
];

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="md:hidden flex items-center justify-between p-4 bg-[#10182E] border-b border-gold-500/20 text-white">
        <EADLogo size="sm" showSubtitle={false} />
        <button onClick={() => setIsOpen(!isOpen)} className="text-gold-400 hover:text-gold-300">
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className={`
        fixed inset-y-0 left-0 z-50 w-60 bg-[#10182E] border-r border-gold-500/20 transform transition-transform duration-200 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        md:static md:inset-auto md:flex
      `}>
        <div className="py-5 px-4 border-b border-gold-500/20 flex justify-center">
          <EADLogo size="md" showSubtitle={true} />
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `group flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#1A274B] text-gold-400 font-semibold border-l-2 border-gold-500 shadow-sm'
                    : 'text-slate-300 hover:bg-[#131E3A] hover:text-gold-300'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`mr-2.5 h-4 w-4 flex-shrink-0 ${
                      isActive ? 'text-gold-400' : 'text-slate-400 group-hover:text-gold-300'
                    }`}
                    aria-hidden="true"
                  />
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gold-500/20 bg-[#0B1120]">
          <div className="flex items-center px-2 py-1.5">
            <div className="w-7 h-7 rounded-lg bg-[#1A274B] border border-gold-500/30 flex items-center justify-center text-gold-400 font-bold text-xs mr-2.5">
              👑
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-200 truncate">
                {user?.nombre || 'Admin EAD'}
              </p>
              <p className="text-[10px] text-gold-400/90 truncate font-semibold">
                Torre de Control
              </p>
            </div>
            <button
              onClick={logout}
              className="ml-1 p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
