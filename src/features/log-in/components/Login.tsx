import catLogo from '../../../assets/cat_logo.webp';
import { useState, useMemo, type MouseEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import { useAuthStore } from '../../../stores/auth-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  createLoginFormValidator,
  type LoginFormSchema
} from '../validators/login-form-validator';
import ErrorToast from '../../../components/toasts/ErrorToast';
import WarningToast from '../../../components/toasts/WarningToast';
import { useSendResetPasswordLinkStore } from '../../../components/send-reset-password-link/stores/send-reset-password-link-store';

export default function Login() {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const isAuthenticatedUserSession = useAuthStore(
    (state) => state.isAuthenticatedUserSession
  );
  const logUserInWithEmailAndPassword = useAuthStore(
    (state) => state.logUserInWithEmailAndPassword
  );
  const logUserInWithFacebook = useAuthStore(
    (state) => state.logUserInWithFacebook
  );
  const logUserInWithGoogle = useAuthStore(
    (state) => state.logUserInWithGoogle
  );

  const [serverError, setServerError] = useState<string | null>(null);
  const [showVerifyEmailToast, setShowVerifyEmailToast] = useState(false);
  const [isThirdPartyLoading, setIsThirdPartyLoading] = useState(false);

  // Recreate the schema whenever the language changes so that error messages are in the correct language
  const formSchema = useMemo(() => createLoginFormValidator(), [i18n.language]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    clearErrors
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(formSchema)
  });

  const goToUserProfile = () => navigate(`/user-profile`);

  // Handle cleanup to prevent race conditions
  useEffect(() => {
    return () => {
      // Cleanup function to prevent state updates on unmounted component
    };
  }, []);

  const onEmailPasswordLogin = async (formData: LoginFormSchema) => {
    // Clear previous errors
    setServerError(null);
    clearErrors();

    const { error, data } = await logUserInWithEmailAndPassword(
      formData.email,
      formData.password
    );
    const userSession = data?.session;
    const errorMessage = error?.message;

    if (errorMessage === 'Email not confirmed') {
      setShowVerifyEmailToast(true);
    } else if (errorMessage) {
      setServerError(errorMessage);
    } else if (!isAuthenticatedUserSession(userSession)) {
      setServerError(t('no_authenticated_user_found'));
    } else {
      // Clear form and all state before navigation
      reset();
      setShowVerifyEmailToast(false);
      setServerError(null);
      goToUserProfile();
    }
  };

  const onFacebookLogin = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsThirdPartyLoading(true);
    try {
      await logUserInWithFacebook();
    } finally {
      setIsThirdPartyLoading(false);
    }
  };

  const onGoogleLogin = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsThirdPartyLoading(true);
    try {
      await logUserInWithGoogle();
    } finally {
      setIsThirdPartyLoading(false);
    }
  };

  const onCloseErrorToast = () => {
    setServerError(null);
    clearErrors();
  };

  const onCloseWarningToast = () => setShowVerifyEmailToast(false);

  const { setShowSendResetPasswordLinkDialog } =
    useSendResetPasswordLinkStore();

  const handleForgotPassword = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowSendResetPasswordLinkDialog(true);
  };

  // Get error messages from form state
  const formErrorMessages = Object.values(errors)
    .filter((error) => error?.message)
    .map((error) => error.message as string);

  // Combine form errors and server errors
  const allErrorMessages = [...formErrorMessages];
  if (serverError) {
    allErrorMessages.push(serverError);
  }

  return (
    <>
      <div className="bg-main-background h-screen bg-cover pt-7">
        {allErrorMessages.length > 0 && (
          <ErrorToast
            messages={allErrorMessages}
            onCloseToast={onCloseErrorToast}
          />
        )}
        {showVerifyEmailToast && (
          <WarningToast
            messages={[t('verify_email')]}
            onCloseToast={onCloseWarningToast}
          />
        )}
        <div className="flex flex-col justify-center px-6">
          <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              alt="CatMatch"
              src={catLogo}
              className="m-auto h-[120px] w-auto"
            />
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-black">
              {t('log_in_to_your_account')}
            </h2>
          </div>

          <div className="mt-10 rounded-xl bg-[#7289DA] p-8 shadow-2xl sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSubmit(onEmailPasswordLogin)}>
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm/6 font-medium text-black"
                  >
                    {t('email_address')}
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      {...register('email')}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm/6 font-medium text-black"
                    >
                      {t('password')}
                    </label>
                    <div className="text-sm">
                      <button
                        onClick={handleForgotPassword}
                        className="text-sm/6 text-white hover:font-bold hover:text-indigo-700"
                      >
                        {t('forgot_password')}
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <input
                      id="password"
                      type="password"
                      {...register('password')}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                    />
                  </div>
                </div>
              </div>

              <p className="mt-2 text-end text-sm/6 text-white">
                {t('not_a_member')}{' '}
                <Link
                  to="/register"
                  className="font-semibold text-indigo-900 hover:font-bold hover:text-indigo-700"
                >
                  {t('register')}
                </Link>
              </p>

              <div className="mt-4 space-y-2">
                <div>
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    {t(isSubmitting ? 'signing_in' : 'sign_in')}
                  </button>
                </div>
                <p className="text-center">{t('or')}</p>
              </div>

              <div className="mt-3 space-y-2">
                <div>
                  <button
                    disabled={isThirdPartyLoading}
                    onClick={onFacebookLogin}
                    type="button"
                    className="flex w-full justify-center gap-x-3 rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    <FaFacebook className="size-4 self-center" />
                    {t(
                      isThirdPartyLoading
                        ? 'signing_in'
                        : 'log_in_with_facebook'
                    )}
                  </button>
                </div>

                <div>
                  <button
                    disabled={isThirdPartyLoading}
                    onClick={onGoogleLogin}
                    type="button"
                    className="flex w-full justify-center gap-x-3 rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    <FaGoogle className="ml-[-15px] size-4 self-center" />
                    {t(
                      isThirdPartyLoading ? 'signing_in' : 'log_in_with_google'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
