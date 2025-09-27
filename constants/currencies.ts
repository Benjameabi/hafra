export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Conversion rate from USD base
}

export const currencies: { [key: string]: Currency } = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    rate: 1, // Base currency
  },
  SEK: {
    code: 'SEK',
    symbol: 'kr',
    name: 'Swedish Krona',
    rate: 10.5, // Approximate rate: 1 USD = 10.5 SEK
  }
};

// Get currency based on language code
export const getCurrencyByLanguage = (languageCode: string): Currency => {
  switch (languageCode) {
    case 'sv': // Swedish
      return currencies.SEK;
    case 'en': // English
    case 'es': // Spanish
    default:
      return currencies.USD;
  }
};

// Format price with proper currency symbol and placement
export const formatPrice = (price: number, languageCode: string): string => {
  const currency = getCurrencyByLanguage(languageCode);
  const convertedPrice = Math.round(price * currency.rate);
  
  // Swedish Krona typically goes after the number
  if (currency.code === 'SEK') {
    return `${convertedPrice} ${currency.symbol}`;
  }
  
  // USD format: $100
  return `${currency.symbol}${convertedPrice}`;
}; 