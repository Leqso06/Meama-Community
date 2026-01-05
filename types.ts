
export interface Review {
    id: string; // Changed to string for R0000001 format
    rating: number;
    text?: string;
    reviewer: string;
    date: string;
    customerId?: string; // Added field for tracking uniqueness
    imageUrl?: string; // URL from Sheet or Base64 from local upload
}

export interface Barista {
    id: string; // Supports B0000001 format
    name: string;
    photo: string;
    branch: string; // Replaces certificationDate
    reviews: Review[];
    averageRating: number;
}

export enum Language {
    EN = 'EN',
    GEO = 'GEO',
}

export enum SortOption {
    BestAverageRating = 'bestAverageRating',
    MostReviews = 'mostReviews',
    BranchAZ = 'branchAZ',
    NameAZ = 'nameAZ',
}
