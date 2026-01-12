import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaQuestionCircle, FaTimes } from 'react-icons/fa';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { useAuthStore } from '../../../stores/auth-store';
import {
  createEditAnimalListingFormValidator,
  type EditAnimalListingFormSchema
} from '../validators/editAnimalListingFormValidator';
import useGetAnimalListing from '../hooks/useGetAnimalListing';
import useUpdateAnimalListingPhotos from '../hooks/useUpdateAnimalListingPhotos';
import useUpdateAnimalListing from '../hooks/useUpdateAnimalListing';
import ErrorToast from '../../../components/toasts/ErrorToast';
import SuccessToast from '../../../components/toasts/SuccessToast';
import usePhotoHandling from '../hooks/usePhotoHandling';
import useAddressHandling from '../hooks/useAddressHandling';
import {
  createUpdateAnimalRequestFromFormData,
  getEditAnimalFormErrorMessages
} from '../utils/formSubmission';
import ListingTips from './ListingTips';

export default function EditAnimalListing() {
  const { animalId } = useParams();
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const userSession = useAuthStore((state) => state.session);
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);
  const isAuthenticatedUserSession = useAuthStore(
    (state) => state.isAuthenticatedUserSession
  );

  const goToLoginPage = () => navigate('/login', { replace: true });

  useEffect(() => {
    if (!isLoadingSession) {
      if (!isAuthenticatedUserSession(userSession)) {
        goToLoginPage();
      }
    }
  }, [userSession, isLoadingSession]);

  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [existingPhotos, setExistingPhotos] = useState<
    Array<{ photoUrl: string; order: number; markedForDeletion?: boolean }>
  >([]);

  const formValidator = useMemo(
    () => createEditAnimalListingFormValidator(),
    [i18n.language]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
    clearErrors
  } = useForm<EditAnimalListingFormSchema>({
    resolver: zodResolver(formValidator) as any
  });

  const {
    photos,
    photoPreviews,
    photoValidationErrors,
    isCompressing,
    handlePhotoUpload,
    handleRemovePhoto,
    compressPhotos,
    clearPhotos,
    setPhotoValidationErrors
  } = usePhotoHandling();

  const {
    addressSuggestions,
    showAddressSuggestions,
    locationTooltip,
    handleAddressChange,
    handleAddressSelect,
    setLocationTooltip
  } = useAddressHandling(setValue, watch, i18n.language.split('-')[0]);

  const {
    data: animalListing,
    isPending: isLoadingAnimalListing,
    isError: getAnimalListingFailed
  } = useGetAnimalListing(animalId!);

  const {
    isPending: isUpdatingAnimalListing,
    mutateAsync: updateAnimalListing,
    isError: updateAnimalListingFailed
  } = useUpdateAnimalListing();

  const {
    isPending: isUpdatingAnimalListingPhotos,
    mutateAsync: updateAnimalListingPhotos,
    isError: updateAnimalListingPhotosFailed
  } = useUpdateAnimalListingPhotos();

  useEffect(() => {
    if (animalListing?.animal) {
      const animal = animalListing.animal;
      setValue('name', animal.name);
      setValue('age', animal.ageInWeeks);
      setValue('gender', animal.gender);
      setValue('description', animal.description);
      setValue('neutered', animal.neutered ? 'yes' : 'no');
      setValue('address.formatted', animal.addressDisplayName);
      setExistingPhotos(animal.animalPhotos || []);
    }
  }, [animalListing, setValue]);

  const onSubmit = async (data: EditAnimalListingFormSchema) => {
    setServerError(null);
    setSuccessMessage(null);
    clearErrors();
    setPhotoValidationErrors([]);

    const hasFormChanges = Object.keys(data).some(
      (key) => data[key as keyof typeof data] !== undefined
    );
    const hasNewPhotos = photos.length > 0;
    const hasDeletedPhotos = existingPhotos.some(
      (photo) => photo.markedForDeletion
    );
    const hasPhotoChanges = hasNewPhotos || hasDeletedPhotos;

    if (!hasFormChanges && !hasPhotoChanges) {
      setServerError(t('no_changes_detected'));
      return;
    }

    // Photos are now optional - no validation required
    // Users can delete all photos if they want

    try {
      if (hasFormChanges) {
        const updateAnimalRequest = createUpdateAnimalRequestFromFormData(data);
        await updateAnimalListing({
          animalId: animalId!,
          animalData: updateAnimalRequest
        });

        if (updateAnimalListingFailed) {
          setServerError(t('update_animal_listing_error'));
          return;
        }
      }

      if (hasPhotoChanges) {
        // If there are new photos or photos marked for deletion, we need to update all photos
        const compressionResult = await compressPhotos(photos).catch(
          (error) => {
            console.warn('Photo compression failed:', error);
            return { compressedPhotos: photos, compressionErrors: [] };
          }
        );
        const photosToUpload = compressionResult.compressedPhotos;
        const compressionErrors = compressionResult.compressionErrors;

        if (compressionErrors.length > 0) {
          setPhotoValidationErrors(compressionErrors);
          return;
        }

        const animalPhotos = new FormData();
        photosToUpload.forEach((photo) => animalPhotos.append('photos', photo));

        await updateAnimalListingPhotos({
          animalId: animalId!,
          animalPhotos
        });

        if (updateAnimalListingPhotosFailed) {
          setServerError(t('update_animal_listing_error'));
          return;
        }
      }

      if (isMounted.current) {
        setSuccessMessage(t('animal_listing_updated_successfully'));
        if (hasPhotoChanges) {
          clearPhotos();
          // Update existing photos to remove deleted ones
          setExistingPhotos(
            existingPhotos.filter((photo) => !photo.markedForDeletion)
          );
        }
      }
    } catch (error) {
      if (isMounted.current) {
        setServerError(t('update_animal_listing_error'));
      }
    }
  };

  const handleDeleteExistingPhoto = (index: number) => {
    const updatedPhotos = [...existingPhotos];
    updatedPhotos[index] = { ...updatedPhotos[index], markedForDeletion: true };
    setExistingPhotos(updatedPhotos);
  };

  const handleRestoreExistingPhoto = (index: number) => {
    const updatedPhotos = [...existingPhotos];
    updatedPhotos[index] = {
      ...updatedPhotos[index],
      markedForDeletion: false
    };
    setExistingPhotos(updatedPhotos);
  };

  const handleClearForm = () => {
    clearPhotos();
    reset();
    setServerError(null);
    setSuccessMessage(null);
    clearErrors();
    // Reset markedForDeletion flags
    setExistingPhotos(
      existingPhotos.map((photo) => ({ ...photo, markedForDeletion: false }))
    );
  };

  const formErrorMessages = getEditAnimalFormErrorMessages(errors);
  const allErrorMessages = [...formErrorMessages];
  if (serverError) allErrorMessages.push(serverError);
  if (photoValidationErrors.length > 0)
    allErrorMessages.push(...photoValidationErrors);

  const onCloseErrorToast = () => {
    setServerError(null);
    setPhotoValidationErrors([]);
    clearErrors();
  };

  const onCloseSuccessToast = () => {
    setSuccessMessage(null);
  };

  const isSubmitDisabled =
    isSubmitting ||
    isCompressing ||
    isUpdatingAnimalListing ||
    isUpdatingAnimalListingPhotos ||
    isLoadingAnimalListing;
  const isLoading =
    isSubmitting ||
    isCompressing ||
    isUpdatingAnimalListing ||
    isUpdatingAnimalListingPhotos ||
    isLoadingAnimalListing;

  if (isLoadingAnimalListing) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] px-4 py-8 md:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl bg-white p-6 shadow-lg md:p-8">
            <div className="flex items-center justify-center">
              <div className="loading loading-spinner loading-lg"></div>
              <span className="ml-4 text-lg">{t('loading_animal_data')}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (getAnimalListingFailed) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] px-4 py-8 md:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl bg-white p-6 shadow-lg md:p-8">
            <h1 className="mb-4 text-center font-serif text-3xl font-bold md:text-4xl">
              {t('error_loading_animal')}
            </h1>
            <p className="mb-6 text-center text-gray-600">
              {t('animal_listing_load_error_desc')}
            </p>
            <div className="flex justify-center">
              <button
                className="btn btn-primary"
                onClick={() => navigate('/rehomer/dashboard')}
              >
                {t('return_to_dashboard')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9] px-4 py-8 md:px-8">
      {allErrorMessages.length > 0 && (
        <ErrorToast
          messages={allErrorMessages}
          onCloseToast={onCloseErrorToast}
        />
      )}

      {successMessage && (
        <SuccessToast
          messages={[successMessage]}
          onCloseToast={onCloseSuccessToast}
        />
      )}

      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl bg-white p-6 shadow-lg md:p-8">
          <h1 className="mb-2 text-center font-serif text-3xl font-bold md:text-4xl">
            {t('edit_animal_title')}
          </h1>
          <p className="mb-8 text-center text-gray-600">
            {t('edit_animal_desc')}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{t('cat_photos')}</h2>
                <span className="text-sm text-gray-500">
                  {existingPhotos.length + photos.length} / 5{' '}
                  {t('photos_total')}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {t('edit_cat_photos_desc')}
              </p>

              {existingPhotos.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 text-lg font-medium">
                    {t('existing_photos')}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                    {existingPhotos.map((photo, index) => (
                      <div key={index} className="group relative">
                        <img
                          src={photo.photoUrl}
                          alt={`${t('existing_photo')} ${index + 1}`}
                          className={`h-32 w-full rounded-lg object-cover shadow-md ${
                            photo.markedForDeletion ? 'opacity-50' : ''
                          }`}
                        />
                        {photo.markedForDeletion ? (
                          <button
                            type="button"
                            onClick={() => handleRestoreExistingPhoto(index)}
                            className="absolute -top-2 -right-2 rounded-full bg-green-500 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-green-600"
                            aria-label={t('restore_photo')}
                          >
                            <svg
                              className="h-3 w-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                              ></path>
                            </svg>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleDeleteExistingPhoto(index)}
                            className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                            aria-label={t('delete_photo')}
                          >
                            <FaTimes className="h-3 w-3" />
                          </button>
                        )}
                        <div className="bg-opacity-50 absolute right-0 bottom-0 left-0 rounded-b-lg bg-black py-1 text-center text-xs text-white">
                          {photo.markedForDeletion
                            ? t('deleted')
                            : t('existing')}{' '}
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    {t('existing_photos_note')}
                  </p>
                </div>
              )}

              <div className="hover:border-primary rounded-2xl border-2 border-dashed border-gray-300 p-8 text-center transition-colors">
                <input
                  type="file"
                  id="photo-upload"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  disabled={photos.length + existingPhotos.length >= 5}
                />
                <label
                  htmlFor="photo-upload"
                  className={`flex cursor-pointer flex-col items-center justify-center space-y-4 ${
                    photos.length + existingPhotos.length >= 5
                      ? 'cursor-not-allowed opacity-50'
                      : ''
                  }`}
                >
                  <IoCloudUploadOutline className="h-16 w-16 text-gray-400" />
                  <div>
                    <p className="font-medium">
                      {t(
                        photos.length + existingPhotos.length >= 5
                          ? 'reached_max_photos'
                          : 'upload_new_photos'
                      )}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {t('photo_upload_rules')}
                    </p>
                  </div>
                </label>
              </div>

              {photoPreviews.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-3 text-lg font-medium">
                    {t('new_photos')}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                    {photoPreviews.map((preview, index) => (
                      <div key={index} className="group relative">
                        <img
                          src={preview}
                          alt={`${t('preview')} ${index + 1}`}
                          className="h-32 w-full rounded-lg object-cover shadow-md"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(index)}
                          className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                          aria-label={t('remove_photo')}
                        >
                          <FaTimes className="h-3 w-3" />
                        </button>
                        <div className="bg-opacity-50 absolute right-0 bottom-0 left-0 rounded-b-lg bg-black py-1 text-center text-xs text-white">
                          {t('new')} {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <section className="space-y-6">
              <h2 className="text-xl font-semibold">
                {t('edit_animals_form_title')}
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="block font-medium">
                    {t('cat_name')}
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register('name')}
                    className="input input-bordered w-full"
                    placeholder="e.g., Whiskers"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="age" className="block font-medium">
                    {t('cat_age')}
                  </label>
                  <input
                    id="age"
                    type="number"
                    {...register('age')}
                    className="input input-bordered w-full"
                    placeholder="e.g., 12"
                    min="1"
                  />
                  {errors.age && (
                    <p className="text-sm text-red-500">{errors.age.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="gender" className="block font-medium">
                    {t('gender')}
                  </label>
                  <select
                    id="gender"
                    {...register('gender')}
                    className="select select-bordered w-full"
                  >
                    <option value="">{t('select_gender')}</option>
                    <option value="Male">{t('male')}</option>
                    <option value="Female">{t('female')}</option>
                  </select>
                  {errors.gender && (
                    <p className="text-sm text-red-500">
                      {errors.gender.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block font-medium">
                    {t('neutered_label')}
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex cursor-pointer items-center space-x-2">
                      <input
                        type="radio"
                        {...register('neutered')}
                        value="yes"
                        className="radio radio-primary"
                      />
                      <span>{t('yes')}</span>
                    </label>
                    <label className="flex cursor-pointer items-center space-x-2">
                      <input
                        type="radio"
                        {...register('neutered')}
                        value="no"
                        className="radio radio-primary"
                      />
                      <span>{t('no')}</span>
                    </label>
                  </div>
                  <p className="text-sm text-gray-500">{t('neutered_desc')}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="block font-medium">
                  {t('description')}
                </label>
                <textarea
                  id="description"
                  {...register('description')}
                  className="textarea textarea-bordered h-32 w-full"
                  placeholder={t('description_placeholder')}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-semibold">{t('location')}</h2>
                <div className="relative">
                  <button
                    type="button"
                    onMouseEnter={() => setLocationTooltip(true)}
                    onMouseLeave={() => setLocationTooltip(false)}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label={t('location_aria_label')}
                  >
                    <FaQuestionCircle />
                  </button>
                  {locationTooltip && (
                    <div className="absolute bottom-full left-0 z-10 mb-2 w-64 rounded-lg bg-gray-800 p-3 text-sm text-white shadow-lg">
                      {t('location_tooltip')}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="block font-medium">
                  {t('address')}
                </label>
                <div className="relative">
                  <input
                    id="address"
                    type="text"
                    value={watch('address.formatted')}
                    onChange={handleAddressChange}
                    className="input input-bordered w-full"
                    placeholder={t('address_placeholder')}
                    autoComplete="off"
                  />
                  {showAddressSuggestions && addressSuggestions.length > 0 && (
                    <div className="absolute top-full right-0 left-0 z-20 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                      {addressSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleAddressSelect(suggestion)}
                          className="w-full border-b border-gray-100 px-4 py-3 text-left last:border-b-0 hover:bg-gray-100"
                        >
                          {suggestion.formatted}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.address?.formatted && (
                  <p className="text-sm text-red-500">
                    {errors.address.message}
                  </p>
                )}
                <p className="text-sm text-gray-500">{t('address_desc')}</p>
              </div>
            </section>

            {/* Form Actions */}
            <div className="flex flex-col gap-4 border-t pt-6 sm:flex-row">
              <button
                type="submit"
                className="btn btn-primary flex-1 py-3 text-lg"
                disabled={isSubmitDisabled}
              >
                {isLoading ? t('submitting') : t('update_animal_form_submit')}
              </button>
              <button
                type="button"
                className="btn btn-outline flex-1 py-3 text-lg"
                onClick={handleClearForm}
              >
                {t('clear_changes')}
              </button>
            </div>

            <p className="text-center text-sm text-gray-500">
              {t('edit_form_fields_note')}
            </p>
          </form>
        </div>

        <ListingTips />
      </div>
    </div>
  );
}
