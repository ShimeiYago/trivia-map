/* istanbul ignore file */

export async function getImageSize(src: string): Promise<Size> {
  // convert object url to image
  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });

  return {
    width: img.width,
    height: img.height,
    aspect: img.height / img.width,
  };
}

type Size = {
  width: number;
  height: number;
  aspect: number;
};
