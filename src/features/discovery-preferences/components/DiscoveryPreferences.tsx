import { useNavigate } from 'react-router';

export function DiscoveryPreferences() {
  const navigate = useNavigate();
  return (
    <div className="flex w-full justify-center">
      <div className="flex-rows flex">
        <h1>Discovery Preferences</h1>
        <h2>Set up your preferences to find your ideal cat!</h2>
        <button
          className="btn btn-success btn-xl mt-20"
          onClick={() => navigate('/discovery')}
        >
          Done
        </button>
      </div>
    </div>
  );
}
