import { describe, it, expect } from 'vitest';
import getTokenHeaders from './getTokenHeaders';

describe('getTokenHeaders', () => {
  it('should return headers with authorization bearer token', () => {
    const accessToken = 'test-access-token';
    const refreshToken = 'test-refresh-token';

    const headers = getTokenHeaders(accessToken, refreshToken);

    expect(headers).toEqual({
      Authorization: `Bearer ${accessToken}`,
      'Refresh-Token': refreshToken
    });
  });

  it('should handle empty tokens', () => {
    const headers = getTokenHeaders('', '');

    expect(headers).toEqual({
      Authorization: 'Bearer ',
      'Refresh-Token': ''
    });
  });

  it('should handle special characters in tokens', () => {
    const accessToken = 'token.with.dots-and_underscores';
    const refreshToken = 'refresh!@#$%^&*()';

    const headers = getTokenHeaders(accessToken, refreshToken);

    expect(headers.Authorization).toBe(`Bearer ${accessToken}`);
    expect(headers['Refresh-Token']).toBe(refreshToken);
  });
});
