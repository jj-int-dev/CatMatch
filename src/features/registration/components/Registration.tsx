import catLogo from '../../../assets/cat_logo.png';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type FieldErrors } from 'react-hook-form';
import {
  createRegistrationFormValidator,
  type RegistrationFormSchema
} from '../validators/registrationFormValidator';
import { useAuthStore } from '../../../stores/auth-store';
import { useState, useMemo, type MouseEvent } from 'react';
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

  const [showErrorToast, setShowErrorToast] = useState(false);
  const [formValidationErrors, setFormValidationErrors] = useState<string[]>(
    []
  );

  // Recreate the schema whenever the language changes so that error messages are in the correct language
  const formSchema = useMemo(
    () => createRegistrationFormValidator(),
    [i18n.language]
  );

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { isSubmitting },
    reset
  } = useForm<RegistrationFormSchema>({
    resolver: zodResolver(formSchema)
  });

  const goToUserProfile = (userId: string) =>
    navigate(`/user-profile/${userId}`);

  const goToLoginPage = () => navigate('/login');

  const onEmailPasswordRegistration = async (
    formData: RegistrationFormSchema
  ) => {
    const { error, data } = await registerNewUserWithEmailAndPassword(
      formData.email,
      formData.password
    );

    const user = data?.user;
    const userSession = data?.session;
    const errorMessage = error?.message;

    if (errorMessage) {
      setFormValidationErrors([errorMessage]);
      setShowErrorToast(true);
    } else if (
      !isAuthenticatedUser(user) &&
      !isAuthenticatedUserSession(userSession)
    ) {
      setFormValidationErrors([t('no_authenticated_user_found')]);
      setShowErrorToast(true);
    } else {
      reset();
      setShowErrorToast(false);
      setFormValidationErrors([]);

      if (isAuthenticatedUserSession(userSession)) {
        goToUserProfile(userSession!.user.id);
      } else if (isAuthenticatedUser(user)) {
        // user hasn't confirmed email yet
        goToLoginPage();
      }
    }
  };

  const onRegistrationFailure = (
    formErrors: FieldErrors<RegistrationFormSchema>
  ) => {
    const errorMsgs: string[] = [];

    if (formErrors.email?.message != null) {
      errorMsgs.push(formErrors.email.message);
    }
    if (formErrors.password?.message != null) {
      const passwordErrors = formErrors.password.message.split('\n');
      errorMsgs.push(...passwordErrors);
    }
    if (formErrors.confirmPassword?.message != null) {
      errorMsgs.push(formErrors.confirmPassword.message);
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

  return (
    <>
      <div className="bg-main-background h-screen bg-cover pt-7">
        {showErrorToast && (
          <ErrorToast
            messages={formValidationErrors}
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
            <form>
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
                    onClick={handleSubmit(
                      onEmailPasswordRegistration,
                      onRegistrationFailure
                    )}
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
                    type="submit"
                    onClick={onFacebookLogin}
                    className="flex w-full justify-center gap-x-3 rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    <FaFacebook className="size-4 self-center" />
                    {t('log_in_with_facebook')}
                  </button>
                </div>

                <div>
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    onClick={onGoogleLogin}
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
