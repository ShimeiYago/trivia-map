import React from 'react';
import { Typography } from '@mui/material';
import styles from './index.module.css';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

export class ImageField extends React.Component<Props> {
  render() {
    const { error, helperText, onChange, disabled } = this.props;

    const labelClassNames = [styles['label']];
    if (!disabled) labelClassNames.push(styles['label-active']);

    const helperTextClassNames = [styles['helper-text']];
    if (error) helperTextClassNames.push(styles['helper-text-error']);

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
          {!disabled && (
            <div className={styles['content']}>
              <Typography>
                <AddAPhotoIcon fontSize="large" />
              </Typography>
              <Typography>写真を追加</Typography>
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
}

export type Props = {
  error?: boolean;
  helperText?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
};
