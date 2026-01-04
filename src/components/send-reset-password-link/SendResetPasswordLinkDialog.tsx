import { MdOutlineEmail } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useMemo, useState, useEffect } from 'react';
import {
  createEmailValidator,
  type EmailSchema
} from './validators/emailValidator';
import i18n from '../../utils/i18n';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../../stores/auth-store';
import { useSendResetPasswordLinkStore } from './stores/send-reset-password-link-store';

export function SendResetPasswordLinkDialog() {
  const { t } = useTranslation();
  const sendResetPasswordLink = useAuthStore(
    (state) => state.sendResetPasswordLink
  );
  const {
    showSendResetPasswordLinkDialog,
    setShowSendResetPasswordLinkDialog
  } = useSendResetPasswordLinkStore();

  const emailValidator = useMemo(() => createEmailValidator(), [i18n.language]);

  const [emailSentMessage, setEmailSentMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const closeDialog = () => {
    setShowSendResetPasswordLinkDialog(false);
  };

  const {
    register,
    handleSubmit,
    clearErrors,
    reset,
    formState: { isSubmitting, errors }
  } = useForm<EmailSchema>({
    resolver: zodResolver(emailValidator)
  });

  // Reset form state when dialog opens/closes
  useEffect(() => {
    if (!showSendResetPasswordLinkDialog) {
      reset();
      clearErrors();
      setEmailSentMessage(null);
      setIsSuccess(false);
    }
  }, [showSendResetPasswordLinkDialog, reset, clearErrors]);

  // Auto-close after success
  useEffect(() => {
    if (isSuccess && emailSentMessage) {
      const timer = setTimeout(() => {
        closeDialog();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, emailSentMessage]);

  const handleSendEmail = async (formData: EmailSchema) => {
    clearErrors();
    setEmailSentMessage(null);
    setIsSuccess(false);
    const { error } = await sendResetPasswordLink(formData.email);
    if (error) {
      // Error is displayed via form error
      // We can set a generic error on the email field
      // but the validator already catches invalid email; Supabase error is generic.
      // We'll set a form-level error using setError
      // For simplicity, we can set a message in emailSentMessage (but it's error)
      setEmailSentMessage(t('unable_to_send_email'));
    } else {
      setEmailSentMessage(t('email_sent'));
      setIsSuccess(true);
      reset();
    }
  };

  const handleSendEmailFailure = () => {
    // Errors are already available in `errors` object
    // No need to set separate state
  };

  if (!showSendResetPasswordLinkDialog) return null;

  return (
    <dialog open={showSendResetPasswordLinkDialog} className="modal">
      <div className="modal-box w-md bg-white">
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute top-2 right-2 bg-transparent text-black transition-colors duration-200 hover:border-[rgba(0,0,0,0.12)] hover:bg-[rgba(0,0,0,0.12)] hover:text-black"
            onClick={closeDialog}
          >
            ✕
          </button>
        </form>
        {emailSentMessage ? (
          <div className="mt-6">
            <p className={isSuccess ? 'text-green-500' : 'text-red-600'}>
              {emailSentMessage}
            </p>
          </div>
        ) : (
          <>
            <div className="mt-6">
              <h3 className="text-md font-bold">
                {t('reset_password_link_dialog_title')}
              </h3>
              <div className="pt-6">
                <span className="px-1 text-sm text-gray-600">{t('email')}</span>
                <input
                  type="email"
                  {...register('email')}
                  className="text-md block w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 shadow-md focus:border-[#4181fa] focus:bg-white focus:outline-none"
                />
                {errors.email && (
                  <div className="mt-2">
                    <ul className="list-inside list-disc">
                      <li className="text-sm text-red-600">
                        {errors.email.message}
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-action">
              <button
                className="btn btn-sm border-[#4181fa] bg-[#4181fa] text-white transition-all duration-300 ease-in-out hover:scale-95 hover:shadow-sm"
                disabled={isSubmitting}
                onClick={handleSubmit(handleSendEmail, handleSendEmailFailure)}
              >
                <MdOutlineEmail /> {t('send')}
              </button>
            </div>
          </>
        )}
      </div>
      {/* Backdrop click closes dialog */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={closeDialog}>close</button>
      </form>
    </dialog>
  );
}
