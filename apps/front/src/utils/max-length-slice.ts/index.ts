export function maxLengthSlice(origText: string, maxLength: number) {
  if (origText.length > maxLength) {
    return origText.slice(0, maxLength) + '...';
  }

  return origText;
}
