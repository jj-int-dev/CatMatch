import catLogo from '../../../assets/cat_logo.webp';
import { useState, useMemo, type MouseEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { FaFacebook, FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
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
  const [showPassword, setShowPassword] = useState(false);

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

  useEffect(() => {
    return () => {
      // Cleanup function to prevent state updates on unmounted component
    };
  }, []);

  const onEmailPasswordLogin = async (formData: LoginFormSchema) => {
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

  const formErrorMessages = Object.values(errors)
    .filter((error) => error?.message)
    .map((error) => error.message as string);

  const allErrorMessages = [...formErrorMessages];
  if (serverError) {
    allErrorMessages.push(serverError);
  }

  return (
    <div className="from-base-200 to-base-300 min-h-screen bg-gradient-to-br px-6 py-12">
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

      <div className="mx-auto flex max-w-md flex-col items-center">
        {/* Logo */}
        <img
          alt="CatMatch"
          src={catLogo}
          className="h-28 w-auto drop-shadow-lg sm:h-32"
        />

        {/* Heading */}
        <h1 className="text-base-content mt-8 text-center text-3xl font-bold sm:text-4xl">
          {t('log_in_to_your_account')}
        </h1>
        <p className="text-base-content/70 mt-2 text-center">
          {t('welcome_back_login_subtitle')}
        </p>

        {/* Login Card */}
        <div className="card bg-base-100 mt-8 w-full shadow-2xl">
          <div className="card-body">
            <form onSubmit={handleSubmit(onEmailPasswordLogin)}>
              <div className="space-y-4">
                {/* Email Field */}
                <div className="form-control">
                  <label htmlFor="email" className="label">
                    <span className="label-text font-medium">
                      {t('email_address')}
                    </span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...register('email')}
                    className="input input-bordered focus:input-primary w-full"
                    placeholder={t('enter_your_email')}
                  />
                </div>

                {/* Password Field */}
                <div className="form-control">
                  <label htmlFor="password" className="label">
                    <span className="label-text font-medium">
                      {t('password')}
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      {...register('password')}
                      className="input input-bordered focus:input-primary w-full pr-10"
                      placeholder={t('enter_your_password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-base-content/60 hover:text-base-content absolute top-1/2 right-3 -translate-y-1/2"
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showPassword ? (
                        <FaEyeSlash className="h-5 w-5" />
                      ) : (
                        <FaEye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <label className="label">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="link-hover link label-text-alt text-primary"
                    >
                      {t('forgot_password')}
                    </button>
                  </label>
                </div>

                {/* Sign In Button */}
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="btn btn-primary w-full"
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      {t('signing_in')}
                    </>
                  ) : (
                    t('sign_in')
                  )}
                </button>

                {/* Divider */}
                <div className="divider text-base-content/60 text-sm">
                  {t('or')}
                </div>

                {/* Social Login Buttons */}
                <div className="space-y-3">
                  <button
                    disabled={isThirdPartyLoading}
                    onClick={onFacebookLogin}
                    type="button"
                    className="btn btn-outline btn-secondary w-full"
                  >
                    <FaFacebook className="h-5 w-5" />
                    {t('log_in_with_facebook')}
                  </button>

                  <button
                    disabled={isThirdPartyLoading}
                    onClick={onGoogleLogin}
                    type="button"
                    className="btn btn-outline btn-accent w-full"
                  >
                    <FaGoogle className="h-5 w-5" />
                    {t('log_in_with_google')}
                  </button>
                </div>
              </div>
            </form>

            {/* Register Link */}
            <div className="divider"></div>
            <p className="text-base-content/70 text-center text-sm">
              {t('not_a_member')}{' '}
              <Link
                to="/register"
                className="link-hover link text-primary font-semibold"
              >
                {t('register')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
