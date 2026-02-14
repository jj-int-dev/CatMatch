import { useTranslation } from 'react-i18next';
import {
  TbHeart,
  TbShieldCheck,
  TbUsers,
  TbSparkles,
  TbPaw,
  TbHome,
  TbEye,
  TbTarget,
  TbArrowRight
} from 'react-icons/tb';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../stores/auth-store';

export default function About() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userSession = useAuthStore((state) => state.session);
  const isAuthenticatedUserSession = useAuthStore(
    (state) => state.isAuthenticatedUserSession
  );

  const values = [
    {
      icon: <TbHeart className="size-8" />,
      title: t('about_value_compassion_title'),
      description: t('about_value_compassion_desc'),
      gradient: 'from-error to-accent'
    },
    {
      icon: <TbShieldCheck className="size-8" />,
      title: t('about_value_safety_title'),
      description: t('about_value_safety_desc'),
      gradient: 'from-primary to-secondary'
    },
    {
      icon: <TbUsers className="size-8" />,
      title: t('about_value_community_title'),
      description: t('about_value_community_desc'),
      gradient: 'from-secondary to-info'
    },
    {
      icon: <TbSparkles className="size-8" />,
      title: t('about_value_transparency_title'),
      description: t('about_value_transparency_desc'),
      gradient: 'from-accent to-warning'
    }
  ];

  const milestones = [
    {
      icon: <TbPaw className="size-6" />,
      stat: '1,000+',
      label: t('about_milestone_adoptions')
    },
    {
      icon: <TbUsers className="size-6" />,
      stat: '5,000+',
      label: t('about_milestone_members')
    },
    {
      icon: <TbHome className="size-6" />,
      stat: '500+',
      label: t('about_milestone_shelters')
    },
    {
      icon: <TbHeart className="size-6" />,
      stat: '98%',
      label: t('about_milestone_satisfaction')
    }
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="from-base-100 via-base-200 to-base-300 relative overflow-hidden bg-gradient-to-br py-20 md:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="from-primary/20 to-accent/20 absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-r opacity-30 blur-3xl"></div>
          <div className="from-secondary/20 to-info/20 absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-r opacity-30 blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="dark:bg-base-100/80 mb-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm">
            <TbHeart className="text-error size-5" />
            <span className="text-base-content text-sm font-medium">
              {t('about_hero_badge')}
            </span>
          </div>

          <h1 className="text-base-content mb-6 font-serif text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            {t('about_hero_title')}
          </h1>

          <p className="text-base-content/80 mx-auto mb-8 max-w-2xl text-lg md:text-xl">
            {t('about_hero_subtitle')}
          </p>

          {/* Milestones Grid */}
          <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className="bg-base-100/80 group rounded-2xl p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <div className="from-primary to-accent mb-3 inline-flex rounded-xl bg-gradient-to-r p-2 text-white">
                  {milestone.icon}
                </div>
                <div className="text-base-content mb-1 text-3xl font-bold">
                  {milestone.stat}
                </div>
                <div className="text-base-content/80 text-sm">
                  {milestone.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="bg-base-100 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="from-primary to-accent mb-4 inline-flex rounded-xl bg-gradient-to-r p-3 text-white">
              <TbSparkles className="size-8" />
            </div>
            <h2 className="text-base-content mb-4 font-serif text-4xl font-bold md:text-5xl">
              {t('about_story_title')}
            </h2>
          </div>

          <div className="space-y-8">
            <div className="bg-base-200/50 rounded-3xl p-8 shadow-sm">
              <h3 className="text-base-content mb-4 text-2xl font-bold">
                {t('about_story_problem_title')}
              </h3>
              <p className="text-base-content/80 text-lg leading-relaxed">
                {t('about_story_problem_text')}
              </p>
            </div>

            <div className="bg-base-200/50 rounded-3xl p-8 shadow-sm">
              <h3 className="text-base-content mb-4 text-2xl font-bold">
                {t('about_story_solution_title')}
              </h3>
              <p className="text-base-content/80 text-lg leading-relaxed">
                {t('about_story_solution_text')}
              </p>
            </div>

            <div className="bg-base-200/50 rounded-3xl p-8 shadow-sm">
              <h3 className="text-base-content mb-4 text-2xl font-bold">
                {t('about_story_today_title')}
              </h3>
              <p className="text-base-content/80 text-lg leading-relaxed">
                {t('about_story_today_text')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="from-base-100 to-base-200 bg-gradient-to-b py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-base-content mb-4 font-serif text-4xl font-bold md:text-5xl">
              {t('about_values_title')}
            </h2>
            <p className="text-base-content/80 mx-auto max-w-2xl text-lg">
              {t('about_values_subtitle')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {values.map((value, index) => (
              <div
                key={index}
                className="group bg-base-100 relative overflow-hidden rounded-3xl p-8 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 transition-opacity group-hover:opacity-5`}
                ></div>
                <div className="relative">
                  <div
                    className={`mb-6 inline-flex rounded-xl bg-gradient-to-r ${value.gradient} p-3 text-white shadow-lg`}
                  >
                    {value.icon}
                  </div>
                  <h3 className="text-base-content mb-3 text-2xl font-bold">
                    {value.title}
                  </h3>
                  <p className="text-base-content/80 text-lg leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="bg-base-100 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Side - Vision Icon */}
            <div className="relative">
              <div className="from-primary/20 to-accent/20 absolute -inset-4 rounded-3xl bg-gradient-to-r blur-3xl"></div>
              <div className="from-primary to-accent relative flex aspect-square items-center justify-center rounded-3xl bg-gradient-to-br p-12 shadow-2xl">
                <TbEye className="size-48 text-white md:size-64" />
              </div>
            </div>

            {/* Right Side - Vision Content */}
            <div>
              <div className="mb-6 flex items-center gap-3">
                <TbTarget className="from-primary to-accent size-12 rounded-xl bg-gradient-to-r p-2 text-white" />
                <h2 className="text-base-content font-serif text-4xl font-bold md:text-5xl">
                  {t('about_vision_title')}
                </h2>
              </div>

              <div className="space-y-6">
                <p className="text-base-content/80 text-lg leading-relaxed">
                  {t('about_vision_text_1')}
                </p>
                <p className="text-base-content/80 text-lg leading-relaxed">
                  {t('about_vision_text_2')}
                </p>

                <ul className="space-y-4">
                  {[
                    t('about_vision_goal_1'),
                    t('about_vision_goal_2'),
                    t('about_vision_goal_3')
                  ].map((goal, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="from-primary to-accent mt-1 flex-shrink-0 rounded-full bg-gradient-to-r p-1">
                        <TbArrowRight className="size-4 text-white" />
                      </div>
                      <span className="text-base-content/80 text-lg">
                        {goal}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
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
          <TbPaw className="mx-auto mb-6 size-16 text-white" />
          <h2 className="mb-6 font-serif text-4xl font-bold text-white md:text-5xl">
            {t('about_cta_title')}
          </h2>
          <p className="text-primary-content/90 mb-10 text-lg md:text-xl">
            {t('about_cta_subtitle')}
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={() =>
                navigate(
                  isAuthenticatedUserSession(userSession)
                    ? '/discovery'
                    : '/login'
                )
              }
              className="group text-primary inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-8 py-4 text-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-white/25 active:scale-95"
            >
              <span>{t('about_cta_browse')}</span>
              <TbPaw className="size-6 transition-transform group-hover:rotate-12" />
            </button>

            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center justify-center gap-3 rounded-2xl border-2 border-white/30 bg-transparent px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-white hover:bg-white/10 active:scale-95"
            >
              <TbHeart className="size-6" />
              <span>{t('about_cta_join')}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
