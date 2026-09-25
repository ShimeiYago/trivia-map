import React from 'react';
import styles from './index.module.css';

export class CounterButton extends React.Component<Props> {
  static defaultProps: Props = {
    variant: 'default',
  };

  render() {
    const { variant, ariaLabel, disabled, children, onClick } = this.props;

    let className: string;
    switch (variant) {
      case 'async':
        className = styles.asyncButton;
        break;
      default:
        className = styles.button;
    }

    return (
      <button className={className} aria-label={ariaLabel} disabled={disabled} onClick={onClick}>
        {children}
      </button>
    );
  }
}

export type Props = {
  variant: Variant;
  ariaLabel?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

type Variant = 'default' | 'async';
