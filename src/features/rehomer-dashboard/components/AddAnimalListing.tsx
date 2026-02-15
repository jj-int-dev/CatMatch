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
import useGetUserType from '../../../hooks/useGetUserType';

export default function AddAnimalListing() {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const userSession = useAuthStore((state) => state.session);
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);
  const isAuthenticatedUserSession = useAuthStore(
    (state) => state.isAuthenticatedUserSession
  );

  const { data: userType, isLoading: isLoadingUserType } = useGetUserType();

  const goToDiscovery = () => navigate('/discovery', { replace: true });
  const goToLoginPage = () => navigate('/login', { replace: true });
  const goToNewAnimalListing = (animalId: string) =>
    navigate(`/rehomer/animal/edit/${animalId}`, { replace: true });

  useEffect(() => {
    if (!isLoadingSession && !isLoadingUserType) {
      if (!isAuthenticatedUserSession(userSession)) {
        goToLoginPage();
        return;
      }
      if (userType === 'Adopter') {
        goToDiscovery();
      }
    }
  }, [userSession, isLoadingSession, isLoadingUserType, userType]);

  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const [serverError, setServerError] = useState<string | null>(null);

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
    setServerError(null);
    clearErrors();
    setPhotoValidationErrors([]);

    const compressionResult = await compressPhotos(photos).catch((error) => {
      console.warn('Photo compression failed, using original photos:', error);
      return { compressedPhotos: photos, compressionErrors: [] };
    });
    const photosToUpload = compressionResult.compressedPhotos;
    const compressionErrors = compressionResult.compressionErrors;

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
    clearPhotos();
    reset();
    setServerError(null);
    clearErrors();
  };

  const formErrorMessages = getAddAnimalFormErrorMessages(errors);
  const allErrorMessages = [...formErrorMessages];
  if (serverError) {
    allErrorMessages.push(serverError);
  }
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

  const descriptionLength = watch('description')?.length || 0;
  const maxDescriptionLength = 1000;

  return (
    <div className="from-base-200 to-base-300 min-h-screen bg-gradient-to-br px-4 py-8 md:px-8">
      {allErrorMessages.length > 0 && (
        <ErrorToast
          messages={allErrorMessages}
          onCloseToast={onCloseErrorToast}
        />
      )}
      <div className="mx-auto max-w-4xl">
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body">
            <h1 className="card-title text-base-content justify-center text-3xl font-bold md:text-4xl">
              {t('add_animal_title')}
            </h1>
            <p className="text-base-content/70 text-center">
              {t('add_animal_desc')}
            </p>

            <div className="divider"></div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Photo Upload Section */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base-content text-xl font-semibold">
                    {t('cat_photos')}
                  </h2>
                  <span className="badge badge-primary badge-lg">
                    {photos.length} / 5 {t('photos_uploaded')}
                  </span>
                </div>
                <p className="text-base-content/70 text-sm">
                  {t('cat_photos_desc')}
                </p>

                {/* Photo Upload Area */}
                <div className="hover:border-primary border-base-300 bg-base-200/50 rounded-2xl border-2 border-dashed p-8 text-center transition-colors">
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
                    <IoCloudUploadOutline className="text-base-content/40 h-16 w-16" />
                    <div>
                      <p className="text-base-content font-medium">
                        {t(
                          photos.length >= 5
                            ? 'reached_max_photos'
                            : 'upload_photos'
                        )}
                      </p>
                      <p className="text-base-content/60 mt-1 text-sm">
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
                          className="aspect-square w-full rounded-lg object-cover shadow-md"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(index)}
                          className="btn btn-circle btn-error btn-sm absolute -top-2 -right-2 opacity-0 transition-opacity group-hover:opacity-100"
                          aria-label={t('remove_photo')}
                        >
                          <FaTimes className="h-3 w-3" />
                        </button>
                        <div className="badge badge-neutral badge-sm absolute right-2 bottom-2">
                          {t('photo')} {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <div className="divider"></div>

              {/* Cat Information Section */}
              <section className="space-y-6">
                <h2 className="text-base-content text-xl font-semibold">
                  {t('add_animals_form_title')}
                </h2>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Cat Name */}
                  <div className="form-control">
                    <label htmlFor="name" className="label">
                      <span className="label-text font-medium">
                        {t('cat_name')} *
                      </span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      {...register('name')}
                      className="input input-bordered focus:input-primary w-full"
                      placeholder="e.g., Whiskers"
                    />
                    {errors.name && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.name.message}
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Age */}
                  <div className="form-control">
                    <label htmlFor="age" className="label">
                      <span className="label-text font-medium">
                        {t('cat_age')} *
                      </span>
                    </label>
                    <input
                      id="age"
                      type="number"
                      {...register('age')}
                      className="input input-bordered focus:input-primary w-full"
                      placeholder="e.g., 12"
                      min="1"
                    />
                    {errors.age && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.age.message}
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Gender */}
                  <div className="form-control">
                    <label htmlFor="gender" className="label">
                      <span className="label-text font-medium">
                        {t('gender')} *
                      </span>
                    </label>
                    <select
                      id="gender"
                      {...register('gender')}
                      className="select select-bordered focus:select-primary w-full"
                    >
                      <option value="">{t('select_gender')}</option>
                      <option value="Male">{t('male')}</option>
                      <option value="Female">{t('female')}</option>
                    </select>
                    {errors.gender && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.gender.message}
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Neutered Status */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        {t('neutered_label')}
                      </span>
                    </label>
                    <div className="flex items-center gap-4 pt-2">
                      <label className="label cursor-pointer gap-2">
                        <input
                          type="radio"
                          {...register('neutered')}
                          value="yes"
                          className="radio radio-primary"
                        />
                        <span className="label-text">{t('yes')}</span>
                      </label>
                      <label className="label cursor-pointer gap-2">
                        <input
                          type="radio"
                          {...register('neutered')}
                          value="no"
                          className="radio radio-primary"
                          defaultChecked
                        />
                        <span className="label-text">{t('no')}</span>
                      </label>
                    </div>
                    <label className="label">
                      <span className="label-text-alt text-base-content/60">
                        {t('neutered_desc')}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div className="form-control">
                  <label htmlFor="description" className="label">
                    <span className="label-text font-medium">
                      {t('description')} *
                    </span>
                  </label>
                  <textarea
                    id="description"
                    {...register('description')}
                    className="textarea textarea-bordered focus:textarea-primary h-32 w-full"
                    placeholder={t('description_placeholder')}
                    maxLength={maxDescriptionLength}
                  />
                  <div className="mt-1 flex justify-end">
                    <span
                      className={`text-sm font-medium transition-colors ${
                        descriptionLength >= maxDescriptionLength
                          ? 'text-error'
                          : 'text-base-content/60'
                      }`}
                    >
                      {descriptionLength} / {maxDescriptionLength}
                    </span>
                  </div>
                  {errors.description && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.description.message}
                      </span>
                    </label>
                  )}
                </div>
              </section>

              <div className="divider"></div>

              {/* Location Section */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-base-content text-xl font-semibold">
                    {t('location')}
                  </h2>
                  <div className="tooltip" data-tip={t('location_tooltip')}>
                    <button
                      type="button"
                      className="btn btn-circle btn-ghost btn-xs"
                      onMouseEnter={() => setLocationTooltip(true)}
                      onMouseLeave={() => setLocationTooltip(false)}
                      aria-label={t('location_aria_label')}
                    >
                      <FaQuestionCircle className="text-base-content/60 h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="form-control">
                  <label htmlFor="address" className="label">
                    <span className="label-text font-medium">
                      {t('address')} *
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      id="address"
                      type="text"
                      value={watch('address.formatted')}
                      onChange={handleAddressChange}
                      className="input input-bordered focus:input-primary w-full"
                      placeholder={t('address_placeholder')}
                      autoComplete="off"
                    />
                    {showAddressSuggestions &&
                      addressSuggestions.length > 0 && (
                        <div className="bg-base-100 border-base-300 absolute top-full right-0 left-0 z-20 mt-1 max-h-60 overflow-y-auto rounded-lg border shadow-lg">
                          {addressSuggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleAddressSelect(suggestion)}
                              className="hover:bg-base-200 border-base-300 w-full border-b px-4 py-3 text-left last:border-b-0"
                            >
                              {suggestion.formatted}
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                  {errors.address?.formatted && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.address.message}
                      </span>
                    </label>
                  )}
                  <label className="label">
                    <span className="label-text-alt text-base-content/60">
                      {t('address_desc')}
                    </span>
                  </label>
                </div>
              </section>

              <div className="divider"></div>

              {/* Form Actions */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <button
                  type="submit"
                  className="btn btn-primary flex-1"
                  disabled={isSubmitDisabled}
                >
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      {t('submitting')}
                    </>
                  ) : (
                    t('add_animal_form_submit')
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-outline flex-1"
                  onClick={handleClearForm}
                >
                  {t('add_animal_form_clear')}
                </button>
              </div>

              <p className="text-base-content/60 text-center text-sm">
                * {t('required_fields')}
              </p>
            </form>
          </div>
        </div>

        <ListingTips />
      </div>
    </div>
  );
}
