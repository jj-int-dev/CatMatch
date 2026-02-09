import { useTranslation } from 'react-i18next';
import landingPageCat from '../../../assets/landing_page_cat.webp';
import CatTestimonialPic1 from '../../../assets/cat_testimonial_1.jpg';
import CatTestimonialPic2 from '../../../assets/cat_testimonial_2.jpg';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../../stores/auth-store';
import { TbHeart, TbHome, TbPaw, TbStar, TbCheck } from 'react-icons/tb';

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
      navigate(`/user-profile`);
    } else {
      navigate('/login');
    }
  };

  const testimonials = [
    {
      name: 'Luna',
      quote: t('luna_testimonial'),
      image: CatTestimonialPic1,
      rating: 5
    },
    {
      name: 'Max',
      quote: t('max_testimonial'),
      image: CatTestimonialPic1,
      rating: 5
    },
    {
      name: 'Bella',
      quote: t('bella_testimonial'),
      image: CatTestimonialPic2,
      rating: 5
    }
  ];

  const features = [
    {
      icon: <TbPaw className="size-8" />,
      title: t('adopt_a_cat_today'),
      description: t('search_through_cats'),
      color: 'from-accent to-error'
    },
    {
      icon: <TbHome className="size-8" />,
      title: t('find_cat_dream_home'),
      description: t('help_cats_find_homes'),
      color: 'from-secondary to-info'
    },
    {
      icon: <TbHeart className="size-8" />,
      title: t('safe_and_verified'),
      description: t('safe_and_verified_desc'),
      color: 'from-primary to-secondary'
    }
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="from-base-100 via-base-200 to-base-300 relative overflow-hidden bg-gradient-to-br pt-8 pb-20 md:pt-16 md:pb-32">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="from-primary/30 to-accent/30 absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-r opacity-30 blur-3xl"></div>
          <div className="from-secondary/30 to-info/30 absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-r opacity-30 blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left content */}
            <div className="text-center lg:text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm">
                <TbStar className="text-warning size-5" />
                <span className="text-base-content text-sm font-medium">
                  {t('trusted_by_cat_lovers')}
                </span>
              </div>

              <h1 className="text-base-content mb-6 font-serif text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
                <span className="block">{t('title_line_1')}</span>
                <span className="from-primary to-accent block bg-gradient-to-r bg-clip-text text-transparent">
                  {t('title_line_2')}
                </span>
              </h1>

              <p className="text-base-content/80 mb-8 text-lg md:text-xl">
                {t('hero_description')}
              </p>

              <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  onClick={handleClick}
                  disabled={isLoadingSession}
                  className="group from-primary to-accent hover:shadow-primary/25 relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="relative z-10">{t('get_started')}</span>
                  <TbHeart className="relative z-10 size-6 transition-transform group-hover:scale-110" />
                  <div className="from-primary/80 to-accent/80 absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity group-hover:opacity-100"></div>
                </button>

                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="border-base-100 from-info to-secondary size-10 rounded-full border-2 bg-gradient-to-r shadow-sm"
                      ></div>
                    ))}
                  </div>
                  <span className="text-base-content/80 text-sm">
                    <span className="font-semibold">1,000+</span>{' '}
                    {t('successful_adoptions')}
                  </span>
                </div>
              </div>

              {/* Features grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="group bg-base-100/80 rounded-2xl p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <div
                      className={`mb-4 inline-flex rounded-xl bg-gradient-to-r ${feature.color} p-3 text-white`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-base-content mb-2 font-semibold">
                      {feature.title}
                    </h3>
                    <p className="text-base-content/80 text-sm">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right image */}
            <div className="relative">
              <div className="relative mx-auto max-w-md lg:mx-0">
                <div className="from-primary/20 to-accent/20 absolute -inset-4 rounded-3xl bg-gradient-to-r opacity-20 blur-3xl"></div>
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    src={landingPageCat}
                    alt="Happy cat looking for a home"
                    className="h-auto w-full object-cover"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                  {/* Floating stats card */}
                  <div className="bg-base-100/95 absolute -bottom-6 left-1/2 w-4/5 -translate-x-1/2 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-base-content text-2xl font-bold">
                          500+
                        </div>
                        <div className="text-base-content/80 text-sm">
                          {t('cats_available')}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-base-content text-2xl font-bold">
                          98%
                        </div>
                        <div className="text-base-content/80 text-sm">
                          {t('success_rate')}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-base-content text-2xl font-bold">
                          24h
                        </div>
                        <div className="text-base-content/80 text-sm">
                          {t('avg_response')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="from-base-100 to-base-200 bg-gradient-to-b py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base-content mb-4 font-serif text-4xl font-bold md:text-5xl">
              {t('happy_tails_stories')}
            </h2>
            <p className="text-base-content/80 mx-auto mb-12 max-w-2xl text-lg">
              {t('happy_tails_stories_desc')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group bg-base-100 relative overflow-hidden rounded-3xl shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              >
                <div className="from-primary/10 to-accent/10 absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-100"></div>
                <div className="relative p-8">
                  <div className="mb-6 overflow-hidden rounded-2xl">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="mb-4 flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <TbStar
                        key={i}
                        className="fill-warning text-warning size-5"
                      />
                    ))}
                  </div>

                  <blockquote className="text-base-content mb-6 text-lg italic">
                    "{testimonial.quote}"
                  </blockquote>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-base-content font-semibold">
                        {testimonial.name}
                      </div>
                      <div className="text-base-content/80 text-sm">
                        {t('happy_cat_parent')}
                      </div>
                    </div>
                    <div className="from-primary/10 to-accent/10 flex items-center gap-2 rounded-full bg-gradient-to-r px-3 py-1">
                      <TbCheck className="text-primary size-4" />
                      <span className="text-primary text-sm font-medium">
                        {t('verified')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="from-primary to-accent relative overflow-hidden bg-gradient-to-r py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-white/10 blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 font-serif text-4xl font-bold text-white md:text-5xl">
            {t('ready_to_find_match')}
          </h2>
          <p className="text-primary-content/80 mb-10 text-lg md:text-xl">
            {t('ready_to_find_match_desc')}
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={handleClick}
              disabled={isLoadingSession}
              className="group text-primary inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-8 py-4 text-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-white/25 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span>{t('get_started')}</span>
              <TbHeart className="size-6 transition-transform group-hover:scale-110" />
            </button>

            <button
              onClick={() => navigate('/discovery')}
              className="inline-flex items-center justify-center gap-3 rounded-2xl border-2 border-white/30 bg-transparent px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-white hover:bg-white/10 active:scale-95"
            >
              <TbPaw className="size-6" />
              <span>{t('browse_cats_cta')}</span>
            </button>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-primary-content/80 text-sm">
                {t('cats_available')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">1,000+</div>
              <div className="text-primary-content/80 text-sm">
                {t('happy_families')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">98%</div>
              <div className="text-primary-content/80 text-sm">
                {t('success_rate')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">24h</div>
              <div className="text-primary-content/80 text-sm">
                {t('avg_response')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <TbPaw className="text-neutral-content size-8" />
                <span className="text-neutral-content text-2xl font-bold">
                  CatMatch
                </span>
              </div>
              <p className="text-neutral-content/80">
                {t('connecting_homes_since')}
              </p>
            </div>

            <div>
              <h3 className="text-neutral-content mb-4 font-semibold">
                {t('for_adopters')}
              </h3>
              <ul className="text-neutral-content/80 space-y-2">
                <li>
                  <a
                    href="#"
                    className="hover:text-neutral-content transition-colors"
                  >
                    {t('browse_cats_link')}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-neutral-content transition-colors"
                  >
                    {t('adoption_process')}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-neutral-content transition-colors"
                  >
                    {t('faq')}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-neutral-content mb-4 font-semibold">
                {t('for_rehomers')}
              </h3>
              <ul className="text-neutral-content/80 space-y-2">
                <li>
                  <a
                    href="#"
                    className="hover:text-neutral-content transition-colors"
                  >
                    {t('list_a_cat')}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-neutral-content transition-colors"
                  >
                    {t('rehoming_guide')}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-neutral-content transition-colors"
                  >
                    {t('safety_tips')}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-neutral-content mb-4 font-semibold">
                {t('company')}
              </h3>
              <ul className="text-neutral-content/80 space-y-2">
                <li>
                  <a
                    href="#"
                    className="hover:text-neutral-content transition-colors"
                  >
                    {t('about_us')}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-neutral-content transition-colors"
                  >
                    {t('contact')}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-neutral-content transition-colors"
                  >
                    {t('privacy_policy')}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-neutral-focus text-neutral-content/80 mt-12 border-t pt-8 text-center">
            <p>{t('copyright_text')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
