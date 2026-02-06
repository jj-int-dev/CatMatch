import catLogo from '../../../assets/cat_logo.webp';
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
import { HiEye, HiEyeOff } from 'react-icons/hi';

export default function ResetPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);
  const userSession = useAuthStore((state) => state.session);
  const isAuthenticatedUserSession = useAuthStore(
    (state) => state.isAuthenticatedUserSession
  );
  const updateUserPassword = useAuthStore((state) => state.updateUserPassword);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [formValidationErrors, setFormValidationErrors] = useState<string[]>(
    []
  );
  const [passwordChangedMessage, setPasswordChangedMessage] = useState<
    string | null
  >(null);

  const goToLoginPage = () => navigate('/login', { replace: true });
  const goToUserProfile = () => navigate(`/user-profile`);

  useEffect(() => {
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
        goToUserProfile();
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
      <div className="from-base-100 to-base-200 flex min-h-screen items-center justify-center bg-gradient-to-br px-4 py-12">
        {showErrorToast && (
          <ErrorToast
            messages={formValidationErrors}
            onCloseToast={onCloseErrorToast}
          />
        )}
        {passwordChangedMessage && (
          <SuccessToast messages={[passwordChangedMessage]} />
        )}

        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="mb-8 text-center">
            <img
              alt="CatMatch"
              src={catLogo}
              className="mx-auto mb-6 h-24 w-auto"
            />
            <h2 className="text-base-content text-3xl font-bold">
              {t('reset_your_password')}
            </h2>
            <p className="text-base-content/70 mt-2">
              {t(
                'reset_password_desc',
                'Enter your new password below to secure your account'
              )}
            </p>
          </div>

          {/* Form Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <form
                onSubmit={handleSubmit(
                  handlePasswordChange,
                  handlePasswordChangeFailure
                )}
              >
                <div className="space-y-4">
                  {/* New Password Field */}
                  <div className="form-control">
                    <label htmlFor="newPassword" className="label">
                      <span className="label-text font-medium">
                        {t('enter_new_password')}
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        id="newPassword"
                        {...register('newPassword')}
                        type={showPassword ? 'text' : 'password'}
                        className="input input-bordered w-full pr-10"
                        placeholder={t('enter_password', 'Enter password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="btn btn-ghost btn-sm absolute top-0 right-0 h-full px-3"
                      >
                        {showPassword ? (
                          <HiEyeOff className="size-5" />
                        ) : (
                          <HiEye className="size-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="form-control">
                    <label htmlFor="confirmPassword" className="label">
                      <span className="label-text font-medium">
                        {t('confirm_new_password')}
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        {...register('confirmPassword')}
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="input input-bordered w-full pr-10"
                        placeholder={t('confirm_password', 'Confirm password')}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="btn btn-ghost btn-sm absolute top-0 right-0 h-full px-3"
                      >
                        {showConfirmPassword ? (
                          <HiEyeOff className="size-5" />
                        ) : (
                          <HiEye className="size-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary w-full shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        {t('saving', 'Saving...')}
                      </>
                    ) : (
                      t('save')
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Back to Profile Link */}
          <div className="mt-6 text-center">
            <button
              onClick={goToUserProfile}
              className="link link-primary text-sm"
            >
              {t('back_to_profile', '← Back to Profile')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
