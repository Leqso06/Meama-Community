
import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { Language, SortOption } from '../types';

interface HeaderProps {
    onLogoClick: () => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    sortOption: SortOption;
    setSortOption: (option: SortOption) => void;
}

const Header: React.FC<HeaderProps> = ({ 
    onLogoClick,
}) => {
    const { language, setLanguage, t } = useLocalization();

    // Desktop Logo ID
    const DESKTOP_LOGO_ID = '1C8De-CfBt3K-SjnsGFsXkI9PTkxE0R51';

    // Using thumbnail API for direct image embedding
    const DESKTOP_LOGO_URL = `https://drive.google.com/thumbnail?id=${DESKTOP_LOGO_ID}&sz=w600`;

    const toggleLanguage = () => {
        setLanguage(language === Language.EN ? Language.GEO : Language.EN);
    };

    // Note: Mobile elements (Hamburger, Mobile Logo) have been removed
    // as the mobile view now handles these directly in App.tsx without a header.

    return (
        <header className="hidden md:block bg-[#211f1f] sticky top-0 z-50 md:py-2 shadow-xl shadow-black/15">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between relative">
                    {/* Desktop Spacer for Centering */}
                    <div className="flex-1" />

                    {/* Desktop Logo - Aligned Center */}
                    <button
                        type="button"
                        onClick={onLogoClick}
                        className="focus:outline-none transition-opacity hover:opacity-80"
                    >
                        <img 
                            src={DESKTOP_LOGO_URL} 
                            alt={t('logo')} 
                            className="h-12 w-auto object-contain" 
                        />
                    </button>
                    
                    {/* Desktop Language Toggle */}
                    <div className="flex items-center gap-4 flex-1 justify-end">
                        <button
                            onClick={toggleLanguage}
                            className="font-semibold text-brand-text-secondary tracking-widest text-sm font-roboto-force"
                        >
                            <span className={`transition-colors ${language === Language.GEO ? 'text-brand-accent font-bold' : 'hover:text-brand-text-primary'}`}>GEO</span>
                            <span className="mx-1">|</span>
                            <span className={`transition-colors ${language === Language.EN ? 'text-brand-accent font-bold' : 'hover:text-brand-text-primary'}`}>ENG</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
