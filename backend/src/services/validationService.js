export function validateVPA(vpa) {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(vpa);
}

export function luhnCheck(num) {
  let sum = 0, alt = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let n = parseInt(num[i]);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

export function detectNetwork(num) {
  if (num.startsWith("4")) return "visa";
  if (/^5[1-5]/.test(num)) return "mastercard";
  if (/^3[47]/.test(num)) return "amex";
  if (/^(60|65|8[1-9])/.test(num)) return "rupay";
  return "unknown";
}

export function validateExpiry(mm, yy) {
  const month = parseInt(mm);
  let year = parseInt(yy);
  if (yy.length === 2) year += 2000;
  const now = new Date();
  const exp = new Date(year, month - 1);
  return exp >= new Date(now.getFullYear(), now.getMonth());
}
