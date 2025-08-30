export function getAgeFromDateOfBirth(dateOfBirth: string): number {
  if (!dateOfBirth) return -1;

  const today = new Date();
  const dob = new Date(dateOfBirth);

  let age = today.getFullYear() - dob.getFullYear();
  const monthDifference = today.getMonth() - dob.getMonth();

  // Adjust age if the birthday hasn't occurred yet this year
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < dob.getDate())
  ) {
    age--;
  }

  return age;
}
