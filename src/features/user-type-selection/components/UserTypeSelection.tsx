import { useState } from 'react';
import { useSetNavigationColor } from '../../../hooks/useSetNavigationColor';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { UserTypeCard } from './UserTypeCard';
import { ConfirmUserTypeButton } from './ConfirmUserTypeButton';
import { GreetingRow } from './GreetingRow';
import {
  getAdopterExplanations,
  getRehomerExplanations
} from '../utils/getUserTypeExplanations';

export default function UserTypeSelection() {
  useSetNavigationColor('transparent');
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isAdopter, setIsAdopter] = useState<boolean | null>(null);

  const onConfirmUserType = () => {
    if (isAdopter === true) {
      navigate('/discovery-preferences');
    } else if (isAdopter === false) {
      navigate('/rehomer-dashboard');
    }
  };

  return (
    <div className="-mt-16 flex h-screen w-screen flex-col items-center justify-center bg-[#3e98fd] bg-cover bg-center">
      <div className="mb-25 grid grid-cols-12">
        <div className="col-span-4 pt-8">
          <GreetingRow />
        </div>
        <div className="col-span-8 flex items-center">
          <div className="flex flex-row gap-x-10">
            <UserTypeCard
              cardTitle={`${t('adopt_a_cat')} 🐈`}
              cardPhrases={getAdopterExplanations()}
              onChecked={() => setIsAdopter(true)}
            />
            <UserTypeCard
              cardTitle={`${t('rehome_a_cat')} 🏠`}
              cardPhrases={getRehomerExplanations()}
              onChecked={() => setIsAdopter(false)}
            />
          </div>
        </div>
      </div>
      <ConfirmUserTypeButton onPress={onConfirmUserType} />
    </div>
  );
}
