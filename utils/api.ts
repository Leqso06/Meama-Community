
import { GOOGLE_SCRIPT_API_URL } from '../constants';
import { Review } from '../types';
import { sanitizeForSheets, padId } from './formatting';

export interface ReviewPayload {
    baristaId: string;
    rating: number;
    review: string;
    customerId: string;
    username: string;
    branch: string;
    image?: string;
}

export const getOrCreateCustomerId = (): string => {
    const STORAGE_KEY = 'meama_customer_id';
    let customerId = localStorage.getItem(STORAGE_KEY);
    
    if (!customerId) {
        const randomId = Math.floor(Math.random() * 9999999) + 1;
        customerId = `C${padId(randomId)}`;
        localStorage.setItem(STORAGE_KEY, customerId);
    }
    return customerId;
};

export const submitReviewToSheet = async (
    baristaId: string, 
    rating: number, 
    reviewText: string, 
    username: string, 
    branch: string, 
    imageBase64?: string
): Promise<Review> => {
    const tempId = `R${9000000 + Math.floor(Math.random() * 999999)}`;

    if (GOOGLE_SCRIPT_API_URL.includes('REPLACE_WITH')) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
            id: tempId,
            rating,
            text: reviewText,
            reviewer: username || `Meama Customer`,
            date: new Date().toISOString().split('T')[0],
            imageUrl: imageBase64 
        };
    }

    const customerId = getOrCreateCustomerId();
    
    // Username Logic
    let finalUsername = username.trim();
    const USERNAME_KEY = 'meama_username';

    if (!finalUsername) {
        const storedUsername = localStorage.getItem(USERNAME_KEY);
        if (storedUsername) {
            finalUsername = storedUsername;
        } else {
            // Anonymous fallback: "Meama Customer 123"
            const idDigits = parseInt(customerId.replace(/\D/g, ''), 10);
            finalUsername = `Meama Customer ${idDigits}`;
        }
    } else {
        localStorage.setItem(USERNAME_KEY, finalUsername);
    }

    const payload: ReviewPayload = {
        baristaId,
        rating,
        review: sanitizeForSheets(reviewText),
        customerId,
        username: sanitizeForSheets(finalUsername),
        branch: sanitizeForSheets(branch),
        image: imageBase64 
    };

    try {
        const response = await fetch(GOOGLE_SCRIPT_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' }, // Avoids CORS preflight issues
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Server Error: ${response.status}`);
        }
        
        const responseData = await response.json();
        if (responseData.status === 'error') {
            throw new Error(responseData.error);
        }

    } catch (error) {
        console.error("API Submission Error:", error);
        throw error;
    }

    return {
        id: tempId, 
        rating,
        text: reviewText,
        reviewer: finalUsername,
        date: new Date().toISOString().split('T')[0],
        imageUrl: imageBase64 
    };
};
