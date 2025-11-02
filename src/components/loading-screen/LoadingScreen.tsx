import { useNavigationStore } from '../../stores/navigation-store';

export default function () {
  const setNavigationColor = useNavigationStore(
    (state) => state.setNavigationColor
  );
  setNavigationColor('transparent');

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#3e98fd]">
      <div className="flex space-x-2">
        {[0, 1, 2].map((index) => (
          <div key={index} className="relative">
            {/* Bouncing dot */}
            <div
              className="animate-dot-hover h-4 w-4 rounded-full bg-white"
              style={{
                animationDelay: `${index * 200}ms`
              }}
            />
            {/* Shadow */}
            <div
              className="animate-dot-shadow absolute -bottom-1 left-0 h-1 w-full rounded-full bg-black/20"
              style={{
                animationDelay: `${index * 200}ms`
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
