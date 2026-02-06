import { useTranslation } from 'react-i18next';
import { useNavigationStore } from '../../stores/navigation-store';

export default function LoadingScreen() {
  const { t } = useTranslation();
  const setNavigationColor = useNavigationStore(
    (state) => state.setNavigationColor
  );
  setNavigationColor('transparent');

  return (
    <div className="from-primary via-secondary to-accent fixed inset-0 flex items-center justify-center bg-gradient-to-br">
      <div className="flex flex-col items-center space-y-6">
        {/* Bouncing dots */}
        <div className="flex space-x-3">
          {[0, 1, 2].map((index) => (
            <div key={index} className="relative">
              {/* Bouncing dot */}
              <div
                className="animate-dot-hover bg-base-100 h-5 w-5 rounded-full shadow-lg"
                style={{
                  animationDelay: `${index * 200}ms`
                }}
              />
              {/* Shadow */}
              <div
                className="animate-dot-shadow bg-base-content/20 absolute -bottom-1 left-0 h-1.5 w-full rounded-full"
                style={{
                  animationDelay: `${index * 200}ms`
                }}
              />
            </div>
          ))}
        </div>

        {/* Optional loading text */}
        <p className="text-base-100 animate-pulse text-lg font-medium tracking-wide">
          {t('loading')}
        </p>
      </div>
    </div>
  );
}
