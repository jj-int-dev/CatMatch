import catLogo from '../../../assets/cat_logo.webp';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { FaFacebook, FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  createRegistrationFormValidator,
  type RegistrationFormSchema
} from '../validators/registrationFormValidator';
import { useAuthStore } from '../../../stores/auth-store';
import { useState, useMemo, type MouseEvent, useEffect } from 'react';
import ErrorToast from '../../../components/toasts/ErrorToast';

export default function Registration() {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const registerNewUserWithEmailAndPassword = useAuthStore(
    (state) => state.registerNewUserWithEmailAndPassword
  );
  const isAuthenticatedUser = useAuthStore(
    (state) => state.isAuthenticatedUser
  );
  const isAuthenticatedUserSession = useAuthStore(
    (state) => state.isAuthenticatedUserSession
  );
  const logUserInWithFacebook = useAuthStore(
    (state) => state.logUserInWithFacebook
  );
  const logUserInWithGoogle = useAuthStore(
    (state) => state.logUserInWithGoogle
  );

  const [serverError, setServerError] = useState<string | null>(null);
  const [isThirdPartyLoading, setIsThirdPartyLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formSchema = useMemo(
    () => createRegistrationFormValidator(),
    [i18n.language]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    clearErrors
  } = useForm<RegistrationFormSchema>({
    resolver: zodResolver(formSchema)
  });

  const goToUserProfile = () => navigate(`/user-profile`);
  const goToLoginPage = () => navigate('/login');

  useEffect(() => {
    return () => {
      // Cleanup function to prevent state updates on unmounted component
    };
  }, []);

  const onEmailPasswordRegistration = async (
    formData: RegistrationFormSchema
  ) => {
    setServerError(null);
    clearErrors();

    const { error, data } = await registerNewUserWithEmailAndPassword(
      formData.email,
      formData.password
    );

    const user = data?.user;
    const userSession = data?.session;
    const errorMessage = error?.message;

    if (errorMessage) {
      setServerError(errorMessage);
    } else if (
      !isAuthenticatedUser(user) &&
      !isAuthenticatedUserSession(userSession)
    ) {
      setServerError(t('no_authenticated_user_found'));
    } else {
      reset();
      setServerError(null);

      if (isAuthenticatedUserSession(userSession)) {
        goToUserProfile();
      } else if (isAuthenticatedUser(user)) {
        goToLoginPage();
      }
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

      <div className="mx-auto flex max-w-md flex-col items-center">
        {/* Logo */}
        <img
          alt="CatMatch"
          src={catLogo}
          className="h-28 w-auto drop-shadow-lg sm:h-32"
        />

        {/* Heading */}
        <h1 className="text-base-content mt-8 text-center text-3xl font-bold sm:text-4xl">
          {t('create_your_account')}
        </h1>
        <p className="text-base-content/70 mt-2 text-center">
          {t('join_catmatch_subtitle')}
        </p>

        {/* Registration Card */}
        <div className="card bg-base-100 mt-8 w-full shadow-2xl">
          <div className="card-body">
            <form onSubmit={handleSubmit(onEmailPasswordRegistration)}>
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
                      autoComplete="new-password"
                      {...register('password')}
                      className="input input-bordered focus:input-primary w-full pr-10"
                      placeholder={t('create_password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-base-content/60 hover:text-base-content absolute top-1/2 right-3 z-10 -translate-y-1/2"
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
                </div>

                {/* Confirm Password Field */}
                <div className="form-control">
                  <label htmlFor="confirmPassword" className="label">
                    <span className="label-text font-medium">
                      {t('confirm_password')}
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      {...register('confirmPassword')}
                      className="input input-bordered focus:input-primary w-full pr-10"
                      placeholder={t('confirm_your_password')}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="text-base-content/60 hover:text-base-content absolute top-1/2 right-3 z-10 -translate-y-1/2"
                      aria-label={
                        showConfirmPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash className="h-5 w-5" />
                      ) : (
                        <FaEye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Sign Up Button */}
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="btn btn-primary w-full"
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      {t('creating_account')}
                    </>
                  ) : (
                    t('sign_up')
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
                    {t('sign_up_with_facebook')}
                  </button>

                  <button
                    disabled={isThirdPartyLoading}
                    onClick={onGoogleLogin}
                    type="button"
                    className="btn btn-outline btn-accent w-full"
                  >
                    <FaGoogle className="h-5 w-5" />
                    {t('sign_up_with_google')}
                  </button>
                </div>
              </div>
            </form>

            {/* Login Link */}
            <div className="divider"></div>
            <p className="text-base-content/70 text-center text-sm">
              {t('already_a_member')}{' '}
              <Link
                to="/login"
                className="link-hover link text-primary font-semibold"
              >
                {t('login')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
