/* istanbul ignore file */

import { SelializedImageFile } from '../../types/selialized-image-file';
import { PercentCrop, PixelCrop } from 'react-image-crop';
import { UploadedImage } from 'types/uploaded-image';

export async function resizeAndConvertToSelializedImageFile(
  param: File | UploadedImage,
  maxLength: number,
  crop?: PercentCrop,
): Promise<SelializedImageFile> {
  if ('objectUrl' in param) {
    return resizeAndConvertToSelializedImageFileFromObjectUrl({
      objectUrl: param.objectUrl,
      fileType: param.fileType,
      fileName: param.fileName,
      maxLength: maxLength,
      crop: crop,
    });
  }

  const objectUrl = URL.createObjectURL(param);
  return resizeAndConvertToSelializedImageFileFromObjectUrl({
    objectUrl: objectUrl,
    fileType: param.type,
    fileName: param.name,
    maxLength: maxLength,
    crop: crop,
  });
}

async function resizeAndConvertToSelializedImageFileFromObjectUrl(param: {
  objectUrl: string;
  fileType: string;
  fileName: string;
  maxLength: number;
  crop?: PercentCrop;
}): Promise<SelializedImageFile> {
  const { objectUrl, fileType, fileName, maxLength, crop } = param;

  // convert object url to image
  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = objectUrl;
  });

  const pixelCrop = crop
    ? getPixelCrop(img.width, img.height, crop)
    : undefined;

  // convert to image element to canvas with resizing
  const [width, height] = getResizedWidthAndHeight({
    origWidth: pixelCrop?.width ?? img.width,
    origHeight: pixelCrop?.height ?? img.height,
    maxLength: maxLength,
  });
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('failed to getContext from canvas');
  }
  if (pixelCrop) {
    ctx.drawImage(
      img,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      width,
      height,
    );
  } else {
    ctx.drawImage(img, 0, 0, width, height);
  }

  // convert canvas to dataUrl
  const dataUrl = canvas.toDataURL(fileType);

  // refresh
  URL.revokeObjectURL(objectUrl);

  return {
    dataUrl: dataUrl,
    fileName: fileName,
  };
}

function getResizedWidthAndHeight(param: {
  origWidth: number;
  origHeight: number;
  maxLength: number;
}) {
  const { origWidth, origHeight, maxLength } = param;

  if (Math.max(origWidth, origHeight) <= maxLength) {
    return [origWidth, origHeight];
  }

  let width = origWidth;
  let height = origHeight;
  if (origWidth >= origHeight) {
    width = maxLength;
    height = origHeight * (maxLength / origWidth);
  } else {
    height = maxLength;
    width = origWidth * (maxLength / origHeight);
  }

  return [width, height];
}

function getPixelCrop(
  width: number,
  height: number,
  percentCrop: PercentCrop,
): PixelCrop {
  return {
    unit: 'px',
    width: (width * percentCrop.width) / 100,
    height: (height * percentCrop.height) / 100,
    x: (width * percentCrop.x) / 100,
    y: (height * percentCrop.y) / 100,
  };
}
