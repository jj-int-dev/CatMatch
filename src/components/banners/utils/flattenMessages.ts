import type { BannerMessage } from '../types/BannerProps';

export default function (messages: BannerMessage[]): string[] {
  return messages.flatMap(([message, separator]) =>
    separator ? message.split(separator) : [message]
  );
}
