import { Transaction, Income, Currency } from '@/types';
import { ParsedTransaction, ParsedIncome, RBCRow } from '@/types/import';
import { categorizeTransaction, categorizeIncome } from './categoryRules';
import { generateId } from './storage';

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

function parseRBCDate(dateStr: string): Date {
  // RBC format: MM/DD/YYYY or YYYY-MM-DD
  if (dateStr.includes('/')) {
    const [month, day, year] = dateStr.split('/');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }
  return new Date(dateStr);
}

function parseAmount(amountStr: string): number {
  // Remove currency symbols, commas, and whitespace
  const cleaned = amountStr.replace(/[$,\s]/g, '');
  return parseFloat(cleaned) || 0;
}

function cleanDescription(description: string): string {
  // Common RBC prefixes to remove
  const prefixPatterns = [
    /^CONTACTLESS INTERAC PURCHASE\s*-\s*\d+\s*/i,
    /^INTERAC PURCHASE\s*-\s*\d+\s*/i,
    /^INTERAC E-TRANSFER\s*-\s*\d+\s*/i,
    /^CONTACTLESS VISA DEBIT PUR\s*-\s*\d+\s*/i,
    /^VISA DEBIT PURCHASE\s*-?\s*\d*\s*/i,
    /^VISA DEBIT PUR\s*-\s*\d+\s*/i,
    /^POS PURCHASE\s*-\s*\d+\s*/i,
    /^PRE-AUTHORIZED DEBIT\s*-?\s*/i,
    /^PRE-AUTHORIZED PAYMENT\s*-?\s*/i,
    /^ELECTRONIC FUNDS TRANSFER\s*-?\s*/i,
    /^EFT\s*-?\s*/i,
    /^WWW TRANSFER\s*-?\s*/i,
    /^ONLINE BANKING PAYMENT\s*-?\s*/i,
    /^MISC PAYMENT\s*-?\s*/i,
  ];

  let cleaned = description;
  for (const pattern of prefixPatterns) {
    cleaned = cleaned.replace(pattern, '');
  }

  // Clean up any leading/trailing dashes or whitespace
  cleaned = cleaned.replace(/^[\s-]+|[\s-]+$/g, '').trim();

  return cleaned || description; // Return original if cleaning results in empty string
}

export function parseRBCCSV(csvContent: string): { transactions: ParsedTransaction[]; income: ParsedIncome[] } {
  const lines = csvContent.split(/\r?\n/).filter(line => line.trim());

  // Skip header row
  const dataLines = lines.slice(1);

  const transactions: ParsedTransaction[] = [];
  const income: ParsedIncome[] = [];

  for (const line of dataLines) {
    const fields = parseCSVLine(line);

    // RBC columns: Account Type, Account Number, Transaction Date, Cheque Number, Description 1, Description 2, CAD$, USD$
    if (fields.length < 7) continue;

    const row: RBCRow = {
      accountType: fields[0] || '',
      accountNumber: fields[1] || '',
      transactionDate: fields[2] || '',
      chequeNumber: fields[3] || '',
      description1: fields[4] || '',
      description2: fields[5] || '',
      cad: fields[6] || '',
      usd: fields[7] || '',
    };

    // Combine descriptions and clean up RBC prefixes
    const rawDescription = [row.description1, row.description2]
      .filter(Boolean)
      .join(' - ')
      .trim();

    if (!rawDescription || !row.transactionDate) continue;

    const description = cleanDescription(rawDescription);

    // Parse amounts - check CAD first, then USD
    const cadAmount = parseAmount(row.cad);
    const usdAmount = parseAmount(row.usd);

    // Determine currency and amount
    let amount: number;
    let currency: Currency;

    if (cadAmount !== 0) {
      amount = cadAmount;
      currency = 'CAD';
    } else if (usdAmount !== 0) {
      amount = usdAmount;
      currency = 'USD';
    } else {
      continue; // Skip rows with no amount
    }

    const date = parseRBCDate(row.transactionDate);
    const id = generateId();

    // Positive amounts = income, negative amounts = expenses
    if (amount > 0) {
      income.push({
        id,
        amount,
        source: description,
        category: categorizeIncome(description),
        date,
        currency,
        selected: true,
        isDuplicate: false,
      });
    } else {
      transactions.push({
        id,
        amount: Math.abs(amount),
        category: categorizeTransaction(description),
        description,
        date,
        currency,
        selected: true,
        isDuplicate: false,
      });
    }
  }

  return { transactions, income };
}

export function detectDuplicates(
  parsedTransactions: ParsedTransaction[],
  parsedIncome: ParsedIncome[],
  existingTransactions: Transaction[],
  existingIncome: Income[]
): { transactions: ParsedTransaction[]; income: ParsedIncome[] } {
  // Create lookup sets for existing data
  const existingTransactionKeys = new Set(
    existingTransactions.map(t => {
      const date = typeof t.date === 'string' ? new Date(t.date) : t.date;
      return `${date.toISOString().split('T')[0]}|${t.amount}|${t.description.toLowerCase()}`;
    })
  );

  const existingIncomeKeys = new Set(
    existingIncome.map(i => {
      const date = typeof i.date === 'string' ? new Date(i.date) : i.date;
      return `${date.toISOString().split('T')[0]}|${i.amount}|${i.source.toLowerCase()}`;
    })
  );

  // Mark duplicates
  const transactions = parsedTransactions.map(t => {
    const key = `${t.date.toISOString().split('T')[0]}|${t.amount}|${t.description.toLowerCase()}`;
    const isDuplicate = existingTransactionKeys.has(key);
    return {
      ...t,
      isDuplicate,
      selected: !isDuplicate, // Deselect duplicates
    };
  });

  const income = parsedIncome.map(i => {
    const key = `${i.date.toISOString().split('T')[0]}|${i.amount}|${i.source.toLowerCase()}`;
    const isDuplicate = existingIncomeKeys.has(key);
    return {
      ...i,
      isDuplicate,
      selected: !isDuplicate, // Deselect duplicates
    };
  });

  return { transactions, income };
}

export function convertToTransaction(parsed: ParsedTransaction): Transaction {
  return {
    id: parsed.id,
    amount: parsed.amount,
    category: parsed.category,
    description: parsed.description,
    date: parsed.date,
    currency: parsed.currency,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function convertToIncome(parsed: ParsedIncome): Income {
  return {
    id: parsed.id,
    amount: parsed.amount,
    source: parsed.source,
    category: parsed.category,
    date: parsed.date,
    currency: parsed.currency,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
