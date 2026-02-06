import { useState, useCallback } from 'react';
import type { AddressSuggestionSchema } from '../../../validators/addressSuggestionValidators';
import useGetAddressSuggestions from '../../../hooks/useGetAddressSuggestions';
import type { UseFormSetValue, UseFormWatch } from 'react-hook-form';

// Define a type for forms that have an address field with the expected structure
export type FormWithAddress = {
  address?: {
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
  setShowAddressSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
  setAddressSuggestions: React.Dispatch<
    React.SetStateAction<AddressSuggestionSchema[]>
  >;
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

  // Use a type assertion to handle the optional address field
  const addressValue = watch('address.formatted' as any) as string | undefined;
  const {
    data: fetchedAddressSuggestions,
    isLoading: isLoadingAddressSuggestions
  } = useGetAddressSuggestions(addressValue || '', languageCode);

  const handleAddressChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      // Use type assertion for setValue
      (setValue as any)('address.formatted', value, { shouldValidate: true });

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
    },
    [fetchedAddressSuggestions, setValue]
  );

  const handleAddressSelect = useCallback(
    (address: AddressSuggestionSchema) => {
      // Use type assertion for setValue
      (setValue as any)('address', address, { shouldValidate: true });
      setShowAddressSuggestions(false);
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
    setLocationTooltip,
    setShowAddressSuggestions,
    setAddressSuggestions
  };
}
