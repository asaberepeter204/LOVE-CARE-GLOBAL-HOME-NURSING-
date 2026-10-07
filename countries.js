// countries.js - LOVE CARE GLOBAL - 8 Countries + Other
export const COUNTRIES = [
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', momo: true, currency: 'GHS' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', momo: false, currency: 'NGN' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', momo: false, currency: 'ZAR' },
  { code: 'GB', name: 'United Kingdom (UK)', flag: '🇬🇧', momo: false, currency: 'GBP' },
  { code: 'US', name: 'United States (USA)', flag: '🇺🇸', momo: false, currency: 'USD' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', momo: false, currency: 'AUD' },
  { code: 'AE', name: 'UAE - Dubai', flag: '🇦🇪', momo: false, currency: 'AED' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', momo: false, currency: 'CAD' },
  { code: 'OTHER', name: 'Other Country', flag: '🌍', momo: false, currency: 'USD' },
];

export function getCountryOptions(selectedCode='') {
  return COUNTRIES.map(c => `<option value="${c.code}" ${c.code===selectedCode?'selected':''}>${c.flag} ${c.name} - ${c.currency}</option>`).join('');
}
export function isGhana(code){ return code==='GH'; }
