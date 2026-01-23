import {
  ExpenseCategory,
  IncomeCategory,
  expenseCategories,
  expenseCategoryLabels,
  incomeCategories,
  incomeCategoryLabels,
} from './categories';

// Re-export for backward compatibility
export {
  expenseCategories as allCategories,
  expenseCategoryLabels as categoryLabels,
  incomeCategories,
  incomeCategoryLabels,
};

interface ExpenseCategoryRule {
  category: ExpenseCategory;
  keywords: string[];
}

interface IncomeCategoryRule {
  category: IncomeCategory;
  keywords: string[];
}

// Expense categorization rules - ordered by specificity (more specific matches first)
const expenseCategoryRules: ExpenseCategoryRule[] = [
  {
    category: 'groceries',
    keywords: [
      'costco', 'walmart', 'loblaws', 'metro', 'sobeys', 'no frills',
      'real canadian superstore', 'superstore', 'food basics', 'freshco',
      'farm boy', 't&t', 'whole foods', 'safeway', 'save-on', 'independent',
      'grocery', 'groceries', 'longos', 'fortinos', 'zehrs'
    ],
  },
  {
    category: 'eating-out',
    keywords: [
      'uber eats', 'ubereats', 'doordash', 'skip the dishes', 'skipthedishes',
      'mcdonald', 'mcdonalds', 'tim hortons', 'tim horton', 'starbucks',
      'restaurant', 'cafe', 'coffee', 'pizza', 'burger', 'sushi', 'thai',
      'chinese food', 'indian food', 'subway', 'wendy', 'popeyes', 'kfc',
      'harvey', 'a&w', 'dairy queen', 'taco bell', 'chipotle', 'panera',
      'swiss chalet', 'boston pizza', 'east side mario', 'kelsey', 'montana',
      'the keg', 'milestones', 'jack astor', 'cactus club', 'earls',
      'joey', 'moxies', 'bier markt'
    ],
  },
  {
    category: 'transportation',
    keywords: [
      'shell', 'petro-canada', 'petro canada', 'petrocan', 'esso', 'gas',
      'pioneer', 'ultramar', 'mobil', 'husky', 'chevron', 'sunoco',
      'uber trip', 'lyft', 'presto', 'transit', 'ttc', 'go transit',
      'parking', 'impark', 'green p', 'car wash', 'autoroute', '407 etr',
      'canadian tire gas', 'costco gas'
    ],
  },
  {
    category: 'utilities',
    keywords: [
      'hydro', 'enbridge', 'toronto hydro', 'hydro one', 'electricity',
      'natural gas', 'water bill', 'internet', 'rogers', 'bell', 'telus',
      'fido', 'koodo', 'virgin mobile', 'freedom mobile', 'chatr'
    ],
  },
  {
    category: 'subscription',
    keywords: [
      'netflix', 'spotify', 'disney', 'disney+', 'amazon prime', 'apple tv',
      'crave', 'paramount', 'hbo', 'youtube premium', 'apple music',
      'subscription', 'membership', 'monthly fee'
    ],
  },
  {
    category: 'entertainment',
    keywords: [
      'cinema', 'cineplex', 'movie', 'theatre', 'theater', 'concert',
      'ticketmaster', 'stubhub', 'xbox', 'playstation', 'steam', 'nintendo',
      'gaming', 'twitch', 'arcade', 'bowling', 'golf', 'rec room'
    ],
  },
  {
    category: 'insurance',
    keywords: [
      'insurance', 'manulife', 'sun life', 'great west', 'canada life',
      'desjardins', 'intact', 'aviva', 'td insurance', 'rbc insurance',
      'belair', 'allstate', 'state farm'
    ],
  },
  {
    category: 'housing',
    keywords: [
      'rent', 'mortgage', 'property tax', 'condo fee', 'maintenance fee',
      'landlord', 'lease'
    ],
  },
  {
    category: 'healthcare',
    keywords: [
      'shoppers drug', 'shoppers drug mart', 'pharmacy', 'pharma', 'rexall',
      'medical', 'dental', 'doctor', 'clinic', 'hospital', 'dentist',
      'optometrist', 'vision', 'glasses', 'contacts', 'physiotherapy',
      'physio', 'chiro', 'massage therapy', 'prescription'
    ],
  },
  {
    category: 'personal-care',
    keywords: [
      'salon', 'haircut', 'barber', 'spa', 'nail', 'beauty', 'cosmetic',
      'sephora', 'bath & body', 'lush', 'the body shop'
    ],
  },
  {
    category: 'shopping',
    keywords: [
      'amazon', 'best buy', 'home depot', 'canadian tire', 'walmart.com',
      'ikea', 'the brick', 'leon', 'structube', 'wayfair', 'ebay',
      'staples', 'dollarama', 'winners', 'homesense', 'marshalls',
      'hudson bay', 'hbc', 'indigo', 'chapters', 'apple store', 'apple.com'
    ],
  },
  {
    category: 'clothing',
    keywords: [
      'h&m', 'zara', 'gap', 'old navy', 'uniqlo', 'nordstrom', 'aritzia',
      'lululemon', 'nike', 'adidas', 'foot locker', 'sportchek', 'sport chek',
      'marks work', 'marks ', 'simons', 'holt renfrew', 'banana republic',
      'j.crew', 'club monaco', 'roots'
    ],
  },
  {
    category: 'education',
    keywords: [
      'tuition', 'university', 'college', 'school', 'course', 'udemy',
      'coursera', 'skillshare', 'masterclass', 'linkedin learning',
      'textbook', 'education'
    ],
  },
  {
    category: 'travel',
    keywords: [
      'airline', 'air canada', 'westjet', 'porter', 'united', 'delta',
      'american airlines', 'hotel', 'marriott', 'hilton', 'airbnb',
      'booking.com', 'expedia', 'trivago', 'hostel', 'resort', 'flight',
      'vacation', 'travel'
    ],
  },
  {
    category: 'gifts',
    keywords: [
      'gift', 'present', 'flowers', 'hallmark', 'card shop', 'charity',
      'donation', 'gofundme'
    ],
  },
  {
    category: 'debt',
    keywords: [
      'credit card payment', 'loan payment', 'line of credit', 'loc payment'
    ],
  },
  {
    category: 'harrison',
    keywords: [
      'harrison', 'daycare', 'childcare', 'baby', 'diaper', 'formula',
      'toys r us', 'buy buy baby'
    ],
  },
];

// Income categorization rules
const incomeCategoryRules: IncomeCategoryRule[] = [
  {
    category: 'salary',
    keywords: [
      'payroll', 'salary', 'wage', 'direct deposit', 'employer',
      'paycheque', 'paycheck', 'bi-weekly pay', 'monthly pay'
    ],
  },
  {
    category: 'freelance',
    keywords: [
      'freelance', 'contract', 'consulting', 'invoice', 'client payment',
      'side gig', 'self-employed'
    ],
  },
  {
    category: 'investment',
    keywords: [
      'dividend', 'interest', 'capital gain', 'investment', 'stock',
      'etf', 'mutual fund', 'reit', 'tfsa', 'rrsp', 'fhsa'
    ],
  },
  {
    category: 'refund',
    keywords: [
      'refund', 'return', 'rebate', 'cashback', 'reimbursement',
      'credit', 'adjustment'
    ],
  },
  {
    category: 'gift',
    keywords: [
      'gift', 'present', 'birthday', 'christmas', 'holiday'
    ],
  },
  {
    category: 'transfer',
    keywords: [
      'transfer', 'e-transfer', 'etransfer', 'interac', 'sent money'
    ],
  },
];

export function categorizeTransaction(description: string): ExpenseCategory {
  const lowerDesc = description.toLowerCase();

  for (const rule of expenseCategoryRules) {
    for (const keyword of rule.keywords) {
      if (lowerDesc.includes(keyword.toLowerCase())) {
        return rule.category;
      }
    }
  }

  return 'other';
}

export function categorizeIncome(description: string): IncomeCategory {
  const lowerDesc = description.toLowerCase();

  for (const rule of incomeCategoryRules) {
    for (const keyword of rule.keywords) {
      if (lowerDesc.includes(keyword.toLowerCase())) {
        return rule.category;
      }
    }
  }

  return 'other';
}
