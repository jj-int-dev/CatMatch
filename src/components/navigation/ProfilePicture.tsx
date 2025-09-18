//import { useNavigate } from 'react-router-dom';

type ProfilePictureProps = { userId: string };

export default function ProfilePicture({ userId }: ProfilePictureProps) {
  //const navigate = useNavigate();

  const goToUserProfile = () => {
    console.log(userId);
    //TODO: navigate(`/user-profile/${userId}`);
  };

  //TODO: use a custom react query hook that gets the currently logged in user's profile picture URL.
  // the hook should accept a userId and a placeholder profile picture url

  return (
    <div className="avatar">
      <div
        onClick={goToUserProfile}
        className="ring-offset-base-100 w-24 cursor-pointer rounded-full ring-2 ring-indigo-900 ring-offset-2"
      >
        <img src="https://img.daisyui.com/images/profile/demo/spiderperson@192.webp" />
      </div>
    </div>
  );
}
