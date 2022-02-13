import React from 'react';
import { CounterButton } from 'views/components/atoms/counter-button';
import { CounterTextbox } from 'views/components/atoms/counter-textbox';
import styles from './index.module.css';

export class Renderer extends React.Component<Props, State> {
  state = {
    incrementAmount: '2',
  };

  render() {
    const {
      count,
      counterError,

      decrement,
      increment,
      incrementByAmount,
      incrementIfOdd,
      fetchCount,
      postCount,
    } = this.props;

    const incrementValue = Number(this.state.incrementAmount) || 0;

    return (
      <div>
        {counterError ? <div>{counterError}</div> : null}
        <div className={styles.row}>
          <CounterButton
            ariaLabel="Decrement value"
            onClick={() => decrement()}
          >
            -
          </CounterButton>
          <span className={styles.value}>{count}</span>
          <CounterButton
            ariaLabel="Increment value"
            onClick={() => increment()}
          >
            +
          </CounterButton>
        </div>
        <div className={styles.row}>
          <CounterTextbox
            ariaLabel="Set increment amount"
            value={this.state.incrementAmount}
            onChange={(e) => this.setIncrementAmount(e.target.value)}
          />
          <CounterButton onClick={() => incrementByAmount(incrementValue)}>
            Add Amount
          </CounterButton>
          <CounterButton onClick={() => incrementIfOdd(incrementValue)}>
            Add If Odd
          </CounterButton>
          <CounterButton
            variant="async"
            onClick={() => fetchCount()}
            disabled={this.props.loading}
          >
            Fetch
          </CounterButton>
          <CounterButton
            variant="async"
            onClick={() => postCount(count)}
            disabled={this.props.loading}
          >
            Post
          </CounterButton>
        </div>
      </div>
    );
  }

  protected setIncrementAmount(incrementAmount: string) {
    this.setState({ incrementAmount: incrementAmount });
  }
}

export type Props = {
  count: number;
  counterError: string | null;
  loading: boolean;

  decrement: () => void;
  increment: () => void;
  incrementByAmount: (incrementValue: number) => void;
  incrementIfOdd: (incrementValue: number) => void;
  fetchCount: () => void;
  postCount: (postValue: number) => void;
};

export type State = {
  incrementAmount: string;
};
