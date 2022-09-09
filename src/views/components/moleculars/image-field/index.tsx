import React from 'react';
import { Typography } from '@mui/material';
import styles from './index.module.css';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

export class ImageField extends React.Component<Props> {
  render() {
    const { helperText, onChange, disabled, src, variant } = this.props;

    const labelClassNames = this.getLabelClassNames();
    const imgClassNames = this.getImgClassNames();
    const contentClassNames = this.getContentClassNames();
    const helperTextClassNames = this.getHelperTextClassNames();

    return (
      <div>
        <label className={labelClassNames.join(' ')}>
          {!disabled && (
            <input
              type="file"
              accept="image/*"
              onChange={onChange}
              className={styles['input-image']}
            />
          )}

          {src && <img src={src} className={imgClassNames.join(' ')} />}

          {!disabled && (
            <div className={contentClassNames.join(' ')}>
              <Typography>
                <AddAPhotoIcon fontSize="large" />
              </Typography>
              {variant === 'square' && (
                <Typography>タップして写真を追加</Typography>
              )}
            </div>
          )}
        </label>
        {helperText && (
          <Typography className={helperTextClassNames.join(' ')}>
            {helperText}
          </Typography>
        )}
      </div>
    );
  }

  protected getLabelClassNames() {
    const { variant, disabled, src } = this.props;

    const classNames = [styles['label']];

    switch (variant) {
      case 'square':
        classNames.push(styles['variant-square']);
        break;
      case 'icon':
        classNames.push(styles['variant-icon']);
        break;
    }

    if (!disabled) classNames.push(styles['label-active']);

    if (!src) classNames.push(styles['label-noimage']);

    return classNames;
  }

  protected getImgClassNames() {
    const { variant } = this.props;

    const classNames = [styles['img']];

    switch (variant) {
      case 'square':
        classNames.push(styles['variant-square']);
        break;
      case 'icon':
        classNames.push(styles['variant-icon']);
        break;
    }

    return classNames;
  }

  protected getContentClassNames() {
    const { variant } = this.props;

    const classNames = [styles['content']];

    switch (variant) {
      case 'square':
        classNames.push(styles['content-large']);
        break;
      case 'icon':
        classNames.push(styles['content-small']);
        break;
    }

    return classNames;
  }

  protected getHelperTextClassNames() {
    const { error, variant } = this.props;

    const classNames = [styles['helper-text']];

    if (error) classNames.push(styles['helper-text-error']);

    if (variant === 'icon') classNames.push(styles['helper-text-center']);

    return classNames;
  }
}

export type Props = {
  error?: boolean;
  helperText?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  variant: 'square' | 'icon';
  src?: string;
};
