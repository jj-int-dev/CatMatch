import { useSetNavigationColor } from '../../../hooks/useSetNavigationColor';
import defaultProfilePic from '../../../assets/default_profile_pic.jpg';

export default function UserTypeSelection() {
  useSetNavigationColor('transparent');

  return (
    <div className="-mt-16 flex h-screen w-screen flex-col items-center justify-center bg-[#3e98fd] bg-cover bg-center">
      <div className="mb-25 grid grid-cols-12">
        <div className="col-span-4 pt-8">
          <div className="flex flex-col">
            <div className="avatar pl-4">
              <div className="w-48 rounded-full">
                <img src={defaultProfilePic} />
              </div>
            </div>
            <div className="mt-8">
              <div className="skeleton bg-skeleton bg-skeleton-base h-[1.125rem] w-[4.375rem]" />
            </div>
            <div className="mt-8">
              <div className="skeleton bg-skeleton bg-skeleton-base h-[1.125rem] w-[4.375rem]" />
            </div>
          </div>
        </div>
        <div className="col-span-8 flex items-center">
          <div className="flex flex-row gap-x-10">
            <div className="skeleton bg-skeleton bg-skeleton-base h-96 w-96 rounded-4xl" />
            <div className="skeleton bg-skeleton bg-skeleton-base h-96 w-96 rounded-4xl" />
          </div>
        </div>
      </div>
      <div className="flex w-full justify-center">
        <div className="skeleton bg-skeleton bg-skeleton-base h-[2.5rem] w-[3.638rem]" />
      </div>
    </div>
  );
}
