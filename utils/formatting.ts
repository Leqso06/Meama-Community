
// Centralized formatting and sanitization utilities

// Prevent CSV Injection in Google Sheets
export const sanitizeForSheets = (str: string): string => {
    if (typeof str !== 'string') return str;
    const trimmed = str.trim();
    // If string starts with =, +, -, or @, prepend ' to treat as text
    if (/^[\=\+\-\@]/.test(trimmed)) {
        return "'" + trimmed;
    }
    return str;
};

// Pad IDs (e.g. 1 -> 0000001)
export const padId = (input: number | string): string => {
    const s = input.toString().trim();
    if (s.length >= 7) return s;
    return s.padStart(7, '0');
};

// Standardize ID format (e.g. "4" -> "R0000004")
export const formatId = (prefix: string, rawId?: string | number): string => {
    if (!rawId) return `${prefix}${Math.floor(Math.random() * 1000000)}`; // Fallback if missing
    const numbersOnly = rawId.toString().replace(/\D/g, '');
    if (!numbersOnly) return `${prefix}${Math.floor(Math.random() * 1000000)}`;
    return `${prefix}${padId(numbersOnly)}`;
};

// Remove "Meama Collect -" prefix
export const formatBranchName = (branch: string): string => {
    if (!branch) return '';
    return branch.replace(/^(meama collect\s*[-–—]\s*)/i, '').trim();
};

// Google Drive Link Processor
export const processDriveLink = (link: string): string => {
    if (!link) return 'https://via.placeholder.com/150?text=No+Image';
    if (link.includes('drive.google.com/thumbnail') || link.includes('googleusercontent')) return link;
    const idMatch = link.match(/[-\w]{25,}/);
    if (!idMatch) return link;
    return `https://drive.google.com/thumbnail?id=${idMatch[0]}&sz=w800`;
};
