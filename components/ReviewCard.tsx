
import React, { useState } from 'react';
import { Review } from '../types';
import StarRating from './StarRating';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  return (
    <div className="bg-[#151515] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors">
      <div className="flex flex-col">
          <div className="flex justify-between items-start w-full">
              <div className="flex flex-col">
                 <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-sm text-[#FCFBF4]/70 italic">
                        {review.reviewer}
                    </p>
                    <span className="hidden sm:inline text-white/20 text-xs">•</span>
                    <div className="flex items-center">
                        <StarRating rating={review.rating} readOnly={true} size="sm" />
                    </div>
                 </div>
                 <p className="text-[10px] text-brand-text-secondary/50 mt-0.5">{review.date}</p>
              </div>
          </div>

          {review.text && <p className="text-brand-text-secondary/80 text-sm leading-relaxed mt-2 whitespace-pre-line">{review.text}</p>}
      </div>
      
      {review.imageUrl && (
        <>
            <div className="mt-3">
                <img 
                    src={review.imageUrl} 
                    alt="Review attachment" 
                    className="h-20 w-auto rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity border border-white/10"
                    onClick={() => setIsImageModalOpen(true)}
                />
            </div>
            
            {/* Simple Image Modal */}
            {isImageModalOpen && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                    onClick={() => setIsImageModalOpen(false)}
                >
                    <div className="relative max-w-full max-h-full">
                        <img 
                            src={review.imageUrl} 
                            alt="Full size" 
                            className="max-w-full max-h-[90vh] object-contain rounded-md"
                        />
                        <button 
                            className="absolute top-2 right-2 bg-white/20 text-white rounded-full p-2 hover:bg-white/40"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsImageModalOpen(false);
                            }}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </>
      )}
    </div>
  );
};

export default ReviewCard;
