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
      setEmailSentMessage(t('unable_to_send_email'));
    } else {
      setEmailSentMessage(t('email_sent'));
      setIsSuccess(true);
      reset();
    }
  };

  const handleSendEmailFailure = () => {
    // Errors are already available in `errors` object
  };

  if (!showSendResetPasswordLinkDialog) return null;

  return (
    <dialog open={showSendResetPasswordLinkDialog} className="modal">
      <div className="modal-box bg-base-100 shadow-xl">
        {/* Close button */}
        <form method="dialog">
          <button
            className="btn btn-circle btn-ghost btn-sm absolute top-3 right-3"
            onClick={closeDialog}
            aria-label={t('close')}
          >
            ✕
          </button>
        </form>

        {emailSentMessage ? (
          // Success/Error message display
          <div className="flex flex-col items-center space-y-4 py-8">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-full ${
                isSuccess ? 'bg-success/20' : 'bg-error/20'
              }`}
            >
              {isSuccess ? (
                <svg
                  className="text-success h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="text-error h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </div>
            <p
              className={`text-center text-lg font-medium ${
                isSuccess ? 'text-success' : 'text-error'
              }`}
            >
              {emailSentMessage}
            </p>
            {isSuccess && (
              <p className="text-base-content/70 text-center text-sm">
                {t('check_email_for_reset_link')}
              </p>
            )}
          </div>
        ) : (
          // Form display
          <>
            <div className="mb-6">
              <h3 className="text-base-content mb-2 text-2xl font-bold">
                {t('reset_password_link_dialog_title')}
              </h3>
              <p className="text-base-content/70 text-sm">
                {t('reset_password_dialog_description')}
              </p>
            </div>

            <div className="space-y-4">
              <div className="form-control">
                <label htmlFor="email" className="label">
                  <span className="label-text font-medium">{t('email')}</span>
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  <MdOutlineEmail className="text-base-content/50 h-5 w-5" />
                  <input
                    type="email"
                    id="email"
                    {...register('email')}
                    className="grow"
                    placeholder={t('enter_your_email')}
                  />
                </label>
                {errors.email && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.email.message}
                    </span>
                  </label>
                )}
              </div>
            </div>

            <div className="modal-action">
              <button
                className="btn btn-primary w-full"
                disabled={isSubmitting}
                onClick={handleSubmit(handleSendEmail, handleSendEmailFailure)}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    {t('sending')}
                  </>
                ) : (
                  <>
                    <MdOutlineEmail className="h-5 w-5" />
                    {t('send')}
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Backdrop */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={closeDialog}>close</button>
      </form>
    </dialog>
  );
}
