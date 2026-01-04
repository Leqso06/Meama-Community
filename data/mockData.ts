
import { Barista, Review } from '../types';

const padId = (num: number): string => num.toString().padStart(7, '0');

// Global counters to prevent duplicates even in mock data
let reviewCounter = 1000;
let customerCounter = 1000;

export const generateReviews = (count: number, baseRating: number): Review[] => {
    const reviews: Review[] = [];
    for (let i = 1; i <= count; i++) {
        reviewCounter++;
        customerCounter++;
        const rating = Math.max(1, Math.min(5, Math.round(baseRating + (Math.random() - 0.5) * 2)));
        reviews.push({
            id: `R${padId(reviewCounter)}`,
            rating,
            text: Math.random() > 0.3 ? `Exceptional service and the coffee was perfect. A true professional!` : undefined,
            reviewer: 'Anonymous User',
            date: `2024-${String(Math.floor(Math.random() * 5) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
            customerId: `C${padId(customerCounter)}`
        });
    }
    return reviews;
};

export const calculateAverageRating = (reviews: Review[]): number => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return total / reviews.length;
};

const baristasData: Omit<Barista, 'averageRating'>[] = [
    {
        id: 'B0000001',
        name: 'Giorgi Beridze',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
        branch: 'Vake Branch',
        reviews: generateReviews(124, 4.8),
    },
    {
        id: 'B0000002',
        name: 'Nino Kapanadze',
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop',
        branch: 'Saburtalo Branch',
        reviews: generateReviews(98, 4.9),
    },
    {
        id: 'B0000003',
        name: 'Davit Gelashvili',
        photo: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=800&auto=format&fit=crop',
        branch: 'Batumi Plaza',
        reviews: generateReviews(75, 4.6),
    },
    {
        id: 'B0000004',
        name: 'Mariam Tsiklauri',
        photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop',
        branch: 'Tbilisi Mall',
        reviews: generateReviews(52, 4.7),
    },
    {
        id: 'B0000005',
        name: 'Luka Maisuradze',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
        branch: 'East Point',
        reviews: generateReviews(150, 4.5),
    },
    {
        id: 'B0000006',
        name: 'Ana Abashidze',
        photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
        branch: 'Kutaisi Center',
        reviews: generateReviews(88, 4.9),
    },
     {
        id: 'B0000007',
        name: 'Sandro Jorjoliani',
        photo: 'https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=800&auto=format&fit=crop',
        branch: 'Rustaveli Ave',
        reviews: generateReviews(34, 4.3),
    },
    {
        id: 'B0000008',
        name: 'Elene Lomidze',
        photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800&auto=format&fit=crop',
        branch: 'Gldani Mall',
        reviews: generateReviews(110, 4.8),
    },
];


export const initialBaristas: Barista[] = baristasData.map(barista => ({
    ...barista,
    averageRating: calculateAverageRating(barista.reviews),
}));
