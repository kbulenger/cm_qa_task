export class StringUtils {
  static parseCurrency(text: string): number {
    if (!text) return 0;
    const cleanText = text.replace(/[^0-9.,-]/g, '');
    const normalized = cleanText.replace(/,/g, '.');
    const value = parseFloat(normalized);
    return Number.isNaN(value) ? 0 : value;
  }
}