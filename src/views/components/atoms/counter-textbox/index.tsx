import React from 'react';
import styles from './index.module.css';

export class CounterTextbox extends React.Component<Props> {
  static defaultProps: Props = {
    value: '',
  };

  render() {
    const { value, ariaLabel, disabled, onChange } = this.props;

    return (
      <input
        className={styles.textbox}
        aria-label={ariaLabel}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    );
  }
}

export type Props = {
  value: string;
  ariaLabel?: string;
  disabled?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
