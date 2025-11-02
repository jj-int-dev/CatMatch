// adding this unique value at the end of the image url prevents
// a cached version of a different image with the same name from
// being displayed
export default function (imageUrl: string): string {
  return `${imageUrl}?timestamp=${Date.now()}`;
}
