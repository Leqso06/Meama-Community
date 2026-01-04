
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Review, SortOption, Language } from './types';
import { useLocalization } from './hooks/useLocalization';
import { useBaristaData } from './hooks/useBaristaData';
import { transliterate } from './utils/transliteration';
import { getOrCreateCustomerId } from './utils/api'; 
import Header from './components/Header';
import BaristaCard from './components/BaristaCard';
import BaristaCardHorizontal from './components/BaristaCardHorizontal';
import StarRating from './components/StarRating';
import ReviewForm from './components/ReviewForm';
import ReviewCard from './components/ReviewCard';
import Pagination from './components/Pagination';
import SortDropdown from './components/SortDropdown';
import FilterDropdown from './components/FilterDropdown';

const CoffeeBeanLoader = ({ size = "w-10 h-10" }: { size?: string }) => (
    <div className={`animate-spin mx-auto mb-4 ${size}`}>
        <img 
            src="https://drive.google.com/thumbnail?id=1d38wtv9UC8RQKlocrrw4CWjWsiJ0t2DU&sz=w200" 
            alt="Loading..." 
            className="w-full h-full object-contain"
        />
    </div>
);

const App: React.FC = () => {
  const { t, language, setLanguage } = useLocalization();
  const { baristas, setBaristas, isLoading, isUsingMockData, debugInfo } = useBaristaData(t);

  const [selectedBaristaId, setSelectedBaristaId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>(SortOption.BestAverageRating);
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  
  const mobileTitleRef = useRef<HTMLHeadingElement>(null);
  const desktopTitleRef = useRef<HTMLHeadingElement>(null);
  const isFirstRender = useRef(true);

  const ITEMS_PER_PAGE_MOBILE = 24;
  const ITEMS_PER_PAGE_DESKTOP = 48;

  // Scroll to top on page change
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    
    // Simple smooth scroll logic
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    const ref = isDesktop ? desktopTitleRef.current : mobileTitleRef.current;
    const offset = isDesktop ? 120 : 20;

    if (ref) {
        window.scrollTo({ top: ref.offsetTop - offset, behavior: 'smooth' });
    }
  }, [currentPage]);

  // Reset page when filters change
  useEffect(() => { setCurrentPage(1); }, [searchTerm, sortOption, selectedLocation]);

  // Scroll to top when opening profile
  useEffect(() => { if (selectedBaristaId) window.scrollTo(0, 0); }, [selectedBaristaId]);

  const toggleLanguage = () => setLanguage(language === Language.EN ? Language.GEO : Language.EN);
  const handleLogoClick = useCallback(() => setSelectedBaristaId(null), []);

  // --- Derived State Calculations ---

  const globalAverageRating = useMemo(() => {
    let totalSum = 0;
    let totalCount = 0;
    for (const b of baristas) {
        for (const r of b.reviews) {
            totalSum += r.rating;
            totalCount++;
        }
    }
    return totalCount === 0 ? 0 : totalSum / totalCount;
  }, [baristas]);

  const uniqueLocations = useMemo(() => {
    return Array.from(new Set(baristas.map(b => b.branch))).sort();
  }, [baristas]);

  const filteredAndSortedBaristas = useMemo(() => {
    const lowerTerm = searchTerm.toLowerCase();

    return baristas
      .filter(barista => {
        if (selectedLocation !== 'All' && barista.branch !== selectedLocation) return false;
        
        if (!searchTerm) return true;
        const geoName = barista.name.toLowerCase();
        const engName = transliterate(barista.name).toLowerCase();
        return geoName.includes(lowerTerm) || engName.includes(lowerTerm);
      })
      .sort((a, b) => {
        switch (sortOption) {
          case SortOption.NameAZ: return a.name.localeCompare(b.name);
          case SortOption.MostReviews: return b.reviews.length - a.reviews.length;
          case SortOption.BranchAZ: return a.branch.localeCompare(b.branch);
          case SortOption.BestAverageRating: 
          default: 
            // 0 reviews always last
            if (a.reviews.length === 0 && b.reviews.length > 0) return 1;
            if (b.reviews.length === 0 && a.reviews.length > 0) return -1;
            if (a.reviews.length === 0 && b.reviews.length === 0) return 0;

            // Bayesian Average
            // WR = (v*R + m*C) / (v+m)
            // v = count, R = avg, m = 1 (weight), C = global avg
            const C = globalAverageRating;
            const m = 1;
            const wrA = (a.reviews.length * a.averageRating + m * C) / (a.reviews.length + m);
            const wrB = (b.reviews.length * b.averageRating + m * C) / (b.reviews.length + m);
            return wrB - wrA;
        }
      });
  }, [baristas, searchTerm, sortOption, globalAverageRating, selectedLocation]);

  // Handle optimistic updates from ReviewForm
  const handleAddReview = (baristaId: string, newReview: Omit<Review, 'id' | 'date'>) => {
    const currentCustomerId = getOrCreateCustomerId();
    const newUsername = newReview.reviewer;

    setBaristas(prev => prev.map(barista => {
        // Sync username across all reviews for this customer
        const updatedReviews = barista.reviews.map(r => 
            r.customerId === currentCustomerId ? { ...r, reviewer: newUsername } : r
        );

        if (barista.id !== baristaId) {
            return { ...barista, reviews: updatedReviews };
        }

        const addedReview: Review = {
            ...newReview,
            id: `R_OPT_${Date.now()}`, // Optimistic ID
            date: new Date().toISOString().split('T')[0],
            customerId: currentCustomerId
        };
        
        const finalReviews = [addedReview, ...updatedReviews];
        const totalRating = finalReviews.reduce((sum, r) => sum + r.rating, 0);
        
        return {
            ...barista,
            reviews: finalReviews,
            averageRating: totalRating / finalReviews.length
        };
    }));
  };

  const selectedBarista = useMemo(() => 
    selectedBaristaId ? baristas.find(b => b.id === selectedBaristaId) : null
  , [selectedBaristaId, baristas]);

  // Helper for Title
  const mainTitleText = useMemo(() => {
      const text = t('meetOurBaristas');
      if (language !== Language.GEO) return text;
      // Convert Georgian Mkhedruli to Mtavruli (Caps)
      return text.split('').map(char => {
        const code = char.charCodeAt(0);
        if (code >= 0x10D0 && code <= 0x10FA) return String.fromCharCode(code + 3008);
        return char;
      }).join('');
  }, [t, language]);

  // --- Render Views ---

  if (selectedBarista) {
    const displayName = language === Language.EN ? transliterate(selectedBarista.name) : selectedBarista.name;
    // Split name logic
    const lastSpace = displayName.lastIndexOf(' ');
    const firstName = lastSpace === -1 ? displayName : displayName.substring(0, lastSpace);
    const lastName = lastSpace === -1 ? '' : displayName.substring(lastSpace + 1);

    return (
      <div className={`min-h-screen bg-brand-bg font-georgian`}>
        <Header onLogoClick={handleLogoClick} searchTerm={searchTerm} setSearchTerm={setSearchTerm} sortOption={sortOption} setSortOption={setSortOption} />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div className="flex justify-between items-center mb-6">
                <button onClick={() => setSelectedBaristaId(null)} className="inline-flex items-center text-brand-text-secondary hover:text-brand-text-primary transition-colors text-sm font-medium group">
                    <svg className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    {t('backToBaristas')}
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 fade-in-up">
                {/* Profile Card */}
                <div className="md:col-span-1 flex flex-col items-center bg-[#1C1C1E] rounded-2xl p-8 border border-white/5 shadow-xl h-fit relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-brand-accent/30 to-transparent"></div>
                    <div className="relative group mb-6">
                         <div className="absolute inset-0 bg-brand-accent/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-110"></div>
                         <img src={selectedBarista.photo} alt={selectedBarista.name} className="w-36 h-36 rounded-full object-cover border-[3px] border-brand-accent/90 relative z-10 shadow-2xl" />
                    </div>
                    <div className="text-center mb-1 flex flex-col items-center">
                         <h1 className="text-3xl font-bold text-[#FCFBF4] leading-tight tracking-tight">{firstName}</h1>
                         {lastName && <div className="text-3xl font-bold text-[#FCFBF4] leading-tight tracking-tight">{lastName}</div>}
                    </div>
                    <div className="flex items-center gap-2 mb-8 mt-2 opacity-90">
                        <StarRating rating={selectedBarista.averageRating} readOnly={true} size="sm" />
                        <span className="text-[#FCFBF4] font-bold text-base">{selectedBarista.averageRating.toFixed(1)}</span>
                        <span className="text-brand-text-secondary text-sm font-medium">· {selectedBarista.reviews.length} {t('reviews')}</span>
                    </div>
                    <div className="w-full pt-5 border-t border-white/5">
                        <div className="flex items-center justify-center text-brand-text-secondary/60 text-xs font-bold uppercase tracking-widest">
                            {selectedBarista.branch}
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="md:col-span-2 space-y-8">
                    <ReviewForm 
                        baristaId={selectedBarista.id} 
                        baristaName={displayName} 
                        baristaBranch={selectedBarista.branch} 
                        onSubmit={handleAddReview} 
                        existingReviews={selectedBarista.reviews}
                    />
                    <div>
                        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                             <h2 className="text-xl font-bold text-[#FCFBF4]">{t('customerReviews')}</h2>
                             <span className="text-xs text-brand-text-secondary uppercase tracking-wider">{selectedBarista.reviews.length} Total</span>
                        </div>
                        <div className="space-y-4 overflow-y-auto md:max-h-[60vh] pr-2 custom-scrollbar">
                            {selectedBarista.reviews.length > 0 ? (
                                selectedBarista.reviews
                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .map((review, i) => (
                                    <div key={review.id} className="fade-in-up" style={{animationDelay: `${i * 50}ms`}}>
                                        <ReviewCard review={review} />
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 bg-[#1C1C1E]/50 rounded-2xl border border-white/5 border-dashed">
                                    <p className="text-brand-text-secondary/70">{t('noReviewsYet')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
      </div>
    );
  }

  // --- Main List View ---
  
  // Pagination Logic
  const mobileStartIndex = (currentPage - 1) * ITEMS_PER_PAGE_MOBILE;
  const mobilePaginatedData = filteredAndSortedBaristas.slice(mobileStartIndex, mobileStartIndex + ITEMS_PER_PAGE_MOBILE);
  const mobileTotalPages = Math.ceil(filteredAndSortedBaristas.length / ITEMS_PER_PAGE_MOBILE);

  const desktopStartIndex = (currentPage - 1) * ITEMS_PER_PAGE_DESKTOP;
  const desktopPaginatedData = filteredAndSortedBaristas.slice(desktopStartIndex, desktopStartIndex + ITEMS_PER_PAGE_DESKTOP);
  const desktopTotalPages = Math.ceil(filteredAndSortedBaristas.length / ITEMS_PER_PAGE_DESKTOP);

  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <div className={`min-h-screen bg-brand-bg font-georgian`}>
      <Header onLogoClick={handleLogoClick} searchTerm={searchTerm} setSearchTerm={setSearchTerm} sortOption={sortOption} setSortOption={setSortOption} />
      
      {isUsingMockData && (
        <div className="bg-red-900/50 text-red-200 px-4 py-2 text-center text-sm border-b border-red-500/30">Warning: Unable to load live data. Showing demonstration data.</div>
      )}
      
      {/* Empty / Error State */}
      {(!isLoading && baristas.length === 0) && (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-brand-card border border-red-500/30 rounded-xl p-8 text-center max-w-lg mx-auto">
                <h2 className="text-xl font-bold text-white mb-2">{t('setupRequired')}</h2>
                {debugInfo && (
                    <div className="bg-black/30 p-4 rounded text-left overflow-auto text-sm font-mono text-gray-300 mb-4 border border-gray-700">{debugInfo}</div>
                )}
                {!debugInfo && <p className="text-gray-400 mb-4">No data found. Please check your Google Sheet connection.</p>}
            </div>
        </div>
      )}

      {/* MOBILE LIST */}
      <div className="md:hidden relative">
        <div className="absolute top-6 right-6 z-10">
             <button onClick={toggleLanguage} className="font-semibold text-brand-text-secondary tracking-widest text-xs font-roboto-force">
                <span className={`transition-colors ${language === Language.GEO ? 'text-brand-accent font-bold' : 'hover:text-brand-text-primary'}`}>GEO</span><span className="mx-2 text-brand-text-secondary/30">|</span><span className={`transition-colors ${language === Language.EN ? 'text-brand-accent font-bold' : 'hover:text-brand-text-primary'}`}>ENG</span>
            </button>
        </div>
        <main className="container mx-auto px-5 pb-2">
            <div className="flex flex-col items-center pt-12 pb-2 fade-in-up">
                <img src="https://drive.google.com/thumbnail?id=1C8De-CfBt3K-SjnsGFsXkI9PTkxE0R51&sz=w800" alt="Meama Collect" className="h-24 w-auto mb-8 object-contain scale-125" />
                <div className="w-full border-b border-brand-text-secondary/10 my-8"></div>
                <h1 ref={mobileTitleRef} className={`text-3xl font-bold text-center text-[#FCFBF4] leading-tight mb-4 tracking-wide`}>{mainTitleText}</h1>
                <div className="w-16 h-1 bg-brand-accent rounded-full mb-4"></div>
            </div>
            
            <div className="mb-10 fade-in-up relative z-30" style={{animationDelay: '100ms'}}>
                <div className="flex flex-col gap-4">
                    <div className="relative">
                        <input type="text" placeholder={t('searchByName')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-brand-bg/60 border border-brand-accent/20 rounded-xl py-3 px-4 pl-10 w-full text-brand-text-primary placeholder-brand-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all text-sm" />
                        <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <FilterDropdown options={uniqueLocations} selectedOption={selectedLocation} onOptionChange={setSelectedLocation} labelKey="filterByLocation" allLabelKey="allLocations" className="w-full" />
                    <SortDropdown currentSort={sortOption} onSortChange={setSortOption} className="w-full" />
                </div>
            </div>

            {isLoading ? (
                <div className="text-center text-brand-text-secondary py-12">
                  <CoffeeBeanLoader />
                  <p className="text-sm tracking-wide">{t('loading')}</p>
                </div>
            ) : (
                <>
                    <div className="flex flex-col gap-4">
                        {mobilePaginatedData.map((barista, index) => (
                            <div key={barista.id} className="fade-in-up" style={{animationDelay: `${100 + index * 50}ms`}}><BaristaCardHorizontal barista={barista} onSelect={() => setSelectedBaristaId(barista.id)} /></div>
                        ))}
                        {mobilePaginatedData.length === 0 && !debugInfo && <div className="text-center text-brand-text-secondary py-8"><p>No baristas found.</p></div>}
                    </div>
                    {mobilePaginatedData.length > 0 && <Pagination currentPage={currentPage} totalPages={mobileTotalPages} onPageChange={handlePageChange} />}
                </>
            )}
        </main>
      </div>

      {/* DESKTOP LIST */}
      <main className="hidden md:block container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 ref={desktopTitleRef} className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 text-brand-text-primary fade-in-up text-[#FCFBF4] tracking-wide`}>{mainTitleText}</h1>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 md:mb-12 fade-in-up relative z-30" style={{animationDelay: '50ms'}}>
            <div className="relative w-full md:w-96">
                <input type="text" placeholder={t('searchByName')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-brand-card/50 border border-brand-accent/30 rounded-full py-3 px-4 pl-10 w-full text-brand-text-primary placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all" />
                <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                <FilterDropdown options={uniqueLocations} selectedOption={selectedLocation} onOptionChange={setSelectedLocation} labelKey="filterByLocation" allLabelKey="allLocations" className="w-full md:w-auto md:min-w-[220px]" />
                <SortDropdown currentSort={sortOption} onSortChange={setSortOption} className="w-full md:w-auto md:min-w-[220px]" />
            </div>
        </div>

        {isLoading ? (
             <div className="text-center text-brand-text-secondary py-12">
               <CoffeeBeanLoader size="w-12 h-12" />
               <p>{t('loading')}</p>
             </div>
        ) : (
            <div className="w-full mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {desktopPaginatedData.map((barista, index) => (
                        <div key={barista.id} className="fade-in-up" style={{animationDelay: `${100 + index * 50}ms`}}><BaristaCard barista={barista} onSelect={() => setSelectedBaristaId(barista.id)} /></div>
                    ))}
                    {desktopPaginatedData.length === 0 && !debugInfo && <div className="col-span-full text-center text-brand-text-secondary py-12"><p>No baristas found.</p></div>}
                </div>
                {desktopPaginatedData.length > 0 && <Pagination currentPage={currentPage} totalPages={desktopTotalPages} onPageChange={handlePageChange} />}
            </div>
        )}
      </main>
    </div>
  );
};

export default App;
