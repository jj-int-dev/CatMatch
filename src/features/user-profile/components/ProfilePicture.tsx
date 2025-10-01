import type { ProfilePicturComponentProps } from '../types/ProfilePictureProps';

export function ProfilePicture({ profilePicUrl }: ProfilePicturComponentProps) {
  return (
    <div className="h-min max-w-[40%] rounded-2xl shadow-2xl/50 max-lg:hidden">
      <img
        src={profilePicUrl}
        className="max-h-[550px] w-auto self-center rounded-lg shadow-2xl/50"
      />
    </div>
  );
}
