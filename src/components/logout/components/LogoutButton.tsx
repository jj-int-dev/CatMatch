import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

type LogoutButtonComponentProps = {
  onLogout?: (() => void) | (() => Promise<void>);
};

export function LogoutButton({ onLogout }: LogoutButtonComponentProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const LOGOUT_MODAL_ID = 'logout-modal';

  const showConfirmationModal = () => {
    const modal = document?.getElementById(
      LOGOUT_MODAL_ID
    ) as HTMLDialogElement | null;

    if (modal && !modal.open) modal.showModal();
  };

  const closeModal = () =>
    (
      document?.getElementById(LOGOUT_MODAL_ID) as HTMLDialogElement | null
    )?.close();

  const handleLogout = () => {
    closeModal();
    if (onLogout) {
      Promise.resolve(onLogout()).then(() => {
        navigate('/login');
      });
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <button
        onClick={showConfirmationModal}
        className="m-0 rounded-lg bg-white p-4 font-sans text-[15px] leading-[100%] font-semibold text-[#7289DA] shadow-lg transition-shadow duration-100 ease-out hover:bg-indigo-900 hover:text-white active:shadow-sm"
      >
        {t('sign_out')}
      </button>
      <dialog id={LOGOUT_MODAL_ID} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">
            Are you sure you want to log out?
          </h3>
          <div className="modal-action">
            <button onClick={handleLogout}>Yes</button>
            <button onClick={closeModal}>No</button>
          </div>
        </div>
      </dialog>
    </>
  );
}
