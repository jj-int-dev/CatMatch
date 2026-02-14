import { useTranslation } from 'react-i18next';
import {
  TbShieldCheck,
  TbUsersGroup,
  TbMessages,
  TbStethoscope,
  TbAlertTriangle,
  TbHome,
  TbInfoCircle,
  TbPaw,
  TbArrowRight
} from 'react-icons/tb';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../stores/auth-store';

export default function SafetyTips() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userSession = useAuthStore((state) => state.session);
  const isAuthenticatedUserSession = useAuthStore(
    (state) => state.isAuthenticatedUserSession
  );

  const sections = [
    {
      icon: <TbUsersGroup className="size-8" />,
      title: t('safety_tips_section_meeting_title'),
      description: t('safety_tips_section_meeting_desc'),
      gradient: 'from-primary to-secondary',
      points: [
        {
          title: t('safety_tips_meeting_point_1_title'),
          description: t('safety_tips_meeting_point_1_desc')
        },
        {
          title: t('safety_tips_meeting_point_2_title'),
          description: t('safety_tips_meeting_point_2_desc')
        },
        {
          title: t('safety_tips_meeting_point_3_title'),
          description: t('safety_tips_meeting_point_3_desc')
        },
        {
          title: t('safety_tips_meeting_point_4_title'),
          description: t('safety_tips_meeting_point_4_desc')
        }
      ]
    },
    {
      icon: <TbMessages className="size-8" />,
      title: t('safety_tips_section_communication_title'),
      description: t('safety_tips_section_communication_desc'),
      gradient: 'from-secondary to-info',
      points: [
        {
          title: t('safety_tips_communication_point_1_title'),
          description: t('safety_tips_communication_point_1_desc')
        },
        {
          title: t('safety_tips_communication_point_2_title'),
          description: t('safety_tips_communication_point_2_desc')
        },
        {
          title: t('safety_tips_communication_point_3_title'),
          description: t('safety_tips_communication_point_3_desc')
        },
        {
          title: t('safety_tips_communication_point_4_title'),
          description: t('safety_tips_communication_point_4_desc')
        }
      ]
    },
    {
      icon: <TbStethoscope className="size-8" />,
      title: t('safety_tips_section_health_title'),
      description: t('safety_tips_section_health_desc'),
      gradient: 'from-info to-success',
      points: [
        {
          title: t('safety_tips_health_point_1_title'),
          description: t('safety_tips_health_point_1_desc')
        },
        {
          title: t('safety_tips_health_point_2_title'),
          description: t('safety_tips_health_point_2_desc')
        },
        {
          title: t('safety_tips_health_point_3_title'),
          description: t('safety_tips_health_point_3_desc')
        },
        {
          title: t('safety_tips_health_point_4_title'),
          description: t('safety_tips_health_point_4_desc')
        },
        {
          title: t('safety_tips_health_point_5_title'),
          description: t('safety_tips_health_point_5_desc')
        }
      ]
    },
    {
      icon: <TbAlertTriangle className="size-8" />,
      title: t('safety_tips_section_scams_title'),
      description: t('safety_tips_section_scams_desc'),
      gradient: 'from-warning to-error',
      points: [
        {
          title: t('safety_tips_scams_point_1_title'),
          description: t('safety_tips_scams_point_1_desc')
        },
        {
          title: t('safety_tips_scams_point_2_title'),
          description: t('safety_tips_scams_point_2_desc')
        },
        {
          title: t('safety_tips_scams_point_3_title'),
          description: t('safety_tips_scams_point_3_desc')
        },
        {
          title: t('safety_tips_scams_point_4_title'),
          description: t('safety_tips_scams_point_4_desc')
        }
      ]
    },
    {
      icon: <TbHome className="size-8" />,
      title: t('safety_tips_section_home_title'),
      description: t('safety_tips_section_home_desc'),
      gradient: 'from-accent to-primary',
      points: [
        {
          title: t('safety_tips_home_point_1_title'),
          description: t('safety_tips_home_point_1_desc')
        },
        {
          title: t('safety_tips_home_point_2_title'),
          description: t('safety_tips_home_point_2_desc')
        },
        {
          title: t('safety_tips_home_point_3_title'),
          description: t('safety_tips_home_point_3_desc')
        },
        {
          title: t('safety_tips_home_point_4_title'),
          description: t('safety_tips_home_point_4_desc')
        }
      ]
    }
  ];

  const warnings = [
    t('safety_tips_warning_point_1'),
    t('safety_tips_warning_point_2'),
    t('safety_tips_warning_point_3')
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
            <TbShieldCheck className="text-primary size-5" />
            <span className="text-base-content text-sm font-medium">
              {t('safety_tips_hero_badge')}
            </span>
          </div>

          <h1 className="text-base-content mb-6 font-serif text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            {t('safety_tips_hero_title')}
          </h1>

          <p className="text-base-content/80 mx-auto max-w-2xl text-lg md:text-xl">
            {t('safety_tips_hero_subtitle')}
          </p>
        </div>
      </section>

      {/* Safety Sections */}
      {sections.map((section, sectionIndex) => (
        <section
          key={sectionIndex}
          className={`py-16 ${sectionIndex % 2 === 0 ? 'bg-base-100' : 'from-base-100 to-base-200 bg-gradient-to-b'}`}
        >
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="mb-12 text-center">
              <div
                className={`mb-4 inline-flex rounded-xl bg-gradient-to-r ${section.gradient} p-3 text-white shadow-lg`}
              >
                {section.icon}
              </div>
              <h2 className="text-base-content mb-3 font-serif text-3xl font-bold md:text-4xl">
                {section.title}
              </h2>
              <p className="text-base-content/70 mx-auto max-w-2xl text-lg">
                {section.description}
              </p>
            </div>

            {/* Points Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {section.points.map((point, pointIndex) => (
                <div
                  key={pointIndex}
                  className="bg-base-200/50 group rounded-2xl p-6 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <div className="mb-3 flex items-start gap-3">
                    <div
                      className={`mt-1 flex-shrink-0 rounded-full bg-gradient-to-r ${section.gradient} p-1.5`}
                    >
                      <TbArrowRight className="size-4 text-white" />
                    </div>
                    <h3 className="text-base-content text-lg font-bold">
                      {point.title}
                    </h3>
                  </div>
                  <p className="text-base-content/80 ml-8 leading-relaxed">
                    {point.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Important Reminders */}
      <section className="bg-base-200 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="from-warning/10 to-error/10 rounded-3xl bg-gradient-to-r p-8 shadow-lg md:p-12">
            <div className="mb-6 flex items-center gap-3">
              <div className="from-warning to-error flex-shrink-0 rounded-xl bg-gradient-to-r p-3 text-white shadow-lg">
                <TbInfoCircle className="size-8" />
              </div>
              <h2 className="text-base-content font-serif text-3xl font-bold">
                {t('safety_tips_warning_title')}
              </h2>
            </div>

            <ul className="space-y-4">
              {warnings.map((warning, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="from-warning to-error mt-1 flex-shrink-0 rounded-full bg-gradient-to-r p-1.5">
                    <TbAlertTriangle className="size-4 text-white" />
                  </div>
                  <span className="text-base-content/90 text-lg leading-relaxed">
                    {warning}
                  </span>
                </li>
              ))}
            </ul>
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
          <TbShieldCheck className="mx-auto mb-6 size-16 text-white" />
          <h2 className="mb-6 font-serif text-4xl font-bold text-white md:text-5xl">
            {t('safety_tips_cta_title')}
          </h2>
          <p className="text-primary-content/90 mb-10 text-lg md:text-xl">
            {t('safety_tips_cta_subtitle')}
          </p>

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
            <span>{t('safety_tips_cta_button')}</span>
            <TbPaw className="size-6 transition-transform group-hover:rotate-12" />
          </button>
        </div>
      </section>
    </div>
  );
}
