
import React from 'react';
import { Barista, Language } from '../types';
import { useLocalization } from '../hooks/useLocalization';
import StarRating from './StarRating';
import { transliterate } from '../utils/transliteration';
import { formatBranchName } from '../utils/formatting';

interface BaristaCardProps {
  barista: Barista;
  onSelect: () => void;
}

const BaristaCardHorizontal: React.FC<BaristaCardProps> = ({ barista, onSelect }) => {
  const { language, t } = useLocalization();
  const displayName = language === Language.EN ? transliterate(barista.name) : barista.name;
  const branchName = formatBranchName(barista.branch);

  return (
    <div 
        onClick={onSelect}
        className="group relative flex items-stretch bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-0 active:bg-[#202020] active:scale-[0.98] transition-all duration-200 cursor-pointer h-[165px] w-full overflow-hidden shadow-sm"
    >
      <div className="w-[50%] h-full shrink-0 relative bg-gray-800">
        <img
            src={barista.photo}
            alt={displayName}
            className="w-full h-full object-cover"
            loading="lazy"
        />
      </div>

      <div className="flex flex-col justify-center flex-grow min-w-0 px-5 py-3 h-full">
          <div className="flex flex-col justify-center w-full space-y-2.5">
              <h3 className="text-white font-bold text-xl leading-tight truncate font-montserrat">
                {displayName}
              </h3>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                    <StarRating rating={barista.averageRating} readOnly={true} size="sm" />
                    <span className="text-white font-bold text-sm">
                        {barista.averageRating.toFixed(1)}
                    </span>
                </div>
                <span className="text-white/50 text-[10px] font-normal mt-1">
                    ({barista.reviews.length} {t('reviews')})
                </span>
              </div>
              
              <div className="text-white/60 text-[11px] font-medium leading-snug pt-1">
                <span>Meama Collect - {branchName}</span>
                <svg className="w-3.5 h-3.5 inline ml-1 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
          </div>
      </div>
    </div>
  );
};

export default BaristaCardHorizontal;
