import { useTranslation } from 'react-i18next';
import { useChangeUserTypeStore } from './stores/change-user-type-store';

export function ConfirmChangeUserTypeDialog() {
  const { t } = useTranslation();
  const {
    newUserType,
    showChangeUserTypeDialog,
    setNewUserType,
    setShowChangeUserTypeDialog
  } = useChangeUserTypeStore();

  const handleClose = () => {
    setShowChangeUserTypeDialog(false);
  };

  if (!showChangeUserTypeDialog) return null;

  return (
    <dialog open={showChangeUserTypeDialog} className="modal">
      <div className="modal-box bg-white">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button
            className="btn btn-sm btn-circle btn-ghost absolute top-2 right-2 bg-transparent text-black transition-colors duration-200 hover:border-[rgba(0,0,0,0.12)] hover:bg-[rgba(0,0,0,0.12)] hover:text-black"
            onClick={handleClose}
          >
            ✕
          </button>
        </form>
        <h3 className="text-lg font-bold">
          {t(`${newUserType!.toLowerCase()}_confirmation_title`)}
        </h3>
        <p className="py-4">
          {t(`${newUserType!.toLowerCase()}_confirmation_desc`)}
        </p>
        <div className="modal-action">
          <button
            className="btn btn-sm border-[#e53935] bg-[#e53935] text-white transition-all duration-300 ease-in-out hover:scale-95 hover:shadow-sm"
            onClick={handleClose}
          >
            {t('no')}
          </button>
          {/* TODO: on click, go through data deletion process, log user out & navigate to login page, display success banner on login page */}
          <button
            className="btn btn-sm border-[#36b37e] bg-[#36b37e] text-white transition-all duration-300 ease-in-out hover:scale-95 hover:shadow-sm"
            onClick={handleClose}
          >
            {t('yes')}
          </button>
        </div>
      </div>
    </dialog>
  );
}
