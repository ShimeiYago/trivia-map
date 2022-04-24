import React from 'react';
import styles from './index.module.css';
import { Image } from '../../atoms/image';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';

export class DeletableImage extends React.Component<Props> {
  render() {
    const {
      src,
      alt,
      width,
      height,
      objectFit,
      borderRadius,
      onClick,
      onDelete,
    } = this.props;

    const wrapperClassNames: string[] = [styles.wrapper];
    if (width) wrapperClassNames.push(styles[`width-${width}`]);
    if (height) wrapperClassNames.push(styles[`height-${height}`]);

    return (
      <div className={wrapperClassNames.join(' ')}>
        <Image
          src={src}
          alt={alt}
          onClick={onClick}
          height="full"
          width="full"
          objectFit={objectFit}
          borderRadius={borderRadius}
        />
        <div className={styles['delete-button']} onClick={onDelete}>
          <IconButton aria-label="delete" color="inherit">
            <CloseIcon />
          </IconButton>
        </div>
      </div>
    );
  }
}

export type Props = {
  src: string;
  alt?: string;
  width?: Sizes;
  height?: Sizes;
  objectFit?: 'cover';
  borderRadius?: boolean;
  onClick?: () => void;
  onDelete: () => void;
};

type Sizes = 'full' | '100px' | '200px' | '300px';
