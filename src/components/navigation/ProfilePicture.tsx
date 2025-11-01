import { useNavigate } from 'react-router-dom';

type ProfilePictureProps = { imgSrc: string; userId: string };

export default function ProfilePicture({
  imgSrc,
  userId
}: ProfilePictureProps) {
  const navigate = useNavigate();

  const goToUserProfile = () => {
    navigate(`/user-profile/${userId}`);
  };

  return (
    <div className="avatar">
      <div
        onClick={goToUserProfile}
        className="ring-offset-base-100 size-9 cursor-pointer rounded-full ring-2 ring-indigo-900 ring-offset-1 transition duration-300 ease-in-out hover:scale-105 hover:shadow-md"
      >
        <img src={imgSrc} />
      </div>
    </div>
  );
}
