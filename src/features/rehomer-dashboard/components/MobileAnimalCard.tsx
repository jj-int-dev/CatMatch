import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaRegEdit, FaRegTrashAlt, FaEllipsisV, FaPaw } from 'react-icons/fa';
import { useSwipeGesture } from '../../../hooks/useSwipeGesture';
import ActionSheet from './ActionSheet';
import type { AnimalToDelete } from './DeleteAnimalDialog';
import defaultCatPic from '../../../assets/default_cat.webp';

interface MobileAnimalCardProps {
  animal: {
    animalId: string;
    name: string;
    gender: string;
    ageInWeeks: number;
    addressDisplayName: string;
    description: string;
    animalPhotos: Array<{ photoUrl: string; order: number }>;
  };
  onEdit: (animalId: string) => void;
  onDelete: (animal: AnimalToDelete) => void;
  getAgeDisplay: (ageInWeeks: number) => string;
  useActionSheet?: boolean;
}

export default function MobileAnimalCard({
  animal,
  onEdit,
  onDelete,
  getAgeDisplay,
  useActionSheet = false
}: MobileAnimalCardProps) {
  const { t } = useTranslation();
  const [showActions, setShowActions] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [showActionSheet, setShowActionSheet] = useState(false);

  const { ref: swipeRef } = useSwipeGesture({
    onSwipeLeft: () => {
      if (!useActionSheet) {
        setShowActions(true);
        setSwipeOffset(-140);
      }
    },
    onSwipeRight: () => {
      if (!useActionSheet) {
        setShowActions(false);
        setSwipeOffset(0);
      }
    },
    onDrag: (deltaX: number) => {
      if (!useActionSheet) {
        if (deltaX < 0) {
          // Swiping left
          const offset = Math.max(-140, deltaX);
          setSwipeOffset(offset);
          if (offset <= -70) {
            setShowActions(true);
          }
        } else {
          // Swiping right
          const offset = Math.min(0, deltaX);
          setSwipeOffset(offset);
          if (offset >= -70) {
            setShowActions(false);
          }
        }
      }
    },
    onDragEnd: () => {
      if (!useActionSheet) {
        if (swipeOffset <= -70) {
          setSwipeOffset(-140);
          setShowActions(true);
        } else {
          setSwipeOffset(0);
          setShowActions(false);
        }
      }
    },
    threshold: 30,
    maxDuration: 300
  });

  const handleEdit = () => {
    onEdit(animal.animalId);
    setSwipeOffset(0);
    setShowActions(false);
  };

  const handleDelete = () => {
    onDelete({
      animalId: animal.animalId,
      name: animal.name,
      gender: animal.gender,
      ageDisplay: getAgeDisplay(animal.ageInWeeks),
      addressDisplay: animal.addressDisplayName,
      description: animal.description,
      photoUrl: animal.animalPhotos.find((a) => a.order === 0)?.photoUrl ?? ''
    });
    setSwipeOffset(0);
    setShowActions(false);
  };

  const handleActionSheetEdit = () => {
    onEdit(animal.animalId);
    setShowActionSheet(false);
  };

  const handleActionSheetDelete = () => {
    onDelete({
      animalId: animal.animalId,
      name: animal.name,
      gender: animal.gender,
      ageDisplay: getAgeDisplay(animal.ageInWeeks),
      addressDisplay: animal.addressDisplayName,
      description: animal.description,
      photoUrl: animal.animalPhotos.find((a) => a.order === 0)?.photoUrl ?? ''
    });
    setShowActionSheet(false);
  };

  return (
    <>
      <div
        className="card bg-base-100 relative overflow-hidden shadow-md transition-shadow duration-200 hover:shadow-lg"
        ref={swipeRef}
      >
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(${swipeOffset}px)` }}
        >
          {/* Main card content */}
          <div className="flex min-w-0 flex-1 items-start gap-4 p-4">
            {/* Animal Photo */}
            <div className="avatar flex-shrink-0">
              <div className="ring-base-300 size-20 rounded-xl ring-2">
                <img
                  className="object-cover"
                  src={animal.animalPhotos[0]?.photoUrl || defaultCatPic}
                  alt={animal.name}
                />
              </div>
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1 space-y-2">
              {/* Header: Name & Gender */}
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base-content truncate text-lg font-bold">
                  {animal.name}
                </h3>
                <div className="badge badge-primary badge-sm flex-shrink-0 gap-1 font-medium">
                  <FaPaw className="size-2.5" />
                  {animal.gender}
                </div>
              </div>

              {/* Meta Information */}
              <div className="text-base-content/70 flex items-center gap-2 text-sm">
                <span className="text-base-content/80 font-medium">
                  {getAgeDisplay(animal.ageInWeeks)}
                </span>
                <span className="bg-base-content/30 size-1 rounded-full" />
                <span className="truncate">{animal.addressDisplayName}</span>
              </div>

              {/* Description */}
              <p className="text-base-content/70 line-clamp-2 text-sm leading-relaxed">
                {animal.description}
              </p>
            </div>

            {/* Action menu button for action sheet mode */}
            {useActionSheet && (
              <button
                onClick={() => setShowActionSheet(true)}
                className="btn btn-circle btn-ghost btn-sm text-base-content/60 flex-shrink-0"
                aria-label={t('open_actions')}
              >
                <FaEllipsisV className="size-4" />
              </button>
            )}
          </div>

          {/* Action buttons (swipe reveal) */}
          {!useActionSheet && (
            <div className="flex flex-shrink-0 items-stretch">
              <button
                onClick={handleEdit}
                className="bg-info text-info-content hover:bg-info/90 active:bg-info/80 flex w-[70px] flex-col items-center justify-center gap-1 transition-all"
                aria-label={t('edit')}
              >
                <FaRegEdit className="size-5" />
                <span className="text-xs font-semibold">{t('edit')}</span>
              </button>
              <button
                onClick={handleDelete}
                className="bg-error text-error-content hover:bg-error/90 active:bg-error/80 flex w-[70px] flex-col items-center justify-center gap-1 transition-all"
                aria-label={t('delete')}
              >
                <FaRegTrashAlt className="size-5" />
                <span className="text-xs font-semibold">{t('delete')}</span>
              </button>
            </div>
          )}
        </div>

        {/* Swipe hint indicator */}
        {!useActionSheet && !showActions && (
          <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 opacity-50 transition-opacity duration-200">
            <div className="text-base-content/40 flex items-center gap-1 text-xs">
              <span className="hidden text-[10px] sm:inline">
                {t('swipe_for_actions')}
              </span>
              <svg
                className="size-4 animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Action Sheet */}
      {useActionSheet && (
        <ActionSheet
          isOpen={showActionSheet}
          onClose={() => setShowActionSheet(false)}
          onEdit={handleActionSheetEdit}
          onDelete={handleActionSheetDelete}
          title={animal.name}
        />
      )}
    </>
  );
}
