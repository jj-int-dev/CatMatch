import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaRegEdit, FaRegTrashAlt, FaTimes } from 'react-icons/fa';

interface ActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  title?: string;
}

export default function ActionSheet({
  isOpen,
  onClose,
  onEdit,
  onDelete,
  title
}: ActionSheetProps) {
  const { t } = useTranslation();

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when action sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleEdit = () => {
    onEdit();
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Action Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 animate-[slide-up_0.3s_ease-out]">
        <div className="mx-auto max-w-md">
          {/* Card Container */}
          <div className="card bg-base-100 rounded-t-3xl shadow-2xl">
            {/* Header */}
            <div className="border-base-300 flex items-center justify-between border-b px-5 py-4">
              <h3 className="text-base-content text-lg font-semibold">
                {title || t('actions')}
              </h3>
              <button
                onClick={onClose}
                className="btn btn-circle btn-ghost btn-sm"
                aria-label={t('close')}
              >
                <FaTimes className="size-5" />
              </button>
            </div>

            {/* Action Items */}
            <div className="space-y-1 p-3">
              {/* Edit Action */}
              <button
                onClick={handleEdit}
                className="bg-base-100 hover:bg-info/10 flex w-full items-center gap-4 rounded-xl px-4 py-4 text-left transition-all duration-200 hover:shadow-sm active:scale-[0.98]"
              >
                <div className="bg-info/20 flex size-12 items-center justify-center rounded-full">
                  <FaRegEdit className="text-info size-5" />
                </div>
                <div className="flex-1">
                  <div className="text-base-content font-semibold">
                    {t('edit')}
                  </div>
                  <div className="text-base-content/70 text-sm">
                    {t('edit_animal_description')}
                  </div>
                </div>
              </button>

              {/* Delete Action */}
              <button
                onClick={handleDelete}
                className="bg-base-100 hover:bg-error/10 flex w-full items-center gap-4 rounded-xl px-4 py-4 text-left transition-all duration-200 hover:shadow-sm active:scale-[0.98]"
              >
                <div className="bg-error/20 flex size-12 items-center justify-center rounded-full">
                  <FaRegTrashAlt className="text-error size-5" />
                </div>
                <div className="flex-1">
                  <div className="text-base-content font-semibold">
                    {t('delete')}
                  </div>
                  <div className="text-base-content/70 text-sm">
                    {t('delete_animal_description')}
                  </div>
                </div>
              </button>
            </div>

            {/* Cancel Button */}
            <div className="border-base-300 border-t p-4">
              <button
                onClick={onClose}
                className="btn btn-block btn-ghost rounded-xl font-semibold"
              >
                {t('cancel')}
              </button>
            </div>

            {/* Safe area for iOS - theme aware */}
            <div className="bg-base-100 h-6" />
          </div>
        </div>
      </div>

      {/* Keyframe animation styles */}
      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
