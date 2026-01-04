
import React, { useState, useRef, useEffect } from 'react';
import { useLocalization } from '../hooks/useLocalization';

interface FilterDropdownProps {
    options: string[];
    selectedOption: string;
    onOptionChange: (option: string) => void;
    labelKey: string; // The label to show (e.g. "Location")
    allLabelKey: string; // The label for the "All" option
    className?: string;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ 
    options, 
    selectedOption, 
    onOptionChange, 
    labelKey,
    allLabelKey,
    className = '' 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { t } = useLocalization();

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (value: string) => {
        onOptionChange(value);
        setIsOpen(false);
    };

    // Helper to clean up branch names for display (removes "Meama Collect - ")
    const getDisplayValue = (val: string) => {
        if (val === 'All') return t(allLabelKey as any);
        return val.replace(/^(meama collect\s*[-–—]\s*)/i, '').trim();
    };

    const displayLabel = selectedOption === 'All' 
        ? t(labelKey as any) 
        : getDisplayValue(selectedOption);

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-full flex items-center justify-between
                    bg-[#1a1a1a] border rounded-xl py-3 px-4 text-sm font-medium
                    transition-all duration-200 ease-out
                    ${isOpen 
                        ? 'border-brand-accent shadow-[0_0_0_2px_rgba(176,134,94,0.3)] bg-[#202020]' 
                        : 'border-brand-accent/30 hover:bg-[#202020] hover:border-brand-accent/50'
                    }
                    text-brand-text-primary focus:outline-none
                `}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className="truncate mr-2 font-montserrat flex-1 text-left">
                    <span className="text-brand-text-secondary mr-2">{t(labelKey as any)}:</span>
                    <span className="text-brand-accent font-semibold">
                        {selectedOption === 'All' ? t(allLabelKey as any) : getDisplayValue(selectedOption)}
                    </span>
                </span>
                <svg 
                    className={`w-4 h-4 text-brand-text-secondary transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'rotate-180 text-brand-accent' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>

            {/* Dropdown Menu */}
            <div 
                className={`
                    absolute z-50 mt-2 w-full min-w-[220px] right-0
                    bg-[#1a1a1a]/[1] backdrop-blur-sm border border-brand-accent/50 rounded-xl
                    shadow-[0_8px_24px_rgba(0,0,0,0.4)]
                    origin-top p-2
                    transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]
                    max-h-[300px] overflow-y-auto
                    ${isOpen 
                        ? 'opacity-100 scale-100 translate-y-0 visible pointer-events-auto' 
                        : 'opacity-0 scale-95 -translate-y-2 invisible pointer-events-none'
                    }
                `}
                role="listbox"
            >
                <div className="flex flex-col gap-1">
                    {/* All Option */}
                    <button
                        onClick={() => handleSelect('All')}
                        role="option"
                        aria-selected={selectedOption === 'All'}
                        className={`
                            w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-100
                            flex items-center justify-between group
                            ${selectedOption === 'All'
                                ? 'bg-brand-accent/10 text-brand-accent font-semibold'
                                : 'text-brand-text-primary hover:bg-[#242424] hover:text-[#b8935e]'
                            }
                        `}
                    >
                        <span className="font-montserrat">{t(allLabelKey as any)}</span>
                        {selectedOption === 'All' && (
                            <svg className="w-4 h-4 text-brand-accent fade-in-up" style={{ animationDuration: '0.2s' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        )}
                    </button>

                    {/* Branch Options */}
                    {options.map((opt) => (
                        <button
                            key={opt}
                            onClick={() => handleSelect(opt)}
                            role="option"
                            aria-selected={selectedOption === opt}
                            className={`
                                w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-100
                                flex items-center justify-between group
                                ${selectedOption === opt
                                    ? 'bg-brand-accent/10 text-brand-accent font-semibold'
                                    : 'text-brand-text-primary hover:bg-[#242424] hover:text-[#b8935e]'
                                }
                            `}
                        >
                            <span className="font-montserrat">{getDisplayValue(opt)}</span>
                            {selectedOption === opt && (
                                <svg className="w-4 h-4 text-brand-accent fade-in-up" style={{ animationDuration: '0.2s' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FilterDropdown;
