const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function convertGroup(n: number): string {
  let output = '';
  if (n >= 100) {
    output += `${units[Math.floor(n / 100)]} Hundred `;
    n %= 100;
  }
  if (n >= 20) {
    output += `${tens[Math.floor(n / 10)]} `;
    n %= 10;
  } else if (n >= 10) {
    output += `${teens[n - 10]} `;
    return output;
  }
  if (n > 0) {
    output += `${units[n]} `;
  }
  return output;
}

export function convertToIndianCurrencyWords(amount: number): string {
  if (isNaN(amount) || amount === 0) return 'Rupees Zero only';

  const absolute = Math.floor(Math.abs(amount));
  const crore = Math.floor(absolute / 10000000);
  const lakh = Math.floor((absolute % 10000000) / 100000);
  const thousand = Math.floor((absolute % 100000) / 1000);
  const hundred = absolute % 1000;

  let str = 'Rupees ';
  if (crore > 0) str += `${convertGroup(crore)}Crore `;
  if (lakh > 0) str += `${convertGroup(lakh)}Lakh `;
  if (thousand > 0) str += `${convertGroup(thousand)}Thousand `;
  if (hundred > 0) str += `${convertGroup(hundred)}`;

  return `${str.trim()} only`;
}