import catLogo from '../../../assets/cat_logo.png';
import { useState, useMemo, type MouseEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import { useAuthStore } from '../../../stores/auth-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type FieldErrors } from 'react-hook-form';
import {
  createLoginFormValidator,
  type LoginFormSchema
} from '../validators/login-form-validator';
import ErrorToast from '../../../components/toasts/ErrorToast';
import WarningToast from '../../../components/toasts/WarningToast';

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

  const [showErrorToast, setShowErrorToast] = useState(false);
  const [formValidationErrors, setFormValidationErrors] = useState<string[]>(
    []
  );
  const [showVerifyEmailToast, setShowVerifyEmailToast] = useState(false);

  // Recreate the schema whenever the language changes so that error messages are in the correct language
  const formSchema = useMemo(() => createLoginFormValidator(), [i18n.language]);

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { isSubmitting },
    reset
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(formSchema)
  });

  const goToUserProfile = (userId: string) =>
    navigate(`/user-profile/${userId}`);

  const onEmailPasswordLogin = async (formData: LoginFormSchema) => {
    const { error, data } = await logUserInWithEmailAndPassword(
      formData.email,
      formData.password
    );
    console.log('Login data:', data);
    console.log('Login error:', error);
    const userSession = data?.session;
    const errorMessage = error?.message;

    if (errorMessage === 'Email not confirmed') {
      setShowVerifyEmailToast(true);
    } else if (errorMessage) {
      setFormValidationErrors([errorMessage]);
      setShowErrorToast(true);
    } else if (!isAuthenticatedUserSession(userSession)) {
      setFormValidationErrors([t('no_authenticated_user_found')]);
      setShowErrorToast(true);
    } else {
      reset();
      onCloseWarningToast();
      setShowErrorToast(false);
      setFormValidationErrors([]);
      goToUserProfile(userSession!.user.id);
    }
  };

  const onLoginFailure = (formErrors: FieldErrors<LoginFormSchema>) => {
    const errorMsgs: string[] = [];

    if (formErrors.email?.message != null) {
      errorMsgs.push(formErrors.email.message);
    }
    if (formErrors.password?.message != null) {
      const passwordErrors = formErrors.password.message.split('\n');
      errorMsgs.push(...passwordErrors);
    }

    setFormValidationErrors(errorMsgs);
    setShowErrorToast(errorMsgs.length > 0);
  };

  const onFacebookLogin = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await logUserInWithFacebook();
  };

  const onGoogleLogin = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await logUserInWithGoogle();
  };

  const onCloseErrorToast = () => {
    clearErrors();
    setShowErrorToast(false);
    setFormValidationErrors([]);
  };

  const onCloseWarningToast = () => setShowVerifyEmailToast(false);

  return (
    <>
      <div className="bg-main-background h-screen bg-cover pt-7">
        {showErrorToast && (
          <ErrorToast
            messages={formValidationErrors}
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
            <form action="#" method="POST">
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
                      <Link
                        to="/forgot-password"
                        className="text-sm/6 text-white hover:font-bold hover:text-indigo-700"
                      >
                        {t('forgot_password')}
                      </Link>
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
                    onClick={handleSubmit(onEmailPasswordLogin, onLoginFailure)}
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    {t('sign_in')}
                  </button>
                </div>
                <p className="text-center">{t('or')}</p>
              </div>

              <div className="mt-3 space-y-2">
                <div>
                  <button
                    disabled={isSubmitting}
                    onClick={onFacebookLogin}
                    type="submit"
                    className="flex w-full justify-center gap-x-3 rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    <FaFacebook className="size-4 self-center" />
                    {t('log_in_with_facebook')}
                  </button>
                </div>

                <div>
                  <button
                    disabled={isSubmitting}
                    onClick={onGoogleLogin}
                    type="submit"
                    className="flex w-full justify-center gap-x-3 rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    <FaGoogle className="ml-[-15px] size-4 self-center" />
                    {t('log_in_with_google')}
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
