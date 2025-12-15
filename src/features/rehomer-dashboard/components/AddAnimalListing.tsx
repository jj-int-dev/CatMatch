import { useState, useEffect, useMemo } from 'react';
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

// Mock address suggestions for autocomplete
const mockAddressSuggestions = [
  '123 Main St, New York, NY',
  '456 Oak Ave, Los Angeles, CA',
  '789 Pine Rd, Chicago, IL',
  '101 Maple Dr, Houston, TX',
  '202 Elm St, Phoenix, AZ'
];

export default function AddAnimalListing() {
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
      // Only check authentication after session loading is complete
      if (!isAuthenticatedUserSession(userSession)) {
        goToLoginPage();
      }
    }
  }, [userSession, isLoadingSession]);

  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [locationTooltip, setLocationTooltip] = useState(false);

  // Recreate the schema whenever the language changes so that error messages are in the correct language
  const formValidator = useMemo(
    () => createAddAnimalListingFormValidator(),
    [i18n.language]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<AddAnimalListingFormSchema>({
    resolver: zodResolver(formValidator) as any // as any type due to age preprocessor function
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPhotos: File[] = [];
    const newPreviews: string[] = [];

    // Calculate how many more photos we can add
    const remainingSlots = 5 - photos.length;
    const filesToAdd = Math.min(files.length, remainingSlots);

    for (let i = 0; i < filesToAdd; i++) {
      const file = files[i];
      newPhotos.push(file);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      newPreviews.push(previewUrl);
    }

    setPhotos([...photos, ...newPhotos]);
    setPhotoPreviews([...photoPreviews, ...newPreviews]);
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = [...photos];
    const newPreviews = [...photoPreviews];

    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(newPreviews[index]);

    newPhotos.splice(index, 1);
    newPreviews.splice(index, 1);

    setPhotos(newPhotos);
    setPhotoPreviews(newPreviews);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue('location.address', value, { shouldValidate: true });

    if (value.length > 2) {
      // Filter mock suggestions based on input
      const filtered = mockAddressSuggestions.filter((addr) =>
        addr.toLowerCase().includes(value.toLowerCase())
      );
      setAddressSuggestions(filtered);
      setShowAddressSuggestions(true);
    } else {
      setAddressSuggestions([]);
      setShowAddressSuggestions(false);
    }
  };

  const handleAddressSelect = (address: string) => {
    setValue('location.address', address, { shouldValidate: true });

    // Extract city and state from address (mock implementation)
    const parts = address.split(', ');
    if (parts.length >= 2) {
      const city = parts[1] || '';
      const state = parts[2] || '';
      setValue('location.city', city);
      setValue('location.state', state);

      // Mock coordinates - in a real app, you would geocode the address
      setValue('location.coordinates', {
        lat: Math.random() * 180 - 90,
        lng: Math.random() * 360 - 180
      });
    }

    setShowAddressSuggestions(false);
  };

  const onSubmit = handleSubmit((data: AddAnimalListingFormSchema) => {
    // Validate that at least one photo is uploaded
    if (photos.length === 0) {
      alert('Please upload at least one photo of the cat');
      return;
    }

    console.log('Form data:', data);
    console.log('Photos:', photos);

    // In a real app, you would submit to an API here
    alert('Cat listing created successfully!');

    // Reset form
    setPhotos([]);
    setPhotoPreviews([]);
    setValue('location.address', '');
    setValue('location.city', '');
    setValue('location.state', '');
    setValue('location.coordinates', { lat: 0, lng: 0 });
  });

  return (
    <div className="min-h-screen bg-[#f9f9f9] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl bg-white p-6 shadow-lg md:p-8">
          <h1 className="mb-2 text-center font-serif text-3xl font-bold md:text-4xl">
            Create Cat Listing
          </h1>
          <p className="mb-8 text-center text-gray-600">
            Fill out the form below to list a cat for adoption
          </p>

          <form onSubmit={onSubmit} className="space-y-8">
            {/* Photo Upload Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Cat Photos</h2>
                <span className="text-sm text-gray-500">
                  {photos.length} / 5 photos uploaded
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Upload up to 5 photos of the cat. At least 1 photo is required.
                You can drag and drop or click to browse.
              </p>

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
                      {photos.length >= 5
                        ? 'Maximum 5 photos reached'
                        : 'Click or drag to upload photos'}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      PNG, JPG, GIF up to 5MB each
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
                        alt={`Preview ${index + 1}`}
                        className="h-32 w-full rounded-lg object-cover shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                        aria-label="Remove photo"
                      >
                        <FaTimes className="h-3 w-3" />
                      </button>
                      <div className="bg-opacity-50 absolute right-0 bottom-0 left-0 rounded-b-lg bg-black py-1 text-center text-xs text-white">
                        Photo {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {photos.length === 0 && (
                <p className="mt-2 text-sm text-red-500">
                  At least one photo is required
                </p>
              )}
            </section>

            {/* Cat Information Section */}
            <section className="space-y-6">
              <h2 className="text-xl font-semibold">Cat Information</h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Cat Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="block font-medium">
                    Cat Name *
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
                    Age (in weeks) *
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
                    Gender *
                  </label>
                  <select
                    id="gender"
                    {...register('gender')}
                    className="select select-bordered w-full"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  {errors.gender && (
                    <p className="text-sm text-red-500">
                      {errors.gender.message}
                    </p>
                  )}
                </div>

                {/* Neutered Status */}
                <div className="space-y-2">
                  <label className="block font-medium">Neutered / Spayed</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex cursor-pointer items-center space-x-2">
                      <input
                        type="radio"
                        {...register('neutered')}
                        value="yes"
                        className="radio radio-primary"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex cursor-pointer items-center space-x-2">
                      <input
                        type="radio"
                        {...register('neutered')}
                        value="no"
                        className="radio radio-primary"
                      />
                      <span>No</span>
                    </label>
                    <label className="flex cursor-pointer items-center space-x-2">
                      <input
                        type="radio"
                        {...register('neutered')}
                        value="unknown"
                        className="radio radio-primary"
                        defaultChecked
                      />
                      <span>Unknown</span>
                    </label>
                  </div>
                  <p className="text-sm text-gray-500">
                    If not specified, it will be assumed the cat is not neutered
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label htmlFor="description" className="block font-medium">
                  Description *
                </label>
                <textarea
                  id="description"
                  {...register('description')}
                  className="textarea textarea-bordered h-32 w-full"
                  placeholder="Tell potential adopters about the cat's personality, habits, health, etc."
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
                <h2 className="text-xl font-semibold">Location</h2>
                <div className="relative">
                  <button
                    type="button"
                    onMouseEnter={() => setLocationTooltip(true)}
                    onMouseLeave={() => setLocationTooltip(false)}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Location information"
                  >
                    <FaQuestionCircle />
                  </button>
                  {locationTooltip && (
                    <div className="absolute bottom-full left-0 z-10 mb-2 w-64 rounded-lg bg-gray-800 p-3 text-sm text-white shadow-lg">
                      The full address will not be displayed to adopters. Only
                      the city and state will be shown to protect your privacy.
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="location" className="block font-medium">
                  Address *
                </label>
                <div className="relative">
                  <input
                    id="location"
                    type="text"
                    value={watch('location.address')}
                    onChange={handleAddressChange}
                    className="input input-bordered w-full"
                    placeholder="Start typing an address..."
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
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.location?.address && (
                  <p className="text-sm text-red-500">
                    {errors.location.address.message}
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  Select an address from the suggestions to ensure proper
                  formatting
                </p>
              </div>

              {/* Display selected city and state */}
              {(watch('location.city') || watch('location.state')) && (
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="font-medium text-blue-800">
                    Address Preview for Adopters:
                  </p>
                  <p className="text-blue-600">
                    {watch('location.city') && `${watch('location.city')}, `}
                    {watch('location.state')}
                  </p>
                </div>
              )}
            </section>

            {/* Form Actions */}
            <div className="flex flex-col gap-4 border-t pt-6 sm:flex-row">
              <button
                type="submit"
                className="btn btn-primary flex-1 py-3 text-lg"
                disabled={photos.length === 0}
              >
                Create Listing
              </button>
              <button
                type="button"
                className="btn btn-outline flex-1 py-3 text-lg"
                onClick={() => {
                  setPhotos([]);
                  setPhotoPreviews([]);
                  setValue('name', '');
                  setValue('age', 0);
                  setValue('gender', '' as any);
                  setValue('description', '');
                  setValue('neutered', 'unknown');
                  setValue('location.address', '');
                  setValue('location.city', '');
                  setValue('location.state', '');
                  setValue('location.coordinates', { lat: 0, lng: 0 });
                }}
              >
                Clear Form
              </button>
            </div>

            <p className="text-center text-sm text-gray-500">
              * Required fields
            </p>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-lg">
          <h3 className="mb-4 text-lg font-semibold">
            Tips for a Great Listing
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>
                Use clear, well-lit photos that show the cat's face and body
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Include photos from different angles</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>
                Be honest about the cat's personality and any special needs
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Respond promptly to inquiries from potential adopters</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
