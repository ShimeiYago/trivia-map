import { SelializedImageFile } from 'types/selialized-image-file';

export function getImageSrc(image: string | SelializedImageFile | null) {
  if (typeof image === 'string') {
    return image;
  }

  if (image === null) {
    return undefined;
  }

  // SelializedImageFile case
  return image.dataUrl;
}
