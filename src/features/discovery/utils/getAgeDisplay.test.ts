import getAgeDisplay from './getAgeDisplay';
import type { TFunction } from 'i18next';

describe('getAgeDisplay', () => {
  const mockT = ((key: string) => {
    const translations: Record<string, string> = {
      week: 'week',
      weeks_plural_suffix: 's',
      month: 'month',
      months_plural_suffix: 's',
      year: 'year',
      years_plural_suffix: 's'
    };
    return translations[key] || key;
  }) as unknown as TFunction;

  describe('weeks display', () => {
    it('should display 1 week for 1 week old', () => {
      const result = getAgeDisplay(1, mockT);
      expect(result).toBe('1 week');
    });

    it('should display weeks with plural suffix for 2 weeks', () => {
      const result = getAgeDisplay(2, mockT);
      expect(result).toBe('2 weeks');
    });

    it('should display weeks with plural suffix for 3 weeks', () => {
      const result = getAgeDisplay(3, mockT);
      expect(result).toBe('3 weeks');
    });
  });

  describe('months display', () => {
    it('should display 1 month for 4 weeks old', () => {
      const result = getAgeDisplay(4, mockT);
      expect(result).toBe('1 month');
    });

    it('should display months with plural suffix for 8 weeks (2 months)', () => {
      const result = getAgeDisplay(8, mockT);
      expect(result).toBe('2 months');
    });

    it('should display 6 months for 24 weeks', () => {
      const result = getAgeDisplay(24, mockT);
      expect(result).toBe('6 months');
    });

    it('should display 11 months for 44 weeks', () => {
      const result = getAgeDisplay(44, mockT);
      expect(result).toBe('11 months');
    });
  });

  describe('years display', () => {
    it('should display 1 year for 52 weeks', () => {
      const result = getAgeDisplay(52, mockT);
      // 52 weeks / 4 = 13 months, 13 / 12 = 1 year with 1 month remaining
      expect(result).toBe('1 year 1 month');
    });

    it('should display years with plural suffix for 104 weeks (2 years)', () => {
      const result = getAgeDisplay(104, mockT);
      // 104 weeks / 4 = 26 months, 26 / 12 = 2 years with 2 months remaining
      expect(result).toBe('2 years 2 months');
    });

    it('should display 5 years for 260 weeks', () => {
      const result = getAgeDisplay(260, mockT);
      // 260 weeks / 4 = 65 months, 65 / 12 = 5 years with 5 months remaining
      expect(result).toBe('5 years 5 months');
    });
  });

  describe('years and months display', () => {
    it('should display 1 year 2 months for 56 weeks', () => {
      const result = getAgeDisplay(56, mockT);
      // 56 weeks / 4 = 14 months, 14 / 12 = 1 year with 2 months remaining
      expect(result).toBe('1 year 2 months');
    });

    it('should display 1 year 3 months for 60 weeks', () => {
      const result = getAgeDisplay(60, mockT);
      // 60 weeks / 4 = 15 months, 15 / 12 = 1 year with 3 months remaining
      expect(result).toBe('1 year 3 months');
    });

    it('should display 2 years 5 months for 116 weeks', () => {
      const result = getAgeDisplay(116, mockT);
      // 116 weeks / 4 = 29 months, 29 / 12 = 2 years with 5 months remaining
      expect(result).toBe('2 years 5 months');
    });

    it('should display 3 years 10 months for 182 weeks', () => {
      const result = getAgeDisplay(182, mockT);
      // 182 weeks / 4 = 45.5 ~46 months, 46 / 12 = 3 years with 10 months remaining
      expect(result).toBe('3 years 10 months');
    });
  });

  describe('edge cases', () => {
    it('should handle 0 weeks', () => {
      const result = getAgeDisplay(0, mockT);
      expect(result).toBe('0 weeks');
    });

    it('should round weeks to months correctly', () => {
      // 5 weeks should round to 1 month (5/4 = 1.25 rounds to 1)
      const result = getAgeDisplay(5, mockT);
      expect(result).toBe('1 month');
    });

    it('should handle very old cats (10 years)', () => {
      const result = getAgeDisplay(520, mockT);
      // 520 weeks / 4 = 130 months, 130 / 12 = 10 years with 10 months remaining
      expect(result).toBe('10 years 10 months');
    });
  });
});
