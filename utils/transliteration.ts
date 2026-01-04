
export const transliterate = (text: string): string => {
  if (!text) return '';

  const map: Record<string, string> = {
    'ა': 'a', 'ბ': 'b', 'გ': 'g', 'დ': 'd', 'ე': 'e', 'ვ': 'v',
    'ზ': 'z', 'თ': 't', 'ი': 'i', 'კ': 'k', 'ლ': 'l', 'მ': 'm',
    'ნ': 'n', 'ო': 'o', 'პ': 'p', 'ჟ': 'zh', 'რ': 'r', 'ს': 's',
    'ტ': 't', 'უ': 'u', 'ფ': 'p', 'ქ': 'k', 'ღ': 'gh', 'ყ': 'q',
    'შ': 'sh', 'ჩ': 'ch', 'ც': 'ts', 'ძ': 'dz', 'წ': 'ts', 'ჭ': 'tch',
    'ხ': 'kh', 'ჯ': 'j', 'ჰ': 'h'
  };

  // Function to capitalize the first letter of a string
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  // Split by space to handle First Name and Last Name separately
  return text.split(' ').map(word => {
    const transliteratedWord = word.split('').map(char => {
      // Check against map, fallback to original char if not found (e.g., punctuation)
      return map[char] || char;
    }).join('');
    
    return capitalize(transliteratedWord);
  }).join(' ');
};
