import { useState, useRef } from 'react';
import type { ProfilePicturComponentProps } from '../types/ProfilePictureProps';
import { RiEditLine } from 'react-icons/ri';

export function MobileProfilePicture({
  profilePicUrl,
  isEditMode
}: ProfilePicturComponentProps) {
  const [currentImageUrl, setCurrentImageUrl] = useState(profilePicUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if the file is one of the allowed MIME types
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (allowedTypes.includes(file.type)) {
        // Create a preview URL for the selected file
        const previewUrl = URL.createObjectURL(file);
        setCurrentImageUrl(previewUrl);
      }
    }
    // Reset the file input so the same file can be selected again
    if (event.target) {
      event.target.value = '';
    }
  };

  return (
    <div className="relative mx-auto -mt-16 block h-48 w-48 lg:hidden">
      <img
        src={currentImageUrl}
        className="h-full w-full rounded-full bg-cover bg-center shadow-xl"
      />
      {isEditMode && (
        <>
          <button
            onClick={handleEditClick}
            className="absolute right-2 bottom-2 h-8 w-8 cursor-pointer rounded-full bg-white p-1.5 shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
            aria-label="Edit profile picture"
          >
            <RiEditLine className="size-5 text-black" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg, image/png, image/webp"
            className="hidden"
          />
        </>
      )}
    </div>
  );
}
