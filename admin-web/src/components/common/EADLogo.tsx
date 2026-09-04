import React from 'react';

interface EADLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const EADLogo: React.FC<EADLogoProps> = ({ size = 'md', showSubtitle = true }) => {
  const diamondSize = size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-12 h-12' : 'w-9 h-9';
  const innerDiamondSize = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-6 h-6' : 'w-4.5 h-4.5';
  const titleSize = size === 'sm' ? 'text-sm tracking-[0.25em]' : size === 'lg' ? 'text-2xl tracking-[0.3em]' : 'text-base tracking-[0.28em]';
  const subTitleSize = size === 'sm' ? 'text-[9px] tracking-[0.3em]' : size === 'lg' ? 'text-xs tracking-[0.35em]' : 'text-[10px] tracking-[0.32em]';

  return (
    <div className="flex flex-col items-center select-none">
      {/* Exact 3D Gold Nested Diamond from official website */}
      <div className={`relative ${diamondSize} flex items-center justify-center mb-1.5`}>
        {/* Outer Gold Diamond */}
        <div 
          className="w-full h-full rotate-45 border-[2px] border-[#D4A33B] rounded-[2px] flex items-center justify-center shadow-[0_0_10px_rgba(212,163,59,0.3)]"
          style={{
            background: 'linear-gradient(135deg, rgba(230,190,104,0.3) 0%, rgba(198,146,52,0.15) 50%, rgba(166,118,35,0.4) 100%)'
          }}
        >
          {/* Inner Solid Gold Diamond */}
          <div 
            className={`${innerDiamondSize} rotate-45 border border-[#E6BE68] rounded-[1px]`}
            style={{
              background: 'linear-gradient(135deg, #E6BE68 0%, #C69234 60%, #A67623 100%)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.4)'
            }}
          />
        </div>
      </div>

      {/* Exact Typography EAD BPO from official website */}
      <div className="flex flex-col items-center">
        <span className={`font-black text-white font-sans ${titleSize} leading-none ml-1`}>
          E A D
        </span>
        <span className={`font-bold text-white font-sans ${subTitleSize} leading-none mt-1 ml-1 text-slate-100`}>
          B P O
        </span>
      </div>

      {showSubtitle && (
        <span className="text-[9px] font-semibold text-[#D4A33B] tracking-widest uppercase mt-2 text-center">
          OPERACIONES & GESTIÓN DE CAMPO
        </span>
      )}
    </div>
  );
};
