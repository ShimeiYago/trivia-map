import { SelializedImageFile } from '../../types/selialized-image-file';

export async function convertToFile(selializedFile: SelializedImageFile) {
  const blob = await (await fetch(selializedFile.dataUrl)).blob();
  return new File([blob], selializedFile.fileName);
}
