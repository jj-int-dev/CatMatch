import type { AddAnimalListingFormSchema } from '../validators/addAnimalListingFormValidator';
import type { EditAnimalListingFormSchema } from '../validators/editAnimalListingFormValidator';
import type { CreateAnimalListingRequest } from '../types/CreateAnimalListingRequest';
import type { UpdateAnimalListingRequest } from '../types/UpdateAnimalListingRequest';
import type { FieldErrors } from 'react-hook-form';

export function createAnimalRequestFromFormData(
  data: AddAnimalListingFormSchema
): CreateAnimalListingRequest {
  return {
    name: data.name,
    gender: data.gender,
    ageInWeeks: data.age,
    neutered: data.neutered === 'yes',
    addressDisplayName: data.address.formatted,
    description: data.description,
    address: {
      latitude: data.address.lat,
      longitude: data.address.lon
    }
  };
}

export function createUpdateAnimalRequestFromFormData(
  data: EditAnimalListingFormSchema
): UpdateAnimalListingRequest {
  const updateRequest: UpdateAnimalListingRequest = {};

  if (data.name !== undefined) {
    updateRequest.name = data.name;
  }

  if (data.gender !== undefined) {
    updateRequest.gender = data.gender;
  }

  if (data.age !== undefined) {
    updateRequest.ageInWeeks = data.age;
  }

  if (data.neutered !== undefined) {
    updateRequest.neutered = data.neutered === 'yes';
  }

  if (data.description !== undefined) {
    updateRequest.description = data.description;
  }

  if (data.address !== undefined) {
    updateRequest.addressDisplayName = data.address.formatted;
    updateRequest.address = {
      latitude: data.address.lat,
      longitude: data.address.lon
    };
  }

  return updateRequest;
}

export function getAddAnimalFormErrorMessages(
  errors: FieldErrors<AddAnimalListingFormSchema>
): string[] {
  return Object.values(errors)
    .filter((error) => error?.message)
    .map((error) => error.message as string);
}

export function getEditAnimalFormErrorMessages(
  errors: FieldErrors<EditAnimalListingFormSchema>
): string[] {
  return Object.values(errors)
    .filter((error) => error?.message)
    .map((error) => error.message as string);
}
