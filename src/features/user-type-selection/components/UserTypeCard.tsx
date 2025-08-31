import CheckmarkIcon from '../../../assets/checkmark.svg?react';

type UserTypeCardProps = {
  cardTitle: string;
  cardPhrases: string[];
  onChecked: () => void;
};

export function UserTypeCard(props: UserTypeCardProps) {
  const { cardTitle, cardPhrases, onChecked } = props;

  return (
    <div className="card w-96 rounded-4xl bg-white text-black shadow-sm">
      <div className="card-body">
        <div className="flex justify-between">
          <h2 className="text-3xl font-bold">{cardTitle}</h2>
          <input
            type="radio"
            name="radio-1"
            onChange={onChecked}
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
