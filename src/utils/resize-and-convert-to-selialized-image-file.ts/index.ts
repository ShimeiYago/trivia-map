/* istanbul ignore file */

import { UPLOAD_IMAGE_MAX_LENGTH } from './../../constant/index';
import { SelializedImageFile } from '../../types/SelializedImageFile';

export async function resizeAndConvertToSelializedImageFile(
  file: File,
): Promise<SelializedImageFile> {
  // create object url
  const objectURL = URL.createObjectURL(file);

  // convert object url to image
  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = objectURL;
  });

  // convert to image element to canvas with resizing
  const [width, height] = getResizedWidthAndHeight(img.width, img.height);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('failed to getContext from canvas');
  }
  ctx.drawImage(img, 0, 0, width, height);

  // convert canvas to dataUrl
  const dataURL = canvas.toDataURL(file.type);

  // refresh
  URL.revokeObjectURL(objectURL);

  return {
    dataUrl: dataURL,
    fileName: file.name,
  };
}

function getResizedWidthAndHeight(origWidth: number, origHeight: number) {
  if (Math.max(origWidth, origHeight) <= UPLOAD_IMAGE_MAX_LENGTH) {
    return [origWidth, origHeight];
  }

  let width = origWidth;
  let height = origHeight;
  if (origWidth >= origHeight) {
    width = UPLOAD_IMAGE_MAX_LENGTH;
    height = origHeight * (UPLOAD_IMAGE_MAX_LENGTH / origWidth);
  } else {
    height = UPLOAD_IMAGE_MAX_LENGTH;
    width = origWidth * (UPLOAD_IMAGE_MAX_LENGTH / origHeight);
  }

  return [width, height];
}
