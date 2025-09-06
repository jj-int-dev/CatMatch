export type BannerMessage = [message: string, separator?: string];

export type BannerProps = {
  messages: BannerMessage[];
  onCloseBanner?: () => void | Promise<void>;
};
