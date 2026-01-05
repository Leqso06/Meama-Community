
// Image processing and security sanitization

export const compressAndSanitizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        // 1. Client-Side Size Check (Limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
            reject(new Error("File too large. Maximum size is 5MB."));
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                // Security: Resize to max 1024px to prevent memory exhaustion
                const MAX_DIMENSION = 1024; 
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_DIMENSION) {
                        height *= MAX_DIMENSION / width;
                        width = MAX_DIMENSION;
                    }
                } else {
                    if (height > MAX_DIMENSION) {
                        width *= MAX_DIMENSION / height;
                        height = MAX_DIMENSION;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                
                if (ctx) {
                    // Draw strips metadata (EXIF, etc)
                    ctx.drawImage(img, 0, 0, width, height);
                    // Force convert to JPEG (0.7 quality)
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    resolve(dataUrl);
                } else {
                    reject(new Error("Browser does not support image processing."));
                }
            };
            
            img.onerror = () => reject(new Error("Invalid image data."));
        };
        
        reader.onerror = () => reject(new Error("Failed to read file."));
    });
};
