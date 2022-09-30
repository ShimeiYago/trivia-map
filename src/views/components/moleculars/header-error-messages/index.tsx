import React from 'react';
import { Alert, AlertTitle } from '@mui/material';
import { red } from '@mui/material/colors';
import styles from './index.module.css';

export class HeaderErrorMessages extends React.Component<Props> {
  render() {
    const { errorTitle, errorMessages } = this.props;

    if (errorMessages) {
      return (
        <Alert
          severity="error"
          sx={{
            borderWidth: '2px',
            borderColor: red[500],
            borderStyle: 'solid',
          }}
        >
          <AlertTitle sx={{ color: red[500], fontWeight: 'bold' }}>{errorTitle}</AlertTitle>
          <ul className={styles['error-ul']}>
            {errorMessages.map((msg, index) => (
              <li key={`error-${index}`}>{msg}</li>
            ))}
          </ul>
        </Alert>
      );
    }

    return (
      <Alert severity="error" sx={{ color: red[500], fontWeight: 'bold' }}>
        {errorTitle}
      </Alert>
    );
  }
}

export type Props = {
  errorTitle: string;
  errorMessages?: string[];
};
