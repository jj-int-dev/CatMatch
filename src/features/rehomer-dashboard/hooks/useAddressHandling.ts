import { useState, useCallback, useEffect } from 'react';
import type { AddressSuggestionSchema } from '../../../validators/addressSuggestionValidators';
import useGetAddressSuggestions from '../../../hooks/useGetAddressSuggestions';
import type {
  UseFormSetValue,
  UseFormWatch,
  Path,
  PathValue
} from 'react-hook-form';

// Define a type for forms that have an address field with the expected structure
export type FormWithAddress = {
  address: {
    formatted: string;
    lat: number;
    lon: number;
  };
};

export type UseAddressHandlingReturn = {
  addressSuggestions: AddressSuggestionSchema[];
  showAddressSuggestions: boolean;
  locationTooltip: boolean;
  isLoadingAddressSuggestions: boolean;
  handleAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddressSelect: (address: AddressSuggestionSchema) => void;
  setLocationTooltip: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function useAddressHandling<T extends FormWithAddress>(
  setValue: UseFormSetValue<T>,
  watch: UseFormWatch<T>,
  languageCode: string
): UseAddressHandlingReturn {
  const [addressSuggestions, setAddressSuggestions] = useState<
    AddressSuggestionSchema[]
  >([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [locationTooltip, setLocationTooltip] = useState(false);

  const addressFormatted = watch('address.formatted' as Path<T>);
  const addressLat = watch('address.lat' as Path<T>);
  const addressLon = watch('address.lon' as Path<T>);

  const {
    data: fetchedAddressSuggestions,
    isLoading: isLoadingAddressSuggestions
  } = useGetAddressSuggestions(
    (addressFormatted as string) || '',
    languageCode,
    'client-custom-location'
  );

  // Manage suggestions visibility based on whether user has selected an address
  // Only show suggestions if user is typing AND hasn't selected an address yet
  useEffect(() => {
    // If lat/lon exist, user has selected an address - don't show suggestions
    if (addressLat && addressLon) {
      setShowAddressSuggestions(false);
      setAddressSuggestions([]);
      return;
    }

    // User is typing and hasn't selected yet - show suggestions if available
    if (
      fetchedAddressSuggestions &&
      fetchedAddressSuggestions.results.length > 0
    ) {
      setAddressSuggestions(fetchedAddressSuggestions.results);
      setShowAddressSuggestions(true);
    } else {
      setAddressSuggestions([]);
      setShowAddressSuggestions(false);
    }
  }, [fetchedAddressSuggestions, addressLat, addressLon]);

  const handleAddressChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      // When user types, update formatted field and CLEAR lat/lon
      // This ensures validation knows the address is incomplete
      setValue('address.formatted' as Path<T>, value as PathValue<T, Path<T>>, {
        shouldValidate: true
      });
      setValue('address.lat' as Path<T>, 0 as PathValue<T, Path<T>>, {
        shouldValidate: true
      });
      setValue('address.lon' as Path<T>, 0 as PathValue<T, Path<T>>, {
        shouldValidate: true
      });
      setValue('address.city' as Path<T>, '' as PathValue<T, Path<T>>, {
        shouldValidate: true
      });
    },
    [setValue]
  );

  const handleAddressSelect = useCallback(
    (address: AddressSuggestionSchema) => {
      // Set all address fields with properly typed values
      setValue(
        'address.formatted' as Path<T>,
        address.formatted as PathValue<T, Path<T>>,
        {
          shouldValidate: true
        }
      );
      setValue('address.lat' as Path<T>, address.lat as PathValue<T, Path<T>>, {
        shouldValidate: true
      });
      setValue('address.lon' as Path<T>, address.lon as PathValue<T, Path<T>>, {
        shouldValidate: true
      });
      // city not needed for rehomer purposes, only for discovery purposes
      setValue('address.city' as Path<T>, '' as PathValue<T, Path<T>>, {
        shouldValidate: true
      });
      // Suggestions will be hidden by the useEffect when it detects lat/lon exist
    },
    [setValue]
  );

  return {
    addressSuggestions,
    showAddressSuggestions,
    locationTooltip,
    isLoadingAddressSuggestions,
    handleAddressChange,
    handleAddressSelect,
    setLocationTooltip
  };
}
