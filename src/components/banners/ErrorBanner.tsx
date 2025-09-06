import type { BannerProps } from './types/BannerProps';
import flattenMessages from './utils/flattenMessages';

export default function ErrorBanner({ messages, onCloseBanner }: BannerProps) {
  const bannerMessages = flattenMessages(messages);

  return (
    <div role="alert" className="alert alert-vertical sm:alert-horizontal">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <ul>
        {bannerMessages.map((msg) => (
          <li>{msg}</li>
        ))}
      </ul>
      <div>
        <button className="btn btn-xs btn-primary" onClick={onCloseBanner}>
          X
        </button>
      </div>
    </div>
  );
}
