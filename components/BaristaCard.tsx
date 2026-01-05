
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

const BaristaCard: React.FC<BaristaCardProps> = ({ barista, onSelect }) => {
  const { language } = useLocalization();
  const displayName = language === Language.EN ? transliterate(barista.name) : barista.name;
  const branchName = formatBranchName(barista.branch);

  return (
    <div 
        onClick={onSelect}
        className="group relative flex items-stretch bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-0 hover:border-brand-accent/40 hover:bg-[#202020] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer h-[150px] w-full overflow-hidden"
    >
      <div className="w-[140px] h-full shrink-0 relative bg-gray-800">
        <img
            src={barista.photo}
            alt={displayName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
        />
      </div>

      <div className="flex flex-col justify-center flex-grow min-w-0 px-4 py-2 h-full relative">
          <div className="flex flex-col justify-center h-full space-y-2">
              <div className="flex justify-between items-start">
                 <h3 className="text-white font-bold text-xl leading-tight truncate font-montserrat pr-2">
                    {displayName}
                 </h3>
              </div>

              <div className="flex items-center gap-2">
                <StarRating rating={barista.averageRating} readOnly={true} size="md" />
                <span className="text-white font-bold text-base">{barista.averageRating.toFixed(1)}</span>
                <span className="text-gray-500 text-xs mt-0.5">({barista.reviews.length})</span>
              </div>
              
              <div className="text-white/60 text-[11px] font-medium leading-snug mt-1">
                <div>Meama Collect -</div>
                <div className="flex items-center">
                    <span>{branchName}</span>
                    <svg className="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default BaristaCard;
