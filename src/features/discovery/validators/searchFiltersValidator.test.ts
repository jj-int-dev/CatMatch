import { searchFiltersValidator } from './searchFiltersValidator';
import type { TFunction } from 'i18next';
import type { SearchFilters } from '../types/SearchFilters';

describe('searchFiltersValidator', () => {
  const mockT = ((key: string) => key) as unknown as TFunction;

  describe('client-current-location validation', () => {
    it('should validate when latitude and longitude are provided', () => {
      const filters: SearchFilters = {
        locationSource: 'client-current-location',
        location: {
          formatted: '',
          city: '',
          latitude: 40.7128,
          longitude: -74.006
        },
        neutered: 'All',
        maxDistanceMeters: 50,
        gender: 'Male',
        minAgeWeeks: 0,
        maxAgeWeeks: 120
      };

      const result = searchFiltersValidator(filters, mockT);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should fail when latitude is missing', () => {
      const filters: SearchFilters = {
        locationSource: 'client-current-location',
        location: {
          formatted: '',
          city: '',
          latitude: null,
          longitude: -74.006
        },
        neutered: 'All',
        maxDistanceMeters: 100,
        gender: 'Male',
        minAgeWeeks: 5,
        maxAgeWeeks: 120
      };

      const result = searchFiltersValidator(filters, mockT);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('current_location_error');
    });

    it('should fail when longitude is missing', () => {
      const filters: SearchFilters = {
        locationSource: 'client-current-location',
        location: {
          formatted: '',
          city: '',
          latitude: 40.7128,
          longitude: null
        },
        neutered: 'Neutered Only',
        maxDistanceMeters: 50,
        gender: 'Male',
        minAgeWeeks: 0,
        maxAgeWeeks: 20
      };

      const result = searchFiltersValidator(filters, mockT);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('current_location_error');
    });

    it('should fail when both coordinates are missing', () => {
      const filters: SearchFilters = {
        locationSource: 'client-current-location',
        location: {
          formatted: '',
          city: '',
          latitude: null,
          longitude: null
        },
        neutered: 'All',
        maxDistanceMeters: 80,
        gender: 'All',
        minAgeWeeks: 25,
        maxAgeWeeks: 170
      };

      const result = searchFiltersValidator(filters, mockT);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('current_location_error');
    });
  });

  describe('client-custom-location validation', () => {
    it('should validate when all required fields are provided', () => {
      const filters: SearchFilters = {
        locationSource: 'client-custom-location',
        location: {
          formatted: '123 Main St, New York, NY',
          city: 'New York',
          latitude: 40.7128,
          longitude: -74.006
        },
        neutered: 'All',
        maxDistanceMeters: 1,
        gender: 'Male',
        minAgeWeeks: 25,
        maxAgeWeeks: 479
      };

      const result = searchFiltersValidator(filters, mockT);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should fail when formatted address is empty', () => {
      const filters: SearchFilters = {
        locationSource: 'client-custom-location',
        location: {
          formatted: '',
          city: 'New York',
          latitude: 40.7128,
          longitude: -74.006
        },
        neutered: 'All',
        maxDistanceMeters: 80,
        gender: 'All',
        minAgeWeeks: 25,
        maxAgeWeeks: 170
      };

      const result = searchFiltersValidator(filters, mockT);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('invalid_address');
    });

    it('should fail when formatted address is only whitespace', () => {
      const filters: SearchFilters = {
        locationSource: 'client-custom-location',
        location: {
          formatted: '   ',
          city: 'New York',
          latitude: 40.7128,
          longitude: -74.006
        },
        neutered: 'Neutered Only',
        maxDistanceMeters: 23,
        gender: 'All',
        minAgeWeeks: 0,
        maxAgeWeeks: 60
      };

      const result = searchFiltersValidator(filters, mockT);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('invalid_address');
    });

    it('should fail when city is missing', () => {
      const filters: SearchFilters = {
        locationSource: 'client-custom-location',
        location: {
          formatted: '123 Main St',
          city: null,
          latitude: 40.7128,
          longitude: -74.006
        },
        neutered: 'All',
        maxDistanceMeters: 80,
        gender: 'All',
        minAgeWeeks: 0,
        maxAgeWeeks: 480
      };

      const result = searchFiltersValidator(filters, mockT);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('invalid_address');
    });

    it('should fail when city is empty string', () => {
      const filters: SearchFilters = {
        locationSource: 'client-custom-location',
        location: {
          formatted: '123 Main St',
          city: '',
          latitude: 40.7128,
          longitude: -74.006
        },
        neutered: 'Neutered Only',
        maxDistanceMeters: 50,
        gender: 'All',
        minAgeWeeks: 1,
        maxAgeWeeks: 67
      };

      const result = searchFiltersValidator(filters, mockT);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('invalid_address');
    });

    it('should fail when city is only whitespace', () => {
      const filters: SearchFilters = {
        locationSource: 'client-custom-location',
        location: {
          formatted: '123 Main St',
          city: '   ',
          latitude: 40.7128,
          longitude: -74.006
        },
        neutered: 'All',
        maxDistanceMeters: 95,
        gender: 'Female',
        minAgeWeeks: 1,
        maxAgeWeeks: 2
      };

      const result = searchFiltersValidator(filters, mockT);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('invalid_address');
    });

    it('should fail when latitude is missing', () => {
      const filters: SearchFilters = {
        locationSource: 'client-custom-location',
        location: {
          formatted: '123 Main St',
          city: 'New York',
          latitude: null,
          longitude: -74.006
        },
        neutered: 'Neutered Only',
        maxDistanceMeters: 30,
        gender: 'Male',
        minAgeWeeks: 13,
        maxAgeWeeks: 49
      };

      const result = searchFiltersValidator(filters, mockT);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('invalid_address');
    });

    it('should fail when longitude is missing', () => {
      const filters: SearchFilters = {
        locationSource: 'client-custom-location',
        location: {
          formatted: '123 Main St',
          city: 'New York',
          latitude: 40.7128,
          longitude: null
        },
        neutered: 'All',
        maxDistanceMeters: 80,
        gender: 'All',
        minAgeWeeks: 25,
        maxAgeWeeks: 170
      };

      const result = searchFiltersValidator(filters, mockT);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('invalid_address');
    });
  });

  describe('edge cases', () => {
    it('should validate with non-zero coordinates', () => {
      const filters: SearchFilters = {
        locationSource: 'client-custom-location',
        location: {
          formatted: 'Some Address',
          city: 'City',
          latitude: 0.1,
          longitude: 0.1
        },
        neutered: 'Neutered Only',
        maxDistanceMeters: 80,
        gender: 'All',
        minAgeWeeks: 25,
        maxAgeWeeks: 150
      };

      const result = searchFiltersValidator(filters, mockT);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });
  });
});
