import { useState, useRef } from 'react';
import type { ProfilePicturComponentProps } from '../types/ProfilePictureProps';
import { RiEditLine } from 'react-icons/ri';

export function ProfilePicture({
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
    <div className="relative h-min max-w-[40%] rounded-2xl shadow-2xl/50 max-lg:hidden">
      <img
        src={currentImageUrl}
        className="max-h-[550px] w-auto self-center rounded-lg shadow-2xl/50"
      />
      {isEditMode && (
        <>
          <button
            onClick={handleEditClick}
            className="absolute right-2 bottom-2 h-10 w-10 cursor-pointer rounded-full bg-white p-2 shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
            aria-label="Edit profile picture"
          >
            <RiEditLine className="size-6 text-black" />
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
