import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaQuestionCircle, FaTimes } from 'react-icons/fa';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { useAuthStore } from '../../../stores/auth-store';
import {
  createAddAnimalListingFormValidator,
  type AddAnimalListingFormSchema
} from '../validators/addAnimalListingFormValidator';
import useCreateAnimalListing from '../hooks/useCreateAnimalListing';
import useCreateAnimalListingPhotos from '../hooks/useCreateAnimalListingPhotos';
import ErrorToast from '../../../components/toasts/ErrorToast';
import usePhotoHandling from '../hooks/usePhotoHandling';
import useAddressHandling from '../hooks/useAddressHandling';
import {
  createAnimalRequestFromFormData,
  getAddAnimalFormErrorMessages
} from '../utils/formSubmission';
import ListingTips from './ListingTips';

export default function AddAnimalListing() {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const userSession = useAuthStore((state) => state.session);
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);
  const isAuthenticatedUserSession = useAuthStore(
    (state) => state.isAuthenticatedUserSession
  );

  const goToLoginPage = () => navigate('/login', { replace: true });

  const goToNewAnimalListing = (animalId: string) =>
    navigate(`/rehomer/animal/edit/${animalId}`, { replace: true });

  useEffect(() => {
    if (!isLoadingSession) {
      // Only check authentication after session loading is complete
      if (!isAuthenticatedUserSession(userSession)) {
        goToLoginPage();
      }
    }
  }, [userSession, isLoadingSession]);

  // Ref to track if component is mounted to prevent state updates after unmounting
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const [serverError, setServerError] = useState<string | null>(null);

  // Recreate the schema whenever the language changes so that error messages are in the correct language
  const formValidator = useMemo(
    () => createAddAnimalListingFormValidator(),
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
  } = useForm<AddAnimalListingFormSchema>({
    resolver: zodResolver(formValidator) as any // as any type due to age preprocessor function
  });

  // Use custom hooks for photo and address handling
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
    isPending: isCreatingAnimalListing,
    mutateAsync: createAnimalListing,
    isError: createAnimalListingFailed
  } = useCreateAnimalListing();

  const {
    isPending: isCreatingAnimalListingPhotos,
    mutateAsync: createAnimalListingPhotos,
    isError: createAnimalListingPhotosFailed
  } = useCreateAnimalListingPhotos();

  const onSubmit = async (data: AddAnimalListingFormSchema) => {
    // Clear previous errors
    setServerError(null);
    clearErrors();
    setPhotoValidationErrors([]);

    // Photos are now optional - no validation required

    // Compress photos before submission
    const compressionResult = await compressPhotos(photos).catch((error) => {
      console.warn('Photo compression failed, using original photos:', error);
      return { compressedPhotos: photos, compressionErrors: [] };
    });
    const photosToUpload = compressionResult.compressedPhotos;
    const compressionErrors = compressionResult.compressionErrors;

    // If there are compression errors for large photos, show error and stop submission
    if (compressionErrors.length > 0) {
      setPhotoValidationErrors(compressionErrors);
      return;
    }

    const createAnimalRequest = createAnimalRequestFromFormData(data);

    try {
      const { animalId } = await createAnimalListing(createAnimalRequest);

      if (createAnimalListingFailed) {
        setServerError(t('create_animal_listing_error'));
        return;
      }

      const animalPhotos = new FormData();
      photosToUpload.forEach((photo) => animalPhotos.append('photos', photo));
      await createAnimalListingPhotos({ animalId, animalPhotos });

      if (createAnimalListingPhotosFailed) {
        setServerError(t('create_animal_listing_error'));
        return;
      }

      // Clear form and all state before navigation
      if (isMounted.current) {
        reset();
        setServerError(null);
        clearPhotos();
        setPhotoValidationErrors([]);
      }

      goToNewAnimalListing(animalId);
    } catch (error) {
      if (isMounted.current) {
        setServerError(t('create_animal_listing_error'));
      }
    }
  };

  const handleClearForm = () => {
    // Clear all photos and revoke object URLs
    clearPhotos();
    reset();
    setServerError(null);
    clearErrors();
  };

  // Get error messages from form state
  const formErrorMessages = getAddAnimalFormErrorMessages(errors);

  // Combine all error messages (excluding photo validation errors since they're shown in ErrorToast)
  const allErrorMessages = [...formErrorMessages];
  if (serverError) {
    allErrorMessages.push(serverError);
  }
  // Photo validation errors are also included in the ErrorToast
  if (photoValidationErrors.length > 0) {
    allErrorMessages.push(...photoValidationErrors);
  }

  const onCloseErrorToast = () => {
    setServerError(null);
    setPhotoValidationErrors([]);
    clearErrors();
  };

  const isSubmitDisabled =
    photos.length === 0 ||
    isSubmitting ||
    isCompressing ||
    isCreatingAnimalListing ||
    isCreatingAnimalListingPhotos;
  const isLoading =
    isSubmitting ||
    isCompressing ||
    isCreatingAnimalListing ||
    isCreatingAnimalListingPhotos;

  return (
    <div className="min-h-screen bg-[#f9f9f9] px-4 py-8 md:px-8">
      {allErrorMessages.length > 0 && (
        <ErrorToast
          messages={allErrorMessages}
          onCloseToast={onCloseErrorToast}
        />
      )}
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl bg-white p-6 shadow-lg md:p-8">
          <h1 className="mb-2 text-center font-serif text-3xl font-bold md:text-4xl">
            {t('add_animal_title')}
          </h1>
          <p className="mb-8 text-center text-gray-600">
            {t('add_animal_desc')}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Photo Upload Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{t('cat_photos')}</h2>
                <span className="text-sm text-gray-500">
                  {photos.length} / 5 {t('photos_uploaded')}
                </span>
              </div>
              <p className="text-sm text-gray-600">{t('cat_photos_desc')}</p>

              {/* Photo Upload Area */}
              <div className="hover:border-primary rounded-2xl border-2 border-dashed border-gray-300 p-8 text-center transition-colors">
                <input
                  type="file"
                  id="photo-upload"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  disabled={photos.length >= 5}
                />
                <label
                  htmlFor="photo-upload"
                  className={`flex cursor-pointer flex-col items-center justify-center space-y-4 ${
                    photos.length >= 5 ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                >
                  <IoCloudUploadOutline className="h-16 w-16 text-gray-400" />
                  <div>
                    <p className="font-medium">
                      {t(
                        photos.length >= 5
                          ? 'reached_max_photos'
                          : 'upload_photos'
                      )}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {t('photo_upload_rules')}
                    </p>
                  </div>
                </label>
              </div>

              {/* Photo Previews */}
              {photoPreviews.length > 0 && (
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
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
                        {t('photo')} {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Cat Information Section */}
            <section className="space-y-6">
              <h2 className="text-xl font-semibold">
                {t('add_animals_form_title')}
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Cat Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="block font-medium">
                    {t('cat_name')} *
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

                {/* Age */}
                <div className="space-y-2">
                  <label htmlFor="age" className="block font-medium">
                    {t('cat_age')} *
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

                {/* Gender */}
                <div className="space-y-2">
                  <label htmlFor="gender" className="block font-medium">
                    {t('gender')} *
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

                {/* Neutered Status */}
                <div className="space-y-2">
                  <label className="block font-medium">{t('neutered')}</label>
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
                        defaultChecked
                      />
                      <span>{t('no')}</span>
                    </label>
                  </div>
                  <p className="text-sm text-gray-500">{t('neutered_desc')}</p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label htmlFor="description" className="block font-medium">
                  {t('description')} *
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

            {/* Location Section */}
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
                  {t('address')} *
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
                {isLoading ? t('submitting') : t('add_animal_form_submit')}
              </button>
              <button
                type="button"
                className="btn btn-outline flex-1 py-3 text-lg"
                onClick={handleClearForm}
              >
                {t('add_animal_form_clear')}
              </button>
            </div>

            <p className="text-center text-sm text-gray-500">
              * {t('required_fields')}
            </p>
          </form>
        </div>

        <ListingTips />
      </div>
    </div>
  );
}
