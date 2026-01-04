import { FaRegTrashAlt } from 'react-icons/fa';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import defaultCatPic from '../../../assets/default_cat.webp';

export type AnimalToDelete = {
  animalId: string;
  name: string;
  gender: string;
  ageDisplay: string;
  addressDisplay: string;
  description: string;
  photoUrl: string;
};

export type DeleteAnimalDialogProps = {
  animal: AnimalToDelete;
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

export function DeleteAnimalDialog({
  animal,
  isOpen,
  isDeleting,
  onClose,
  onConfirm
}: DeleteAnimalDialogProps) {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Open/close dialog based on isOpen prop
  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="modal modal-bottom sm:modal-middle backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
      onClose={handleClose}
    >
      <div className="modal-box relative w-full max-w-md bg-white p-0 shadow-2xl sm:max-w-lg">
        <form method="dialog">
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="btn btn-circle btn-ghost btn-sm absolute top-2 right-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </form>

        <div className="p-6">
          <div className="mb-4">
            <h3
              id="delete-dialog-title"
              className="text-xl font-bold text-gray-900"
            >
              {t('delete_animal_dialog_title')}
            </h3>
          </div>

          <div className="mb-4">
            <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3">
              <img
                src={animal.photoUrl || defaultCatPic}
                alt={animal.name}
                className="h-12 w-12 rounded-lg object-cover"
              />
              <div>
                <p className="font-medium text-gray-900">{animal.name}</p>
                <p className="text-sm text-gray-600">
                  {animal.gender} • {animal.ageDisplay} •{' '}
                  {animal.addressDisplay}
                </p>
              </div>
            </div>
          </div>

          <p id="delete-dialog-description" className="mb-6 text-gray-700">
            {t('delete_animal_dialog_content_1')}{' '}
            <strong className="font-semibold text-gray-900">
              {animal.name}
            </strong>{' '}
            {t('delete_animal_dialog_content_2')}
          </p>

          {isDeleting ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-4">
              <div className="relative">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <FaRegTrashAlt className="h-6 w-6 text-gray-700" />
                </div>
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-900">
                  {t('deleting_animal_1')}
                </p>
                <p className="text-sm text-gray-600">
                  {t('deleting_animal_2')}
                </p>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
                <div className="h-full w-full animate-[loading_2s_linear] bg-gradient-to-r from-blue-500 to-purple-500"></div>
              </div>
            </div>
          ) : (
            <div className="modal-action mt-0 flex flex-col gap-3 p-0 sm:flex-row sm:gap-3">
              <button
                onClick={handleClose}
                className="btn btn-outline flex-1 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
              >
                {t('delete_animal_dialog_cancel')}
              </button>
              <button
                onClick={onConfirm}
                className="btn flex-1 border-red-600 bg-red-600 text-white hover:border-red-700 hover:bg-red-700"
              >
                {t('delete_animal_dialog_confirm')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop - clicking will close the dialog via form method="dialog" */}
      <form method="dialog" className="modal-backdrop">
        <button
          disabled={isDeleting}
          aria-label={t('delete_animal_dialog_close_aria_label')}
        >
          close
        </button>
      </form>
    </dialog>
  );
}
