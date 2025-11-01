import CheckmarkIcon from '../../../assets/checkmark.svg?react';
import { useChangeUserTypeStore } from '../../../components/confirm-change-user-type/stores/change-user-type-store';

type UserTypeCardProps = {
  cardTitle: string;
  cardPhrases: string[];
  initialUserType: string;
  userTypeForCard: string;
};

export function UserTypeCard(props: UserTypeCardProps) {
  const { cardTitle, cardPhrases, initialUserType, userTypeForCard } = props;
  const setNewUserType = useChangeUserTypeStore(
    (state) => state.setNewUserType
  );

  return (
    <div className="card w-96 rounded-4xl bg-white text-black shadow-sm">
      <div className="card-body">
        <div className="flex justify-between">
          <h2 className="text-3xl font-bold">{cardTitle}</h2>
          <input
            type="radio"
            name="radio-1"
            defaultChecked={initialUserType === userTypeForCard}
            onChange={() => setNewUserType(userTypeForCard)}
            className="radio radio-xl border-blue-300 bg-white checked:border-blue-600 checked:bg-blue-200 checked:text-blue-600"
          />
        </div>
        <ul className="mt-6 flex flex-col gap-2 text-xs">
          {cardPhrases.map((phrase, index) => (
            <li key={index}>
              <CheckmarkIcon />
              <span>{phrase}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
