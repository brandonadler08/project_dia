import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'gold';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'neutral', className }) => {
  const variantStyles = {
    success: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.15)]',
    warning: 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.15)]',
    danger: 'bg-red-500/15 text-red-300 border border-red-500/40 shadow-[0_0_8px_rgba(239,68,68,0.15)]',
    info: 'bg-sky-500/15 text-sky-300 border border-sky-500/40 shadow-[0_0_8px_rgba(14,165,233,0.15)]',
    neutral: 'bg-navy-800/80 text-slate-300 border border-slate-700',
    gold: 'bg-gold-500/20 text-gold-300 border border-gold-500/40 shadow-[0_0_8px_rgba(212,175,55,0.2)]'
  };

  return (
    <span className={twMerge(
      clsx(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide",
        variantStyles[variant],
        className
      )
    )}>
      {label}
    </span>
  );
};
