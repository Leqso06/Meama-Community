
import React, { useState, useEffect } from 'react';
import { Barista, Review } from '../types';
import { initialBaristas, calculateAverageRating } from '../data/mockData';
import { GOOGLE_SCRIPT_API_URL } from '../constants';
import { formatId, processDriveLink } from '../utils/formatting';

interface UseBaristaDataResult {
    baristas: Barista[];
    isLoading: boolean;
    error: string;
    isUsingMockData: boolean;
    debugInfo: string;
    setBaristas: React.Dispatch<React.SetStateAction<Barista[]>>;
}

export const useBaristaData = (t: any): UseBaristaDataResult => {
    const [baristas, setBaristas] = useState<Barista[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isUsingMockData, setIsUsingMockData] = useState(false);
    const [debugInfo, setDebugInfo] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setDebugInfo('');
            setError('');

            // Configuration Checks
            if (GOOGLE_SCRIPT_API_URL.includes('INSERT_NEW_DEPLOYMENT_URL_HERE')) {
                setDebugInfo(t('setupMessage'));
                setIsLoading(false);
                return;
            }

            if (GOOGLE_SCRIPT_API_URL.includes('REPLACE_WITH')) {
                setBaristas(initialBaristas);
                setIsUsingMockData(true);
                setIsLoading(false);
                return;
            }

            try {
                const noCacheUrl = `${GOOGLE_SCRIPT_API_URL}?t=${Date.now()}`;
                const response = await fetch(noCacheUrl);
                
                const contentType = response.headers.get("content-type");
                if (contentType && !contentType.includes("application/json")) {
                     throw new Error("API returned HTML. Check Script Deployment settings.");
                }
                
                if (!response.ok) throw new Error('Failed to fetch data');
                
                const data = await response.json();
                if (data.error) throw new Error(`Script Error: ${data.error}`);
                
                const baristasRows = (data.baristas || []).slice(1);
                const reviewsRows = (data.reviews || []).slice(1);

                // --- Parse Reviews ---
                const reviewsData = reviewsRows
                    .map((cols: string[]) => {
                        if (!cols || cols.length < 5) return null;
                        
                        // Status check (Col 9)
                        if (cols[9]?.toString().toLowerCase() === 'inactive') return null;

                        const rating = parseFloat(cols[6]) || 5;
                        let dateStr = cols[1]?.toString().split('T')[0] || new Date().toISOString().split('T')[0];

                        // Foreign Keys Normalization
                        const uniqueReviewId = formatId('R', cols[0]);
                        const baristaId = formatId('B', cols[4]);
                        const customerId = formatId('C', cols[2]);

                        return {
                            id: uniqueReviewId,
                            rating,
                            text: cols[7] || '',
                            reviewer: cols[3] || 'Anonymous',
                            date: dateStr,
                            imageUrl: cols[8] ? processDriveLink(cols[8]) : undefined,
                            baristaId,
                            customerId
                        };
                    })
                    .filter((r: any) => r !== null);

                // --- Parse Baristas ---
                const parsedBaristas = baristasRows
                    .map((cols: string[]) => {
                        if (!cols || cols.length < 2 || !cols[1]) return null;
                        
                        // Status check (Col 5)
                        if (cols[5]?.toString().toLowerCase() === 'inactive') return null;

                        const uniqueBaristaId = formatId('B', cols[0]);
                        const baristaReviews = reviewsData.filter((r: any) => r.baristaId === uniqueBaristaId);

                        return {
                            id: uniqueBaristaId,
                            name: cols[1],
                            branch: cols[2] || 'Main Branch',
                            photo: processDriveLink(cols[3] || ''),
                            reviews: baristaReviews,
                            averageRating: calculateAverageRating(baristaReviews)
                        };
                    })
                    .filter((b: Barista | null) => b !== null);

                if (parsedBaristas.length > 0) {
                    setBaristas(parsedBaristas);
                    setIsUsingMockData(false);
                } else {
                    const msg = `Connected to Sheet, but found 0 valid baristas. Rows: ${baristasRows.length}`;
                    console.warn(msg);
                    setDebugInfo(msg);
                }

            } catch (err: any) {
                console.error("Data Load Error:", err);
                setError(err.message);
                setDebugInfo(`Error loading data: ${err.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [t]);

    return { baristas, isLoading, error, isUsingMockData, debugInfo, setBaristas };
};
