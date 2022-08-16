import React from 'react';
import { NonStyleLink } from 'views/components/atoms/non-style-link';
import { IconAndText } from 'views/components/atoms/icon-and-text';
import { ACCOUNT_SETTINGS_LINK } from 'constant/links';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

export class BackToAccountSettingNavi extends React.Component {
  render() {
    return (
      <NonStyleLink to={ACCOUNT_SETTINGS_LINK}>
        <IconAndText
          iconComponent={<KeyboardArrowLeftIcon />}
          text="アカウント設定"
          align="left"
          iconPosition="left"
        />
      </NonStyleLink>
    );
  }
}
