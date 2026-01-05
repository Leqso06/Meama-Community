
import React, { useState, useEffect, useRef } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import StarRating from './StarRating';
import { Review } from '../types';
import { submitReviewToSheet, getOrCreateCustomerId } from '../utils/api';
import { compressAndSanitizeImage } from '../utils/image';

interface ReviewFormProps {
  baristaId: string;
  baristaName: string;
  baristaBranch: string;
  onSubmit: (baristaId: string, newReview: Omit<Review, 'id' | 'date'>) => void;
  existingReviews: Review[];
}

const ReviewForm: React.FC<ReviewFormProps> = ({ baristaId, baristaName, baristaBranch, onSubmit, existingReviews }) => {
  const { t } = useLocalization();
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [username, setUsername] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check previous ratings on mount
  useEffect(() => {
      const currentCustomerId = getOrCreateCustomerId();
      const storageKey = `rated_barista_${baristaId}`;
      const storedUsername = localStorage.getItem('meama_username');
      
      setUsername(storedUsername || '');

      const isLocallyRated = localStorage.getItem(storageKey) === 'true';
      const isRemotelyRated = existingReviews?.some(r => r.customerId === currentCustomerId);

      if (isLocallyRated || isRemotelyRated) {
          if (!isLocallyRated) localStorage.setItem(storageKey, 'true');
          setHasRated(true);
      } else {
          setHasRated(false);
          setRating(0);
          setText('');
          setSelectedImage(null);
      }
  }, [baristaId, existingReviews]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const file = e.target.files?.[0];
    if (!file) return;

    try {
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
        if (!validTypes.some(type => file.type === type) && !file.type.startsWith('image/')) {
            throw new Error("Invalid file type. Please upload a JPG, PNG, or WebP image.");
        }
        
        const compressedBase64 = await compressAndSanitizeImage(file);
        setSelectedImage(compressedBase64);
    } catch (err: any) {
        console.error("Image Error:", err);
        setError(err.message || "Failed to process image.");
        if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validation
    const trimmedUsername = username.trim();
    if (trimmedUsername) {
        if (trimmedUsername.length < 2) return setError(t('usernameTooShort'));
        if (!/^[\p{L}\p{N}_.]+$/u.test(trimmedUsername)) return setError(t('usernameInvalidFormat'));
    }
    
    if (rating === 0) return setError(t('ratingRequired'));

    setIsSubmitting(true);

    try {
        const savedReview = await submitReviewToSheet(
            baristaId, 
            rating, 
            text, 
            username, 
            baristaBranch, 
            selectedImage || undefined
        );
        
        if (savedReview) {
            onSubmit(baristaId, { ...savedReview, customerId: getOrCreateCustomerId() });
            localStorage.setItem(`rated_barista_${baristaId}`, 'true');
            setHasRated(true); 
            setMessage(t('thankYouForReview'));
        }
    } catch (err: any) {
        setError(`${t('errorSubmitting')} (${err.message || 'Network Error'})`);
    } finally {
        setIsSubmitting(false);
    }
  };

  if (hasRated) {
      return (
        <div className="bg-[#1C1C1E] rounded-2xl p-8 shadow-lg text-center border border-white/5">
            <div className="flex justify-center mb-4">
                <div className="bg-green-500/10 p-3 rounded-full">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
            </div>
            <h2 className="text-xl font-bold text-[#FCFBF4] mb-2">{t('thankYouForReview')}</h2>
        </div>
      );
  }

  return (
    <div className="bg-[#1C1C1E] rounded-2xl p-6 shadow-lg border border-white/5">
      <div className="mb-4 text-center">
         <h2 className="text-sm font-medium text-brand-text-secondary uppercase tracking-wider mb-2">{t('rateBarista')}</h2>
         <div className="flex justify-center py-2">
             <StarRating rating={rating} onRatingChange={setRating} readOnly={isSubmitting} size="lg" />
         </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={t('usernamePlaceholder')}
            disabled={isSubmitting}
            className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-[#FCFBF4] placeholder-brand-text-secondary/50 focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/30 transition-all disabled:opacity-50 text-sm"
        />

        <div className="relative">
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t('shareExperience')}
                rows={4}
                disabled={isSubmitting}
                className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-[#FCFBF4] placeholder-brand-text-secondary/50 focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/30 transition-all disabled:opacity-50 pb-10 text-sm resize-none"
            />
            
            <div className="absolute bottom-3 left-3 flex items-center">
                <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isSubmitting || !!selectedImage}
                />
                {!selectedImage ? (
                    <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isSubmitting}
                        className="text-brand-text-secondary hover:text-brand-accent transition-colors flex items-center gap-2 text-xs bg-[#252525] px-3 py-1.5 rounded-md border border-white/10"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Add Photo</span>
                    </button>
                ) : (
                    <div className="flex items-center gap-2 bg-[#252525] px-3 py-1.5 rounded-md border border-brand-accent/30">
                        <span className="text-xs text-[#FCFBF4] truncate max-w-[100px]">Image Selected</span>
                        <button type="button" onClick={removeImage} className="text-red-400 hover:text-red-300">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
        
        {selectedImage && (
            <div className="mt-2 relative inline-block group">
                <img src={selectedImage} alt="Preview" className="h-20 w-auto rounded-lg border border-white/10 object-cover" />
                <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        )}

        <button
          type="submit"
          disabled={!!message || isSubmitting}
          className="w-full bg-gradient-to-r from-brand-accent to-[#9e7652] text-[#FCFBF4] font-bold py-2.5 px-6 rounded-xl transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-brand-accent/20 active:scale-95 disabled:bg-gray-600 disabled:shadow-none disabled:from-gray-600 disabled:cursor-not-allowed flex justify-center items-center text-sm uppercase tracking-wide"
        >
          {isSubmitting ? t('submitting') : t('submitReview')}
        </button>
        {error && <p className="text-red-400 text-center pt-2 text-sm">{error}</p>}
        {message && <p className="text-green-400 text-center pt-2 text-sm">{message}</p>}
      </form>
    </div>
  );
};

export default ReviewForm;
