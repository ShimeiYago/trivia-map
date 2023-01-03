import React from 'react';
import styles from './index.module.css';
import { Img } from 'react-image';
import { CenterSpinner } from 'views/components/atoms/center-spinner';

export class Image extends React.Component<Props> {
  render() {
    const { src, alt, width, height, objectFit, borderRadius, onClick } = this.props;

    const classNames: string[] = [styles.image];

    if (objectFit === 'cover') classNames.push(styles.cover);
    if (width) classNames.push(styles[`width-${width}`]);
    if (height) classNames.push(styles[`height-${height}`]);
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
  objectFit?: 'cover';
  borderRadius?: boolean;
  onClick?: () => void;
};

type Sizes = 'full' | '100px' | '200px' | '300px';
