import type { ProfilePicturComponentProps } from '../types/ProfilePictureProps';

export function MobileProfilePicture({
  profilePicUrl
}: ProfilePicturComponentProps) {
  return (
    <img
      src={profilePicUrl}
      className="mx-auto -mt-16 block h-48 w-48 rounded-full bg-cover bg-center shadow-xl lg:hidden"
    />
  );
}
