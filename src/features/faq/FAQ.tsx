import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import {
  TbQuestionMark,
  TbPaw,
  TbHome,
  TbShieldCheck,
  TbChevronDown,
  TbArrowRight
} from 'react-icons/tb';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../stores/auth-store';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSection {
  icon: React.JSX.Element;
  title: string;
  gradient: string;
  questions: FAQItem[];
}

interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  gradient: string;
}

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
  gradient
}: AccordionItemProps) {
  return (
    <div className="bg-base-200/50 group rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md">
      <button
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
        aria-expanded={isOpen}
        className="text-base-content focus:ring-primary dark:focus:ring-offset-base-100 flex w-full items-start gap-4 p-6 text-left transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
      >
        <div
          className={`mt-1 flex-shrink-0 rounded-full bg-gradient-to-r ${gradient} p-2 transition-transform ${isOpen ? 'rotate-0' : ''}`}
        >
          <TbChevronDown
            className={`size-5 text-white transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
        <div className="flex-1">
          <h3 className="text-lg leading-relaxed font-bold">{question}</h3>
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
        aria-hidden={!isOpen}
      >
        <div className="text-base-content/80 px-6 pb-6 pl-[4.5rem] leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userSession = useAuthStore((state) => state.session);
  const isAuthenticatedUserSession = useAuthStore(
    (state) => state.isAuthenticatedUserSession
  );

  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const sections: FAQSection[] = [
    {
      icon: <TbPaw className="size-8" />,
      title: t('faq_section_adoption_title'),
      gradient: 'from-primary to-secondary',
      questions: [
        {
          question: t('faq_question_adoption_fee_title'),
          answer: t('faq_question_adoption_fee_answer')
        },
        {
          question: t('faq_question_contact_rehomer_title'),
          answer: t('faq_question_contact_rehomer_answer')
        },
        {
          question: t('faq_question_prepare_adoption_title'),
          answer: t('faq_question_prepare_adoption_answer')
        },
        {
          question: t('faq_question_multiple_cats_title'),
          answer: t('faq_question_multiple_cats_answer')
        }
      ]
    },
    {
      icon: <TbHome className="size-8" />,
      title: t('faq_section_rehoming_title'),
      gradient: 'from-secondary to-info',
      questions: [
        {
          question: t('faq_question_rehome_own_cat_title'),
          answer: t('faq_question_rehome_own_cat_answer')
        },
        {
          question: t('faq_question_create_listing_title'),
          answer: t('faq_question_create_listing_answer')
        },
        {
          question: t('faq_question_edit_listing_title'),
          answer: t('faq_question_edit_listing_answer')
        },
        {
          question: t('faq_question_response_time_title'),
          answer: t('faq_question_response_time_answer')
        }
      ]
    },
    {
      icon: <TbShieldCheck className="size-8" />,
      title: t('faq_section_platform_title'),
      gradient: 'from-info to-accent',
      questions: [
        {
          question: t('faq_question_user_safety_title'),
          answer: t('faq_question_user_safety_answer')
        },
        {
          question: t('faq_question_account_cost_title'),
          answer: t('faq_question_account_cost_answer')
        },
        {
          question: t('faq_question_conversation_not_working_title'),
          answer: t('faq_question_conversation_not_working_answer')
        },
        {
          question: t('faq_question_shelters_involved_title'),
          answer: t('faq_question_shelters_involved_answer')
        }
      ]
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
            <TbQuestionMark className="text-info size-5" />
            <span className="text-base-content text-sm font-medium">
              {t('faq_hero_badge')}
            </span>
          </div>

          <h1 className="text-base-content mb-6 font-serif text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            {t('faq_hero_title')}
          </h1>

          <p className="text-base-content/80 mx-auto max-w-2xl text-lg md:text-xl">
            {t('faq_hero_subtitle')}
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      {sections.map((section, sectionIndex) => (
        <section
          key={sectionIndex}
          className={`py-16 ${sectionIndex % 2 === 0 ? 'bg-base-100' : 'from-base-100 to-base-200 bg-gradient-to-b'}`}
        >
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="mb-10 text-center">
              <div
                className={`mb-4 inline-flex rounded-xl bg-gradient-to-r ${section.gradient} p-3 text-white shadow-lg`}
              >
                {section.icon}
              </div>
              <h2 className="text-base-content font-serif text-3xl font-bold md:text-4xl">
                {section.title}
              </h2>
            </div>

            {/* Accordion Items */}
            <div className="space-y-4">
              {section.questions.map((item, itemIndex) => {
                const itemId = `${sectionIndex}-${itemIndex}`;
                return (
                  <AccordionItem
                    key={itemId}
                    question={item.question}
                    answer={item.answer}
                    isOpen={openItems[itemId] || false}
                    onToggle={() => toggleItem(itemId)}
                    gradient={section.gradient}
                  />
                );
              })}
            </div>
          </div>
        </section>
      ))}

      {/* CTA Section */}
      <section className="from-primary to-accent relative overflow-hidden bg-gradient-to-r py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-white/10 blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <TbQuestionMark className="mx-auto mb-6 size-16 text-white" />
          <h2 className="mb-6 font-serif text-4xl font-bold text-white md:text-5xl">
            {t('faq_cta_title')}
          </h2>
          <p className="text-primary-content/90 mb-10 text-lg md:text-xl">
            {t('faq_cta_subtitle')}
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={() => navigate('/safety-tips')}
              className="group inline-flex items-center justify-center gap-3 rounded-2xl border-2 border-white/30 bg-transparent px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-white hover:bg-white/10 active:scale-95"
            >
              <TbShieldCheck className="size-6" />
              <span>{t('faq_cta_button_safety')}</span>
            </button>

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
              <span>{t('faq_cta_button_browse')}</span>
              <TbArrowRight className="size-6 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
