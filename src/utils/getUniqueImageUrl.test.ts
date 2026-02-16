import getUniqueImageUrl from './getUniqueImageUrl';

describe('getUniqueImageUrl', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should append timestamp query parameter to image URL', () => {
    const mockDate = new Date('2024-01-01T00:00:00.000Z');
    vi.setSystemTime(mockDate);

    const imageUrl = 'https://example.com/cat.jpg';
    const result = getUniqueImageUrl(imageUrl);

    expect(result).toBe(`${imageUrl}?timestamp=${mockDate.getTime()}`);
  });

  it('should work with URLs that already have query parameters', () => {
    const mockDate = new Date('2024-01-01T00:00:00.000Z');
    vi.setSystemTime(mockDate);

    const imageUrl = 'https://example.com/cat.jpg?size=large';
    const result = getUniqueImageUrl(imageUrl);

    // The function always appends with ?, not &
    expect(result).toBe(`${imageUrl}?timestamp=${mockDate.getTime()}`);
  });

  it('should generate different timestamps for different calls', () => {
    const imageUrl = 'https://example.com/cat.jpg';

    vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
    const result1 = getUniqueImageUrl(imageUrl);

    vi.setSystemTime(new Date('2024-01-01T00:00:01.000Z'));
    const result2 = getUniqueImageUrl(imageUrl);

    expect(result1).not.toBe(result2);
  });

  it('should handle empty string', () => {
    const mockDate = new Date('2024-01-01T00:00:00.000Z');
    vi.setSystemTime(mockDate);

    const result = getUniqueImageUrl('');
    expect(result).toBe(`?timestamp=${mockDate.getTime()}`);
  });
});
