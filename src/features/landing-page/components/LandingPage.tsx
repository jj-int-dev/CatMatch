import { useTranslation } from 'react-i18next';
import landingPageCat from '../../../assets/landing_page_cat.png';
import CatIcon from '../../../assets/cat_icon.svg?react';
import HouseIcon from '../../../assets/house_icon.svg?react';
import CatTestimonialPic1 from '../../../assets/cat_testimonial_1.jpg';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../../stores/auth-store';

function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);
  const userSession = useAuthStore((state) => state.session);
  const isAuthenticatedUserSession = useAuthStore(
    (state) => state.isAuthenticatedUserSession
  );

  const handleClick = () => {
    // if user is logged in, navigate to user profile, else to login page
    if (isAuthenticatedUserSession(userSession)) {
      navigate(`/user-profile/${userSession!.user.id}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <main
        data-testid="homepage"
        className="h-screen overflow-auto bg-[#7289DA] pt-10 pr-20 pb-20 pl-16 md:pt-14 lg:pr-0 lg:pl-32"
      >
        <div className="grid grid-flow-col grid-cols-12">
          <div className="col-span-5 col-start-1">
            <div className="row-1 space-y-4">
              <h1 className="m0 box-border block border-0 border-solid border-[#e5e7eb]">
                <span className="block font-sans text-[56px] leading-[0.9] font-bold tracking-[-0.03em] text-black md:text-[72px] lg:text-[90px] xl:text-[120px]">
                  {t('title_line_1')}
                </span>
                <span className="mt-5 block text-[56px] leading-[0.9] tracking-[-0.05em] text-black italic md:text-[72px] lg:text-[90px] xl:text-[120px]">
                  {t('title_line_2')}
                </span>
              </h1>
            </div>

            <div className="row-2 mt-15 mb-10">
              <div className="grid max-w-[600px] grid-flow-col grid-cols-1 grid-rows-2 gap-x-20 md:grid-cols-2 md:grid-rows-1">
                <div className="flex flex-row gap-x-4 md:col-1">
                  <CatIcon />
                  <p
                    className="font-sans text-[20px] leading-none font-semibold text-black"
                    data-testid="hero-module-apy"
                  >
                    {t('adopt_a_cat_today')}
                    <br />
                    <span className="font-sans text-[14px] font-normal text-black">
                      {t('search_through_cats')}
                    </span>
                  </p>
                </div>

                <div className="flex flex-row gap-x-4 md:col-2">
                  <HouseIcon />
                  <p
                    className="mt-[5px] self-center font-sans text-[20px] leading-none font-semibold text-black"
                    data-testid="hero-module-apy"
                  >
                    {t('find_cat_dream_home')}
                  </p>
                </div>
              </div>
            </div>
            <div className="row-3 mt-28">
              <button
                onClick={handleClick}
                disabled={isLoadingSession}
                className="m-0 rounded-lg bg-white p-4 font-sans text-[15px] leading-[100%] font-semibold text-[#7289DA] shadow-lg transition-shadow duration-100 ease-out hover:bg-indigo-900 hover:text-white active:shadow-sm"
              >
                {t('get_started')}
              </button>
            </div>
          </div>
          <div className="max-sm:col-span-8 max-sm:col-start-2 md:col-span-2 md:col-start-7 md:mt-[-30px] md:items-start">
            <img
              className="max-w-md bg-none md:max-w-lg"
              alt="cat picture"
              loading="eager"
              src={landingPageCat}
            />
          </div>
        </div>
        <div className="mt-23 flex w-full flex-row items-center justify-center gap-x-20">
          <div className="card lg:card-side max-w-xs bg-white shadow-sm">
            <figure>
              <img src={CatTestimonialPic1} alt="cat testimonial 1" />
            </figure>
            <div className="card-body">
              <h2 className="card-title text-black">Luna</h2>
              <p className="text-black">
                Adopting Luna changed my life — she brings me endless joy!
              </p>
            </div>
          </div>
          <div className="card lg:card-side max-w-xs bg-white shadow-sm">
            <figure>
              <img src={CatTestimonialPic1} alt="Album" />
            </figure>
            <div className="card-body">
              <h2 className="card-title text-black">Max</h2>
              <p className="text-black">
                Bringing Max home filled my days with love, purrs, and laughter.
              </p>
            </div>
          </div>
          <div className="card lg:card-side max-w-xs bg-white shadow-sm">
            <figure>
              <img src={CatTestimonialPic1} alt="Album" />
            </figure>
            <div className="card-body">
              <h2 className="card-title text-black">Bella</h2>
              <p className="text-black">
                Adopting Bella was pure joy — she’s my little sunshine daily.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default LandingPage;
