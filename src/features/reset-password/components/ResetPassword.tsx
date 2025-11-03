import catLogo from '../../../assets/cat_logo.png';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '../../../stores/auth-store';
import {
  createNewPasswordValidator,
  type NewPasswordFormSchema
} from '../validators/newPasswordValidator';
import { useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import i18n from '../../../utils/i18n';
import ErrorToast from '../../../components/toasts/ErrorToast';
import SuccessToast from '../../../components/toasts/SuccessToast';

export default function ResetPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);
  const userSession = useAuthStore((state) => state.session);
  const isAuthenticatedUserSession = useAuthStore(
    (state) => state.isAuthenticatedUserSession
  );
  const updateUserPassword = useAuthStore((state) => state.updateUserPassword);

  const goToLoginPage = () => navigate('/login', { replace: true });

  const goToUserProfile = (userId: string) =>
    navigate(`/user-profile/${userId}`);

  const [showErrorToast, setShowErrorToast] = useState(false);
  const [formValidationErrors, setFormValidationErrors] = useState<string[]>(
    []
  );
  const [passwordChangedMessage, setPasswordChangedMessage] = useState<
    string | null
  >(null);

  useEffect(() => {
    // Only check authentication after session loading is complete
    if (!isLoadingSession && !isAuthenticatedUserSession(userSession)) {
      goToLoginPage();
    }
  }, [userSession, isLoadingSession]);

  const newPasswordValidator = useMemo(
    () => createNewPasswordValidator(),
    [i18n.language]
  );

  const handlePasswordChange = async (formData: NewPasswordFormSchema) => {
    clearErrors();
    setShowErrorToast(false);
    setFormValidationErrors([]);

    const { error } = await updateUserPassword(formData.newPassword);

    if (error) {
      setFormValidationErrors([t('password_change_failure')]);
      setShowErrorToast(true);
    } else {
      setPasswordChangedMessage(t('password_change_success'));
      setTimeout(() => {
        setPasswordChangedMessage(null);
        goToUserProfile(userSession!.user.id);
      }, 3000);
    }
  };

  const handlePasswordChangeFailure = (
    formErrors: FieldErrors<NewPasswordFormSchema>
  ) => {
    const errorMsgs: string[] = [];

    if (formErrors.newPassword?.message != null) {
      const passwordErrors = formErrors.newPassword.message.split('\n');
      errorMsgs.push(...passwordErrors);
    }
    if (formErrors.confirmPassword?.message != null) {
      errorMsgs.push(formErrors.confirmPassword.message);
    }

    setFormValidationErrors(errorMsgs);
    setShowErrorToast(errorMsgs.length > 0);
  };

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { isSubmitting }
  } = useForm<NewPasswordFormSchema>({
    resolver: zodResolver(newPasswordValidator)
  });

  const onCloseErrorToast = () => {
    clearErrors();
    setShowErrorToast(false);
    setFormValidationErrors([]);
  };

  return (
    <>
      <div className="bg-main-background h-screen bg-cover pt-25">
        {showErrorToast && (
          <ErrorToast
            messages={formValidationErrors}
            onCloseToast={onCloseErrorToast}
          />
        )}
        {passwordChangedMessage && (
          <SuccessToast messages={[passwordChangedMessage]} />
        )}
        <div className="flex flex-col justify-center px-6">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              alt="CatMatch"
              src={catLogo}
              className="m-auto h-[120px] w-auto"
            />
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-black">
              {t('reset_your_password')}
            </h2>
          </div>

          <div className="mt-10 rounded-xl bg-[#7289DA] p-8 shadow-2xl sm:mx-auto sm:w-full sm:max-w-sm">
            <form>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="newPassword"
                      className="block text-sm/6 font-medium text-black"
                    >
                      {t('enter_new_password')}
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      id="newPassword"
                      {...register('newPassword')}
                      type="password"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm/6 font-medium text-black"
                    >
                      {t('confirm_new_password')}
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      id="confirmPassword"
                      {...register('confirmPassword')}
                      type="password"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div>
                  <button
                    onClick={handleSubmit(
                      handlePasswordChange,
                      handlePasswordChangeFailure
                    )}
                    disabled={isSubmitting}
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    {t('save')}
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
