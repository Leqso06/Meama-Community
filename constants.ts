
import { SortOption } from './types';

// Replace this ID with your actual Google Sheet ID
// The sheet must be "Published to the web" as CSV.
export const GOOGLE_SHEET_ID = '1Vuq9iMIAMnMAMPx44iB1kW-m5tmSjSxp'; 

// PASTE YOUR *NEW* GOOGLE APPS SCRIPT WEB APP URL HERE
// Instructions: 
// 1. In Apps Script, click Deploy -> New Deployment
// 2. Copy the Web app URL
// 3. Paste it below
export const GOOGLE_SCRIPT_API_URL = 'https://script.google.com/macros/s/AKfycbzvvbOM6E3GNhQxd71KTdlMFXN_g3YFNbvl6aVTcPNGLcItVXsQmcuo4NPqSB9yruEN/exec';

export const translations = {
    EN: {
        logo: "CommunityMeama.ge",
        meetOurBaristas: "Meet Our Baristas",
        searchByName: "Search by name...",
        sortBy: "Sort By:",
        filterByLocation: "Location",
        allLocations: "All Locations",
        bestAverageRating: "Best Rating",
        mostReviews: "Most Reviews",
        sortBranch: "Branch (A-Z)",
        nameAZ: "Name (A-Z)",
        nameZA: "Name (Z-A)",
        reviews: "Reviews",
        branch: "Branch",
        viewProfile: "View Profile",
        backToBaristas: "Back to Baristas",
        rateBarista: "Write a review",
        submitYourReview: "Submit Your Review",
        shareExperience: "Share your experience (optional)...",
        usernamePlaceholder: "Your Name",
        submitReview: "Submit Review",
        submitting: "Submitting...",
        customerReviews: "Customer Reviews",
        youHaveRated: "You have already rated this barista today.",
        thankYouForReview: "Thank you for your review!",
        ratingRequired: "Please select a star rating.",
        noReviewsYet: "No reviews yet. Be the first to share your experience!",
        loading: "Loading baristas...",
        fillAllFields: "Please fill in all fields.",
        editBarista: "Edit Barista",
        addBarista: "Add Barista",
        name: "Name",
        photoUrl: "Photo URL",
        certificationDate: "Certification Date",
        cancel: "Cancel",
        save: "Save",
        errorSubmitting: "Error submitting review. Please try again.",
        setupRequired: "Setup Required",
        setupMessage: "Please update constants.ts with your new Google Script Deployment URL.",
        usernameTaken: "This username is already taken. Please choose another one.",
        usernameTooShort: "Username must be at least 2 characters long.",
        usernameInvalidFormat: "Username can only contain letters, numbers, '_' and '.'",
    },
    GEO: {
        logo: "CommunityMeama.ge",
        meetOurBaristas: "გაიცანით ჩვენი ბარისტები",
        searchByName: "ძიება სახელით...",
        sortBy: "სორტირება:",
        filterByLocation: "ლოკაცია",
        allLocations: "ყველა ფილიალი",
        bestAverageRating: "საუკეთესო შეფასება",
        mostReviews: "ყველაზე მეტი შეფასება",
        sortBranch: "ფილიალი (ა-ჰ)",
        nameAZ: "სახელი (ა-ჰ)",
        nameZA: "სახელი (ჰ-ა)",
        reviews: "შეფასება",
        branch: "ფილიალი",
        viewProfile: "პროფილის ნახვა",
        backToBaristas: "უკან",
        rateBarista: "დაწერეთ შეფასება",
        submitYourReview: "დატოვეთ შეფასება",
        shareExperience: "გაგვიზიარეთ თქვენი გამოცდილება (სურვილისამებრ)...",
        usernamePlaceholder: "თქვენი სახელი",
        submitReview: "შეფასების გაგზავნა",
        submitting: "იგზავნება...",
        customerReviews: "მომხმარებლის შეფასებები",
        youHaveRated: "თქვენ დღეს უკვე შეაფასეთ ეს ბარისტა.",
        thankYouForReview: "გმადლობთ შეფასებისთვის!",
        ratingRequired: "გთხოვთ აირჩიოთ ვარსკვლავი.",
        noReviewsYet: "შეფასებები ჯერ არ არის. იყავი პირველი!",
        loading: "იტვირთება...",
        fillAllFields: "გთხოვთ შეავსოთ ყველა ველი.",
        editBarista: "ბარისტას რედაქტირება",
        addBarista: "ბარისტას დამატება",
        name: "სახელი",
        photoUrl: "ფოტოს URL",
        certificationDate: "სერტიფიცირების თარიღი",
        cancel: "გაუქმება",
        save: "შენახვა",
        errorSubmitting: "შეცდომა შეფასების გაგზავნისას. სცადეთ თავიდან.",
        setupRequired: "საჭიროა გამართვა",
        setupMessage: "გთხოვთ განაახლოთ constants.ts თქვენი Google Script-ის ახალი ბმულით.",
        usernameTaken: "ეს მომხმარებლის სახელი დაკავებულია. გთხოვთ აირჩიოთ სხვა.",
        usernameTooShort: "სახელი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს.",
        usernameInvalidFormat: "სახელი უნდა შეიცავდეს მხოლოდ ასოებს, ციფრებს, '_' და '.'-ს.",
    }
};

export const sortOptions: { value: SortOption, labelKey: keyof typeof translations.EN }[] = [
    { value: SortOption.BestAverageRating, labelKey: 'bestAverageRating' },
    { value: SortOption.MostReviews, labelKey: 'mostReviews' },
    { value: SortOption.NameAZ, labelKey: 'nameAZ' },
    { value: SortOption.BranchAZ, labelKey: 'sortBranch' },
];
