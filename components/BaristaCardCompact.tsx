
import React from 'react';
import { Barista, Language } from '../types';
import { useLocalization } from '../hooks/useLocalization';
import StarRating from './StarRating';
import { transliterate } from '../utils/transliteration';

interface BaristaCardProps {
  barista: Barista;
  onSelect: () => void;
}

const BaristaCardCompact: React.FC<BaristaCardProps> = ({ barista, onSelect }) => {
  const { t, language } = useLocalization();
  const displayName = language === Language.EN ? transliterate(barista.name) : barista.name;

  return (
    <div 
        onClick={onSelect}
        className="group flex flex-col items-center bg-[#222224] rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-white/5 w-full max-w-[280px] mx-auto h-full"
    >
      <div className="w-full aspect-square overflow-hidden relative">
        <img
            src={barista.photo}
            alt={displayName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      
      <div className="w-full p-4 flex flex-col items-center space-y-2 flex-grow">
        <h3 className="text-lg font-bold text-[#FCFBF4] text-center leading-tight">
            {displayName}
        </h3>
        
        <div className="flex items-center gap-1">
            <StarRating rating={barista.averageRating} readOnly={true} size="sm" />
            <span className="text-[#FCFBF4] font-bold text-xs">{barista.averageRating.toFixed(1)}</span>
        </div>

        <p className="text-[10px] font-normal text-white/60 uppercase tracking-widest text-center">
            {barista.branch}
        </p>

        <div className="flex-grow"></div>

        <button
            className="w-full py-2 rounded-lg font-bold text-xs bg-[#333335] text-white hover:bg-[#FCFBF4] hover:text-black transition-colors mt-2"
        >
            {t('viewProfile')}
        </button>
      </div>
    </div>
  );
};

export default BaristaCardCompact;
