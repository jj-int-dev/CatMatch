export type ProfilePictureComponentProps = {
  profilePicUrl: string;
  isEditMode: boolean;
  onChooseNewProfilePic: () => void;
  onNewProfilePicChosen: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
