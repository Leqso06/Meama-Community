
import React, { useState } from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange, readOnly = false, size = 'md' }) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  // Size mapping
  // sm: ~18px, md: ~24px, lg: ~30px (20% larger than 24px)
  const textSize = 
    size === 'sm' ? 'text-lg' : 
    size === 'lg' ? 'text-3xl' : 
    'text-2xl';

  // INPUT MODE (Interactive): Uses discrete stars that change color on hover/click
  if (!readOnly) {
    const displayRating = hoverRating > 0 ? hoverRating : rating;
    return (
      <div className={`flex cursor-pointer select-none ${textSize}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`transition-colors duration-200 ${
              star <= displayRating ? 'text-brand-accent' : 'text-gray-600'
            }`}
            onClick={() => onRatingChange?.(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
          >
            ★
          </span>
        ))}
      </div>
    );
  }

  // READ-ONLY MODE (Display): Uses CSS Gradient Clipping
  // Calculation: Converts 0-5 rating to 0-100 percentage
  const percentage = Math.min(100, Math.max(0, (rating / 5) * 100));

  return (
    <div 
      className={`star-rating-gradient font-bold tracking-tighter ${textSize}`} 
      style={{ '--rating-percent': `${percentage}%` } as React.CSSProperties}
      title={`${rating.toFixed(1)} / 5`}
    >
      ★★★★★
    </div>
  );
};

export default StarRating;
