import { MdOutlineEmail } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import {
  createEmailValidator,
  type EmailSchema
} from './validators/emailValidator';
import i18n from '../../utils/i18n';
import { useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../../stores/auth-store';

export const openSendResetPasswordLinkDialog = () => {
  (
    document.getElementById(
      'sendResetPasswordLinkDialog'
    ) as HTMLDialogElement | null
  )?.showModal();
};

export function SendResetPasswordLinkDialog() {
  const { t } = useTranslation();
  const sendResetPasswordLink = useAuthStore(
    (state) => state.sendResetPasswordLink
  );

  const emailValidator = useMemo(() => createEmailValidator(), [i18n.language]);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSentMessage, setEmailSentMessage] = useState<string | null>(null);

  const closeSendResetPasswordLinkDialog = () =>
    (
      document.getElementById(
        'sendResetPasswordLinkDialog'
      ) as HTMLDialogElement | null
    )?.close();

  const onPressCloseButton = () => {
    clearErrors();
    setEmailError(null);
    closeSendResetPasswordLinkDialog();
  };

  const handleSendEmail = async (formData: EmailSchema) => {
    clearErrors();
    setEmailError(null);
    const { error } = await sendResetPasswordLink(formData.email);
    if (error) {
      setEmailError(t('unable_to_send_email'));
    } else {
      setEmailSentMessage(t('email_sent'));
      setTimeout(() => {
        setEmailSentMessage(null);
        closeSendResetPasswordLinkDialog();
      }, 3000);
    }
  };

  const handleSendEmailFailure = (formErrors: FieldErrors<EmailSchema>) => {
    setEmailError(formErrors.email?.message ?? null);
  };

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { isSubmitting }
  } = useForm<EmailSchema>({
    resolver: zodResolver(emailValidator)
  });

  return (
    <>
      <dialog id="sendResetPasswordLinkDialog" className="modal">
        <div className="modal-box w-md bg-white">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute top-2 right-2 bg-transparent text-black transition-colors duration-200 hover:border-[rgba(0,0,0,0.12)] hover:bg-[rgba(0,0,0,0.12)] hover:text-black"
              onClick={onPressCloseButton}
            >
              ✕
            </button>
          </form>
          {emailSentMessage ? (
            <div className="mt-6">
              <p className="text-green-500">{t('email_sent')}</p>
            </div>
          ) : (
            <>
              <div className="mt-6">
                <h3 className="text-md font-bold">
                  {t('reset_password_link_dialog_title')}
                </h3>
                <div className={`pt-6${emailError ? 'pb-2' : ''}`}>
                  <span className="px-1 text-sm text-gray-600">
                    {t('email')}
                  </span>
                  <input
                    type="email"
                    {...register('email')}
                    className="text-md block w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 shadow-md focus:border-[#4181fa] focus:bg-white focus:outline-none"
                  />
                </div>
                {emailError && (
                  <div className="py-2">
                    <ul className="list-inside list-disc">
                      <li className="text-sm text-red-600">{emailError}</li>
                    </ul>
                  </div>
                )}
              </div>
              <div className="modal-action">
                <button
                  className="btn btn-sm border-[#4181fa] bg-[#4181fa] text-white transition-all duration-300 ease-in-out hover:scale-95 hover:shadow-sm"
                  disabled={isSubmitting}
                  onClick={handleSubmit(
                    handleSendEmail,
                    handleSendEmailFailure
                  )}
                >
                  <MdOutlineEmail /> {t('send')}
                </button>
              </div>
            </>
          )}
        </div>
      </dialog>
    </>
  );
}
