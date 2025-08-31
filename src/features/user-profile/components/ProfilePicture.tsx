type ProfilePicturComponentProps = { profilePicUrl: string };

export function ProfilePicture({ profilePicUrl }: ProfilePicturComponentProps) {
  return (
    <div className="h-min max-w-[40%] rounded-2xl shadow-2xl/50">
      <img
        src={profilePicUrl}
        className="max-h-[550px] w-auto self-center rounded-lg shadow-2xl/50"
      />
    </div>
  );
}
