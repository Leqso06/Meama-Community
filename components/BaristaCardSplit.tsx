import React from 'react';
import { Barista, Language } from '../types';
import { useLocalization } from '../hooks/useLocalization';
import StarRating from './StarRating';
import { transliterate } from '../utils/transliteration';

interface BaristaCardProps {
  barista: Barista;
  onSelect: () => void;
}

const BaristaCardSplit: React.FC<BaristaCardProps> = ({ barista, onSelect }) => {
  const { t, language } = useLocalization();
  const displayName = language === Language.EN ? transliterate(barista.name) : barista.name;

  return (
    <div className="bg-[#1C1C1E] rounded-2xl overflow-hidden shadow-lg flex flex-col w-full max-w-[300px] mx-auto border border-transparent hover:shadow-2xl transition-all hover:-translate-y-1">
      {/* Upper: Details Grid */}
      <div className="p-5 flex items-center gap-3">
        {/* Left: Image */}
        <img
            src={barista.photo}
            alt={displayName}
            className="w-24 h-24 rounded-full object-cover border-2 border-brand-accent shrink-0"
        />
        
        {/* Right: Text Info */}
        <div className="flex flex-col justify-center min-w-0">
            <h3 className="font-montserrat text-base font-bold text-[#FCFBF4] mb-1 leading-snug truncate">
                {displayName}
            </h3>
            
            <div className="flex items-center gap-1 mb-1 text-brand-accent font-bold text-sm">
                 <StarRating rating={barista.averageRating} readOnly={true} size="sm" />
                 <span className="ml-1">{barista.averageRating.toFixed(1)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-[11px] text-gray-500">
                <span>{barista.reviews.length} {t('reviews')}</span>
                <span className="text-gray-600">•</span>
                <span>{barista.branch}</span>
            </div>
        </div>
      </div>

      {/* Bottom: Action Bar */}
      <button
        onClick={onSelect}
        className="mt-auto bg-[#2A2A2D] text-[#FCFBF4] border-t border-[#333] py-3.5 px-5 w-full font-semibold text-sm flex justify-between items-center hover:bg-brand-accent hover:text-white transition-colors group"
      >
        <span>{t('viewProfile')}</span>
        <span className="transform group-hover:translate-x-1 transition-transform">→</span>
      </button>
    </div>
  );
};

export default BaristaCardSplit;