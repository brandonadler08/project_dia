import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  colorClass?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, subtitle, colorClass = 'text-gold-400 bg-gold-500/20 border border-gold-500/40' }) => {
  return (
    <div className="glass-panel rounded-2xl p-5 border border-gold-500/20 shadow-xl overflow-hidden relative">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-gold-400/90 uppercase tracking-wider truncate">{title}</p>
          <p className="text-3xl font-bold text-white mt-1.5 font-mono">{value}</p>
        </div>
        <div className={`rounded-xl p-2.5 ${colorClass}`}>
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
      </div>
      {subtitle && (
        <div className="mt-3 pt-2.5 border-t border-gold-500/10 text-[11px] text-slate-400">
          {subtitle}
        </div>
      )}
    </div>
  );
};
