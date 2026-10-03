import { describe, expect, it } from 'vitest';
import { normalizeIndianMobile, phoneDigits, whatsappLink } from './phone';

describe('phone', () => {
  it('accepts the usual ways of typing an Indian mobile', () => {
    for (const input of ['9876543210', '+91 98765 43210', '91-9876543210', '098765 43210', ' 98765-43210 ']) {
      expect(normalizeIndianMobile(input)).toBe('9876543210');
    }
  });

  it('rejects numbers that are not Indian mobiles', () => {
    for (const input of ['12345', '5876543210', '98765432101', 'abc', '']) {
      expect(normalizeIndianMobile(input)).toBeNull();
    }
  });

  it('builds WhatsApp links without doubling the country code', () => {
    expect(whatsappLink('+91 98765 43210', 'hi')).toBe('https://wa.me/919876543210?text=hi');
    expect(phoneDigits('03732-123456')).toBe('03732123456');
  });
});
