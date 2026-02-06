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
      <div className="modal-box bg-base-100 relative w-full max-w-md p-0 shadow-2xl sm:max-w-lg">
        {/* Close Button */}
        <form method="dialog">
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="btn btn-circle btn-ghost btn-sm absolute top-3 right-3 disabled:opacity-50"
            aria-label={t('close')}
          >
            ✕
          </button>
        </form>

        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="bg-error/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <FaRegTrashAlt className="text-error h-8 w-8" />
            </div>
            <h3
              id="delete-dialog-title"
              className="text-base-content mb-2 text-2xl font-bold"
            >
              {t('delete_animal_dialog_title')}
            </h3>
          </div>

          {/* Animal Info Card */}
          <div className="alert mb-4 shadow-md">
            <div className="flex items-center gap-3">
              <img
                src={animal.photoUrl || defaultCatPic}
                alt={animal.name}
                className="h-16 w-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="text-base-content font-semibold">{animal.name}</p>
                <p className="text-base-content/70 text-sm">
                  {animal.gender} • {animal.ageDisplay} •{' '}
                  {animal.addressDisplay}
                </p>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          <p
            id="delete-dialog-description"
            className="text-base-content/80 mb-6"
          >
            {t('delete_animal_dialog_content_1')}{' '}
            <strong className="text-base-content font-semibold">
              {animal.name}
            </strong>{' '}
            {t('delete_animal_dialog_content_2')}
          </p>

          {/* Deleting State */}
          {isDeleting ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-4">
              <div className="relative">
                <div className="border-base-300 border-t-primary h-16 w-16 animate-spin rounded-full border-4"></div>
                <div className="text-base-content absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <FaRegTrashAlt className="h-6 w-6" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-base-content mb-1 font-medium">
                  {t('deleting_animal_1')}
                </p>
                <p className="text-base-content/70 text-sm">
                  {t('deleting_animal_2')}
                </p>
              </div>
              <progress className="progress progress-primary w-full"></progress>
            </div>
          ) : (
            /* Action Buttons */
            <div className="flex flex-col gap-3 sm:flex-row">
              <button onClick={handleClose} className="btn btn-outline flex-1">
                {t('delete_animal_dialog_cancel')}
              </button>
              <button
                onClick={onConfirm}
                className="btn btn-error flex-1 text-white"
              >
                <FaRegTrashAlt />
                {t('delete_animal_dialog_confirm')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop */}
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
