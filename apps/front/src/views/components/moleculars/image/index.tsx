import React from 'react';
import styles from './index.module.css';
import { Img } from 'react-image';
import { CenterSpinner } from 'views/components/atoms/center-spinner';

export class Image extends React.Component<Props> {
  render() {
    const { src, alt, width, height, maxWidth, maxHeight, objectFit, borderRadius, onClick } =
      this.props;

    const classNames: string[] = [styles.image];

    if (objectFit === 'cover') classNames.push(styles.cover);
    if (width) classNames.push(styles[`width-${width}`]);
    if (height) classNames.push(styles[`height-${height}`]);
    if (maxWidth) classNames.push(styles[`max-width-${maxWidth}`]);
    if (maxHeight) classNames.push(styles[`max-height-${maxHeight}`]);
    if (borderRadius) classNames.push(styles['border-radius']);

    return (
      <Img
        src={src}
        loader={renderLoader()}
        className={classNames.join(' ')}
        alt={alt}
        onClick={onClick}
      />
    );
  }
}

function renderLoader() {
  return (
    <div className={styles.loader}>
      <CenterSpinner />
    </div>
  );
}

export type Props = {
  src: string;
  alt?: string;
  width?: Sizes;
  height?: Sizes;
  maxWidth?: Sizes;
  maxHeight?: Sizes;
  objectFit?: 'cover';
  borderRadius?: boolean;
  onClick?: () => void;
};

type Sizes = 'full' | '80px' | '100px' | '200px' | '300px';
