export const openChangePasswordDialog = () =>
  (
    document.getElementById('changePasswordDialog') as HTMLDialogElement | null
  )?.showModal();

export const closeChangePasswordDialog = () =>
  (
    document.getElementById('changePasswordDialog') as HTMLDialogElement | null
  )?.close();

export function ChangePasswordDialog() {
  return <></>;
}
