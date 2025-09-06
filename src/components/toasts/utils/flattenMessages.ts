import type { ToastMessage } from '../types/ToastTypes';

export default function (messages: ToastMessage[]): string[] {
  return messages.flatMap(([message, separator]) =>
    separator ? message.split(separator) : [message]
  );
}
