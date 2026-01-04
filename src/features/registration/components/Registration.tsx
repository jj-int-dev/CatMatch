import catLogo from '../../../assets/cat_logo.webp';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
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

  // Recreate the schema whenever the language changes so that error messages are in the correct language
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

  // Handle cleanup to prevent race conditions
  useEffect(() => {
    return () => {
      // Cleanup function to prevent state updates on unmounted component
    };
  }, []);

  const onEmailPasswordRegistration = async (
    formData: RegistrationFormSchema
  ) => {
    // Clear previous errors
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
      // Clear form and all state before navigation
      reset();
      setServerError(null);

      if (isAuthenticatedUserSession(userSession)) {
        goToUserProfile();
      } else if (isAuthenticatedUser(user)) {
        // user hasn't confirmed email yet
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
        <div className="flex flex-col justify-center px-6">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              alt="CatMatch"
              src={catLogo}
              className="m-auto h-[120px] w-auto"
            />
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-black">
              {t('create_your_account')}
            </h2>
          </div>

          <div className="mt-10 rounded-xl bg-[#7289DA] p-8 shadow-2xl sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSubmit(onEmailPasswordRegistration)}>
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
                  </div>
                  <div className="mt-2">
                    <input
                      id="password"
                      type="password"
                      {...register('password')}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-700 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm/6 font-medium text-black"
                    >
                      {t('confirm_password')}
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      id="confirmPassword"
                      type="password"
                      {...register('confirmPassword')}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-700 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                    />
                  </div>
                </div>
              </div>

              <p className="mt-2 text-end text-sm/6 text-white">
                {t('already_a_member')}{' '}
                <Link
                  to="/login"
                  className="font-semibold text-indigo-900 hover:font-bold hover:text-indigo-700"
                >
                  {t('login')}
                </Link>
              </p>

              <div className="mt-4 space-y-2">
                <div>
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    {isSubmitting ? `${t('sign_in')}...` : t('sign_in')}
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
                    {isThirdPartyLoading
                      ? `${t('log_in_with_facebook')}...`
                      : t('log_in_with_facebook')}
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
                    {isThirdPartyLoading
                      ? `${t('log_in_with_google')}...`
                      : t('log_in_with_google')}
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
