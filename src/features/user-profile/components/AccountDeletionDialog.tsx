import { useTranslation } from 'react-i18next';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaExclamationTriangle } from 'react-icons/fa';
import { FaSpinner } from 'react-icons/fa';
import useDeleteUser from '../hooks/useDeleteUser';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../../stores/auth-store';

interface AccountDeletionDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccountDeletionDialog({
  isOpen,
  onClose
}: AccountDeletionDialogProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const clearSession = useAuthStore((state) => state.clearSession);
  const deleteUserMutation = useDeleteUser();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    setErrorMessage(null);
    try {
      // Delete user first while still authenticated
      await deleteUserMutation.mutateAsync();
      // Navigate to register page before clearing session to avoid redirect race condition from UserProfile
      navigate('/register', { replace: true });
      // Clear local session after navigation (user no longer exists in DB)
      clearSession();
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : t('delete_user_error');
      setErrorMessage(errorMsg);
    }
  };

  const handleClose = () => {
    setErrorMessage(null);
    deleteUserMutation.reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <dialog open={isOpen} className="modal">
      <div className="modal-box bg-base-100 max-w-md">
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute top-3 right-3"
            onClick={handleClose}
            type="button"
            disabled={deleteUserMutation.isPending}
          >
            ✕
          </button>
        </form>

        <div className="flex flex-col items-center py-4">
          {/* Warning icon */}
          <div className="bg-error/10 mb-6 flex h-20 w-20 items-center justify-center rounded-full">
            <FaExclamationTriangle className="text-error h-10 w-10" />
          </div>

          <h3 className="text-base-content mb-4 text-center text-2xl font-bold">
            {t('delete_account')}
          </h3>

          {deleteUserMutation.isPending ? (
            <div className="my-6 flex flex-col items-center">
              <FaSpinner className="text-primary mb-4 h-12 w-12 animate-spin" />
              <p className="text-base-content/80 text-center">
                {t(
                  'deleting_account_message',
                  'Your account is being deleted. This may take a moment...'
                )}
              </p>
            </div>
          ) : (
            <>
              <div className="alert alert-error mb-6">
                <FaExclamationTriangle className="size-5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold">
                    {t('delete_account_warning', 'This action is permanent!')}
                  </p>
                  <p className="text-base-content/80">
                    {t(
                      'delete_account_confirmation',
                      'Are you sure you want to delete your account? This action cannot be undone. All your data, including profile, photos, and conversations, will be permanently removed.'
                    )}
                  </p>
                </div>
              </div>

              {errorMessage && (
                <div className="alert alert-error mb-4 w-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-6 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm">{errorMessage}</span>
                </div>
              )}

              <div className="mt-6 flex w-full flex-col gap-3">
                <button
                  className="btn btn-error gap-2"
                  onClick={handleConfirmDelete}
                  type="button"
                  disabled={deleteUserMutation.isPending}
                >
                  <RiDeleteBin6Line className="size-5" />
                  {t('delete_account_confirm', 'Delete Account')}
                </button>

                <button
                  className="btn btn-ghost"
                  onClick={handleClose}
                  type="button"
                  disabled={deleteUserMutation.isPending}
                >
                  {t('cancel')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose} disabled={deleteUserMutation.isPending}>
          close
        </button>
      </form>
    </dialog>
  );
}
