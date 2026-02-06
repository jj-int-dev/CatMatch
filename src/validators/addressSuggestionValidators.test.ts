import { describe, it, expect } from 'vitest';
import {
  addressSuggestionValidator,
  getAddressSuggestionsResponseValidator
} from './addressSuggestionValidators';

describe('addressSuggestionValidator', () => {
  it('should validate a correct address suggestion', () => {
    const validData = {
      formatted: '123 Main St, City, State',
      city: 'City',
      lat: 40.7128,
      lon: -74.006
    };

    const result = addressSuggestionValidator.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject address with missing formatted field', () => {
    const invalidData = {
      city: 'City',
      lat: 40.7128,
      lon: -74.006
    };

    const result = addressSuggestionValidator.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject address with missing city field', () => {
    const invalidData = {
      formatted: '123 Main St',
      lat: 40.7128,
      lon: -74.006
    };

    const result = addressSuggestionValidator.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject latitude below -90', () => {
    const invalidData = {
      formatted: '123 Main St',
      city: 'City',
      lat: -91,
      lon: 0
    };

    const result = addressSuggestionValidator.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject latitude above 90', () => {
    const invalidData = {
      formatted: '123 Main St',
      city: 'City',
      lat: 91,
      lon: 0
    };

    const result = addressSuggestionValidator.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject longitude below -180', () => {
    const invalidData = {
      formatted: '123 Main St',
      city: 'City',
      lat: 0,
      lon: -181
    };

    const result = addressSuggestionValidator.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject longitude above 180', () => {
    const invalidData = {
      formatted: '123 Main St',
      city: 'City',
      lat: 0,
      lon: 181
    };

    const result = addressSuggestionValidator.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should accept boundary values for latitude', () => {
    const validData1 = {
      formatted: '123 Main St',
      city: 'City',
      lat: -90,
      lon: 0
    };
    const validData2 = {
      formatted: '123 Main St',
      city: 'City',
      lat: 90,
      lon: 0
    };

    expect(addressSuggestionValidator.safeParse(validData1).success).toBe(true);
    expect(addressSuggestionValidator.safeParse(validData2).success).toBe(true);
  });

  it('should accept boundary values for longitude', () => {
    const validData1 = {
      formatted: '123 Main St',
      city: 'City',
      lat: 0,
      lon: -180
    };
    const validData2 = {
      formatted: '123 Main St',
      city: 'City',
      lat: 0,
      lon: 180
    };

    expect(addressSuggestionValidator.safeParse(validData1).success).toBe(true);
    expect(addressSuggestionValidator.safeParse(validData2).success).toBe(true);
  });
});

describe('getAddressSuggestionsResponseValidator', () => {
  it('should validate response with multiple results', () => {
    const validData = {
      results: [
        {
          formatted: '123 Main St',
          city: 'City1',
          lat: 40.7128,
          lon: -74.006
        },
        {
          formatted: '456 Oak Ave',
          city: 'City2',
          lat: 34.0522,
          lon: -118.2437
        }
      ]
    };

    const result = getAddressSuggestionsResponseValidator.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should validate response with empty results array', () => {
    const validData = {
      results: []
    };

    const result = getAddressSuggestionsResponseValidator.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject response without results field', () => {
    const invalidData = {};

    const result =
      getAddressSuggestionsResponseValidator.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject response with invalid result in array', () => {
    const invalidData = {
      results: [
        {
          formatted: '123 Main St',
          city: 'City1',
          lat: 40.7128,
          lon: -74.006
        },
        {
          formatted: '456 Oak Ave',
          // missing city
          lat: 34.0522,
          lon: -118.2437
        }
      ]
    };

    const result =
      getAddressSuggestionsResponseValidator.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
