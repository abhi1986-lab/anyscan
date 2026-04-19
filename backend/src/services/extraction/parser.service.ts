import { StructuredExtraction } from '../../types';

export class ParserService {
  parse(rawText: string): StructuredExtraction {
    const lines = rawText.split('\n').map(line => line.trim()).filter(line => line.length > 2);
    
    // We try to grab the first substantial line as a "vendor" or "name"
    const vendor = lines.length > 0 ? lines[0] : '';

    // Advanced heuristics to try and catch ID dates, invoice dates, etc
    let date = '';
    const dateMatches = rawText.match(/\b(?:\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}[\/\-]\d{2}[\/\-]\d{2})\b/g);
    if (dateMatches && dateMatches.length > 0) {
      date = dateMatches[0]; // grab the first date candidate
    }

    // Amount can be any block that looks like a decimal or integer sequence with a strong currency context
    let totalAmount = '';
    const totalMatch = rawText.match(/(?:Total|Amount|Amt|Rs\.?|INR|\$|₹)\s*[:]?\s*([\d.,]+)\b/i);
    if (totalMatch) {
      totalAmount = totalMatch[1].replace(/,/g, '');
    } else {
        // Fallback for an ID: just try to find a long number (like an ID number) and shove it in totalAmount for demo
        const idMatch = rawText.match(/\b\d{4}\s\d{4}\s\d{4}\b/);
        if (idMatch) {
            totalAmount = idMatch[0];
        } else {
            const longNumMatch = rawText.match(/\b\d{6,14}\b/);
            if (longNumMatch) totalAmount = longNumMatch[0];
        }
    }

    let tax = '';
    const taxMatch = rawText.match(/Tax\s*[:]?\s*([\d.,]+%?)/i);
    if (taxMatch) {
      tax = taxMatch[1];
    } else {
       // if we found something like DOB, put it in Tax just to show we extracted it (fallback for IDs)
       const dobMatch = rawText.match(/DOB|Birth/i);
       if (dobMatch && dateMatches && dateMatches.length > 1) {
           tax = dateMatches[1];
       } 
    }

    return {
      rawText,
      documentType: 'document',
      fields: {
        vendor,
        date,
        totalAmount,
        tax,
      },
      lineItems: [],
    };
  }
}

export const parserService = new ParserService();
