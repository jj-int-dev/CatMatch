import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaEllipsisV, FaPaw } from 'react-icons/fa';
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
}

export default function MobileAnimalCard({
  animal,
  onEdit,
  onDelete,
  getAgeDisplay
}: MobileAnimalCardProps) {
  const { t } = useTranslation();
  const [showActionSheet, setShowActionSheet] = useState(false);

  const handleEdit = () => {
    onEdit(animal.animalId);
    setShowActionSheet(false);
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
    setShowActionSheet(false);
  };

  return (
    <>
      <div className="card bg-base-100 relative shadow-md transition-shadow duration-200 hover:shadow-lg">
        <div className="flex items-start gap-4 p-4">
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

          {/* Action menu button */}
          <button
            onClick={() => setShowActionSheet(true)}
            className="btn btn-circle btn-ghost btn-sm text-base-content/60 flex-shrink-0"
            aria-label={t('open_actions')}
          >
            <FaEllipsisV className="size-4" />
          </button>
        </div>
      </div>

      {/* Action Sheet */}
      <ActionSheet
        isOpen={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        title={animal.name}
      />
    </>
  );
}
