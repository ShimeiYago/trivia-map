import { SelializedImageFile } from './../../types/SelializedImageFile';

export async function convertToFile(selializedFile: SelializedImageFile) {
  const blob = await (await fetch(selializedFile.dataUrl)).blob();
  return new File([blob], selializedFile.dataUrl);
}
