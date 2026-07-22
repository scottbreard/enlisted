export type MarketCode = 'CA' | 'AU' | 'UK' | 'US'

// Display names for exchange codes (codes stay stable in the DB;
// NEO rebranded as Cboe Canada in 2023)
export const EXCHANGE_LABELS: Record<string, string> = {
  TSX: 'TSX', TSXV: 'TSXV', CSE: 'CSE', NEO: 'Cboe Canada',
}
export const exchangeLabel = (code: string) => EXCHANGE_LABELS[code] ?? code

export interface MarketConfig {
  code: MarketCode
  name: string
  domain: string
  currency: string
  currencySymbol: string
  locale: string
  flag: string
  exchanges: string[]
  exchangeLabel: string
  comingSoon: string
  seo: {
    titleSuffix: string
    description: string
    ogDescription: string
    keywords: string[]
  }
  copy: {
    heroHeadlinePre: string   // "The marketplace for"
    heroHeadlineGold: string  // rendered in gold
    heroHeadlinePost: string  // "executives."
    heroSub: string
    executiveFreeNote: string
    providerCTA: string
    heroMockTicker: string
    heroMockExchange: string
  }
}

const MARKETS: Record<MarketCode, MarketConfig> = {
  CA: {
    code: 'CA',
    name: 'Canada',
    domain: 'enlisted.ca',
    currency: 'CAD',
    currencySymbol: '$',
    locale: 'en-CA',
    flag: '🇨🇦',
    exchanges: ['TSX', 'TSXV', 'CSE', 'Cboe'],
    exchangeLabel: 'TSX, TSXV, CSE & Cboe Canada',
    comingSoon: 'enlisted.au · enlisted.co.uk · enlisted.us',
    seo: {
      titleSuffix: 'Enlisted.ca',
      description: 'Find and compare IR firms, market makers, securities lawyers, auditors, and 90+ specialist service providers for TSX, TSXV, CSE, and Cboe Canada listed companies. Free for executives.',
      ogDescription: 'IR firms, market makers, securities lawyers, auditors & 90+ categories for TSX, TSXV, CSE & Cboe Canada. Free for executives.',
      keywords: [
        'investor relations Canada', 'TSX service providers', 'TSXV IR firms',
        'public company services Canada', 'Canadian public markets directory',
        'securities lawyers Canada', 'transfer agents Canada', 'market makers Canada',
        'CSE listed companies', 'Cboe Canada',
      ],
    },
    copy: {
      heroHeadlinePre: 'The marketplace for',
      heroHeadlineGold: 'Canadian public company',
      heroHeadlinePost: 'executives.',
      heroSub: 'Find and compare IR firms, market makers, legal counsel, auditors, and 90+ specialist categories — all in one place. Free for executives.',
      executiveFreeNote: 'Enlisted is free for every executive at a TSX, TSXV, CSE, or Cboe Canada company. Search, compare, and connect with vetted service providers — plus manage your contracts and track compliance deadlines.',
      providerCTA: "Get your firm in front of the CEOs, CFOs, and IR officers of Canada's public companies. Free to list — upgrade anytime.",
      heroMockTicker: 'TSX:NBMC',
      heroMockExchange: 'TSX',
    },
  },

  AU: {
    code: 'AU',
    name: 'Australia',
    domain: 'enlisted.au',
    currency: 'AUD',
    currencySymbol: 'A$',
    locale: 'en-AU',
    flag: '🇦🇺',
    exchanges: ['ASX', 'NSX'],
    exchangeLabel: 'ASX & NSX',
    comingSoon: 'enlisted.ca · enlisted.co.uk · enlisted.us',
    seo: {
      titleSuffix: 'Enlisted.au',
      description: 'Find and compare IR firms, market makers, securities lawyers, auditors, and 90+ specialist service providers for ASX and NSX listed companies. Free for executives.',
      ogDescription: 'IR firms, market makers, securities lawyers, auditors & 90+ categories for ASX & NSX listed companies. Free for executives.',
      keywords: [
        'investor relations Australia', 'ASX service providers', 'ASX IR firms',
        'public company services Australia', 'Australian public markets directory',
        'securities lawyers Australia', 'transfer agents Australia', 'market makers ASX',
        'NSX listed companies',
      ],
    },
    copy: {
      heroHeadlinePre: 'The marketplace for',
      heroHeadlineGold: 'Australian public company',
      heroHeadlinePost: 'executives.',
      heroSub: 'Find and compare IR firms, market makers, legal counsel, auditors, and 90+ specialist categories — all in one place. Free for executives.',
      executiveFreeNote: 'Enlisted is free for every executive at an ASX or NSX listed company. Search, compare, and connect with vetted service providers — plus manage your contracts and track compliance deadlines.',
      providerCTA: "Get your firm in front of the CEOs, CFOs, and IR officers of Australia's public companies. Free to list — upgrade anytime.",
      heroMockTicker: 'ASX:NBMC',
      heroMockExchange: 'ASX',
    },
  },

  UK: {
    code: 'UK',
    name: 'United Kingdom',
    domain: 'enlisted.co.uk',
    currency: 'GBP',
    currencySymbol: '£',
    locale: 'en-GB',
    flag: '🇬🇧',
    exchanges: ['LSE', 'AIM'],
    exchangeLabel: 'LSE Main Market & AIM',
    comingSoon: 'enlisted.ca · enlisted.au · enlisted.us',
    seo: {
      titleSuffix: 'Enlisted.co.uk',
      description: 'Find and compare IR firms, market makers, solicitors, auditors, and 90+ specialist service providers for LSE and AIM listed companies. Free for executives.',
      ogDescription: 'IR firms, market makers, solicitors, auditors & 90+ categories for LSE Main Market & AIM listed companies. Free for executives.',
      keywords: [
        'investor relations UK', 'LSE service providers', 'AIM IR firms',
        'public company services UK', 'UK public markets directory',
        'securities solicitors UK', 'registrars UK', 'market makers AIM',
        'LSE listed companies',
      ],
    },
    copy: {
      heroHeadlinePre: 'The marketplace for',
      heroHeadlineGold: 'UK public company',
      heroHeadlinePost: 'executives.',
      heroSub: 'Find and compare IR firms, market makers, solicitors, auditors, and 90+ specialist categories — all in one place. Free for executives.',
      executiveFreeNote: 'Enlisted is free for every executive at an LSE Main Market or AIM listed company. Search, compare, and connect with vetted service providers — plus manage your contracts and track compliance deadlines.',
      providerCTA: "Get your firm in front of the CEOs, CFOs, and IR officers of the UK's public companies. Free to list — upgrade anytime.",
      heroMockTicker: 'AIM:NBMC',
      heroMockExchange: 'AIM',
    },
  },

  US: {
    code: 'US',
    name: 'United States',
    domain: 'enlisted.us',
    currency: 'USD',
    currencySymbol: '$',
    locale: 'en-US',
    flag: '🇺🇸',
    exchanges: ['NYSE', 'Nasdaq', 'OTC'],
    exchangeLabel: 'NYSE, Nasdaq & OTC',
    comingSoon: 'enlisted.ca · enlisted.au · enlisted.co.uk',
    seo: {
      titleSuffix: 'Enlisted.us',
      description: 'Find and compare IR firms, market makers, securities lawyers, auditors, and 90+ specialist service providers for NYSE, Nasdaq, and OTC listed companies. Free for executives.',
      ogDescription: 'IR firms, market makers, securities lawyers, auditors & 90+ categories for NYSE, Nasdaq & OTC listed companies. Free for executives.',
      keywords: [
        'investor relations USA', 'NYSE service providers', 'Nasdaq IR firms',
        'public company services USA', 'US public markets directory',
        'securities lawyers USA', 'transfer agents USA', 'market makers NYSE',
        'OTC listed companies',
      ],
    },
    copy: {
      heroHeadlinePre: 'The marketplace for',
      heroHeadlineGold: 'US public company',
      heroHeadlinePost: 'executives.',
      heroSub: 'Find and compare IR firms, market makers, legal counsel, auditors, and 90+ specialist categories — all in one place. Free for executives.',
      executiveFreeNote: 'Enlisted is free for every executive at a NYSE, Nasdaq, or OTC listed company. Search, compare, and connect with vetted service providers — plus manage your contracts and track compliance deadlines.',
      providerCTA: "Get your firm in front of the CEOs, CFOs, and IR officers of America's public companies. Free to list — upgrade anytime.",
      heroMockTicker: 'NYSE:NBMC',
      heroMockExchange: 'NYSE',
    },
  },
}

export function getMarket(): MarketConfig {
  const code = (process.env.NEXT_PUBLIC_MARKET ?? 'CA') as MarketCode
  return MARKETS[code] ?? MARKETS.CA
}

export function getMarketCode(): MarketCode {
  return getMarket().code
}

export default MARKETS
